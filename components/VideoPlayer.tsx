"use client";
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

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
  const isUserSeeking = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
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
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('volumechange', handleVolumeChange);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('volumechange', handleVolumeChange);
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
      
      const frameRate = 30; // Assuming 30 FPS
      const step = 1 / frameRate;
      const newTime = videoRef.current.currentTime + (direction === 'forward' ? step : -step);
      
      isUserSeeking.current = true;
      videoRef.current.currentTime = newTime;
      
      // Notify about frame change
      if (onFrameChange) {
        onFrameChange(newTime);
      }
      isUserSeeking.current = false;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        width="100%"
        className="rounded-lg shadow-md"
        onClick={togglePlayPause}
      >
        <source src="/onmsz_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex space-x-4 mt-4">
        <Button
          onClick={() => stepFrame('backward')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Previous Frame
        </Button>
        <Button
          onClick={togglePlayPause}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          onClick={() => stepFrame('forward')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Next Frame
        </Button>
        <Button
          onClick={toggleMute}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <>
              <VolumeX className="mr-2 h-4 w-4" />
              Unmute
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Mute
            </>
          )}
        </Button>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
