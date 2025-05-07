"use client";
import { useState, useRef, useEffect } from 'react';
import VideoPlayer, { VideoPlayerHandle } from '../components/VideoPlayer';
import MapComponent from '../components/MapComponent';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MapComponentHandle {
  seekToTime: (time: number) => void;
}

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [keyFrames, setKeyFrames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const mapRef = useRef<MapComponentHandle>(null);
  const isMapUpdating = useRef<boolean>(false);
  const isVideoUpdating = useRef<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // Handle dark mode
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    if (!isMapUpdating.current) {
      isVideoUpdating.current = true;
      setCurrentTime(time);
      if (mapRef.current) {
        mapRef.current.seekToTime(time);
      }
      setTimeout(() => {
        isVideoUpdating.current = false;
      }, 50);
    }
  };

  const handleMapTimeUpdate = (time: number) => {
    if (!isVideoUpdating.current) {
      isMapUpdating.current = true;
      setCurrentTime(time);
      if (videoPlayerRef.current) {
        videoPlayerRef.current.seekVideo(time);
      }
      setTimeout(() => {
        isMapUpdating.current = false;
      }, 50);
    }
  };

  const handleFullscreenChange = (isFullscreen: boolean) => {
    // Handle fullscreen change if needed
  };

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to scroll to a specific row
  const scrollToRow = (index: number) => {
    if (!tableContainerRef.current || !rowRefs.current[index]) return;

    const container = tableContainerRef.current;
    const row = rowRefs.current[index];
    
    // Simply scroll the row to the top of the container
    container.scrollTo({
      top: row.offsetTop,
      behavior: 'smooth'
    });
  };

  // Update scroll position when current time changes
  useEffect(() => {
    const currentIndex = keyFrames.findIndex((frame, index) => 
      currentTime >= frame.time && (index === keyFrames.length - 1 || currentTime < keyFrames[index + 1].time)
    );
    if (currentIndex !== -1) {
      scrollToRow(currentIndex);
    }
  }, [currentTime, keyFrames]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Video and Map Synchronization</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video section - 70% width */}
          <div className="video-section w-full lg:w-[70%]">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Video</h2>
            <VideoPlayer
              ref={videoPlayerRef}
              onTimeUpdate={handleTimeUpdate}
              onFrameChange={handleTimeUpdate}
              onFullscreenChange={handleFullscreenChange}
            />
          </div>

          {/* Map section - 40% width */}
          <div className="map-section w-full lg:w-[40%]">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Map</h2>
            <div className="h-[480px] md:h-[540px] lg:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
              <MapComponent
                currentTime={currentTime}
                onTimeUpdate={handleMapTimeUpdate}
                ref={mapRef}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Route Information</h3>
          <div className="flex gap-6">
            {/* Table section */}
            <div className="flex-1">
              <div 
                ref={tableContainerRef}
                className="h-[400px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                    <TableRow>
                      <TableHead className="w-[100px] text-gray-900 dark:text-gray-100">Time</TableHead>
                      <TableHead className="text-gray-900 dark:text-gray-100">Location</TableHead>
                      <TableHead className="w-[200px] text-gray-900 dark:text-gray-100">Coordinates</TableHead>
                      <TableHead className="w-[100px] text-right text-gray-900 dark:text-gray-100">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keyFrames.map((frame, index) => (
                      <TableRow 
                        key={index}
                        ref={(el) => {
                          rowRefs.current[index] = el;
                        }}
                        className={currentTime >= frame.time && (index === keyFrames.length - 1 || currentTime < keyFrames[index + 1].time)
                          ? "bg-primary/10 dark:bg-primary/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTime(frame.time)}
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            ({Math.floor(frame.time)}s)
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{frame.description}</TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                          {frame.lat.toFixed(6)}, {frame.lng.toFixed(6)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/80"
                            onClick={() => {
                              if (videoPlayerRef.current) {
                                videoPlayerRef.current.seekVideo(frame.time);
                                scrollToRow(index);
                              }
                            }}
                          >
                            Jump to
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Description section */}
            <div className="w-[300px]">
              <Card className="h-[400px]">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const currentFrame = keyFrames.find((frame, index) => 
                      currentTime >= frame.time && (index === keyFrames.length - 1 || currentTime < keyFrames[index + 1].time)
                    );
                    
                    if (!currentFrame?.info) {
                      return (
                        <div className="text-gray-500 dark:text-gray-400 italic">
                          No additional information available for this frame
                        </div>
                      );
                    }

                    return (
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-900 dark:text-gray-100">
                          {currentFrame.info}
                        </p>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
