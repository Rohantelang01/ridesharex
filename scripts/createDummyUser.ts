import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // .ts file hi hai, par ESM import me .js likhna padega

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const dummyUser = new User({
      name: "Rohan Kumar",
      phone: "9876543210",
      email: "rohan@example.com",
      password: "hashedpassword123", // future me hash kar sakte ho
      city: "Delhi",
      roles: { passenger: true, driver: false, owner: false },
      passengerInfo: { preferredPayment: "UPI" },
    });

    await dummyUser.save();
    console.log("✅ Dummy user inserted:", dummyUser);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Failed to insert dummy user:", err);
  }
}

main();
