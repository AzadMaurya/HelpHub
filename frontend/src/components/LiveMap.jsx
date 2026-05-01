import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map when location is found
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 13);
  }, [coords, map]);
  return null;
}

const LiveMap = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    // Get live position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable GPS.");
      }
    );
  }, []);

  return (
    <div className="card shadow-lg overflow-hidden" style={{ height: '400px', border: '1px solid #ff0066' }}>
      {error && <div className="alert alert-danger m-2">{error}</div>}
      
      {!position && !error && (
        <div className="d-flex h-100 justify-content-center align-items-center bg-dark">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {position && (
        <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[position.lat, position.lng]}>
            <Popup>You are here! <br /> Reporting from this location.</Popup>
          </Marker>
          <RecenterMap coords={position} />
        </MapContainer>
      )}
    </div>
  );
};

export default LiveMap;