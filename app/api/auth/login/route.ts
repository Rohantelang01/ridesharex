
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ message: "No account found with that email address." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "The password you entered is incorrect." }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // *** FIX: Use 'userId' in the token payload to match what the profile API expects ***
    const tokenPayload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // The user object in the response body can still use 'id' for frontend convenience
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };

    return NextResponse.json({
      message: "Login successful",
      token: token, 
      user: userResponse,
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
