
import { NextRequest, NextResponse } from 'next/server';
import { User, IUser } from '@/models/User';
import { Vehicle, IVehicle } from '@/models/Vehicle';
import connectToDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

async function getTokenFromCookies() {
  const tokenCookie = (await cookies()).get('token');
  if (!tokenCookie) {
    throw new Error('Authentication token not found');
  }
  
  const token = tokenCookie.value;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT secret is not configured');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded.userId;
}

// GET - Fetch user profile data
export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const userId = await getTokenFromCookies();

    const user = await User.findById(userId)
      .populate('ownerInfo.vehicles')
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Profile fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const statusCode = errorMessage.includes('token') ? 401 : 500;
    return NextResponse.json({ error: 'Failed to fetch profile', details: errorMessage }, { status: statusCode });
  }
}

// PUT - Update user profile data
export async function PUT(request: NextRequest) {
  try {
    await connectToDB();
    const userId = await getTokenFromCookies();
    const data = await request.json();

    delete data.password;

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true })
      .populate('ownerInfo.vehicles')
      .select('-password')
      .lean();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error('Profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const statusCode = errorMessage.includes('token') ? 401 : 500;
    return NextResponse.json({ error: 'Failed to update profile', details: errorMessage }, { status: statusCode });
  }
}

// PATCH - Update specific section of user profile and add roles
export async function PATCH(request: NextRequest) {
  try {
    await connectToDB();
    const userId = await getTokenFromCookies();
    const { section, data } = await request.json();

    if (!section || !data) {
      return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // --- Role-adding sections ---
    if (section === 'driverInfo') {
      user.driverInfo = { ...user.driverInfo, ...data };
      if (!user.roles.includes('driver')) user.roles.push('driver');
      await user.save();
    } else if (section === 'ownerInfo') {
      const newVehicle = new Vehicle({ ...data, owner: userId });
      await newVehicle.save();
      if (!user.ownerInfo) user.ownerInfo = { vehicles: [] };
      user.ownerInfo.vehicles.push(newVehicle._id);
      if (!user.roles.includes('owner')) user.roles.push('owner');
      await user.save();
    } 
    // --- Generic section updates ---
    else {
      const nestedSections = ['permanentAddress', 'verification', 'publicInfo'];
      let updateQuery = {};

      if (nestedSections.includes(section)) {
        const $set = {};
        Object.keys(data).forEach(key => {
          $set[`${section}.${key}`] = data[key];
        });
        updateQuery = { $set };
      } else {
        // For top-level fields (e.g., name, age). Assumes `data` holds the fields.
        updateQuery = { $set: data };
      }
      
      await User.findByIdAndUpdate(userId, updateQuery, { new: true, runValidators: true });
    }

    // --- Return updated user ---
    const updatedUser = await User.findById(userId)
      .populate('ownerInfo.vehicles')
      .select('-password')
      .lean();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error('Profile patch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const statusCode = errorMessage.includes('token') ? 401 : 500;
    return NextResponse.json({ 
        error: 'Failed to update profile section',
        details: errorMessage
    }, { status: statusCode });
  }
}
