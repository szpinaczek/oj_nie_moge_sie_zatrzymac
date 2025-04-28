"use client";
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause } from 'lucide-react';

// Define types for the props
interface VideoPlayerProps {
  onTimeUpdate?: (currentTime: number) => void;
  onFrameChange?: (time: number) => void;
}

// Define the ref methods
export interface VideoPlayerHandle {
  pauseVideo: () => void;
  playVideo: () => void;
  seekVideo: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ onTimeUpdate, onFrameChange }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isUserSeeking = useRef(false);

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
      };
      
      const handlePause = () => {
        setIsPlaying(false);
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
        // Notify about frame change only when seeking manually
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

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    <div className="flex flex-col items-center w-full">
      <video
        ref={videoRef}
        width="100%"
        className="rounded-lg shadow-md"
        onClick={togglePlayPause}
      >
        <source src="/onmsz_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Progress bar and time display */}
      <div className="w-full mt-2 px-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{formatTime(currentTime)}</span>
          <div className="relative flex-grow">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration}
              step={0.01}
              className="flex-grow"
              onValueChange={handleSliderChange}
            />
            
            {/* Key frame markers */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
              {keyFrames.map((frame, index) => (
                <div 
                  key={index}
                  className="absolute w-1 h-4 bg-red-500 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-auto"
                  style={{ left: `${(frame.time / duration) * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToTime(frame.time);
                  }}
                  title={`${frame.description} (${formatTime(frame.time)})`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Control buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <Button
          onClick={() => stepFrame('backward')}
          variant="secondary"
          size="sm"
          aria-label="Previous Frame"
        >
          <SkipBack />
          Previous Frame
        </Button>
        
        <Button
          onClick={togglePlayPause}
          variant={isPlaying ? "destructive" : "default"}
          size="sm"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause /> : <Play />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          onClick={() => stepFrame('forward')}
          variant="secondary"
          size="sm"
          aria-label="Next Frame"
        >
          <SkipForward />
          Next Frame
        </Button>
        
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </div>
      
      {/* Key frames navigation */}
      {keyFrames.length > 0 && (
        <div className="w-full mt-4 overflow-x-auto">
          <div className="text-sm font-medium mb-1">Key Locations:</div>
          <div className="flex flex-wrap gap-1">
            {keyFrames.map((frame, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => jumpToTime(frame.time)}
              >
                {frame.description} ({formatTime(frame.time)})
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
