import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Maximize2, Pause, Play, SkipForward } from 'lucide-react';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:8080'); // só se for usar socket

const VideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Aqui ficaria o código do socket se quiser sincronizar ações com backend

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (value) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleSkipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full rounded-xl mb-4"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="flex items-center gap-2 mb-2">
        <Button onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button onClick={handleSkipForward}>
          <SkipForward />
        </Button>
        <Slider
          min={0}
          max={duration}
          step={0.1}
          value={[currentTime]}
          onValueChange={(value) => handleSeek(value[0])}
          className="flex-grow mx-2"
        />
        <span className="text-sm w-16 text-right">
          {Math.floor(currentTime)}/{Math.floor(duration)}s
        </span>
        <Button onClick={handleFullscreen}>
          <Maximize2 />
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
