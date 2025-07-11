import prisma from "../config/prismaClient.js";
import QRCode from "qrcode";

// controller to get all tables (meja) data
export const getTables = async (req, res) => {
  try {
    const tables = await prisma.meja.findMany({
      orderBy: {
        nomorMeja: "asc",
      },
    });
    // checking tables data existence
    if (!tables) return res.status(404).send({ message: "Tables not found" });
    res.status(200).json({ success: true, tables });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get tables (meja) data by id
export const getTableById = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await prisma.meja.findUnique({
      where: { id: id },
    });
    // checking selected table existence
    if (!table) return res.status(404).send({ message: "Table not found" });
    res.status(200).json({ success: true, table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get tableUrl
export const getTableUrl = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await prisma.meja.findUnique({
      where: { id: id },
    });
    if (!table) return res.status(404).send({ message: "Table not found" });
    const qrCodeData = await QRCode.toDataURL(table.tableUrl);
    res.status(200).json({ success: true, qrCode: qrCodeData });
  } catch (error) {
    res.status(500).json({ message: "Failed making QR code" });
  }
};

// controller to create a new table
export const createTable = async (req, res) => {
  const { nomorMeja, jumlahBangku } = req.body;
  const tableUrl = `${process.env.CLI_PORT}?noMeja=${nomorMeja}`;
  try {
    // generate tableUrl to QrCode
    const tableQrCode = await QRCode.toDataURL(tableUrl);
    const newTable = await prisma.meja.create({
      data: {
        nomorMeja: parseInt(nomorMeja),
        jumlahBangku: parseInt(jumlahBangku),
        tableUrl,
        tableCode: tableQrCode,
      },
    });

    res.status(201).json({
      message: "Table created successfully",
      success: true,
      newTable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to update a table
export const updateTable = async (req, res) => {
  const { id } = req.params;
  const { nomorMeja, jumlahBangku, statusMeja } = req.body;
  const tableUrl = `${process.env.CLI_PORT}?noMeja=${nomorMeja}`;
  try {
    // generate tableUrl to QrCode
    const tableQrCode = await QRCode.toDataURL(tableUrl);
    const updatedTable = await prisma.meja.update({
      where: { id: id },
      data: {
        nomorMeja: parseInt(nomorMeja),
        jumlahBangku: parseInt(jumlahBangku),
        statusMeja,
        tableUrl,
        tableCode: tableQrCode,
      },
    });
    res.status(200).json({
      message: `Table ${id} updated successfully`,
      success: true,
      updatedTable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to update a table
export const updateTableStatus = async (req, res) => {
  const { id } = req.params;
  const { statusMeja } = req.body;

  try {
    const updatedMeja = await prisma.meja.update({
      where: { id: id },
      data: { statusMeja },
    });
    res.status(200).json({
      message: `Table ${id} status updated successfully`,
      success: true,
      updatedMeja,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to updated table status" });
  }
};

// controller to delete a table
export const deleteTable = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.meja.delete({
      where: { id: id },
    });
    res.status(200).json({ message: `Table ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
