
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from 'mongoose';
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { Wallet } from "@/models/Wallet";
import connectToDB from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDB();

    const data = await req.json();
    const {
      name, email, phone, password, age, gender,
      isDriver, licenseNumber,
      isOwner, vehicle
    } = data;

    // --- 1. Validations ---
    if (!name || !email || !phone || !password || !age || !gender) {
      throw new Error("Name, email, phone, password, age, and gender are required");
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] }).session(session);
    if (existingUser) {
      throw new Error("User with this email or phone already exists");
    }

    // --- 2. Create User within Transaction ---
    const hashedPassword = await bcrypt.hash(password, 10);
    const roles = ["passenger"];

    if (isDriver) {
      if (!licenseNumber) throw new Error("License number is required for drivers");
      roles.push("driver");
    }
    if (isOwner) {
      if (!vehicle?.make || !vehicle?.vehicleModel || !vehicle?.year || !vehicle?.plateNumber) {
        throw new Error("Complete vehicle information is required for owners");
      }
      roles.push("owner");
    }

    const userPayload = {
      name, email, phone, password: hashedPassword, age, gender, 
      roles: [...new Set(roles)],
      driverInfo: isDriver ? { licenseNumber, status: 'UNAVAILABLE' } : undefined,
      verification: { isAadhaarVerified: false, isPanVerified: false },
    };

    const newUserArr = await User.create([userPayload], { session });
    const newUser = newUserArr[0];

    // --- 3. Create Vehicle and Wallet within Transaction (if applicable) ---
    if (isOwner) {
      const vehiclePayload = {
        ...vehicle,
        owner: newUser._id,
        vehicleModel: vehicle.vehicleModel, // Ensure correct field name
      };
      const newVehicleArr = await Vehicle.create([vehiclePayload], { session });
      newUser.ownerInfo = { vehicles: [newVehicleArr[0]._id] };
    }
    
    const walletArr = await Wallet.create([{ user: newUser._id, generatedBalance: 0, addedBalance: 0 }], { session });
    newUser.wallet = walletArr[0]._id;

    await newUser.save({ session });

    // --- 4. If all successful, commit the transaction ---
    await session.commitTransaction();

    // --- 5. Generate Token and Send Response ---
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, email: newUser.email, roles: newUser.roles },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    cookies().set("token", token, { httpOnly: true, secure: process.env.NODE_ENV !== "development", sameSite: "strict", maxAge: 60*60*24*7, path: "/" });

    return NextResponse.json({
      message: "User created successfully",
      token: token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, roles: newUser.roles },
    }, { status: 201 });

  } catch (error) {
    // --- 6. If any error occurs, abort the transaction ---
    await session.abortTransaction();

    console.error("Signup Transaction Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during signup.";
    return NextResponse.json({ message }, { status: 400 }); // Use 400 for client errors like 'user exists'

  } finally {
    // --- 7. Always end the session ---
    await session.endSession();
  }
}
