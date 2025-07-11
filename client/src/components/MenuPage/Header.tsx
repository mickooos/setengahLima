import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cartItemCount: number; // Menambahkan prop untuk jumlah item di keranjang
}

const Header: React.FC<HeaderProps> = ({ cartItemCount }) => {
  const navigate = useNavigate();
  function previousPage() {
    navigate(-1);
  }
  function goToCheckout() {
    navigate("/checkout");
  }

  return (
    <header
      className="p-6 relative text-white text-center"
      style={{
        background:
          "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(61,23,3,1) 99%)",
      }}
    >
      {/* Go to Previous Page */}
      <button
        onClick={previousPage}
        className="absolute left-4 top-6 h-8 w-8cursor-pointer"
      >
        <i className="bi bi-arrow-left" />
      </button>

      <h1 className="text-4xl items-center font-bold font-menu">メニュー</h1>

      {/* Go to Checkout */}
      <button
        onClick={goToCheckout}
        className="absolute right-4 top-6 h-8 w-8 text-white cursor-pointer"
      >
        <i className="bi bi-cart" />
        {cartItemCount > 0 && (
          <span className="bg-amber-950 text-white text-xs font-bold rounded-full px-2 absolute -top-1 -right-1">
            {cartItemCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
