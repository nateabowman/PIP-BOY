import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { usePipBoy } from '../../context/PipBoyContext';
import { formatCoordinates } from '../../utils/formatters';
import StatDisplay from '../StatDisplay';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapTab: React.FC = () => {
  const { location, loading, error, refresh } = useLocation();
  const { locations, addLocation } = usePipBoy();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [markerName, setMarkerName] = useState('');

  useEffect(() => {
    if (!mapRef.current || !location) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current).setView([location.lat, location.lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Custom marker icon (green Pip-Boy style)
      const greenIcon = L.divIcon({
        className: 'pipboy-marker',
        html: '<div style="width: 20px; height: 20px; background: #00FF41; border: 2px solid #000; border-radius: 50%; box-shadow: 0 0 10px #00FF41;"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      // Add current location marker
      L.marker([location.lat, location.lng], { icon: greenIcon })
        .addTo(map)
        .bindPopup('Current Location');

      mapInstanceRef.current = map;
    } else {
      // Update map center
      mapInstanceRef.current.setView([location.lat, location.lng], 13);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add saved location markers
    if (mapInstanceRef.current) {
      locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup(loc.name || 'Saved Location');
        markersRef.current.push(marker);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, locations]);

  const handleSaveLocation = () => {
    if (location) {
      addLocation({
        id: Date.now().toString(),
        name: markerName || 'Location',
        lat: location.lat,
        lng: location.lng,
        timestamp: new Date(),
        notes: ''
      });
      setMarkerName('');
    }
  };

  return (
    <div className="tab-content fade-in">
      {loading && <div className="stat-label">Loading location...</div>}
      {error && <div className="stat-label" style={{ color: '#ff4444' }}>Error: {error}</div>}
      
      {location && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <StatDisplay label="Address" value={location.address || 'Unknown'} />
            <StatDisplay label="Coordinates" value={formatCoordinates(location.lat, location.lng)} />
            <button className="pipboy-button" onClick={refresh} style={{ marginTop: '10px' }}>
              REFRESH LOCATION
            </button>
          </div>

          <div style={{ marginBottom: '15px', padding: '10px', border: '2px solid var(--pipboy-border)' }}>
            <input
              type="text"
              className="pipboy-input"
              placeholder="Location name"
              value={markerName}
              onChange={(e) => setMarkerName(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <button className="pipboy-button" onClick={handleSaveLocation}>
              SAVE LOCATION
            </button>
          </div>

          <div 
            ref={mapRef} 
            style={{ 
              height: '400px', 
              width: '100%', 
              border: '2px solid var(--pipboy-border)',
              backgroundColor: '#000'
            }} 
          />
        </>
      )}
    </div>
  );
};

export default MapTab;

