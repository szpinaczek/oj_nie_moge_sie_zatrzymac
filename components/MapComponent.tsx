"use client";
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define types for the map data and frames
interface Frame {
  time: number;
  lat: number;
  lng: number;
  description: string;
}

interface MapData {
  frames: Frame[];
  route: [number, number][];
}

interface MapComponentProps {
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapComponent: React.FC<MapComponentProps> = ({ currentTime, onTimeUpdate }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Frame | null>(null);

  useEffect(() => {
    fetch("/frames.json")
      .then(response => response.json())
      .then((data: MapData) => setMapData(data))
      .catch(error => console.error("Error loading map data:", error));
  }, []);

  useEffect(() => {
    if (!mapData) return;
    const exactFrame = mapData.frames.find(frame => Math.floor(frame.time) === Math.floor(currentTime));
    if (exactFrame) {
      setCurrentPosition(exactFrame);
    }
  }, [currentTime, mapData]);

  const handlePolylineClick = (e: L.LeafletMouseEvent) => {
    if (!mapData) return;
    const { lat, lng } = e.latlng;
    const closestFrame = mapData.frames.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lng - lng, 2));
      const currDistance = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lng - lng, 2));
      return currDistance < prevDistance ? curr : prev;
    });
    onTimeUpdate(closestFrame.time);
  };

  const MapUpdater: React.FC<{ position: [number, number] }> = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, map.getZoom(), { animate: true, duration: 1 });
      }
    }, [map, position]);
    return null;
  };

  if (!mapData) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading map data...</div>;
  }

  const defaultCenter = mapData.route[0] || [51.8086928, 19.4710456];
  const center = defaultCenter;

  return (
    <div className="map-container w-full h-full">
      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", borderRadius: "8px" }}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={mapData.route}
          color="blue"
          weight={5}
          opacity={0.7}
          eventHandlers={{ click: handlePolylineClick }}
        />
        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]} icon={DefaultIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">Current Position</h3>
                <p>{currentPosition.description}</p>
                <p>Time: {Math.floor(currentTime)}s</p>
              </div>
            </Popup>
          </Marker>
        )}
        {currentPosition && <MapUpdater position={[currentPosition.lat, currentPosition.lng]} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
