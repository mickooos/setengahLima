import prisma from "../config/prismaClient.js";

// controller to add revenue
export const addRevenue = async (req, res) => {
  const { income } = req.body;

  // field validation
  if (!income) return res.status(400).json({ message: "Income are required." });

  try {
    const newRevenue = await prisma.revenue.create({
      data: { income: parseFloat(income) },
    });
    res.status(201).json({
      message: "Revenue added successfully",
      success: true,
      newRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get all revenue
export const getAllRevenue = async (req, res) => {
  try {
    const revenue = await prisma.revenue.findMany();
    res.status(200).json({ success: true, revenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to calculate total revenue
export const getTotalRevenue = async (req, res) => {
  try {
    // query to calculate the sum of income
    const revenue = await prisma.revenue.aggregate({
      _sum: {
        income: true, // sum up the 'jumlahBayar' field
      },
    });
    // formatted data
    const totalRevenue = revenue._sum.income;
    // sending response
    res.status(200).json({
      message: "Successfully getting total revenue data",
      success: true,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueToday = async (req, res) => {
  try {
    // getting start and end today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    // query to getting today revenue data
    const revenueToday = await prisma.revenue.findMany({
      where: {
        tanggalBuat: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    // count amount of today sales data
    const count = revenueToday.reduce((acc, log) => acc + log.income, 0);
    res.status(200).json({
      success: true,
      count,
      data: revenueToday,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueByDayWeekMonthYear = async (req, res) => {
  const { filter } = req.query;
  let startDate, endDate;

  const now = new Date();
  if (filter === "day") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 9999));
  } else if (filter === "week") {
    startDate = new Date(now.setDate(now.getDate() - 7));
    endDate = new Date();
  } else if (filter === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (filter === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear(), 11, 31);
  } else {
    return res.status(400).json({ message: error.message });
  }

  try {
    const data = await prisma.revenue.findMany({
      where: {
        tanggalBuat: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        tanggalBuat: "asc",
      },
    });

    if (!data || data.length === 0)
      return res.json({ empty: "No data found for the selected filter" });

    const labels = data.map((d) => d.tanggalBuat.toISOString().split("T")[0]);
    const values = data.map((d) => d.income);

    res.status(200).json({ success: true, labels, values });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
