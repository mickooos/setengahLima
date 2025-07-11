import { PrismaClient } from "@prisma/client";

// initialize prisma client
const prisma = new PrismaClient();
export default prisma;

async function checkConnection() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to supabase.");
  } catch (error) {
    console.error(`Error connecting to supabase : ${error.message}.`);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
