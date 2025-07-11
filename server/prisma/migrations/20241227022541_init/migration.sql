-- CreateEnum
CREATE TYPE "StatusMeja" AS ENUM ('RESERVED', 'UNRESERVED');

-- CreateEnum
CREATE TYPE "StatusMenu" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "MetodePembayaran" AS ENUM ('CASH', 'CASHLESS');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('PENDING_PAYMENT', 'PAID');

-- CreateEnum
CREATE TYPE "StatusPesanan" AS ENUM ('CONFIRMED', 'IN_PROGRESS', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "status" "StatusMenu" NOT NULL DEFAULT 'AVAILABLE',
    "gambar" TEXT NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "terjual" INTEGER NOT NULL DEFAULT 0,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategoriMenu" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KategoriMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meja" (
    "id" TEXT NOT NULL,
    "nomorMeja" INTEGER NOT NULL,
    "jumlahBangku" INTEGER NOT NULL,
    "statusMeja" "StatusMeja" NOT NULL DEFAULT 'UNRESERVED',
    "tableUrl" TEXT NOT NULL,
    "tableCode" TEXT NOT NULL,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pesanan" (
    "id" TEXT NOT NULL,
    "pesananId" TEXT NOT NULL,
    "jumlahBayar" DOUBLE PRECISION NOT NULL,
    "noMeja" INTEGER NOT NULL,
    "metodePembayaran" "MetodePembayaran" NOT NULL,
    "statusPesanan" "StatusPesanan" NOT NULL,
    "statusPembayaran" "StatusPembayaran" NOT NULL,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesananMenu" (
    "id" TEXT NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "pesanan_id" TEXT NOT NULL,
    "kuantiti" INTEGER NOT NULL,
    "catatan" TEXT,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PesananMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keranjang" (
    "id" TEXT NOT NULL,
    "noMeja" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "kuantiti" INTEGER NOT NULL,
    "catatan" TEXT,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keranjang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservasi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "jumlahTamu" INTEGER NOT NULL,
    "tanggalReservasi" TIMESTAMP(3) NOT NULL,
    "noMeja" INTEGER NOT NULL,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" SERIAL NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tanggalBuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalEdit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_nama_key" ON "Menu"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriMenu_nama_key" ON "KategoriMenu"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Meja_nomorMeja_key" ON "Meja"("nomorMeja");

-- CreateIndex
CREATE UNIQUE INDEX "Meja_tableUrl_key" ON "Meja"("tableUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Reservasi_nama_key" ON "Reservasi"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "KategoriMenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pesanan" ADD CONSTRAINT "Pesanan_noMeja_fkey" FOREIGN KEY ("noMeja") REFERENCES "Meja"("nomorMeja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesananMenu" ADD CONSTRAINT "PesananMenu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesananMenu" ADD CONSTRAINT "PesananMenu_pesanan_id_fkey" FOREIGN KEY ("pesanan_id") REFERENCES "Pesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_noMeja_fkey" FOREIGN KEY ("noMeja") REFERENCES "Meja"("nomorMeja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservasi" ADD CONSTRAINT "Reservasi_noMeja_fkey" FOREIGN KEY ("noMeja") REFERENCES "Meja"("nomorMeja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
