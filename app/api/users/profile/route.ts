// app/api/users/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User, { IUser } from '@/models/User';
import { connectDB } from '@/lib/db';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return { error: 'No token provided', status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = await verifyToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const user = await User.findById(auth.userId).select('-password').populate([
      { path: 'rideHistory', select: 'from to fare status createdAt' },
      { path: 'cancelList.rideId', select: 'from to fare' }
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Role-based data filtering
    const profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      profileImage: user.profileImage,
      role: user.roles,
      address: {
        homeLocation: user.address?.homeLocation,
        currentLocation: user.address?.currentLocation,
      },
      emergencyContact: user.emergencyContact,
      wallet: user.wallet,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Add role-specific data
    if (user.roles === 'passenger') {
      (profileData as any).passengerInfo = user.passengerInfo;
      (profileData as any).rideHistory = user.rideHistory;
    }
    
    if (user.roles === 'driver') {
      (profileData as any).driverInfo = user.driverInfo;
    }
    
    if (user.roles === 'owner') {
      (profileData as any).ownerInfo = user.ownerInfo;
    }

    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = await verifyToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const {
      name,
      phone,
      age,
      gender,
      profileImage,
      address,
      emergencyContact,
      passengerInfo
    } = body;

    // Find user
    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate age for role
    if (age && user.roles === 'driver' && age < 21) {
      return NextResponse.json(
        { error: 'Driver must be at least 21 years old' },
        { status: 400 }
      );
    }

    // Update basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (profileImage) user.profileImage = profileImage;

    // Update address
    if (address) {
      if (address.homeLocation) {
        user.address.homeLocation = address.homeLocation;
      }
      if (address.currentLocation) {
        user.address.currentLocation = address.currentLocation;
      }
    }

    // Update emergency contact
    if (emergencyContact) {
      user.emergencyContact = emergencyContact;
    }

    // Update role-specific info
    if (user.roles === 'passenger' && passengerInfo) {
      user.passengerInfo = { ...user.passengerInfo, ...passengerInfo };
    }

    await user.save();

    // Return updated profile (exclude password)
    const updatedUser = await User.findById(user._id).select('-password');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}