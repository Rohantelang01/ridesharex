
import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle"; // Ensure Vehicle model is registered

export async function GET(req: Request) {
  try {
    await connectToDB();

    const users = await User.find({
      roles: { $in: ["driver", "owner"] },
    }).populate("ownerInfo.vehicles");

    // Log the entire data object for each user
    console.log("All drivers and owners data:", JSON.stringify(users, null, 2));

    return NextResponse.json(users);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
