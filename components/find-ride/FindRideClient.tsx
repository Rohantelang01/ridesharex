'use client';

import React, { useState } from 'react';
import LocationInput from '@/components/common/LocationInput';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

const Map = dynamic(() => import('@/components/common/Map'), { ssr: false });

const FindRideClient = () => {
  const [pickup, setPickup] = useState<LatLngExpression | null>(null);
  const [destination, setDestination] = useState<LatLngExpression | null>(null);

  const handlePickupSelect = (lat: number, lng: number) => {
    setPickup([lat, lng]);
  };

  const handleDestinationSelect = (lat: number, lng: number) => {
    setDestination([lat, lng]);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Find a Ride</h1>
        <div className="space-y-4">
          <LocationInput label="Pickup Location" onLocationSelect={handlePickupSelect} />
          <LocationInput label="Destination" onLocationSelect={handleDestinationSelect} />
        </div>
      </div>
      {/* This container is now robust for both mobile and desktop */}
      <div className="h-96 md:h-full w-full md:w-2/3">
        <Map start={pickup} end={destination} position={pickup} />
      </div>
    </div>
  );
};

export default FindRideClient;
