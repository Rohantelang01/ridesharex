
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectToDB from "@/lib/db"; // Corrected: Use default import

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; 

export async function POST(req: NextRequest) {
  try {
    await connectToDB(); // Corrected: Call the imported function

    const { name, email, phone, password, age, gender } = await req.json();

    // 1. VALIDATION
    if (!name || !email || !phone || !password || !age || !gender) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // 2. CHECK FOR EXISTING USER
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email or phone already exists" }, { status: 409 });
    }

    // 3. HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. CREATE USER
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      age,
      gender,
      roles: { passenger: true, driver: false, owner: false }, // Default role
    });

    await newUser.save();

    // 5. GENERATE JWT
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. SET COOKIE
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // 7. RETURN RESPONSE
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    // Be more specific with database connection errors
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
        return NextResponse.json({ message: "Database configuration error." }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
