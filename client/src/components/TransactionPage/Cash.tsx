import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bauhaus from "../../assets/bauhaus.jpg";

const Cash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen relative">
      {/* Konten utama dengan efek overlay */}
      <div className="absolute flex flex-col items-center justify-center p-10 bg-white bg-opacity-90 rounded-lg shadow-lg z-10">
        <h1 className="text-5xl font-bold text-black mb-4">
          Silahkan bayar di kasir
        </h1>
        <p className="text-xl text-center text-gray-900">
          jangan lupa beritahu no. meja kamu ya :)
        </p>
      </div>

      {/* Gambar Background */}
      <img
        src={bauhaus}
        className="relative lg:w-1/2 h-auto object-contain rounded-xl z-0"
        alt="Background"
      />
    </div>
  );
};

export default Cash;
