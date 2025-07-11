import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import axios from "axios";
import saLogo from "../../assets/sa-logo.png";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      await axios
        .delete("admin/signout")
        .then((res) => {
          dispatch(logout());
          navigate("/");
          console.log(res.data.message);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Tombol hamburger */}
      <button
        className="lg:hidden p-2 fixed top-2 left-4 z-50 bg-transparent text-white rounded"
        onClick={toggleSidebar}
      >
        <i className={`bi ${isOpen ? "bi-x" : "bi-list"} text-2xl`}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white p-4 z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 lg:static lg:w-64`}
      >
        {/* Placeholder Image for Logo */}
        <div className="mb-8 flex items-center space-x-3">
          <img src={saLogo} alt="Logo" className="h-12 w-12 rounded-full" />
          <h1 className="text-lg font-semibold">setengahAdmin</h1>
        </div>

        {/* Navigasi */}
        <nav>
          <ul>
            <li className="mb-4 flex items-center">
              <i className="bi bi-house-door-fill mr-3"></i>
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-basket-fill mr-3"></i>
              <Link to="/orders" className="hover:text-gray-300">
                Orders
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-box-seam mr-3"></i>
              <Link to="/products" className="hover:text-gray-300">
                Products
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-tags-fill mr-3"></i>
              <Link to="/categories" className="hover:text-gray-300">
                Categories
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-grid-1x2 mr-3"></i>
              <Link to="/tables" className="hover:text-gray-300">
                Tables
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-book-half mr-3"></i>
              <Link to="/reservation" className="hover:text-gray-300">
                Reservation
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-cash-stack mr-3"></i>
              <Link to="/revenue" className="hover:text-gray-300">
                Revenue
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-clipboard-check mr-3"></i>
              <Link to="/sales" className="hover:text-gray-300">
                Sales
              </Link>
            </li>
            <li className="mb-4 flex items-center">
              <i className="bi bi-box-arrow-in-left mr-3"></i>
              <a onClick={handleSignOut} className="hover:text-gray-300">
                Sign Out
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay untuk layar kecil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
