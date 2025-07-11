import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onRemoveAll: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRemoveAll }) => {
  const navigate = useNavigate();
  function previousPage() {
    navigate(-1);
  }

  return (
    <header
      className="fixed top-0 left-0 w-full text-white shadow-md z-50"
      style={{
        background:
          "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(61,23,3,1) 99%)",
      }}
    >
      <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row justify-between items-center">
        <h1
          onClick={previousPage}
          className="text-2xl sm:text-3xl font-bold font-menu cursor-pointer"
        >
          チェックアウトページ
        </h1>
        <button
          onClick={onRemoveAll}
          className="bg-amber-950 text-white font-medium px-4 py-2 rounded-md hover:bg-[#6f4e37] mt-2 sm:mt-0"
        >
          Remove All
        </button>
      </div>
    </header>
  );
};

export default Header;
