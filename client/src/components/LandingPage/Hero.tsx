import React from "react";
import { useMeja } from "../../context/MejaContext";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  const { noMeja } = useMeja();
  return (
    <section
      id="hero"
      className="h-screen flex flex-col justify-center items-center text-center bg-cover bg-center heroBg text-white"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
        Memadamkan haus & Laparmu.
      </h1>
      <p className="text-lg md:text-2xl font-semibold drop-shadow-md">
        Tenangkan pikiran dan rasakan kopimu!.
      </p>
      <div className="text-lg md:text-xl font-semibold drop-shadow-md mt-2 mb-4">
        <p>{noMeja ? `Nomor Meja : ${noMeja}` : null}</p>
      </div>
      <Link
        to="/menu"
        className="px-6 py-3 bg-amber-950  text-white font-bold rounded-lg hover:bg-[#6f4e37] shadow-lg transition-all duration-300"
      >
        Pesan
      </Link>
    </section>
  );
};

export default Hero;
