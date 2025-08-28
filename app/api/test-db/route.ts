import { NextResponse } from "next/server";
import connectToDB from "../../../lib/db";

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json({ message: "MongoDB connected successfully!" });
  } catch (err: any) {
    return NextResponse.json({ error: "DB connection failed", details: err.message }, { status: 500 });
  }
}

