
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const { driverId, coordinates } = await req.json();

    if (!driverId || !coordinates) {
      return NextResponse.json({ message: 'Driver ID and coordinates are required' }, { status: 400 });
    }

    const user = await User.findById(driverId);

    if (!user || user.role !== 'driver') {
      return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
    }

    user.driverInfo.currentLocation.coordinates = coordinates;
    await user.save();

    return NextResponse.json({ message: 'Location updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating driver location:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
