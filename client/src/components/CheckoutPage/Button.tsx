// components/CheckoutPage/CheckoutButton.tsx
import React from "react";

interface CheckoutButtonProps {
  loading: boolean;
  isFilled: boolean;
  onCheckout: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  loading,
  isFilled,
  onCheckout,
}) => {
  return (
    <button
      className={`w-full bg-amber-950 text-white py-2 mt-4 rounded-md hover:bg-[#6f4e37] ${
        isFilled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onCheckout}
      disabled={isFilled || loading}
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
};

export default CheckoutButton;
