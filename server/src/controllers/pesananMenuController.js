import prisma from "../config/prismaClient.js";

export const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await prisma.pesananMenu.findMany({
      include: {
        pesanan: true,
        menu: true,
      },
    });
    // checking order items existence
    if (!orderItems)
      return res.status(404).json({ message: "Order items not found" });
    res.status(200).json({ success: true, orderItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get order items by id
export const getOrderItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await prisma.pesananMenu.findUnique({
      where: { id: id },
      include: {
        pesanan: true,
        menu: true,
      },
    });
    // checking order items existence
    if (!orderItem)
      return res.status(404).json({ message: "Order item not found" });
    res.status(200).json({ success: true, orderItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get order items by order id
export const getOrderItemByOrderId = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItems = await prisma.pesananMenu.findMany({
      where: { pesanan_id: id },
      include: {
        pesanan: true,
        menu: true,
      },
    });
    // checking order items existence
    if (!orderItems)
      return res.status(404).json({ message: "Order items not found" });
    res.status(200).json({ success: true, orderItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to adding new order item by order id
export const createOrderItem = async (req, res) => {
  const { pesanan_id, menu_id, kuantiti, catatan } = req.body;
  try {
    // create a new PesananMenu linked to the specified Pesanan ID
    const newOrderItem = await prisma.pesananMenu.create({
      data: {
        pesanan_id: pesanan_id,
        menu_id: menu_id,
        kuantiti: kuantiti,
        catatan: catatan,
      },
      include: {
        pesanan: true,
        menu: true,
      },
    });

    // calculate the total amount (jumlahBayar) for the related Pesanan
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesanan_id },
      include: {
        pesananMenu: {
          include: {
            menu: true, // include the menu details to access the price
          },
        },
      },
    });

    // calculate the sub total and total amount based on kuantiti and menu harga
    const subTotal = pesanan.pesananMenu.reduce((total, item) => {
      return total + item.kuantiti * item.menu.harga;
    }, 0);
    const tax = subTotal * 0.11;
    const grandTotal = subTotal + tax;

    // update the jumlahBayar field in the Pesanan table
    await prisma.pesanan.update({
      where: { id: pesanan_id },
      data: {
        jumlahBayar: grandTotal,
      },
    });

    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan");
    }

    res.status(201).json({
      message: `Order ${pesanan_id} item updated successfully`,
      success: true,
      newOrderItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to updating order item by id
export const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const { menu_id, kuantiti, catatan } = req.body;

  try {
    // Fetch existing order item
    const orderItem = await prisma.pesananMenu.findUnique({
      where: { id: id },
    });

    // Check if order item exists
    if (!orderItem)
      return res.status(404).json({ message: "Order item not found" });

    // Fetch menu price
    const menu = await prisma.menu.findUnique({
      where: { id: menu_id },
    });

    // Check if menu exists
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    // Calculate new total price (jumlahBayar) including tax
    const subtotal = menu.harga * kuantiti;
    const tax = subtotal * 0.11; // 11% tax
    const jumlahBayar = subtotal + tax;

    // Update order item
    const updatedOrderItem = await prisma.pesananMenu.update({
      where: { id: id },
      data: {
        menu_id: menu_id,
        kuantiti: kuantiti,
        catatan: catatan,
      },
    });

    // Update jumlahBayar in Pesanan
    await prisma.pesanan.update({
      where: { id: orderItem.pesanan_id },
      data: {
        jumlahBayar: {
          increment: jumlahBayar - orderItem.kuantiti * menu.harga * 1.11, // Adjust with previous total including tax
        },
      },
    });

    res.status(201).json({
      message: `Order ${id} item updated successfully`,
      success: true,
      updatedOrderItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to delete order item
export const deleteOrderItem = async (req, res) => {
  const { orderId, itemId } = req.params;
  try {
    // fetch existing order
    const orderItem = await prisma.pesananMenu.findUnique({
      where: { id: itemId },
    });
    if (!orderItem)
      return res.status(404).json({ error: "Order item not found" });
    // deleting order item
    await prisma.pesananMenu.deleteMany({
      where: { id: itemId },
    });
    // recount 'jumlahBayar in Pesanan
    const remainingItems = await prisma.pesananMenu.findMany({
      where: { pesanan_id: orderId },
      include: { menu: true },
    });
    const subTotal = remainingItems.reduce((acc, item) => {
      return acc + item.menu.harga * item.kuantiti;
    }, 0);
    const tax = subTotal * 0.11;
    const grandTotal = subTotal + tax;
    // updating 'jumlahBayar' field in Pesanan
    await prisma.pesanan.update({
      where: { id: orderId },
      data: { jumlahBayar: grandTotal },
    });

    res.status(200).json({
      message: `Order item ${itemId} deleted successfully`,
      updatedTotalPayment: grandTotal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
