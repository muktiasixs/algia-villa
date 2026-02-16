import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapDisplayProps {
  coordinates: [number, number];
  popupText: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ coordinates, popupText }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView(coordinates, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);

      // Fix for default markers not loading in some bundler-less environments
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      L.marker(coordinates, { icon }).addTo(leafletMap.current)
        .bindPopup(popupText)
        .openPopup();
    } else if (leafletMap.current) {
        leafletMap.current.setView(coordinates, 13);
        // Clear existing markers and add new one (simplification for demo)
        leafletMap.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                leafletMap.current?.removeLayer(layer);
            }
        });
         const icon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        L.marker(coordinates, { icon }).addTo(leafletMap.current)
            .bindPopup(popupText)
            .openPopup();
    }
  }, [coordinates, popupText]);

  return <div ref={mapRef} className="h-full w-full rounded-lg shadow-inner z-0" />;
};

export default MapDisplay;
