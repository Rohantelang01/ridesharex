// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import connectToDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper function to get and verify token from cookies
async function getTokenFromCookies() {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    throw new Error('No token found');
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded;
}

// GET - Fetch user profile data
export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const decoded = await getTokenFromCookies();

    const user = await User.findById(decoded.userId)
      .populate('ownerInfo.vehicles')
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Profile fetch error:', error);
    if (error instanceof jwt.JsonWebTokenError || (error as Error).message === 'No token found') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT - Update user profile data (Full Update)
export async function PUT(request: NextRequest) {
  try {
    await connectToDB();
    
    const decoded = await getTokenFromCookies();
    
    const data = await request.json();

    // Ensure sensitive data is not updated
    delete data.password;
    delete data.email;
    
    // Allow roles to be updated
    // delete data.roles;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      data,
      { new: true, runValidators: true }
    )
    .populate('ownerInfo.vehicles')
    .select('-password')
    .lean();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    if (error instanceof jwt.JsonWebTokenError || (error as Error).message === 'No token found') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

// PATCH - Update specific section of user profile
export async function PATCH(request: NextRequest) {
    try {
      await connectToDB();
      
      const decoded = await getTokenFromCookies();
      
      const { section, data } = await request.json();
      
      console.log('PATCH request received:', { section, data, userId: decoded.userId });
  
      if (!data) {
        return NextResponse.json({ error: 'Data is required for patch' }, { status: 400 });
      }

      const update: { [key: string]: any } = {};
      
      // If a section is specified (e.g., 'driverInfo'), create a nested update.
      // This is used for updating existing sections of the profile.
      if (section) {
        Object.keys(data).forEach(key => {
          update[`${section}.${key}`] = data[key];
        });
      } else {
        // If no section is specified, treat it as a root-level update.
        // This is now used for adding a new role and its data simultaneously.
        Object.assign(update, data);
      }

      console.log('Update object:', update);

      // Prevent accidental password or email updates via this endpoint.
      if (Object.keys(update).some(k => k.includes('password') || k.includes('email'))) {
        return NextResponse.json({ error: 'Cannot update sensitive fields' }, { status: 400 });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        decoded.userId,
        { $set: update },
        { new: true, runValidators: true }
      )
      .populate('ownerInfo.vehicles')
      .select('-password')
      .lean();
  
      if (!updatedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      console.log('User updated successfully:', updatedUser._id);
  
      return NextResponse.json({
        success: true,
        user: updatedUser
      });
  
    } catch (error) {
      console.error('Profile patch error:', error);
      if (error instanceof jwt.JsonWebTokenError || (error as Error).message === 'No token found') {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      return NextResponse.json({ 
        error: 'Failed to update profile section',
        details: (error as Error).message
      }, { status: 500 });
    }
}