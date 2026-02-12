import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
    userLocation?: { lat: number; lng: number } | null;
    userAddress?: string | null;
}

// Component to handle map bounds/view updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13); // Zoom level 13 for city/local view
  }, [center, map]);
  return null;
}

export function InteractiveMap({ userLocation, userAddress }: InteractiveMapProps) {
  
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India
  
  // Use user location if available, otherwise default
  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter;

  const zoom = userLocation ? 13 : 5;

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-border shadow-sm z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
            <>
                <MapUpdater center={center} />
                <Marker position={center}>
                    <Popup className="font-sans">
                        <div className="p-2">
                             <h3 className="font-bold text-sm mb-1">Your Location</h3>
                             <p className="text-xs text-slate-600">
                                {userAddress || "Current Position"}
                             </p>
                             <p className="text-[10px] text-slate-400 mt-1">
                                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                             </p>
                        </div>
                    </Popup>
                </Marker>
            </>
        )}
      </MapContainer>
      
      {!userLocation && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-[400] pointer-events-none">
              <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow text-sm font-medium text-slate-600">
                  Waiting for location...
              </div>
          </div>
      )}
    </div>
  );
}
