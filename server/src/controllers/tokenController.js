import prisma from "../config/prismaClient.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.cookies; // token (alias) => refreshToken
    if (!token) return res.sendStatus(401);
    const admin = await prisma.admin.findMany({
      where: { refreshToken: token },
    });
    if (!admin[0]) return res.sendStatus(403);
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const id = admin[0].id;
      const nama = admin[0].nama;
      const email = admin[0].email;
      const accessToken = jwt.sign(
        { id, nama, email },
        process.env.ACCESS_TOKEN,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
      );
      res.json({ accessToken: accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};
