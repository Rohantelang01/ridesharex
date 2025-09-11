
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Booking } from '@/models/Booking';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const {
      passengerId,
      driverId,
      vehicleId,
      pickup, // ILocation { address: string, coordinates: { lat, lng } }
      dropoff, // ILocation { address: string, coordinates: { lat, lng } }
      bookingType,
      fare,
      estimatedDistance,
      estimatedDuration,
      bookingTime // For advance bookings
    } = await req.json();

    // --- Validation ---
    if (!passengerId || !driverId || !vehicleId || !pickup || !dropoff || !bookingType || !fare) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    if (!pickup.address || !pickup.coordinates || !dropoff.address || !dropoff.coordinates) {
        return NextResponse.json({ message: 'Pickup and dropoff must have address and coordinates' }, { status: 400 });
    }

    // --- Check for existing users ---
    const passenger = await User.findById(passengerId);
    const driver = await User.findById(driverId);

    if (!passenger || passenger.role !== 'passenger') {
      return NextResponse.json({ message: 'Passenger not found' }, { status: 404 });
    }
    if (!driver || driver.role !== 'driver') {
      return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
    }

    // --- Data Transformation & Booking Creation ---
    
    // Generate a unique bookingId
    const bookingId = `BK-${Date.now()}`;
    
    let status: 'requested' | 'accepted';
    let scheduledDateTime: Date;

    if (bookingType === 'advance') {
        status = 'requested';
        scheduledDateTime = new Date(bookingTime);
    } else { // instant
        status = 'accepted';
        scheduledDateTime = new Date();
    }

    const newBooking = new Booking({
      bookingId,
      passengerId,
      driverId,
      vehicleId,
      pickup: {
        address: pickup.address,
        coordinates: {
            lat: pickup.coordinates.lat,
            lng: pickup.coordinates.lng
        }
      },
      dropoff: {
        address: dropoff.address,
        coordinates: {
            lat: dropoff.coordinates.lat,
            lng: dropoff.coordinates.lng
        }
      },
      bookingType,
      scheduledDateTime,
      status,
      fare: { 
          totalFare: fare, 
          estimatedFare: fare // Storing fare in both for now
      },
      estimatedDistance,
      estimatedDuration,
      driverAccepted: bookingType === 'instant', // Pre-accepted for instant bookings
    });

    await newBooking.save();
    
    // Update driver's status for instant bookings
    if (bookingType === 'instant') {
        driver.driverInfo.status = 'ON_TRIP';
        await driver.save();
    }

    return NextResponse.json({ message: 'Booking created successfully', booking: newBooking }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    // Provide a more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
