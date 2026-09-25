"use client";

import { useEffect, useRef, useState } from "react";

export const StudioVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [needsPlay, setNeedsPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;

    const startPlayback = (): void => {
      video.muted = true;
      video.defaultMuted = true;
      void video.play().then(
        () => {
          setNeedsPlay(false);
          setIsPlaying(true);
        },
        () => {
          setNeedsPlay(true);
          setIsPlaying(false);
        }
      );
    };

    video.addEventListener("canplay", startPlayback, { once: true });
    startPlayback();

    return () => video.removeEventListener("canplay", startPlayback);
  }, []);

  const togglePlay = (): void => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().then(() => {
        setIsPlaying(true);
        setNeedsPlay(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (): void => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="studio-video-container">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        poster="/artworks/peacock-process-poster.jpg"
        aria-label="A peacock artwork taking shape in the studio"
        onClick={togglePlay}
        className="studio-video-player"
      >
        <source src="/artworks/peacock-process.mp4" type="video/mp4" />
        <source src="/artworks/peacock-process.webm" type="video/webm" />
      </video>

      {/* Interactive Controls Bar */}
      <div className="video-interactive-bar">
        <button
          className="video-ctrl-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚ Pause" : "▶ Play"}
        </button>

        <button
          className="video-ctrl-btn"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
        </button>

        <span className="live-process-tag">
          <span className="live-dot" /> Reel 01: Peacock Nocturne
        </span>
      </div>

      {needsPlay && (
        <button className="hero-video-play" type="button" onClick={togglePlay}>
          ▶ Play studio reel
        </button>
      )}
    </div>
  );
};

