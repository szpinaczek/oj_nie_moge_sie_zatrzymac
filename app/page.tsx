"use client";
import { useState, useRef, useEffect } from 'react';
import VideoPlayer, { VideoPlayerHandle } from '../components/VideoPlayer';
import MapComponent from '../components/MapComponent';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [keyFrames, setKeyFrames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const isMapUpdating = useRef<boolean>(false);
  const isVideoUpdating = useRef<boolean>(false);

  // Load frames data
  useEffect(() => {
    setIsLoading(true);
    fetch("/frames.json")
      .then(response => response.json())
      .then(data => {
        if (data && data.frames) {
          setKeyFrames(data.frames);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading frames data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleTimeUpdate = (time: number) => {
    // Only update the current time if the map is not currently updating
    // This prevents feedback loops between the video and map
    if (!isMapUpdating.current) {
      isVideoUpdating.current = true;
      setCurrentTime(time);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isVideoUpdating.current = false;
      }, 50);
    }
  };

  const handleMapTimeUpdate = (time: number) => {
    if (videoPlayerRef.current && !isVideoUpdating.current) {
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

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video and Map Synchronization</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading data...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="video-section">
              <h2 className="text-xl font-semibold mb-2">Video</h2>
              <VideoPlayer 
                ref={videoPlayerRef} 
                onTimeUpdate={handleTimeUpdate} 
                onFrameChange={handleTimeUpdate}
              />
            </div>
            
            <div className="map-section">
              <h2 className="text-xl font-semibold mb-2">Map</h2>
              <div className="h-[480px] md:h-[540px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden relative">
                <MapComponent currentTime={currentTime} onTimeUpdate={handleMapTimeUpdate} />
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Route Information</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keyFrames.map((frame, index) => (
                    <tr key={index} className={currentTime >= frame.time && (index === keyFrames.length - 1 || currentTime < keyFrames[index + 1].time) ? "bg-blue-50" : ""}>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{formatTime(frame.time)} ({Math.floor(frame.time)}s)</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{frame.description}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{frame.lat.toFixed(6)}, {frame.lng.toFixed(6)}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => {
                            if (videoPlayerRef.current) {
                              videoPlayerRef.current.seekVideo(frame.time);
                            }
                          }}
                        >
                          Jump to
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
