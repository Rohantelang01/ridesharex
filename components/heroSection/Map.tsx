"use client";

import { useEffect, useRef, useState } from "react";

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return; // ✅ ensure container exists

    const loadMap = async () => {
      if (!process.env.NEXT_PUBLIC_MAPPLS_API_KEY) {
        setError("Mappls API key missing");
        return;
      }

      if (!window.mappls) {
        const script = document.createElement("script");
        script.src = `https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0`;
        script.async = true;
        script.onload = () => initializeMap();
        script.onerror = () => setError("Failed to load Mappls SDK");
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return; // ✅ double check

      try {
        mapInstance.current = new window.mappls.Map(mapRef.current, {
          center: [20.5937, 78.9629], // India center
          zoom: 4,
          maptype: "road",
        });
      } catch (err: any) {
        setError("Map initialization failed: " + err.message);
      }
    };

    loadMap();
  }, []);

  const handleMyLocation = () => {
    if (!mapInstance.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          mapInstance.current.setCenter({ lat: latitude, lng: longitude });
          mapInstance.current.setZoom(13);

          new window.mappls.Marker({
            map: mapInstance.current,
            position: { lat: latitude, lng: longitude },
            popup_html: "You are here",
          });
        },
        (err) => setError("Unable to fetch location: " + err.message)
      );
    } else {
      setError("Geolocation not supported by browser");
    }
  };

  return (
    <div className="relative w-full h-[500px]">
      <div
        ref={mapRef}
        id="map"
        className="w-full h-full rounded-md shadow-md border border-gray-300"
      />

      <button
        onClick={handleMyLocation}
        className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
      >
        My Current Location
      </button>

      {error && (
        <div className="absolute bottom-2 left-2 bg-red-500 text-white px-3 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Map;
