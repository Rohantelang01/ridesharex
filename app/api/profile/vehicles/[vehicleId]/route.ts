
import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import dbConnect from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { vehicleId: string } }) {
  // TODO: Implement proper authentication
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const { vehicleId } = params;

  try {
    await dbConnect();

    // const user = await User.findById(session.user._id);
    const user = await User.findOne({ "ownerInfo.vehicles._id": vehicleId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.ownerInfo) {
        return NextResponse.json({ error: 'Owner info not found' }, { status: 404 });
    }

    const vehicleIndex = user.ownerInfo.vehicles.findIndex(v => v._id.toString() === vehicleId);
    if (vehicleIndex === -1) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    user.ownerInfo.vehicles.splice(vehicleIndex, 1);

    if (user.ownerInfo.vehicles.length === 0) {
        user.roles = user.roles.filter(role => role !== 'owner');
        user.ownerInfo = undefined;
    }

    await user.save();

    return NextResponse.json({ message: 'Vehicle deleted successfully', user });

  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
