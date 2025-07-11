import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  // Map route path ke nama header
  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/orders": "Orders",
    "/products": "Products",
    "/categories": "Categories",
    "/tables": "Tables",
    "/reservation": "Reservation",
    "/revenue": "Revenue",
    "/sales": "Sales",
  };

  // Ambil title sesuai dengan route aktif
  const currentTitle = routeTitles[location.pathname] || "Page Not Found";

  return (
    <header className="bg-gray-900 text-white py-4 px-6 shadow-md">
      <h1 className="text-xl font-bold ml-10 md:ml-10 lg:ml-0">
        {currentTitle}
      </h1>
    </header>
  );
};

export default Header;
