import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// controller to register
export const adminRegister = async (req, res) => {
  const { nama, email, password, confPassword } = req.body;
  try {
    // field checking
    if (!nama || !email || !password || !confPassword)
      return res.status(400).send({ message: "Fill out the field" });
    // password checking
    if (password !== confPassword)
      return res.status(400).json({ message: "Password not matched" });
    // password hashing
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);
    // creating admin
    const admin = await prisma.admin.create({
      data: { nama, email, password: hashPwd },
    });
    return res.json({
      message: "Register successful!",
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// controller to login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // field checking
    if (!email || !password)
      return res.status(400).send({ message: "Fill out the field" });
    // admin's email existence checking
    const admin = await prisma.admin.findUnique({ where: { email: email } });
    if (!admin) return res.status(404).send({ message: "Email not found" });
    // admin's password checking
    const isMatched = await bcrypt.compare(password, admin.password);
    if (!isMatched) return res.status(401).send({ message: "Wrong password" });
    // setting admin's token
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
    await prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: refreshToken },
    });
    res
      .cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        success: true,
        accessToken: accessToken,
      });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

// controller to logout
export const adminLogout = async (req, res) => {
  const { token } = req.cookies;
  // checking refresh token existence
  if (!token) return res.status(204).json({ message: "Token not found!" });
  const admin = await prisma.admin.findMany({
    where: { refreshToken: token },
  });
  if (!admin[0]) return res.status(204).send({ message: "Admin not found!" });
  // deleting admin's refresh token
  await prisma.admin.update({
    where: { id: admin[0].id },
    data: { refreshToken: null },
  });
  res.clearCookie("token");
  return res.json({ message: "Logout successful!", success: true });
};

// controller to get admin profile's data
export const adminProfile = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: {
        id: true,
        nama: true,
        email: true,
      },
    });
    // check admin existence
    if (!admin) return res.status(404).send({ message: "Admin Not Found!" });
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
