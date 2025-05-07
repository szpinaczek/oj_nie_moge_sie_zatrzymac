import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Home, Maximize2, Minimize2 } from 'lucide-react';

// Tworzymy własną ikonę dla znacznika aktualnej pozycji
const CurrentPositionIcon = L.icon({
  iconUrl: "/images/marker-icon-red.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Ikona dla punktów kluczowych (kropka)
const KeyFrameIcon = L.divIcon({
  className: 'key-frame-marker',
  html: '<div class="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-md"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

export interface MapComponentHandle {
  seekToTime: (time: number) => void;
}

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

const MapComponent = forwardRef<MapComponentHandle, MapComponentProps>(({ currentTime, onTimeUpdate }, ref) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [currentPosition, setCurrentPosition] = useState<InterpolatedPosition | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastUpdateTime = useRef<number>(0);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useImperativeHandle(ref, () => ({
    seekToTime: (time: number) => {
      if (!mapData || mapData.frames.length === 0) return;
      
      const interpolatedPosition = calculateInterpolatedPosition(time, mapData.frames);
      if (interpolatedPosition && mapRef.current) {
        mapRef.current.setView([interpolatedPosition.lat, interpolatedPosition.lng], mapRef.current.getZoom());
      }
    }
  }));

  // Load map data
  useEffect(() => {
    fetch("/frames.json")
      .then(response => response.json())
      .then(data => setMapData(data))
      .catch(error => console.error("Error loading map data:", error));
  }, []);

  // Update marker position based on current time
  useEffect(() => {
    if (!mapData || mapData.frames.length === 0) return;
    
    const interpolatedPosition = calculateInterpolatedPosition(currentTime, mapData.frames);
    if (interpolatedPosition) {
      setCurrentPosition(interpolatedPosition);
      
      // Znajdź najbliższy punkt kluczowy
      const currentFrame = mapData.frames.find(frame => frame.time >= currentTime) || mapData.frames[mapData.frames.length - 1];
      if (currentFrame) {
        // Aktualizuj widok mapy, aby pokazać aktualną pozycję
        if (mapRef.current) {
          mapRef.current.setView([interpolatedPosition.lat, interpolatedPosition.lng], mapRef.current.getZoom());
        }
      }
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

  const resetView = () => {
    if (mapRef.current && mapData) {
      const bounds = L.latLngBounds(mapData.route);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!mapData) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading map data...</div>;
  }

  const defaultCenter = mapData.route[0] || [51.8086928, 19.4710456];

  return (
    <div ref={containerRef} className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
      <MapContainer
        center={[52.2297, 21.0122]}
        zoom={13}
        className="w-full h-full"
        whenReady={() => {
          if (mapRef.current) {
            mapRef.current = mapRef.current;
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Remaining route line */}
        <Polyline
          positions={mapData.route}
          pathOptions={{
            color: '#d93472',
            weight: 3,
            opacity: 0.7,
            lineJoin: 'round'
          }}
          eventHandlers={{
            click: handlePolylineClick
          }}
        />
        
        {/* Route markers */}
        {mapData?.frames.map((frame, index) => (
          <Marker
            key={index}
            position={[frame.lat, frame.lng]}
            icon={KeyFrameIcon}
            eventHandlers={{
              click: () => {
                const now = Date.now();
                if (now - lastUpdateTime.current > 300) {
                  lastUpdateTime.current = now;
                  onTimeUpdate(frame.time);
                }
              }
            }}
          />
        ))}
        
        {/* Current position marker */}
        {currentPosition && (
          <Marker
            position={[currentPosition.lat, currentPosition.lng]}
            icon={CurrentPositionIcon}
          />
        )}
        
        {/* Map updater component */}
        {currentPosition && (
          <MapUpdater position={[currentPosition.lat, currentPosition.lng]} />
        )}
      </MapContainer>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={resetView}
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
});

export default MapComponent;
