
"use client";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { LatLngExpression, icon } from 'leaflet';
import { useRef, useMemo, useState, useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  position: LatLngExpression;
}

const SearchField = ({ onLocationSelect }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', function (result) {
      onLocationSelect(result.location.y, result.location.x);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
};

const GoToCurrentLocationButton = ({ onLocationSelect }) => {
  const map = useMap();

  const handleGoToCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.flyTo([latitude, longitude], 13);
            onLocationSelect(latitude, longitude);
          },
          (error) => {
            console.error("Error getting current location:", error);
            alert("Could not retrieve your location. Please ensure you have location services enabled and have granted permission.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

  return (
      <button
        onClick={handleGoToCurrentLocation}
        className="absolute top-14 right-2 z-10 bg-white text-black p-2 rounded shadow"
        style={{ zIndex: 1000, top: '52px', right: '12px', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '4px' }}
        type="button"
        title="Go to my current location"
      >
        📍
      </button>
  )
}

const Map = ({ onLocationSelect, position }: MapProps) => {
  const markerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(position);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          onLocationSelect(lat, lng);
          setMarkerPosition([lat, lng]);
        }
      },
    }),
    [onLocationSelect],
  );

  const customIcon = icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  return (
    <MapContainer center={position || [21.1458, 79.0882]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <SearchField onLocationSelect={onLocationSelect} />
      <GoToCurrentLocationButton onLocationSelect={onLocationSelect} />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={markerPosition}
        ref={markerRef}
        icon={customIcon}
      >
      </Marker>
    </MapContainer>
  );
};

export default Map;
