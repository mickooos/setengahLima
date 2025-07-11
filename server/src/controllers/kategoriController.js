import prisma from "../config/prismaClient.js";

// controller to getting all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.kategoriMenu.findMany({
      orderBy: {
        id: "asc",
      },
    });
    // checking categories existence
    if (!categories)
      return res.status(404).send({ message: "Categories not found" });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to getting category by id
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.kategoriMenu.findUnique({
      where: { id: parseInt(id) },
    });
    // checking selected category existence
    if (!category)
      return res.status(404).send({ message: "Categories not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to create a new category
export const createCategory = async (req, res) => {
  const { nama } = req.body;
  try {
    const newCategory = await prisma.kategoriMenu.create({
      data: { nama },
    });
    res.status(201).json({
      message: "Category created successfully",
      success: true,
      newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to updating a category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;
  try {
    // checking selected category existence
    const selectedCategory = await prisma.kategoriMenu.findUnique({
      where: { id: parseInt(id) },
    });
    if (!selectedCategory)
      return res.status(404).send({ message: "Category not found" });

    // updating a category
    const updatedCategory = await prisma.kategoriMenu.update({
      where: { id: parseInt(id) },
      data: { nama },
    });
    res.status(200).json({
      message: `Category ${id} updated successfully`,
      success: true,
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleting a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // checking selected category existence
    const selectedCategory = await prisma.kategoriMenu.findUnique({
      where: { id: parseInt(id) },
    });
    if (!selectedCategory)
      return res.status(404).send({ message: "Category not found" });

    // deleting a category
    await prisma.kategoriMenu.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: `Category ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
