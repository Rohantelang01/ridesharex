
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Map from '@/components/common/Map';

interface LocationInputProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationSelect }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    // Fetch autocomplete suggestions from Mappls API
  };

  const handleUseCurrentLocation = () => {
    // Get user's current location using GPS
  };

  const handleSelectFromMap = () => {
    setShowMap(true);
  };

  const handleMapSelect = (location: { lat: number; lng: number; address: string }) => {
    onLocationSelect(location);
    setShowMap(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={handleAddressChange}
        />
        <Button onClick={handleUseCurrentLocation}>Current Location</Button>
      </div>
      <div>
        {/* Display autocomplete suggestions here */}
      </div>
      <Button onClick={handleSelectFromMap}>Select from Map</Button>
      {showMap && <Map onLocationSelect={handleMapSelect} />}
    </div>
  );
};

export default LocationInput;
