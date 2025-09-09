
import { NextResponse } from "next/server";
import connectToDB from "../../../lib/db";
import { User } from "../../../models/User";

export async function GET() {
  try {
    await connectToDB();
    const drivers = await User.find({ roles: "driver" });
    return NextResponse.json(drivers);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ 
      error: "Failed to fetch drivers", 
      details: errorMessage 
    }, { status: 500 });
  }
}
