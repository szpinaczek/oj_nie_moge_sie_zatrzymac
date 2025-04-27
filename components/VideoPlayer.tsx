"use client";
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Define types for the props
interface VideoPlayerProps {
  onTimeUpdate?: (currentTime: number) => void;
}

// Define the ref methods
export interface VideoPlayerHandle {
  pauseVideo: () => void;
  seekVideo: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ onTimeUpdate }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (onTimeUpdate) {
          onTimeUpdate(video.currentTime);
        }
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [onTimeUpdate]);

  useImperativeHandle(ref, () => ({
    pauseVideo: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    seekVideo: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }
  }));

  const stepFrame = (direction: 'forward' | 'backward') => {
    if (videoRef.current) {
      const frameRate = 30; // Assuming 30 FPS
      const step = 1 / frameRate;
      videoRef.current.currentTime += direction === 'forward' ? step : -step;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} controls width="100%" className="rounded-lg shadow-md">
        <source src="/onmsz_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => stepFrame('backward')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Previous Frame
        </button>
        <button
          onClick={() => stepFrame('forward')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Next Frame
        </button>
      </div>
    </div>
  );
});

export default VideoPlayer;
