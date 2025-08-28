import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// POST /api/auth (signup)
export async function POST(req: NextRequest) {
  await connectToDB();

  const formData = await req.formData();

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();
  const city = formData.get("city")?.toString();
  const role = formData.get("role")?.toString(); // passenger/driver/owner/both

  if (!name || !email || !phone || !password || !city || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check existing user
  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

  // Role flags
  const roles = {
    passenger: role === "passenger" || role === "both" || role === "driver",
    driver: role === "driver" || role === "both",
    owner: role === "owner" || role === "both",
  };

  // Passenger info
  const passengerInfo = {
    preferredPayment: formData.get("preferredPayment")?.toString() || "UPI",
  };

  // Driver info
  let driverInfo: any = {};
  if (roles.driver) {
    driverInfo.licenseNumber = formData.get("licenseNumber")?.toString();
    driverInfo.vehiclePreference = formData.get("vehiclePreference")?.toString();

    const licenseFile = formData.get("licenseFile") as File;
    const profileFile = formData.get("profileFile") as File;

    if (licenseFile?.size) {
      const buffer = Buffer.from(await licenseFile.arrayBuffer());
      driverInfo.licenseImage = await uploadToCloudinary(buffer, "driver/licenses");
    }

    if (profileFile?.size) {
      const buffer = Buffer.from(await profileFile.arrayBuffer());
      driverInfo.profileImage = await uploadToCloudinary(buffer, "driver/profiles");
    }
  }

  // Owner info
  let ownerInfo: any = {};
  if (roles.owner) {
    ownerInfo.aadhaarNumber = formData.get("aadhaarNumber")?.toString();
    const aadhaarFile = formData.get("aadhaarFile") as File;
    if (aadhaarFile?.size) {
      const buffer = Buffer.from(await aadhaarFile.arrayBuffer());
      ownerInfo.aadhaarImage = await uploadToCloudinary(buffer, "owner/aadhaar");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
const newUser = new User({
  name,
  email,
  phone,
  password: hashedPassword,
  city,
  roles,
  passengerInfo,
  driverInfo: roles.driver ? driverInfo : undefined,
  ownerInfo: roles.owner ? ownerInfo : undefined,
} as any);  // type cast to any for TS temporary fix

  await newUser.save();

  return NextResponse.json({ message: "User created successfully", userId: newUser._id }, { status: 201 });
}
