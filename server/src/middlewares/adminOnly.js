import prisma from "../config/prismaClient.js";
import jwt from "jsonwebtoken";

// configuration that only admin can access specific route
export const adminOnly = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // checking token existence
    if (token == null) return next("Sorry, login first to access!");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });
    next();
  } catch (error) {
    return next(error.message);
  }
};
