'use client'

import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('Video loaded successfully');
      setVideoLoaded(true);
      setVideoError(false);
      
      // Force play the video
      video.currentTime = 0;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video autoplay started successfully');
          })
          .catch(error => {
            console.log('Autoplay prevented by browser, trying to enable:', error);
            // Try again after a short delay
            setTimeout(() => {
              video.play().catch(e => console.log('Second play attempt failed:', e));
            }, 100);
          });
      }
    };

    const handleError = () => {
      console.log('Video failed to load');
      setVideoError(true);
      setVideoLoaded(false);
    };

    const handleCanPlay = () => {
      console.log('Video can start playing');
      if (video.paused) {
        video.play().catch(e => console.log('CanPlay event play failed:', e));
      }
    };

    const handleEnded = () => {
      // Ensure loop continues
      video.currentTime = 0;
      video.play().catch(e => console.log('Loop restart failed:', e));
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Video Background */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/shame-to-flame.mp4" type="video/mp4" />
        </video>
      )}
      
      {/* Animated CSS Background (always visible as fallback) */}
      <div className={`absolute inset-0 bg-gradient-to-br from-sky-900 via-purple-900 to-flame-900 animate-gradient-shift transition-opacity duration-1000 ${
        videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
      }`}></div>
      
      {/* Animated particles/stars effect */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        videoLoaded && !videoError ? 'opacity-20' : 'opacity-30'
      }`}>
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
      
      {/* Additional gradient overlay for better content visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 dark:from-black/40 dark:via-transparent dark:to-black/50"></div>
    </div>
  );
};

export default VideoBackground;