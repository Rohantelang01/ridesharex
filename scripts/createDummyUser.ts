import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);

  const dummyUser: Partial<IUser> = {
    name: "Rohan Kumar",
    phone: "9876543210",
    email: "rohan@example.com",
    password: "hashedpassword123", // hash if needed
    city: "Delhi",
    roles: { passenger: true, driver: false, owner: false },
    passengerInfo: { preferredPayment: "UPI" },
  };

  const user = new User(dummyUser);
  await user.save();
  console.log("Dummy user created:", user);
  mongoose.disconnect();
}

main().catch(console.error);
