"use client";
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Define types for the props
interface VideoPlayerProps {
  onTimeUpdate?: (currentTime: number) => void;
  onFrameChange?: (time: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  language?: 'pl' | 'en';
}

// Define the ref methods
export interface VideoPlayerHandle {
  pauseVideo: () => void;
  playVideo: () => void;
  seekVideo: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ onTimeUpdate, onFrameChange, onFullscreenChange, language = 'pl' }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const isUserSeeking = useRef(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          stepFrame('backward');
          break;
        case 'ArrowRight':
          e.preventDefault();
          stepFrame('forward');
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTime]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    onFullscreenChange?.(!isFullscreen);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        if (onTimeUpdate) {
          onTimeUpdate(video.currentTime);
        }
      };
      
      const handlePlay = () => {
        setIsPlaying(true);
        setTimeout(() => {
          setShowPoster(false);
        }, 300);
      };
      
      const handlePause = () => {
        setIsPlaying(false);
        if (video.currentTime === 0) {
          setShowPoster(true);
        }
      };
      
      const handleVolumeChange = () => {
        setIsMuted(video.muted);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('volumechange', handleVolumeChange);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('volumechange', handleVolumeChange);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [onTimeUpdate]);

  useImperativeHandle(ref, () => ({
    pauseVideo: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    playVideo: () => {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing video:", error);
          });
      }
    },
    seekVideo: (time: number) => {
      if (videoRef.current) {
        isUserSeeking.current = true;
        videoRef.current.currentTime = time;
        setCurrentTime(time);
        setShowPoster(false);
        if (onFrameChange) {
          onFrameChange(time);
        }
        isUserSeeking.current = false;
      }
    }
  }));

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        console.log("Playing video");
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing video:", error);
          });
      } else {
        console.log("Pausing video");
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      console.error("videoRef.current is null");
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const seekVideo = (time: number) => {
    if (videoRef.current) {
      isUserSeeking.current = true;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setShowPoster(false);
      if (onFrameChange) {
        onFrameChange(time);
      }
      isUserSeeking.current = false;
    }
  };

  const stepFrame = (direction: 'forward' | 'backward') => {
    if (videoRef.current) {
      // Pause the video first
      videoRef.current.pause();
      setIsPlaying(false);
      
      const frameRate = 25; // Assuming 25 FPS
      const step = 1 / frameRate;
      const newTime = videoRef.current.currentTime + (direction === 'forward' ? step : -step);
      
      isUserSeeking.current = true;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setShowPoster(false);
      
      // Notify about frame change
      if (onFrameChange) {
        onFrameChange(newTime);
      }
      isUserSeeking.current = false;
    }
  };
  
  // Jump to specific time points (useful for navigating between key frames)
  const jumpToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      
      isUserSeeking.current = true;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setShowPoster(false);
      
      if (onFrameChange) {
        onFrameChange(time);
      }
      isUserSeeking.current = false;
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (videoRef.current && value.length > 0) {
      isUserSeeking.current = true;
      const newTime = value[0];
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Notify about frame change
      if (onFrameChange) {
        onFrameChange(newTime);
      }
      isUserSeeking.current = false;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(videoRef.current.currentTime);
      }
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Format time in MM:SS format with total seconds
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const totalSeconds = Math.floor(timeInSeconds);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} (${totalSeconds}s)`;
  };

  // State for key frames
  const [keyFrames, setKeyFrames] = useState<{time: number, description: string}[]>([]);
  
  // Load key frames from frames.json
  useEffect(() => {
    fetch("/frames.json")
      .then(response => response.json())
      .then(data => {
        if (data && data.frames) {
          setKeyFrames(data.frames.map((frame: any) => ({
            time: frame.time,
            description: frame.description
          })));
        }
      })
      .catch(error => console.error("Error loading key frames:", error));
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Video container */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {!isFullscreen && (
          <>
            <video
              ref={videoRef}
              width="100%"
              className="w-full h-full object-contain"
              poster="/images/splash-screen.jpg"
              onClick={togglePlayPause}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onPlay={() => setShowPoster(false)}
              onPause={() => {
                if (videoRef.current?.currentTime === 0) {
                  setShowPoster(true);
                }
              }}
            >
              <source src="/onmsz_medium.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Splash screen overlay */}
            {showPoster && (
              <div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: showPoster ? 1 : 0 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video controls below video */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-b-lg shadow-md">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={togglePlayPause} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? 'Pauza' : 'Odtwarzaj'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => seekVideo(currentTime - 10)} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>10 sekund wstecz</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => stepFrame('backward')} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Poprzednia klatka</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => stepFrame('forward')} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Następna klatka</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => seekVideo(currentTime + 10)} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>10 sekund do przodu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMuted ? 'Włącz dźwięk' : 'Wycisz'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Wyłącz pełny ekran' : 'Pełny ekran'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-sm min-w-[100px] time-display text-gray-600 dark:text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="w-full mt-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.01}
            className="flex-grow slider-track"
            onValueChange={handleSliderChange}
          />
        </div>
            
        {/* Key frame markers */}
        <div className="key-frames-container">
          {keyFrames.map((frame, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="key-frame-marker"
                    style={{ left: `${(frame.time / duration) * 100}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      jumpToTime(frame.time);
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{frame.description[language]} ({formatTime(frame.time)})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[80vw] w-[80vw] p-0 bg-black border-none z-[2000]">
          <DialogTitle className="sr-only">Odtwarzacz wideo</DialogTitle>
          <div className="relative w-full aspect-video">
            {isFullscreen && (
              <>
                <video
                  ref={videoRef}
                  width="100%"
                  className="w-full h-full object-contain"
                  poster="/images/splash-screen.jpg"
                  onClick={togglePlayPause}
                  onTimeUpdate={handleTimeUpdate}
                  onDurationChange={handleDurationChange}
                  onPlay={() => setShowPoster(false)}
                  onPause={() => {
                    if (videoRef.current?.currentTime === 0) {
                      setShowPoster(true);
                    }
                  }}
                >
                  <source src="/onmsz_medium.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Splash screen overlay in dialog */}
                {showPoster && (
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300"
                    style={{ opacity: showPoster ? 1 : 0 }}
                  >
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Video controls in dialog - always visible */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={togglePlayPause} className="text-white hover:bg-white/20">
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isPlaying ? 'Pauza' : 'Odtwarzaj'}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => seekVideo(currentTime - 10)} className="text-white hover:bg-white/20">
                          <SkipBack className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>10 sekund wstecz</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => stepFrame('backward')} className="text-white hover:bg-white/20">
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Poprzednia klatka</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => stepFrame('forward')} className="text-white hover:bg-white/20">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Następna klatka</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => seekVideo(currentTime + 10)} className="text-white hover:bg-white/20">
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>10 sekund do przodu</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isMuted ? 'Włącz dźwięk' : 'Wycisz'}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFullscreen ? 'Wyłącz pełny ekran' : 'Pełny ekran'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span className="text-sm min-w-[100px] time-display text-white ml-auto">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="w-full mt-2">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration}
                  step={0.01}
                  className="flex-grow slider-track"
                  onValueChange={handleSliderChange}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
