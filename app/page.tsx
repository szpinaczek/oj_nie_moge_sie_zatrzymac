"use client";
import { useState, useRef, useEffect } from 'react';
import VideoPlayer, { VideoPlayerHandle } from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { getTranslation } from './i18n/translations';
import { FlagIcons } from './components/FlagIcons';
import L from 'leaflet';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import type { MapData, Language } from '@/types/map';
import { AboutSection } from '@/components/AboutSection';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MapComponentHandle {
  seekToTime: (time: number) => void;
}

interface FrameData {
  time: number;
  lat: number;
  lng: number;
  description: {
    pl: string;
    en: string;
  };
  info?: {
    pl: string;
    en: string;
  };
  distance?: number;
  totalDistance?: number;
}

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-brown-100 dark:bg-brown-800">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ),
});

const HomePageContent = () => {
  const { language, setLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [keyFrames, setKeyFrames] = useState<FrameData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const mapRef = useRef<MapComponentHandle>(null);
  const isMapUpdating = useRef<boolean>(false);
  const isVideoUpdating = useRef<boolean>(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const { theme } = useTheme();
  const videoSectionRef = useRef<HTMLDivElement>(null);

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
          // Oblicz odległości między punktami
          const frames = data.frames.map((frame: FrameData, index: number) => {
            if (index === 0) {
              return { ...frame, distance: 0, totalDistance: 0 };
            }
            
            const prevFrame = data.frames[index - 1];
            const distance = L.latLng(prevFrame.lat, prevFrame.lng)
              .distanceTo(L.latLng(frame.lat, frame.lng));
            
            // Oblicz całkowitą odległość od początku trasy
            const totalDistance = data.frames
              .slice(0, index + 1)
              .reduce((sum: number, f: FrameData, i: number) => {
                if (i === 0) return 0;
                const prev = data.frames[i - 1];
                return sum + L.latLng(prev.lat, prev.lng)
                  .distanceTo(L.latLng(f.lat, f.lng));
              }, 0);
            
            return {
              ...frame,
              distance: Math.round(distance),
              totalDistance: Math.round(totalDistance)
            };
          });
          
          setKeyFrames(frames);
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
      // Find and scroll to the corresponding row
      const currentIndex = keyFrames.findIndex((frame, index) => 
        time >= frame.time && (index === keyFrames.length - 1 || time < keyFrames[index + 1].time)
      );
      if (currentIndex !== -1) {
        scrollToRow(currentIndex);
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

  // Format distance in meters or kilometers
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
  };

  // Function to scroll to a specific row
  const scrollToRow = (index: number) => {
    if (!scrollViewportRef.current || !rowRefs.current[index]) return;

    const viewport = scrollViewportRef.current;
    const row = rowRefs.current[index];
    
    // Scroll the row to the top of the viewport
    viewport.scrollTo({
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

  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    const loadFramesData = async () => {
      try {
        const response = await fetch('/frames.json');
        const data = await response.json();
        
        // Calculate distances between frames
        const framesWithDistances = data.frames.map((frame: any, index: number) => {
          if (index === 0) {
            return { ...frame, distance: 0, totalDistance: 0 };
          }
          
          const prevFrame = data.frames[index - 1];
          const distance = calculateDistance(
            prevFrame.lat,
            prevFrame.lng,
            frame.lat,
            frame.lng
          );
          
          const totalDistance = data.frames
            .slice(0, index)
            .reduce((sum: number, f: any) => sum + (f.distance || 0), 0);
            
          return { ...frame, distance, totalDistance };
        });
        
        // Prepare route data
        const route = framesWithDistances.map((frame: any) => [frame.lat, frame.lng]);
        
        setMapData({
          frames: framesWithDistances,
          route
        });
      } catch (error) {
        console.error('Error loading frames data:', error);
      }
    };

    loadFramesData();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number) => {
    return (value * Math.PI) / 180;
  };

  // Fix for TypeScript error with refs
  const setRowRef = (index: number) => (el: HTMLTableRowElement | null) => {
    rowRefs.current[index] = el;
  };

  // Function to scroll to video section
  const scrollToVideo = () => {
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-brown-100 dark:bg-brown-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        {/* Sticky header */}
        <div className="sticky top-0 z-[1001] bg-brown-50 dark:bg-brown-700/80 backdrop-blur-sm border-b border-brown-100 dark:border-brown-700 py-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-brown-900 dark:text-brown-100">
              {getTranslation('title', language)}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-brown-100 dark:bg-brown-500 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLanguage('pl')}
                  className={`h-8 w-8 ${language === 'pl' ? 'bg-brown-100 dark:bg-brown-500' : ''}`}
                >
                  <FlagIcons.pl />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLanguage('en')}
                  className={`h-8 w-8 ${language === 'en' ? 'bg-brown-100 dark:bg-brown-500' : ''}`}
                >
                  <FlagIcons.en />
                </Button>
              </div>
              <Button
                variant="icon"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="h-5 w-5"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="mb-8">
            <AboutSection language={language} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video section */}
            <div className="video-section w-full lg:w-2/3 scroll-mt-24" ref={videoSectionRef}>
              <div className="max-w-[1280px] mx-auto">
                <VideoPlayer 
                  ref={videoPlayerRef} 
                  onTimeUpdate={handleTimeUpdate} 
                  onFrameChange={handleTimeUpdate}
                  onFullscreenChange={handleFullscreenChange}
                  language={language}
                />
              </div>
            </div>
            
            {/* Map section */}
            <div className="map-section w-full lg:flex-1">
              <div className="h-[300px] md:h-[400px] lg:h-full bg-brown-100 dark:bg-brown-800 rounded-lg overflow-hidden relative">
                {mapData && (
                  <MapComponent
                    currentTime={currentTime}
                    onTimeUpdate={handleMapTimeUpdate}
                    language={language}
                  />
                )}
              </div>
              </div>
            </div>
            
          <div className="mt-6 p-6 bg-brown-50 dark:bg-brown-700 backdrop-blur-sm rounded-lg border-0">
            <h3 className="text-2xl font-bold tracking-tight mb-6 text-brown-900 dark:text-brown-100">
              {getTranslation('routeInfo', language)}
            </h3>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Table section */}
              <div className="flex-1">
                <Card className="border-none bg-transparent">
                  <CardContent className="p-0">
                    <div 
                      ref={scrollViewportRef}
                      className="w-full overflow-y-auto max-h-[400px] pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brown-100 dark:[&::-webkit-scrollbar-thumb]:bg-brown-400 [&::-webkit-scrollbar-thumb]:rounded-full"
                    >
                      <Table>
                        <TableHeader className="sticky top-0 bg-brown-100 dark:bg-brown-700/80 backdrop-blur-sm z-10">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px] text-brown-900 dark:text-brown-100 font-semibold">
                              {getTranslation('time', language)}
                            </TableHead>
                            <TableHead className="text-brown-900 dark:text-brown-100 font-semibold">
                              {getTranslation('location', language)}
                            </TableHead>
                            <TableHead className="hidden md:table-cell w-[200px] text-brown-900 dark:text-brown-100 font-semibold">
                              {getTranslation('coordinates', language)}
                            </TableHead>
                            <TableHead className="w-[150px] text-brown-900 dark:text-brown-100 font-semibold">
                              {getTranslation('distance', language)}
                            </TableHead>
                            <TableHead className="w-[100px] text-right">
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {keyFrames.map((frame, index) => (
                            <TableRow 
                              key={index}
                              ref={setRowRef(index)}
                              className={`hover:bg-brown-50/50 dark:hover:bg-brown-800/30 transition-colors border-b border-brown-100 dark:border-brown-400/50 ${
                                currentTime >= frame.time && (index === keyFrames.length - 1 || currentTime < keyFrames[index + 1].time)
                                  ? "bg-primary/20 dark:bg-primary/30"
                                  : ""
                              }`}
                            >
                              <TableCell className="font-medium text-brown-900 dark:text-brown-100">
                                {formatTime(frame.time)}
                              </TableCell>
                              <TableCell className="text-brown-900 dark:text-brown-100">
                                {frame.description[language]}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-brown-900 dark:text-brown-100">
                                {frame.lat.toFixed(6)}, {frame.lng.toFixed(6)}
                              </TableCell>
                              <TableCell className="text-brown-900 dark:text-brown-100">
                                {formatDistance(frame.totalDistance || 0)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="lg"
                                  className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 transition-colors font-bold"
                                  onClick={() => {
                                    if (videoPlayerRef.current) {
                                      videoPlayerRef.current.seekVideo(frame.time);
                                      scrollToRow(index);
                                      scrollToVideo();
                                    }
                                  }}
                                >
                                  {getTranslation('jumpTo', language)}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Removed Additional Information section - now displayed as floating tooltip */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
};

export default HomePage;
