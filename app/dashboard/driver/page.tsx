"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

// Mock user for development. Replace with actual user from auth.
const mockUser = {
  _id: "60d0fe4f5311236168a109ca", // Example driver ID
};

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState('OFFLINE');
  const watchId = useRef<number | null>(null);
  
  // In a real app, you'd get the user from your authentication context
  const user = mockUser; 

  const updateStatus = async (newStatus: 'AVAILABLE' | 'OFFLINE') => {
    try {
      const response = await fetch('/api/profile/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: user._id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setStatus(data.user.driverInfo.status);
      setIsOnline(newStatus === 'AVAILABLE');
      console.log(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  const updateLocation = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    fetch('/api/profile/location', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId: user._id, coordinates: [longitude, latitude] }),
    })
    .then(res => {
        if(res.ok) {
            console.log("Location updated");
        }
    })
    .catch(error => console.error("Error updating location:", error));
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      // Start watching position
      watchId.current = navigator.geolocation.watchPosition(
        updateLocation,
        (error) => {
          console.error("Geolocation error:", error);
          // Handle errors (e.g., user denied location sharing)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const stopLocationTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      console.log("Stopped location tracking.");
    }
  };

  const handleToggleOnline = () => {
    if (isOnline) {
      // Go Offline
      updateStatus('OFFLINE');
      stopLocationTracking();
    } else {
      // Go Online
      updateStatus('AVAILABLE');
      startLocationTracking();
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <div className="flex items-center gap-4">
        <Button onClick={handleToggleOnline}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </Button>
        <p>Current Status: <span className={`font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>{status}</span></p>
      </div>
       {isOnline && <p className="mt-4 text-sm text-gray-500">Live location tracking is active.</p>}
    </div>
  );
};

export default DriverDashboard;
