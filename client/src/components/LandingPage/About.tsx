import React from "react";
import aboutUs from "../../assets/aboot-us.jpg";

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Grid untuk gambar dan teks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gambar, posisi responsif untuk teks overlay pada layar kecil */}
          <div className="relative">
            <img
              src={aboutUs}
              alt="Tentang Kami"
              className="w-full h-auto object-cover rounded-lg"
            />

            {/* Overlay text hanya untuk layar kecil */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 md:hidden">
              <h2 className="text-4xl font-bold text-white shadow-lg">
                Tentang Kami
              </h2>
            </div>
          </div>

          {/* Teks di sebelah kanan pada layar besar */}
          <div className="text-justify">
            {/* Heading untuk layar besar */}
            <h2 className="text-4xl font-bold hidden md:block mb-4">
              Tentang Kami
            </h2>

            {/* Deskripsi di bawah heading */}
            <p className="text-lg leading-relaxed">
              Selamat Datang yang ber-Gaji kecil dan gaya besar. Tak masalah
              jika harus ke kafe mahal, selama feeds Instagram tetap estetik.
              Selamat menikmati gaya hidup yang lebih mahal daripada tagihan
              bulananmu. Kami mungkin tidak bisa membayar tagihanmu, tapi
              setidaknya kami bisa menyajikan secangkir kopi yang cukup untuk
              membuat Anda merasa sedikit lebih baik saat scroll feed tanpa
              henti. Jadi, ambil tempat Anda dan nikmati kopi yang mungkin lebih
              baik daripada keputusan hidup Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
