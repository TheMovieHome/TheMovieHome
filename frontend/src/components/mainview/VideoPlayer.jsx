// VideoPlayer.jsx - MODIFICADO PARA USAR ARQUIVO MP4 LOCAL

import React, { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  X
} from 'lucide-react';

// 1. IMPORTE O ARQUIVO DE VÍDEO DOS SEUS ASSETS
//    Certifique-se de que o caminho e o nome do arquivo estão corretos.
import videoFile from '../../assets/trailer.mp4';

const VideoPlayer = ({ isOpen, onClose, movieTitle, movieYear }) => {
  // Estados do player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const videoRef = useRef(null);
  const playerRef = useRef(null); // Ref para o container do player
  const controlsTimeoutRef = useRef(null);

  // Função para mostrar controles temporariamente
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Função para alternar play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Função para atualizar o tempo atual
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Função para atualizar a duração
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  // Função para buscar posição no vídeo
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Função para controlar volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Função para alternar mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Função para fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Função para pular tempo
  const skipTime = (seconds) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Função para formatar tempo
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Função para fechar o player
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    onClose();
  };

  // Função para lidar com erros de carregamento
  const handleVideoError = () => {
    setIsLoading(false);
    console.error('Erro ao carregar o vídeo.');
  };

  // Eventos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;

      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlayPause(); break;
        case 'ArrowLeft': e.preventDefault(); skipTime(-10); break;
        case 'ArrowRight': e.preventDefault(); skipTime(10); break;
        case 'ArrowUp': e.preventDefault(); setVolume(prev => Math.min(1, prev + 0.1)); break;
        case 'ArrowDown': e.preventDefault(); setVolume(prev => Math.max(0, prev - 0.1)); break;
        case 'KeyM': e.preventDefault(); toggleMute(); break;
        case 'KeyF': e.preventDefault(); toggleFullscreen(); break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            handleClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isPlaying, currentTime, duration, volume, isFullscreen]);

  // Listener para mudanças de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reset do player quando abre
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setIsLoading(true);
      setShowControls(true);
      // Garante que o vídeo volte ao início quando o player for reaberto
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="video-player-overlay">
      <div
        ref={playerRef}
        className={`video-player ${isFullscreen ? 'fullscreen' : ''}`}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Header */}
        <div className={`video-player-header ${showControls ? 'visible' : ''}`}>
          <div className="video-info">
            <h3>{movieTitle} ({movieYear})</h3>
          </div>
          <button onClick={handleClose} className="close-player-btn">
            <X size={24} color="#ffffff" />
          </button>
        </div>

        {/* Área do Vídeo */}
        <div className="video-container">
          {/* 2. USAMOS A TAG <video> ORIGINAL */}
          <video
            ref={videoRef}
            // 3. O ATRIBUTO `src` RECEBE A VARIÁVEL IMPORTADA
            src={videoFile}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
            onClick={togglePlayPause}
            className="video-element"
            preload="metadata"
          />
          {isLoading && (
            <div className="video-loading">
              <div className="loading-spinner"></div>
              <p>Carregando vídeo...</p>
            </div>
          )}
        </div>

        {/* Controles */}
        {!isLoading && (
          <div className={`video-controls ${showControls ? 'visible' : ''}`}>
            {/* Barra de Progresso */}
            <div className="progress-container">
              <div className="progress-bar" onClick={handleSeek}>
                <div
                  className="progress-fill"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
                <div
                  className="progress-thumb"
                  style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Controles Principais */}
            <div className="controls-main">
              <div className="controls-left">
                <button onClick={() => skipTime(-10)} className="control-btn">
                  <SkipBack size={20} color="#ffffff" />
                </button>
                <button onClick={togglePlayPause} className="play-pause-btn">
                  {isPlaying ? <Pause size={24} color="#ffffff" /> : <Play size={24} color="#ffffff" />}
                </button>
                <button onClick={() => skipTime(10)} className="control-btn">
                  <SkipForward size={20} color="#ffffff" />
                </button>
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                </div>
              </div>
              <div className="controls-right">
                <div className="volume-control">
                  <button onClick={toggleMute} className="control-btn">
                    {isMuted || volume === 0 ? <VolumeX size={20} color="#ffffff" /> : <Volume2 size={20} color="#ffffff" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
                <button onClick={toggleFullscreen} className="control-btn">
                  {isFullscreen ? <Minimize size={20} color="#ffffff" /> : <Maximize size={20} color="#ffffff" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
