"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapComponentProps, MapComponentHandle, MapData } from "@/types/map";

// Add styles for map controls
const mapStyles = `
  .leaflet-control-container .leaflet-control {
    z-index: 1000 !important;
  }
  .leaflet-control-zoom {
    z-index: 1000 !important;
  }
  .leaflet-control-attribution {
    z-index: 1000 !important;
  }
  .leaflet-control-home {
    background: white;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid rgba(0,0,0,0.2);
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .leaflet-control-home:hover {
    background: #f4f4f4;
  }
  .dark .leaflet-control-home {
    background: #1f2937;
    border-color: rgba(255,255,255,0.2);
  }
  .dark .leaflet-control-home:hover {
    background: #374151;
  }
  .dark .leaflet-control-home svg {
    stroke: white;
  }
`;

// Create custom dot marker icon
const DotIcon = L.divIcon({
  className: 'custom-dot-marker',
  html: '<div class="w-3 h-3 bg-[#d93472] rounded-full border-2 border-white shadow-md"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Create current position marker icon
const CurrentPositionIcon = L.icon({
  iconUrl: "/images/marker-icon-red.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create custom Home control
const createHomeControl = (initialPosition: [number, number], initialZoom: number) => {
  const HomeControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function(map: L.Map) {
      const container = L.DomUtil.create('div', 'leaflet-control leaflet-control-home');
      container.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      `;
      container.title = 'Reset view';
      
      container.onclick = function() {
        map.setView(initialPosition, initialZoom);
      };
      
      return container;
    }
  });

  return new HomeControl();
};

const MapComponent = forwardRef<MapComponentHandle, MapComponentProps>(
  ({ mapData, currentTime, onTimeUpdate, language }, ref) => {
    const mapRef = useRef<L.Map>(null);
    const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
    const initialPosition: [number, number] = [mapData.frames[0].lat, mapData.frames[0].lng];
    const initialZoom = 18;

    useImperativeHandle(ref, () => ({
      seekToTime: (time: number) => {
        if (mapRef.current) {
          const frame = mapData.frames.find(
            (f) => time >= f.time && (f === mapData.frames[mapData.frames.length - 1] || time < mapData.frames[mapData.frames.indexOf(f) + 1].time)
          );
          if (frame) {
            mapRef.current.setView([frame.lat, frame.lng], 18);
            setCurrentPosition({ lat: frame.lat, lng: frame.lng });
          }
        }
      },
    }));

    useEffect(() => {
      if (mapRef.current) {
        const frame = mapData.frames.find(
          (f) => currentTime >= f.time && (f === mapData.frames[mapData.frames.length - 1] || currentTime < mapData.frames[mapData.frames.indexOf(f) + 1].time)
        );
        if (frame) {
          mapRef.current.setView([frame.lat, frame.lng], 18);
          setCurrentPosition({ lat: frame.lat, lng: frame.lng });
        }
      }
    }, [currentTime, mapData.frames]);

    return (
      <div className="relative w-full h-full">
        <style>{mapStyles}</style>
        <MapContainer
          ref={mapRef}
          center={initialPosition}
          zoom={initialZoom}
          style={{ height: "100%", width: "100%" }}
          whenReady={() => {
            if (mapRef.current) {
              mapRef.current.setView(initialPosition, initialZoom);
              setCurrentPosition({ lat: initialPosition[0], lng: initialPosition[1] });
              // Add Home control after map is ready
              const homeControl = createHomeControl(initialPosition, initialZoom);
              homeControl.addTo(mapRef.current);
            }
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline
            positions={mapData.route}
            color="#d93472"
            weight={3}
            opacity={0.7}
            eventHandlers={{
              click: (e) => {
                const clickedLatLng = e.latlng;
                const frame = mapData.frames.find(
                  (f) =>
                    Math.abs(f.lat - clickedLatLng.lat) < 0.0001 &&
                    Math.abs(f.lng - clickedLatLng.lng) < 0.0001
                );
                if (frame) {
                  onTimeUpdate(frame.time);
                }
              },
            }}
          />
          {mapData.frames.map((frame, index) => (
            <Marker
              key={index}
              position={[frame.lat, frame.lng]}
              icon={DotIcon}
              eventHandlers={{
                click: () => {
                  onTimeUpdate(frame.time);
                },
              }}
            />
          ))}
          {currentPosition && (
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
              icon={CurrentPositionIcon}
            />
          )}
        </MapContainer>
      </div>
    );
  }
);

MapComponent.displayName = "MapComponent";

export default MapComponent;
