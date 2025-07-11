import prisma from "../src/config/prismaClient.js";
import bcrypt from "bcrypt";

async function main() {
  // password hashing
  const password = process.env.ADMIN_PASSWORD;
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);
  // Seed data untuk model Admin
  const admin = await prisma.admin.create({
    data: {
      nama: "Admin",
      email: "admin@sl.app",
      password: hashPwd,
      refreshToken: null,
    },
  });

  console.log("Seed data berhasil dibuat:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
