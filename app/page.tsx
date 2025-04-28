"use client";
import { useState, useRef, useEffect } from 'react';
import VideoPlayer, { VideoPlayerHandle } from '../components/VideoPlayer';
import MapComponent from '../components/MapComponent';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const isMapUpdating = useRef<boolean>(false);

  const handleTimeUpdate = (time: number) => {
    // Only update the current time if the map is not currently updating
    // This prevents feedback loops between the video and map
    if (!isMapUpdating.current) {
      setCurrentTime(time);
    }
  };

  const handleMapTimeUpdate = (time: number) => {
    if (videoPlayerRef.current) {
      // Set flag to prevent feedback loops
      isMapUpdating.current = true;
      
      // Pause video and seek to the selected time
      videoPlayerRef.current.pauseVideo();
      videoPlayerRef.current.seekVideo(time);
      
      // Update the current time state
      setCurrentTime(time);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isMapUpdating.current = false;
      }, 100);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video and Map Synchronization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="video-section">
          <h2 className="text-xl font-semibold mb-2">Video</h2>
          <VideoPlayer 
            ref={videoPlayerRef} 
            onTimeUpdate={handleTimeUpdate} 
          />
        </div>
        
        <div className="map-section">
          <h2 className="text-xl font-semibold mb-2">Map</h2>
          <div className="h-[480px] md:h-[540px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <MapComponent currentTime={currentTime} onTimeUpdate={handleMapTimeUpdate} />
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-center">
          Current Time: <span className="font-bold">{Math.floor(currentTime)}s</span>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
