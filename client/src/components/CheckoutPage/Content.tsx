import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMeja } from "../../context/MejaContext";
import { useOrder } from "../../context/OrderContext";
import { useMidtransSnap } from "../../hooks/useMidtransSnap";
import { MIDTRANS_CLIENT_KEY } from "../../utils/const";
import Header from "./Header";
import CheckoutCard from "./CheckoutCard";
import PhoneNumber from "./PhoneNumber";
import PaymentMethod from "./PaymentMethod";
import Summary from "./Summary";
import CheckoutButton from "./Button";
import RedirectLink from "./RedirectLink";

interface MenuItem {
  id: string;
  nama: string;
  harga: number;
  gambar: string;
}

interface CartItem {
  id: string;
  menu_id: string;
  kuantiti: number;
  menu: MenuItem;
  catatan: string;
  noMeja: number;
}

const Content: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [noTelp, setNoTelp] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASHLESS");
  const [redirectLink, setRedirectLink] = useState<string | null>(null);
  const { triggerSnap } = useMidtransSnap(MIDTRANS_CLIENT_KEY);
  const { noMeja } = useMeja();
  const { setOrderId } = useOrder();
  const navigate = useNavigate();

  // Fetch data from /cart route
  useEffect(() => {
    axios
      .get("cart")
      .then((response) => {
        setCartItems(response.data.cart);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  }, []);

  const handleIncrease = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, kuantiti: item.kuantiti + 1 } : item
      )
    );
  };

  const handleDecrease = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.kuantiti > 1
          ? { ...item, kuantiti: item.kuantiti - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    axios
      .delete(`cart/${id}`)
      .then(() => {
        setCartItems((items) => items.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  // Remove all items from the cart
  const handleRemoveAll = () => {
    axios
      .delete("cart")
      .then(() => {
        setCartItems([]);
      })
      .catch((error) => {
        console.error("Error deleting all items:", error);
      });
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  // Calculate subtotal
  const subTotal = cartItems.reduce(
    (total, item) => total + item.menu.harga * item.kuantiti,
    0
  );

  // Add 10% tax
  const tax = subTotal * 0.11;
  const totalAmount = subTotal + tax;

  // Update payment status
  const updatePaymentStatus = async (order: any) => {
    try {
      const payload = { id: order.id };
      const response = await axios.post("order/update-payment", payload);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update payment :", error);
    }
  };

  // Send order receipt to customer phone number
  const sendReceipt = async (order: any) => {
    try {
      const payload = {
        customer_phone: noTelp,
        receipt: order,
      };
      await axios.post("order/send-receipt", payload);
    } catch (error) {
      console.error(
        "Failed to send receipt to customer whatsapp number :",
        error
      );
    }
  };

  // Send the amount obtained data to the revenue record
  const sendAmountObtained = async (amount: number) => {
    try {
      await axios
        .post("revenue", { income: amount })
        .then((res) => {
          console.log(res.data.newRevenue);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.error("Failed to send the data : ", error);
    }
  };

  // Check if all field are filled
  const isFilled = cartItems.length === 0 || !noTelp || !paymentMethod;

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setLoading(true);

    const payload = {
      no_meja: noMeja,
      jumlah_bayar: totalAmount,
      metode_pembayaran: paymentMethod,
      pesanan_menu: cartItems.map((item) => ({
        menu_id: item.menu_id,
        kuantiti: item.kuantiti,
        catatan: item.catatan,
      })),
    };

    axios
      .post("order", payload)
      .then((response) => {
        console.log("Checkout successful :", response.data.newOrder);
        const { midtransPayload, newOrder } = response.data;
        const { id, jumlahBayar } = newOrder;
        setOrderId(id);
        sendReceipt(newOrder);
        sendAmountObtained(jumlahBayar);
        handleRemoveAll();

        if (paymentMethod === "CASHLESS") {
          setRedirectLink(midtransPayload.redirect_url);
          triggerSnap(midtransPayload.token, {
            onSuccess: (result) => {
              updatePaymentStatus(newOrder);
              console.log(result);
            },
            onPending: (result) => {
              console.log("Payment pending:", result);
            },
            onError: (result) => {
              console.error("Payment error:", result);
            },
            onClose: () => {
              console.log("Payment popup closed without finishing payment");
            },
          });
        } else {
          navigate("/transaction/cash");
        }
      })
      .catch((error) => {
        console.error("Error during checkout : ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <Header onRemoveAll={handleRemoveAll} />
      <div className="max-w-5xl w-full bg-white p-6 rounded-lg shadow-md flex flex-col lg:flex-row mt-24 lg:mt-16">
        {/* Left Section - Checkout Card */}
        <div className="w-full lg:w-2/3 p-4 h-64 lg:h-auto overflow-y-scroll lg:overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-lg font-semibold text-gray-900">
              Keranjang Kosong
            </p>
          ) : (
            cartItems.map((item) => (
              <CheckoutCard
                key={item.id}
                name={item.menu.nama}
                price={item.menu.harga}
                quantity={item.kuantiti}
                imageUrl={item.menu.gambar}
                onIncrease={() => handleIncrease(item.id)}
                onDecrease={() => handleDecrease(item.id)}
                onRemove={() => handleRemove(item.id)}
              />
            ))
          )}
        </div>

        {/* Right Section - Order Details */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-1/3 flex flex-col gap-4 p-4 border-l border-gray-200">
            <PhoneNumber noTelp={noTelp} setNoTelp={setNoTelp} />
            <PaymentMethod
              paymentMethod={paymentMethod}
              onPaymentMethodChange={handlePaymentMethodChange}
            />
            <Summary subTotal={subTotal} tax={tax} totalAmount={totalAmount} />
            <CheckoutButton
              loading={loading}
              onCheckout={handleCheckout}
              isFilled={isFilled}
            />
            <RedirectLink redirectLink={redirectLink} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
