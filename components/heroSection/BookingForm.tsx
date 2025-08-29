'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const BookingForm = ({ className = "" }) => {
  const { user } = useAuth();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [role, setRole] = useState(user?.role || "customer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ pickup, dropoff, dateTime, role });
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-row justify-center gap-4 w-full ${className}`}>
      <Input
        type="text"
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className="w-1/4"
        aria-label="Pickup location"
      />
      <Input
        type="text"
        placeholder="Dropoff Location"
        value={dropoff}
        onChange={(e) => setDropoff(e.target.value)}
        className="w-1/4"
        aria-label="Dropoff location"
      />
      <Input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="w-1/4"
        aria-label="Date and time"
      />
      {!user && (
        <Select value={role} onValueChange={setRole} className="w-1/4">
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="vehicle-owner">Vehicle Owner</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Button type="submit" className="w-1/6 bg-blue-600 text-white">
        Search
      </Button>
    </form>
  );
};

export default BookingForm;