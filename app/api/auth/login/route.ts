
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectToDB from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { email, password } = await req.json();

    // 1. VALIDATION
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // 2. FIND USER
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 3. VERIFY PASSWORD
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 4. GENERATE JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. SET COOKIE
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // 6. RETURN RESPONSE
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
