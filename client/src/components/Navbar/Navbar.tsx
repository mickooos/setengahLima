import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link as LinkTo } from "react-scroll";

interface NavbarProps {
  showList?: boolean; // Prop untuk mengontrol visibilitas list
}

const Navbar: React.FC<NavbarProps> = ({ showList = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleItemClick = () => {
    setIsOpen(false); // Menutup navbar saat item diklik
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[rgba(1,1,1,0.8)] p-5 shadow-lg z-50">
      {/* Mengubah warna navbar menjadi lebih gelap */}
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl text-white font-bold">
          setengah<span className="text-amber-950">Lima.</span>
        </Link>

        {showList && (
          <>
            {/* Hamburger Menu */}
            <button className="block md:hidden text-white" onClick={toggleMenu}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                ></path>
              </svg>
            </button>
            {/* Navbar Links */}
            <ul
              className={`md:flex space-x-6 hidden ${
                isOpen ? "block" : "hidden"
              } md:block`}
            >
              <li>
                <LinkTo
                  to="hero"
                  className="text-white font-bold hover:text-amber-950 transition-all py-2 md:py-0"
                  spy={true}
                  smooth={true}
                  duration={1100}
                >
                  Home
                </LinkTo>
              </li>
              <li>
                <LinkTo
                  to="about"
                  className="text-white font-bold hover:text-amber-950 transition-all py-2 md:py-0"
                  spy={true}
                  smooth={true}
                  offset={-50}
                  duration={1100}
                >
                  About Us
                </LinkTo>
              </li>
              <li>
                <LinkTo
                  to="contact"
                  className="text-white font-bold hover:text-amber-950 transition-all py-2 md:py-0"
                  spy={true}
                  smooth={true}
                  offset={-50}
                  duration={1100}
                >
                  Contact
                </LinkTo>
              </li>
              <li>
                <LinkTo
                  to="address"
                  className="text-white font-bold hover:text-amber-950 transition-all py-2 md:py-0"
                  spy={true}
                  smooth={true}
                  offset={50}
                  duration={1100}
                >
                  Address
                </LinkTo>
              </li>
              <li>
                <Link
                  to="/my-order"
                  className="text-white font-bold hover:text-amber-950 transition-all py-2 md:py-0"
                >
                  My Order
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {showList && (
        <ul
          className={`mt-4 space-y-4 md:hidden ${isOpen ? "block" : "hidden"}`}
        >
          <li>
            <LinkTo
              to="hero"
              className="block text-white font-bold hover:text-amber-950 transition-all ml-1"
              spy={true}
              smooth={true}
              offset={50}
              duration={1100}
              onClick={handleItemClick}
            >
              Home
            </LinkTo>
          </li>
          <li>
            <LinkTo
              to="about"
              className="block text-white font-bold hover:text-amber-950 transition-all ml-1"
              spy={true}
              smooth={true}
              offset={-50}
              duration={1100}
              onClick={handleItemClick}
            >
              About Us
            </LinkTo>
          </li>
          <li>
            <LinkTo
              to="contact"
              className="block text-white font-bold hover:text-amber-950 transition-all ml-1"
              spy={true}
              smooth={true}
              offset={50}
              duration={1100}
              onClick={handleItemClick}
            >
              Contact
            </LinkTo>
          </li>
          <li>
            <LinkTo
              to="address"
              className="block text-white font-bold hover:text-amber-950 transition-all ml-1"
              spy={true}
              smooth={true}
              offset={50}
              duration={1100}
              onClick={handleItemClick}
            >
              Address
            </LinkTo>
          </li>
          <li>
            <Link
              to="/my-order"
              className="block text-white font-bold hover:text-amber-950 transition-all ml-1"
            >
              My Order
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
