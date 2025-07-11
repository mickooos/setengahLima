import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";
import { numberToRupiah } from "../../utils/number-to-rupiah";
import { formatDate } from "../../utils/format-date";
import axios from "axios";
import bauhaus from "../../assets/bauhauss.png";
import Header from "./Header";

const fetchOrder = async (orderId: string | null) => {
  const response = await axios.get(`order/${orderId}`);
  return response.data.order;
};

const Content: React.FC = () => {
  const { orderId } = useOrder();
  const {
    data: order,
    isLoading,
    error,
  } = useQuery(["order", orderId], () => fetchOrder(orderId), {
    enabled: !!orderId, // Fetch only if orderId exists and is not null
  });

  const getOrderStatusIndex = (status: string): number => {
    const statuses = ["CONFIRMED", "IN_PROGRESS", "DELIVERED", "COMPLETED"];
    return statuses.indexOf(status);
  };

  if (!orderId || !order)
    return (
      <div className="flex items-center justify-center h-screen relative">
        {/* Konten utama dengan efek overlay */}
        <div className="absolute flex flex-col p-10 bg-white bg-opacity-90 rounded-lg shadow-lg z-10">
          <h1 className="text-3xl font-bold text-black mb-4">
            Silahkan pilih pesanan terlebih dahulu
          </h1>
          <Link
            to="/home"
            className="text-xl text-center text-gray-900 underline"
          >
            Kembali
          </Link>
        </div>

        {/* Gambar Background */}
        <img
          src={bauhaus}
          className="relative  h-auto object-contain rounded-xl z-0"
          alt="Background"
        />
      </div>
    );

  if (order?.statusPesanan === "COMPLETED")
    return (
      <div className="flex items-center justify-center h-screen relative">
        {/* Konten utama dengan efek overlay */}
        <div className="absolute flex flex-col p-10 bg-white bg-opacity-90 rounded-lg shadow-lg z-10">
          <h1 className="text-3xl font-bold text-black mb-4">
            Selamat Menikmati Hidangan Kami
          </h1>
          <Link
            to="/home"
            className="text-xl text-center text-gray-900 underline"
          >
            Kembali
          </Link>
        </div>

        {/* Gambar Background */}
        <img
          src={bauhaus}
          className="relative  h-auto object-contain rounded-xl z-0"
          alt="Background"
        />
      </div>
    );

  if (isLoading)
    return <p className="text-center text-2xl mt-10 text-white">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-2xl mt-10 text-white">
        Error Mendapatkan Data
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6">
      <Header />
      <div className="max-w-5xl mx-auto p-6 shadow-lg rounded-lg mt-12 lg:mt-7">
        {!order ? (
          <h2 className="text-center text-2xl mt-40">Kamu belum memesan.</h2>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center bg-yellow-950 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-2xl font-semibold">
                Order - {order.pesananId}
              </h2>
            </div>

            {/* Detail Pesanan */}
            <div className="p-6 bg-slate-50 text-black grid grid-cols-2 gap-4">
              <p>
                <strong>No Meja :</strong> {order.noMeja}
              </p>
              <p>
                <strong>Tanggal : </strong>
                {formatDate(order.tanggalBuat)}
              </p>
              <p>
                <strong>Total : </strong>
                {numberToRupiah(order.jumlahBayar)}
              </p>
              <p>
                <strong>Metode Pembayaran :</strong> {order.metodePembayaran}
              </p>
            </div>

            {/* Pesanan Menu */}
            <div className="flex justify-between items-center bg-yellow-950 text-white px-6 py-4 ">
              <p className="text-xl font-semibold">Daftar Menu Yang Dipesan</p>
            </div>

            {order.pesananMenu.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-slate-50 text-black p-4 shadow"
              >
                <img
                  src={item.menu.gambar}
                  alt={item.menu.nama}
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{item.menu.nama}</h4>
                  <p className="text-sm">
                    Harga : {numberToRupiah(item.menu.harga)}
                  </p>
                  <p className="text-sm">Jumlah : {item.kuantiti}</p>
                  <p className="text-sm text-black">Catatan : {item.catatan}</p>
                </div>
              </div>
            ))}

            {/* Status Pesanan */}
            <div className="flex justify-between items-center bg-yellow-950 text-white px-6 py-4 ">
              <p className="text-xl font-semibold">Status Pesanan</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-b-lg text-black grid grid-cols-2 gap-4">
              {[
                "Pesanan Terkonfirmasi",
                "Pesanan Sedang Disiapkan",
                "Pesanan Diantar",
                "Pesanan Selesai",
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 flex items-center font-semibold justify-center rounded-full ${
                      index <= getOrderStatusIndex(order.statusPesanan)
                        ? "bg-yellow-900 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index <= getOrderStatusIndex(order.statusPesanan)
                      ? "✔"
                      : index + 1}
                  </div>
                  <p className="mt-2 text-sm text-center">{step}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Content;
