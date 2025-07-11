import prisma from "../config/prismaClient.js";

// controller to get all reservations
export const getReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservasi.findMany({
      include: { meja: true },
      orderBy: {
        noMeja: "asc",
      },
    });
    // checking reservations existence
    if (!reservations)
      return res.status(404).json({ message: "Reservations not found" });
    res.status(200).json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controller to get reservation data by id
export const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservasi.findUnique({
      where: { id: id },
      include: { table: true },
    });
    // checking reservations existence
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controller to create a new reservation
export const createReservation = async (req, res) => {
  const { noMeja, nama, kontak, jumlahTamu, tanggalReservasi } = req.body;
  try {
    const newReservation = await prisma.reservasi.create({
      data: {
        noMeja,
        nama,
        kontak,
        jumlahTamu,
        tanggalReservasi: new Date(tanggalReservasi),
      },
      include: { meja: true },
    });
    res.status(201).json({
      message: "Reservation created successfully",
      success: true,
      newReservation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controller to update reservation data
export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { noMeja, nama, kontak, jumlahTamu, tanggalReservasi } = req.body;
  try {
    const updatedReservation = await prisma.reservasi.update({
      where: { id: id },
      data: {
        noMeja,
        nama,
        kontak,
        jumlahTamu,
        tanggalReservasi: new Date(tanggalReservasi),
      },
      include: { meja: true },
    });
    res.status(201).json({
      message: `Reservation ${id} updated successfully`,
      success: true,
      updatedReservation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controller to delete reservation data
export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    // checking reservation existence
    const reservation = await prisma.reservasi.findUnique({
      where: { id: id },
    });
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    // deleting reservation
    await prisma.reservasi.delete({
      where: { id: id },
    });
    res.status(200).json({ message: `Reservation ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
