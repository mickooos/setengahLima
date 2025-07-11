import React from "react";
import { numberToRupiah } from "../../utils/number-to-rupiah";

interface MenuItemProps {
  nama: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  onAddToCart: () => void;
}

const MenuCard: React.FC<MenuItemProps> = ({
  nama,
  harga,
  deskripsi,
  gambar,
  onAddToCart,
}) => {
  return (
    <div className="rounded-lg shadow-md p-6 bg-white">
      {/* Gambar dengan aspect ratio */}
      <div className="relative aspect-video">
        <img
          src={gambar}
          alt={nama}
          className="w-full h-full object-cover rounded-md bg-slate-100"
        />
      </div>

      {/* Nama, Deskripsi dan Harga Menu */}
      <div className="p-5">
        <h1 className="text-2xl font-bold text-gray-900 truncate">{nama}</h1>
        <h3 className="text-sm font-normal text-gray-900 ">
          {numberToRupiah(harga)}
        </h3>
        <p className="text-sm font-normal text-gray-900 mt-2 truncate">
          {deskripsi}
        </p>
      </div>

      {/* Tombol Add to Cart */}
      <button
        onClick={onAddToCart}
        className="w-full bg-amber-950 text-white py-2 rounded-lg shadow-lg hover:bg-[#6f4e37] transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MenuCard;
