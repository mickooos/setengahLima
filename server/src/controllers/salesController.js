import prisma from "../config/prismaClient.js";

// controller to get all sales data
export const getSales = async (req, res) => {
  try {
    // getting data query
    const salesMenu = await prisma.menu.findMany({
      select: {
        nama: true,
        terjual: true,
      },
      orderBy: {
        terjual: "desc",
      },
    });

    // query to calculate the sum of sold products
    const sales = await prisma.menu.aggregate({
      _sum: {
        terjual: true,
      },
    });

    // validating total sales
    const totalSales = sales._sum.terjual || 0;

    // if total sales is zero, don't fetch best-selling product
    let bestSellingName = null;
    if (totalSales > 0) {
      const bestSelling = await prisma.menu.findFirst({
        select: {
          nama: true,
          terjual: true,
        },
        orderBy: {
          terjual: "desc",
        },
      });
      bestSellingName = bestSelling?.nama || "Nama tidak tersedia";
    }

    res.status(200).json({
      success: true,
      bestSellingName, // only included if sales > 0
      totalSales,
      salesMenu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesToday = async (req, res) => {
  try {
    // getting start and end today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    // query to getting today sales data
    const salesToday = await prisma.sales.findMany({
      where: {
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    // count amount of today sales data
    const count = salesToday.reduce((acc, log) => acc + log.jumlah, 0);
    res.status(200).json({
      success: true,
      count,
      data: salesToday,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesByDayWeekMonthYear = async (req, res) => {
  const { filter } = req.query;
  let startDate, endDate;

  const now = new Date();
  if (filter === "day") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
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
    const data = await prisma.sales.findMany({
      where: {
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    if (!data || data.length === 0)
      return res.json({ empty: "No data found for the selected filter" });

    const labels = data.map((d) => d.tanggal.toISOString().split("T")[0]);
    const values = data.map((d) => d.jumlah);

    res.status(200).json({ success: true, labels, values });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
