import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

interface FrameData {
  time: number;
  lat: number;
  lng: number;
  description: string;
}

interface MapData {
  frames: FrameData[];
  route: [number, number][];
}

interface InterpolatedPosition {
  lat: number;
  lng: number;
  description: string;
  prevFrame: FrameData | null;
  nextFrame: FrameData | null;
  progress: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ currentTime, onTimeUpdate }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [currentPosition, setCurrentPosition] = useState<InterpolatedPosition | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const mapRef = useRef<L.Map | null>(null);

  // Load map data
  useEffect(() => {
    fetch("/frames.json")
      .then(response => response.json())
      .then(data => setMapData(data))
      .catch(error => console.error("Error loading map data:", error));
  }, []);

  // Calculate interpolated position based on current time
  const calculateInterpolatedPosition = (time: number, frames: FrameData[]): InterpolatedPosition | null => {
    if (frames.length === 0) return null;
    
    // If time is before the first frame or after the last frame
    if (time <= frames[0].time) {
      return {
        lat: frames[0].lat,
        lng: frames[0].lng,
        description: frames[0].description,
        prevFrame: null,
        nextFrame: frames[0],
        progress: 0
      };
    }
    
    if (time >= frames[frames.length - 1].time) {
      const lastFrame = frames[frames.length - 1];
      return {
        lat: lastFrame.lat,
        lng: lastFrame.lng,
        description: lastFrame.description,
        prevFrame: lastFrame,
        nextFrame: null,
        progress: 1
      };
    }
    
    // Find the frames before and after the current time
    let prevFrameIndex = 0;
    for (let i = 0; i < frames.length - 1; i++) {
      if (frames[i].time <= time && frames[i + 1].time > time) {
        prevFrameIndex = i;
        break;
      }
    }
    
    const prevFrame = frames[prevFrameIndex];
    const nextFrame = frames[prevFrameIndex + 1];
    
    // Calculate progress between the two frames (0 to 1)
    const totalDuration = nextFrame.time - prevFrame.time;
    const elapsed = time - prevFrame.time;
    const progress = totalDuration > 0 ? elapsed / totalDuration : 0;
    
    // Linear interpolation between the two positions
    const lat = prevFrame.lat + (nextFrame.lat - prevFrame.lat) * progress;
    const lng = prevFrame.lng + (nextFrame.lng - prevFrame.lng) * progress;
    
    return {
      lat,
      lng,
      description: `${prevFrame.description} → ${nextFrame.description}`,
      prevFrame,
      nextFrame,
      progress
    };
  };

  // Update marker position based on current time
  useEffect(() => {
    if (!mapData || mapData.frames.length === 0) return;
    
    const interpolatedPosition = calculateInterpolatedPosition(currentTime, mapData.frames);
    if (interpolatedPosition) {
      setCurrentPosition(interpolatedPosition);
    }
  }, [currentTime, mapData]);

  const handlePolylineClick = (e: L.LeafletMouseEvent) => {
    if (!mapData || !mapData.frames.length) return;
    
    const { lat, lng } = e.latlng;
    
    // Find the closest frame to the clicked position
    const closestFrame = mapData.frames.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lng - lng, 2));
      const currDistance = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lng - lng, 2));
      return currDistance < prevDistance ? curr : prev;
    });
    
    // Prevent rapid consecutive updates
    const now = Date.now();
    if (now - lastUpdateTime.current > 300) {
      lastUpdateTime.current = now;
      onTimeUpdate(closestFrame.time);
    }
  };

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const MapUpdater = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    
    useEffect(() => {
      mapRef.current = map;
      
      if (position) {
        // Only follow the marker if it's getting close to the edge of the visible area
        const bounds = map.getBounds();
        const point = L.latLng(position[0], position[1]);
        
        // Calculate how close the point is to the edge (as a percentage of the visible area)
        const visibleWidth = bounds.getEast() - bounds.getWest();
        const visibleHeight = bounds.getNorth() - bounds.getSouth();
        
        const distanceToEast = bounds.getEast() - point.lng;
        const distanceToWest = point.lng - bounds.getWest();
        const distanceToNorth = bounds.getNorth() - point.lat;
        const distanceToSouth = point.lat - bounds.getSouth();
        
        const edgeThreshold = 0.2; // 20% of the visible area
        
        if (
          distanceToEast < visibleWidth * edgeThreshold ||
          distanceToWest < visibleWidth * edgeThreshold ||
          distanceToNorth < visibleHeight * edgeThreshold ||
          distanceToSouth < visibleHeight * edgeThreshold
        ) {
          map.setView(position, map.getZoom(), { animate: true, duration: 0.5 });
        }
      }
    }, [map, position]);
    
    return null;
  };

  if (!mapData) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading map data...</div>;
  }

  const defaultCenter = mapData.route[0] || [51.8086928, 19.4710456];

  return (
    <div className="map-container w-full h-full">
      <MapContainer 
        center={defaultCenter} 
        zoom={15} 
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      >
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
              <div className="p-1">
                <h3 className="font-bold text-base">Current Position</h3>
                <p className="text-sm">{currentPosition.description}</p>
                <p className="text-sm mt-1">Time: {formatTime(currentTime)} ({Math.floor(currentTime)}s)</p>
                {currentPosition.prevFrame && currentPosition.nextFrame && (
                  <div className="mt-2 text-xs">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${currentPosition.progress * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>{formatTime(currentPosition.prevFrame.time)}</span>
                      <span>{formatTime(currentPosition.nextFrame.time)}</span>
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        {currentPosition && <MapUpdater position={[currentPosition.lat, currentPosition.lng]} />}
      </MapContainer>
      
      {/* Map controls and info panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-2 rounded-md shadow-md z-[1000] text-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">Current Time:</span> {formatTime(currentTime)}
          </div>
          {currentPosition && currentPosition.prevFrame && currentPosition.nextFrame && (
            <div>
              <span className="font-semibold">Progress:</span> {Math.round(currentPosition.progress * 100)}%
            </div>
          )}
          {currentPosition && (
            <div>
              <span className="font-semibold">Location:</span> {currentPosition.description.split(' → ')[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
