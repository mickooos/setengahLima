import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeja } from "../../context/MejaContext";
import axios from "axios";

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  menuId: number;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  updateCartCount: () => void;
}

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  menuId,
  quantity,
  setQuantity,
  updateCartCount,
}) => {
  const [catatan, setCatatan] = useState<string>("");
  const { noMeja } = useMeja();
  const navigate = useNavigate();

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleCheckout = async () => {
    const payload = {
      menu_id: menuId,
      kuantiti: quantity,
      catatan: catatan,
      noMeja: noMeja,
    };

    try {
      await axios
        .post("cart", payload, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          console.log("Success adding item to cart :", payload);
          setQuantity(1);
          setCatatan("");
          updateCartCount();
        });
    } catch (error) {
      console.error("Error saat menambahkan item ke cart:", error);
    }
  };

  const goToCheckout = () => {
    navigate("/checkout");
  };

  const closePopup = () => {
    onClose();
    setQuantity(1);
    setCatatan("");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-2/3 md:w-2/4 lg:w-1/4">
        <h2 className="text-lg font-semibold mb-4">Adding Item to Cart</h2>

        {/* Kontrol kuantitas */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-gray-300 text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-400"
            onClick={decreaseQuantity}
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            className="bg-gray-300 text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-400"
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>

        {/* Field catatan */}
        <div className="mb-4">
          <textarea
            className="w-full border-gray-300 rounded-lg p-2"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Catatan..."
          ></textarea>
        </div>

        <div className="flex justify-between space-x-2 text-sm">
          <button
            onClick={handleCheckout}
            className="w-full bg-amber-950 text-white py-2 rounded-lg shadow-md hover:bg-[#6f4e37] transition"
          >
            Add
          </button>
          <button
            onClick={goToCheckout}
            className="w-full bg-green-800 text-white py-2 rounded-lg shadow-md hover:bg-green-500 transition"
          >
            Go To Checkout
          </button>
          <button
            onClick={closePopup}
            className="w-full bg-gray-500 text-white rounded-lg shadow-md hover:text-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
