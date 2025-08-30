
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Booking from "@/models/Booking";

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const { rideId, userId, seats, amount } = await req.json();

    if (!rideId || !userId || !seats || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newBooking = new Booking({
      rideId,
      userId,
      seats,
      amount,
    });

    await newBooking.save();

    return NextResponse.json({ message: "Booking created successfully", booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  await connectToDB();

  try {
    const bookings = await Booking.find({}).populate("rideId").populate("userId");
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
