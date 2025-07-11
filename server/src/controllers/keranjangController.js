import prisma from "../config/prismaClient.js";

// controller to get all cart data
export const getAllCartItem = async (req, res) => {
  try {
    const cart = await prisma.keranjang.findMany({
      include: {
        menu: true,
      },
    });
    // checking order items existence
    if (!cart) return res.status(404).json({ message: "Cart data not found." });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get cart data by id
export const getCartItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await prisma.keranjang.findUnique({
      where: { id: id },
      include: { menu: true },
    });
    // checking order items existence
    if (!cart) return res.status(404).json({ message: "Cart data not found." });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to create cart data
export const createCartItem = async (req, res) => {
  const { kuantiti, catatan, menu_id, noMeja } = req.body;
  try {
    const existingCartItem = await prisma.keranjang.findFirst({
      where: {
        menu_id: parseInt(menu_id),
        noMeja: noMeja,
      },
    });

    if (existingCartItem) {
      const updatedCartItem = await prisma.keranjang.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          kuantiti: existingCartItem.kuantiti + parseInt(kuantiti),
          catatan: catatan || existingCartItem.catatan,
        },
        include: {
          menu: true,
        },
      });

      return res.status(200).json({
        message: `Cart item ${existingCartItem.id} updated successfully`,
        success: true,
        cartItem: updatedCartItem,
      });
    } else {
      const newCartItem = await prisma.keranjang.create({
        data: {
          menu_id: parseInt(menu_id),
          kuantiti: parseInt(kuantiti),
          catatan: catatan,
          noMeja: noMeja,
        },
        include: { menu: true },
      });
      return res.status(201).json({
        message: "Cart created successfully",
        success: true,
        cartItem: newCartItem,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to update cart item
export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { kuantiti, catatan } = req.body;
  try {
    const cartItem = await prisma.keranjang.update({
      where: { id: id },
      data: {
        kuantiti: parseInt(kuantiti),
        catatan: catatan,
      },
      include: { menu: true },
    });
    res.status(201).json({
      message: `Cart ${id} updated successfully`,
      success: true,
      cartItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to delete cart item
export const deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    // checking cart item existence
    const cartItem = await prisma.keranjang.findUnique({
      where: { id: id },
    });
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });
    // deleting cart item
    await prisma.keranjang.delete({
      where: { id: id },
    });
    res.status(200).json({ message: `Cart item ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllItems = async (req, res) => {
  try {
    await prisma.keranjang.deleteMany({});
    res.status(200).json({ message: `All Cart item deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
