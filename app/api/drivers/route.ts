
import { NextResponse } from "next/server";
import connectToDB from "../../../lib/db";
import { User } from "../../../models/User";

const MAX_DISTANCE_IN_METERS = 10 * 1000; // 10 kilometers

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const latitude = parseFloat(url.searchParams.get("latitude") || "0");
    const longitude = parseFloat(url.searchParams.get("longitude") || "0");

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const drivers = await User.find({
      roles: "driver",
      "driverInfo.status": "AVAILABLE",
      "currentLocation.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: MAX_DISTANCE_IN_METERS,
        },
      },
    });

    return NextResponse.json(drivers);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to fetch drivers",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
