import prisma from "../config/prismaClient.js";
import {
  uploadImageToSupabase,
  deleteImageFromSupabase,
} from "../supabase/handler.js";

// controller to get all menu data
export const getMenus = async (req, res) => {
  try {
    const menu = await prisma.menu.findMany({
      include: {
        kategori: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    // checking all menu item
    if (!menu) return res.status(404).json({ error: "Menu is empty" });
    res.status(200).json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get menu data by id
export const getMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
      include: {
        kategori: true,
      },
    });
    // checking menu item
    if (!menu) return res.status(404).json({ error: "Menu item not found" });
    res.status(200).json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to create a new menu
export const createMenu = async (req, res) => {
  const { nama, deskripsi, harga, kategori_id } = req.body;
  const imageFile = req.file;

  // all field validation
  if (!nama || !deskripsi || !harga || !kategori_id || !imageFile)
    return res.status(400).json({ message: "All fields are required." });

  try {
    let imageUrl = null;
    if (imageFile) imageUrl = await uploadImageToSupabase(imageFile);
    // creating a new menu item with image url
    const menu = await prisma.menu.create({
      data: {
        nama,
        deskripsi,
        harga: parseFloat(harga),
        kategori_id: parseInt(kategori_id),
        gambar: imageUrl,
      },
    });
    res.status(201).json({
      message: "Menu created successfully",
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error(`Error creating menu item : ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// controller to updating menu
export const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, harga, status, kategori_id } = req.body;
  const imageFile = req.file; // fetching filename from request

  try {
    // searching menu item
    const menuItem = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
    });
    // error handling for menu item searching
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });
    // checking if there's a new uploaded image
    let imageUrl = menuItem.gambar;
    if (imageFile) {
      if (menuItem.gambar) await deleteImageFromSupabase(menuItem.gambar);
      imageUrl = await uploadImageToSupabase(imageFile);
    }
    // updating menu item
    const menu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        deskripsi,
        status,
        harga: parseFloat(harga),
        kategori_id: parseInt(kategori_id),
        gambar: imageUrl,
      },
    });
    res.status(201).json({
      message: `Menu ${id} updated successfully`,
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error(`Error updating menu item : ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// controller to deleting menu
export const deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    // fetch existing menu item
    const menuItem = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
    });
    // searching menu item
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });
    // deleting image if exist
    if (menuItem.gambar) await deleteImageFromSupabase(menuItem.gambar);
    // deleting menu from database
    await prisma.menu.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: `Menu ${id} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting menu item : ${error.message}`);
    res.status(500).json({ error: "Failed to delete menu" });
  }
};
