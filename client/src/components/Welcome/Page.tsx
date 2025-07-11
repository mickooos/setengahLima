import React from "react";
import { Link } from "react-router-dom";

interface PageProps {
  noMeja: number | null;
}

const Page: React.FC<PageProps> = ({ noMeja }) => {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center bg-cover bg-center welcomeBg text-white">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
        setengahLima.
      </h1>
      <p className="text-lg md:text-2xl font-semibold drop-shadow-md mb-6">
        Selamat Datang di kedai kopi kami.
      </p>
      {noMeja ? (
        <Link
          to="/home"
          className="px-6 py-3 bg-amber-950 text-white font-bold rounded-lg hover:bg-[#6f4e37] shadow-lg transition-all duration-300"
        >
          Lanjut
        </Link>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gradient-to-br from-[#948946] to-[#6F4E37] rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-white">
              Kamu Belum Punya Nomor Meja Mohon scan ulang Barcode pada meja. :)
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
