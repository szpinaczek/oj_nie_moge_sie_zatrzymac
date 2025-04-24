"use client";
import { useState, useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import MapComponent from '../components/MapComponent';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoPlayerRef = useRef<{ pauseVideo: () => void; seekVideo: (time: number) => void }>(null);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleMapTimeUpdate = (time: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pauseVideo();
      videoPlayerRef.current.seekVideo(time);
    }
    setCurrentTime(time);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video and Map Synchronization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="video-section">
          <h2 className="text-xl font-semibold mb-2">Video</h2>
          <VideoPlayer ref={videoPlayerRef} onTimeUpdate={handleTimeUpdate} />
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
