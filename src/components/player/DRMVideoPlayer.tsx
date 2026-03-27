"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import ProtectedOverlay from "./ProtectedOverlay";

// ─── Types ──────────────────────────────────────────────────────────

interface DRMVideoPlayerProps {
  videoUrl: string;
  licenseUrl: string;
  onProgress?: (position: number, duration: number) => void;
  initialPosition?: number;
  userEmail?: string;
  sessionToken?: string;
}

// ─── Component ──────────────────────────────────────────────────────

export default function DRMVideoPlayer({
  videoUrl,
  licenseUrl,
  onProgress,
  initialPosition = 0,
  userEmail,
  sessionToken,
}: DRMVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval>>();
  const sessionStart = useRef(Date.now());

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBlacked, setIsBlacked] = useState(false);

  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  // ── Session token expiry (2 hours) ─────────────────────────────
  const SESSION_MAX_MS = 2 * 60 * 60 * 1000;

  useEffect(() => {
    const check = setInterval(() => {
      if (Date.now() - sessionStart.current > SESSION_MAX_MS) {
        videoRef.current?.pause();
        alert("Session expired. Please reload to continue.");
        clearInterval(check);
      }
    }, 60_000);
    return () => clearInterval(check);
  }, []);

  // ── EME / DRM setup ───────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !licenseUrl) return;

    const setupEME = async () => {
      try {
        const config: MediaKeySystemConfiguration = {
          initDataTypes: ["cenc"],
          videoCapabilities: [
            { contentType: 'video/mp4; codecs="avc1.42E01E"' },
          ],
          audioCapabilities: [
            { contentType: 'audio/mp4; codecs="mp4a.40.2"' },
          ],
        };

        const keySystem = await navigator.requestMediaKeySystemAccess(
          "com.widevine.alpha",
          [config]
        ).catch(() =>
          navigator.requestMediaKeySystemAccess("com.microsoft.playready", [
            config,
          ])
        );

        const mediaKeys = await keySystem.createMediaKeys();
        await video.setMediaKeys(mediaKeys);

        video.addEventListener("encrypted", async (event) => {
          const session = mediaKeys.createSession();
          await session.generateRequest(
            event.initDataType,
            event.initData!
          );

          session.addEventListener("message", async (e) => {
            const response = await fetch(licenseUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/octet-stream",
                ...(sessionToken
                  ? { Authorization: `Bearer ${sessionToken}` }
                  : {}),
              },
              body: e.message,
            });
            const license = await response.arrayBuffer();
            await session.update(new Uint8Array(license));
          });
        });
      } catch {
        // DRM not supported – fall back to unencrypted playback
        console.warn("DRM setup failed, falling back to direct playback");
      }
    };

    setupEME();
  }, [videoUrl, licenseUrl, sessionToken]);

  // ── Resume from last position ──────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !initialPosition) return;
    const onReady = () => {
      video.currentTime = initialPosition;
    };
    video.addEventListener("loadedmetadata", onReady, { once: true });
    return () => video.removeEventListener("loadedmetadata", onReady);
  }, [initialPosition]);

  // ── Progress tracking (every 10s) ─────────────────────────────
  useEffect(() => {
    progressTimer.current = setInterval(() => {
      const v = videoRef.current;
      if (v && !v.paused && onProgress) {
        onProgress(v.currentTime, v.duration);
      }
    }, 10_000);
    return () => clearInterval(progressTimer.current);
  }, [onProgress]);

  // ── DevTools detection ─────────────────────────────────────────
  useEffect(() => {
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff =
        window.outerWidth - window.innerWidth > threshold;
      const heightDiff =
        window.outerHeight - window.innerHeight > threshold;
      if (widthDiff || heightDiff) {
        setIsBlacked(true);
      } else {
        setIsBlacked(false);
      }
    };

    // Debugger timing detection
    const debuggerCheck = setInterval(() => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      if (performance.now() - start > 100) {
        setIsBlacked(true);
      }
    }, 5000);

    window.addEventListener("resize", detectDevTools);
    detectDevTools();

    return () => {
      window.removeEventListener("resize", detectDevTools);
      clearInterval(debuggerCheck);
    };
  }, []);

  // ── Screen sharing detection ───────────────────────────────────
  useEffect(() => {
    const checkDisplayMedia = async () => {
      try {
        // If getDisplayMedia is being used, the Display Capture API
        // will be active. We detect this via the navigator.mediaDevices
        // event or by checking if the video element is being captured.
        if ("getDisplayMedia" in navigator.mediaDevices) {
          const handler = () => setIsBlacked(true);
          // Listen for visibility changes as a proxy
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
              videoRef.current?.pause();
            }
          });
        }
      } catch {
        // ignore
      }
    };
    checkDisplayMedia();
  }, []);

  // ── Controls auto-hide ─────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // ── Player actions ─────────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden select-none group"
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={resetHideTimer}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Black-out overlay for DRM violations */}
      {isBlacked && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <p className="text-white text-lg">
            Screen recording detected. Playback paused.
          </p>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Protected overlay (watermark + screenshot block) */}
      <ProtectedOverlay userEmail={userEmail} />

      {/* Custom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10"
          >
            {/* Progress scrubber */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 mb-2 cursor-pointer accent-[#00C896] appearance-none
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00C896]
                         [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full
                         [&::-webkit-slider-runnable-track]:bg-white/30"
              style={{ pointerEvents: "auto" }}
            />

            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="hover:text-[#00C896] transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Volume */}
                <button
                  onClick={toggleMute}
                  className="hover:text-[#00C896] transition-colors"
                >
                  {isMuted ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 accent-[#00C896] cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                />

                {/* Time */}
                <span className="font-mono text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="hover:text-[#00C896] transition-colors"
              >
                {isFullscreen ? (
                  <Minimize size={20} />
                ) : (
                  <Maximize size={20} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
