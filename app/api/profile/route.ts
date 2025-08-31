// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import jwt from 'jsonwebtoken';

// GET - Fetch user profile data
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Find user and exclude password
    const user = await User.findById(decoded.userId)
      .populate('ownerInfo.vehicles')
      .select('-password')
      .lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch profile' 
    }, { status: 500 });
  }
}

// PUT - Update user profile data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const updateData = await request.json();
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, email, phone