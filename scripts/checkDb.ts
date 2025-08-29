import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Database connected successfully");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

main();
