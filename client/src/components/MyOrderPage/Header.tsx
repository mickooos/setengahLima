import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
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
      <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row justify-center items-center">
        <h1
          onClick={previousPage}
          className="text-2xl sm:text-3xl font-bold font-menu cursor-pointer"
        >
          私の注文
        </h1>
      </div>
    </header>
  );
};

export default Header;
