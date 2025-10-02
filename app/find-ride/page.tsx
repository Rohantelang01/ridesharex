"use client";
import { useState, useEffect } from 'react';
import LocationInput from '@/components/common/LocationInput';
import { Button } from '@/components/ui/button';
import { LatLngExpression } from 'leaflet';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'; // <-- Moved CSS import here

const Map = dynamic(() => import('@/components/common/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

interface Driver {
  _id: string;
  name: string;
  vehicle: {
    model: string;
    licensePlate: string;
  };
  currentLocation: {
    coordinates: [number, number];
  };
  distance: number;
}

const FindRidePage = () => {
  const [pickup, setPickup] = useState<{ lat: number, lng: number } | null>(null);
  const [dropoff, setDropoff] = useState<{ lat: number, lng: number } | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!pickup) {
      alert('Please select a pickup location.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/drivers?lat=${pickup.lat}&lng=${pickup.lng}`);
      if (!response.ok) {
        throw new Error('Failed to fetch drivers.');
      }
      const data = await response.json();
      setAvailableDrivers(data.drivers);
    } catch (error) {
      console.error('Error finding drivers:', error);
      alert('Could not find drivers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const pickupAsLatLng = pickup ? [pickup.lat, pickup.lng] as LatLngExpression : null;
  const dropoffAsLatLng = dropoff ? [dropoff.lat, dropoff.lng] as LatLngExpression : null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Find a Ride</h1>

      <div className="flex flex-col gap-8">
        {/* --- Location Inputs & Search --- */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <LocationInput
              label="Pickup Location"
              onLocationSelect={(lat, lng) => setPickup({ lat, lng })}
            />
            <LocationInput
              label="Dropoff Location"
              onLocationSelect={(lat, lng) => setDropoff({ lat, lng })}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !pickup}>
            {loading ? 'Searching...' : 'Find Drivers'}
          </Button>
        </div>

        {/* --- Map --- */}
        <div className="h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg">
          <Map start={pickupAsLatLng} end={dropoffAsLatLng} position={pickupAsLatLng} />
        </div>

        {/* --- Available Drivers --- */}
        {availableDrivers.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Drivers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDrivers.map((driver) => (
                <div key={driver._id} className="p-4 border rounded-lg shadow-sm">
                  <h3 className="font-bold">{driver.name}</h3>
                  <p>{driver.vehicle.model} - {driver.vehicle.licensePlate}</p>
                  <p>{(driver.distance / 1000).toFixed(2)} km away</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FindRidePage;