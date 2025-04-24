import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const VideoPlayer = forwardRef(({ onTimeUpdate }, ref) => {
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

  return (
    <video ref={videoRef} controls width="100%">
      <source src="/onmsz_small.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

export default VideoPlayer;
