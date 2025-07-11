import prisma from "../config/prismaClient.js";
import snap from "../config/midtransClient.js";
import axios from "axios";
import { numberToRupiah } from "../utils/number-to-rupiah.js";
import { formatDate } from "../utils/formatDate.js";
import { customFormatDate } from "../utils/customFormatDate.js";

// controller to get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.pesanan.findMany({
      include: {
        meja: true,
        pesananMenu: {
          include: {
            menu: true,
          },
        },
      },
    });
    // checking order existence
    if (!orders) return res.status(404).json({ message: "Orders not found" });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get order by id
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.pesanan.findUnique({
      where: { id: id },
      include: {
        meja: true,
        pesananMenu: {
          include: {
            menu: true,
          },
        },
      },
    });
    // checking order existence
    if (!order) return res.json({ message: "Order not found" });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get active orders or order with status 'CONFIRMED'
export const getActiveOrders = async (req, res) => {
  try {
    // query to find orders where statusPesanan is 'CONFIRMED'
    const activeOrders = await prisma.pesanan.findMany({
      where: {
        statusPesanan: "CONFIRMED",
      },
    });
    // calculate amount of active orders
    const count = activeOrders.length;
    // send response
    res.status(200).json({ success: true, activeOrders: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to create order
export const createOrder = async (req, res) => {
  const { no_meja, jumlah_bayar, metode_pembayaran, pesanan_menu } = req.body;
  let sequence = 1;

  try {
    // field checking
    if (!no_meja || !jumlah_bayar || !metode_pembayaran)
      return res.status(400).send({ message: "Fill out the field" });
    // generate custom pesananId
    const date = new Date();
    const orderNumber = String(sequence).padStart(4, "0");
    sequence += 1;
    const pesananId = `${customFormatDate(date)}${orderNumber}`;
    // query to create order
    const newOrder = await prisma.pesanan.create({
      data: {
        noMeja: parseInt(no_meja),
        pesananId: pesananId,
        jumlahBayar: parseFloat(jumlah_bayar),
        metodePembayaran: metode_pembayaran,
        statusPesanan: "CONFIRMED",
        statusPembayaran:
          metode_pembayaran === "CASH" ? "PAID" : "PENDING_PAYMENT",
        pesananMenu: {
          create: pesanan_menu,
        },
      },
      include: { pesananMenu: true }, // creates order items along with the order
    });

    // update 'terjual' field from menu
    for (const barangTerjual of pesanan_menu) {
      await prisma.menu.update({
        where: { id: barangTerjual.menu_id },
        data: {
          terjual: {
            increment: barangTerjual.kuantiti,
          },
        },
      });
    }
    // update 'jumlah' field from sales
    for (const barangTerjual of pesanan_menu) {
      await prisma.sales.create({
        data: {
          menu_id: barangTerjual.menu_id,
          jumlah: barangTerjual.kuantiti,
        },
      });
    }

    // If payment method is cashless, create Midtrans transaction
    if (metode_pembayaran === "CASHLESS") {
      // search menu items specifically
      const items = await prisma.pesananMenu.findMany({
        where: { pesanan_id: newOrder.id },
        include: {
          menu: true,
        },
      });

      // count sub total, tax, and gross amount;
      const subTotal = items.reduce((total, item) => {
        return total + item.menu.harga * item.kuantiti;
      }, 0);
      const tax = subTotal * 0.11;
      const grossAmount = subTotal + tax;

      // create order with midtrans
      let parameter = {
        transaction_details: {
          order_id: `ORD-${newOrder.id}`,
          gross_amount: grossAmount,
        },
        item_details: items.map((item) => ({
          id: item.id,
          price: item.menu.harga * 0.11 + item.menu.harga,
          quantity: item.kuantiti,
          name: item.menu.nama,
          url: item.menu.gambar,
        })),
        callbacks: {
          finish: process.env.CLI_PORT,
        },
      };
      const midtransPayload = await snap.createTransaction(parameter);
      return res.status(201).json({
        message: "Order created successfully",
        success: true,
        newOrder,
        midtransPayload,
      });
    }
    // If payment method is cash, simply return the order without Midtrans
    res.status(201).json({
      message: "Order created successfully (cash payment)",
      success: true,
      newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to send order receipt
export const sendOrderReceipt = async (req, res) => {
  const { customer_phone, receipt } = req.body;
  const { id, pesananId, jumlahBayar, metodePembayaran, tanggalBuat } = receipt;

  // getting order details
  const details = await prisma.pesananMenu.findMany({
    where: { pesanan_id: id },
    include: { menu: true },
  });

  // receipt message
  const message = `
  Detail Transaksi :
  • Order ID : ${pesananId}
  • Item : ${details.map((item) => `\n      - ${item.menu.nama} x ${item.kuantiti} - ${numberToRupiah(item.menu.harga)}`).join("")}
  • Total : ${numberToRupiah(jumlahBayar)}
  • Metode Pembayaran : ${metodePembayaran}
  • Tanggal : ${formatDate(tanggalBuat)} 
  \nTerima kasih sudah mampir ke setengahLima! \nSemoga harimu menyenangkan.`;

  // sending receipt
  try {
    const response = await axios.post(
      process.env.ULTRAMSG_API_URL,
      new URLSearchParams({
        token: process.env.ULTRAMSG_API_TOKEN,
        to: `+62${customer_phone}`,
        body: message,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    res.status(200).json({ success: true, data: response.data });
    console.log(response.data);
  } catch (error) {
    console.error("Error sending WhatsApp message: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// controller to update order status
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { statusPesanan, statusPembayaran } = req.body;
  try {
    const updatedOrder = await prisma.pesanan.update({
      where: { id: id },
      data: { statusPesanan, statusPembayaran },
      include: { pesananMenu: true },
    });
    res.status(201).json({
      message: `Order ${id} updated successfully`,
      success: true,
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to only update order payment status
export const updateOrderPayment = async (req, res) => {
  const { id } = req.body;
  try {
    const updatedPayment = await prisma.pesanan.update({
      where: { id: id },
      data: { statusPembayaran: "PAID" },
    });
    res.status(200).json({
      message: "Payment confirmed",
      success: true,
      updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to delete order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    // fetch existing order
    const order = await prisma.pesanan.findUnique({
      where: { id: id },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    // deleting order
    await prisma.pesanan.deleteMany({
      where: { id: id },
    });
    res.status(200).json({ message: `Order ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
