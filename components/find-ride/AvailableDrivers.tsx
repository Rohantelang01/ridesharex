
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DriverCard from "./DriverCard";
import { IUser } from '../../models/User'; // Adjust path as needed
import LoadingSpinner from '../common/LoadingSpinner';

// Helper to get initials from a name
const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

// Helper to format vehicle info
const formatVehicle = (vehicle: any) => {
    if (!vehicle) return 'No vehicle information';
    return `${vehicle.color || ''} ${vehicle.make || ''} ${vehicle.model || ''} • ${vehicle.plateNumber || ''}`.trim();
}

// Helper to format rate
const formatRate = (driverInfo: any, vehicle: any) => {
    const parts = [];
    if (driverInfo?.hourlyRate) {
        parts.push(`₹${driverInfo.hourlyRate}/hr`);
    }
    if (vehicle?.perKmRate) {
        parts.push(`₹${vehicle.perKmRate}/km`);
    }
    return parts.join(' + ') || 'Rate not available';
}

// Helper to get rate unit
const getRateUnit = (driverInfo: any, vehicle: any) => {
    const hasDriverRate = !!driverInfo?.hourlyRate;
    const hasVehicleRate = !!vehicle?.perKmRate;
    if (hasDriverRate && hasVehicleRate) return 'Driver + Vehicle';
    if (hasDriverRate) return 'Driver rate';
    if (hasVehicleRate) return 'Vehicle rate';
    return '';
}

export default function AvailableDrivers() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await fetch('/api/drivers');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.details || 'Failed to fetch drivers');
                }

                const formattedDrivers = data.map((user: IUser) => {
                    const vehicle = user.ownerInfo?.vehicles?.[0];
                    return {
                        id: user._id,
                        name: user.name,
                        initials: getInitials(user.name),
                        profileImage: user.profileImage,
                        rating: user.publicInfo?.rating?.average || 0,
                        distance: Math.round((Math.random() * 5 + 1) * 10) / 10, // Mock distance
                        duration: Math.floor(Math.random() * 10) + 5, // Mock duration
                        vehicle: formatVehicle(vehicle),
                        rate: formatRate(user.driverInfo, vehicle),
                        rateUnit: getRateUnit(user.driverInfo, vehicle),
                        selected: false, // Default state
                    };
                });

                setDrivers(formattedDrivers);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">🚗 Available Drivers & Vehicles</CardTitle>
                    {!loading && !error && (
                         <div className="flex items-center gap-2 text-sm text-green-600">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {drivers.length} online nearby
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {drivers.length > 0 ? (
                            drivers.map((driver) => (
                                <DriverCard key={driver.id} driver={driver} />
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">No drivers found nearby.</div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
