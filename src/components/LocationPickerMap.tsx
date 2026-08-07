import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, CheckCircle, AlertCircle, ExternalLink, LocateFixed } from 'lucide-react';
import { OrderLocation } from '../types';

interface LocationPickerMapProps {
  onLocationSelect: (location: OrderLocation) => void;
  initialLat?: number;
  initialLng?: number;
}

// Custom Leaflet Pin Icon
const pinIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export default function LocationPickerMap({
  onLocationSelect,
  initialLat = 16.5062, // Vijayawada center
  initialLng = 80.648,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [accuracyMeters, setAccuracyMeters] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('Choose your exact doorstep location.');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([coords.lat, coords.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const marker = L.marker([coords.lat, coords.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const position = marker.getLatLng();
        const newLat = Number(position.lat.toFixed(6));
        const newLng = Number(position.lng.toFixed(6));
        setCoords({ lat: newLat, lng: newLng });
        emitLocation(newLat, newLng, 'manual');
        void resolveAddress(newLat, newLng, 'manual');
      });

      map.on('click', (e) => {
        const newLat = Number(e.latlng.lat.toFixed(6));
        const newLng = Number(e.latlng.lng.toFixed(6));
        marker.setLatLng([newLat, newLng]);
        setCoords({ lat: newLat, lng: newLng });
        emitLocation(newLat, newLng, 'manual');
        void resolveAddress(newLat, newLng, 'manual');
      });

      mapRef.current = map;
      markerRef.current = marker;

      // Initial emit
      emitLocation(coords.lat, coords.lng, 'default');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const emitLocation = (
    lat: number,
    lng: number,
    source: 'default' | 'gps' | 'manual',
    accuracy?: number,
    addressString?: string,
  ) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    onLocationSelect({
      lat,
      lng,
      googleMapsUrl,
      source,
      ...(typeof accuracy === 'number' ? { accuracyMeters: accuracy } : {}),
      addressString: addressString || `Pinned location: ${lat}, ${lng}`,
    });
  };

  const resolveAddress = async (lat: number, lng: number, source: 'gps' | 'manual', accuracy?: number) => {
    const fallback = `Pinned location: ${lat}, ${lng}`;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: { Accept: 'application/json' },
      });
      const location = await response.json() as { display_name?: string };
      const address = location.display_name || fallback;
      setSelectedAddress(address);
      emitLocation(lat, lng, source, accuracy, address);
    } catch {
      setSelectedAddress(fallback);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = Number(position.coords.latitude.toFixed(6));
        const newLng = Number(position.coords.longitude.toFixed(6));
        const accuracy = Math.round(position.coords.accuracy);

        setCoords({ lat: newLat, lng: newLng });
        setAccuracyMeters(accuracy);
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([newLat, newLng], 18);
          markerRef.current.setLatLng([newLat, newLng]);
        }

        emitLocation(newLat, newLng, 'gps', accuracy);
        void resolveAddress(newLat, newLng, 'gps', accuracy);
        setGpsLoading(false);
      },
      (err) => {
        console.error('GPS Detection error:', err);
        const message = err.code === err.PERMISSION_DENIED
          ? 'Location permission was denied. Allow location access, or tap your doorstep on the map.'
          : 'Could not detect GPS. Please retry outdoors or tap your doorstep on the map.';
        setGpsError(message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#FF7A00]" /> Confirm Exact Delivery Location
        </label>
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={gpsLoading}
          className="text-xs bg-amber-50 dark:bg-amber-950/60 text-[#FF7A00] font-bold border border-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
        >
          <LocateFixed className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
          {gpsLoading ? 'Detecting GPS...' : 'Auto-Detect My GPS Location'}
        </button>
      </div>

      {gpsError && (
        <div className="bg-amber-50 dark:bg-stone-800 border-l-4 border-amber-500 p-2.5 rounded text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Map Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/30 shadow-md">
        <div ref={mapContainerRef} className="w-full h-60 sm:h-72 z-0" />
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-medium text-stone-700 dark:text-stone-300 shadow border border-stone-200 dark:border-stone-800 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{accuracyMeters ? `GPS accuracy: +/- ${accuracyMeters} m` : `Coordinates: ${coords.lat}, ${coords.lng}`}</span>
        </div>
      </div>
      <div className="text-[11px] rounded-lg bg-stone-100 dark:bg-stone-800 p-2.5 text-stone-600 dark:text-stone-300 space-y-1.5">
        <p className="font-semibold">Selected location: {selectedAddress}</p>
        <a href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#FF7A00] hover:underline">
          Open this pin in Google Maps <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <p className="text-[11px] text-stone-500 dark:text-stone-400">
        💡 Drag the red marker pin directly to your home doorstep or landmark in Vijayawada for exact delivery routing.
      </p>
    </div>
  );
}
