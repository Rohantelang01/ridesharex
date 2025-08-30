
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the token cookie
    cookies().set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0), // Set to a past date
      path: "/",
    });

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });

  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
