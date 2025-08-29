import { NextResponse } from "next/server";
import connectToDB from "../../../lib/db";

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json({ message: "MongoDB connected successfully!" });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ 
      error: "DB connection failed", 
      details: errorMessage 
    }, { status: 500 });
  }
}