"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import type { RawResult } from 'leaflet-geosearch/dist/providers/provider';

interface Suggestion {
    label: string;
    lat: number;
    lng: number;
}

export default function QuickLocation({ onSearch }) {
    const [from, setFrom] = useState("Connaught Place, New Delhi");
    const [to, setTo] = useState("India Gate, New Delhi");

    const [fromSuggestions, setFromSuggestions] = useState<Suggestion[]>([]);
    const [toSuggestions, setToSuggestions] = useState<Suggestion[]>([]);

    const [fromCoords, setFromCoords] = useState<[number, number] | null>([28.6324, 77.2187]);
    const [toCoords, setToCoords] = useState<[number, number] | null>([28.6129, 77.2295]);

    const provider = new OpenStreetMapProvider();
    const fromTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const toTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFrom(value);
        setFromCoords(null);

        if (fromTimeoutRef.current) {
            clearTimeout(fromTimeoutRef.current);
        }

        if (value.length > 2) {
            fromTimeoutRef.current = setTimeout(async () => {
                const results: RawResult[] = await provider.search({ query: value });
                const suggestions: Suggestion[] = results.map(result => ({
                    label: result.label,
                    lat: result.y,
                    lng: result.x
                }));
                setFromSuggestions(suggestions);
            }, 500);
        } else {
            setFromSuggestions([]);
        }
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTo(value);
        setToCoords(null);

        if (toTimeoutRef.current) {
            clearTimeout(toTimeoutRef.current);
        }

        if (value.length > 2) {
            toTimeoutRef.current = setTimeout(async () => {
                const results: RawResult[] = await provider.search({ query: value });
                const suggestions: Suggestion[] = results.map(result => ({
                    label: result.label,
                    lat: result.y,
                    lng: result.x
                }));
                setToSuggestions(suggestions);
            }, 500);
        } else {
            setToSuggestions([]);
        }
    };

    const handleFromSuggestionClick = (suggestion: Suggestion) => {
        setFrom(suggestion.label);
        setFromCoords([suggestion.lat, suggestion.lng]);
        setFromSuggestions([]);
    };

    const handleToSuggestionClick = (suggestion: Suggestion) => {
        setTo(suggestion.label);
        setToCoords([suggestion.lat, suggestion.lng]);
        setToSuggestions([]);
    };

    const handleSearch = () => {
        if (fromCoords && toCoords) {
            onSearch(fromCoords, toCoords);
        } else {
            alert("Please select a location from the suggestions for both start and end points.");
        }
    };

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setFromCoords([latitude, longitude]);

                // Reverse geocode to get the address
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data.display_name) {
                        setFrom(data.display_name);
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    setFrom(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
                }
            }, (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location. Please check your browser settings.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Your current location"
                        value={from}
                        onChange={handleFromChange}
                        className="pr-20"
                        autoComplete="off"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <button onClick={handleUseMyLocation} className="text-lg p-1 hover:bg-accent rounded-full">
                            ⌖
                        </button>
                        <span className="text-lg">📍</span>
                    </div>
                    {fromSuggestions.length > 0 && (
                        <ul className="absolute suggestion-list w-full bg-card border border-border rounded-md mt-1 shadow-lg">
                            {fromSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-accent cursor-pointer text-card-foreground"
                                    onClick={() => handleFromSuggestionClick(suggestion)}
                                >
                                    {suggestion.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Where do you want to go?"
                        value={to}
                        onChange={handleToChange}
                        className="pr-10"
                        autoComplete="off"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">🎯</span>
                    {toSuggestions.length > 0 && (
                        <ul className="absolute suggestion-list w-full bg-card border border-border rounded-md mt-1 shadow-lg">
                            {toSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-accent cursor-pointer text-card-foreground"
                                    onClick={() => handleToSuggestionClick(suggestion)}
                                >
                                    {suggestion.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Button className="w-full md:w-auto" onClick={handleSearch}>Find</Button>
            </div>
        </div>
    );
}
