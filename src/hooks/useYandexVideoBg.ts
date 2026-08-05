"use client";

import { useEffect, useRef, useState } from "react";

export function isYandexBrowser() {
  if (typeof navigator === "undefined") return false;
  return /YaBrowser|YaSearchBrowser|Yowser/i.test(navigator.userAgent);
}

function isMobileUa() {
  if (typeof navigator === "undefined") return false;
  return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function loadVideoAsBlob(url: string, mime: string) {
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Failed ${url}`);
  const buffer = await response.arrayBuffer();
  return URL.createObjectURL(new Blob([buffer], { type: mime }));
}

type Sources = {
  webm: string;
  mp4: string;
};

/**
 * Background video.
 * Mobile → native <video>, object-fit: contain in a dedicated band.
 * Desktop → canvas mirror (Chrome/Yandex scroll glitch workaround).
 */
export function useYandexVideoBg(sources: Sources) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileUa());
  }, []);

  const useNativeVideo = isMobile;
  const useCanvas = !isMobile;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const softPlay = () => {
      if (cancelled || document.hidden) return;
      video.muted = true;
      video.defaultMuted = true;
      void video.play().catch(() => undefined);
    };

    if (useNativeVideo) {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      const onReady = () => {
        if (video.readyState >= 2) setVideoReady(true);
        softPlay();
      };

      video.addEventListener("canplay", onReady);
      video.addEventListener("loadeddata", onReady);
      video.addEventListener("playing", onReady);
      softPlay();

      const onVisibility = () => {
        if (document.visibilityState === "visible") softPlay();
        else {
          try {
            video.pause();
          } catch {
            /* ignore */
          }
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        cancelled = true;
        video.removeEventListener("canplay", onReady);
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("playing", onReady);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    if (!useCanvas) return;
    let objectUrl: string | null = null;
    let raf = 0;
    let framed = false;
    let drawing = false;

    const softPlay = () => {
      if (cancelled || document.hidden) return;
      video.muted = true;
      video.defaultMuted = true;
      void video.play().catch(() => undefined);
    };

    const drawOnce = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: false });
      if (!canvas || !ctx) return false;
      if (video.readyState < 2 || video.videoWidth <= 0) return false;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(1, Math.round(rect.width * dpr));
      const ch = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      if (cw <= 1 || ch <= 1) return false;

      const scale = Math.max(cw / video.videoWidth, ch / video.videoHeight);
      const w = video.videoWidth * scale;
      const h = video.videoHeight * scale;
      ctx.drawImage(video, (cw - w) / 2, (ch - h) / 2, w, h);

      if (!framed) {
        framed = true;
        setHasFrame(true);
      }
      return true;
    };

    const loop = () => {
      if (cancelled) return;
      if (!document.hidden) drawOnce();
      raf = window.requestAnimationFrame(loop);
    };

    const startCanvasMirror = () => {
      if (drawing) return;
      drawing = true;
      raf = window.requestAnimationFrame(loop);
    };

    const setup = async () => {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      // Blob URL helps Yandex; also avoids some Chrome range-request glitches.
      if (isYandexBrowser()) {
        const order = [
          [sources.mp4, "video/mp4"],
          [sources.webm, "video/webm"],
        ] as const;

        for (const [url, mime] of order) {
          try {
            objectUrl = await loadVideoAsBlob(url, mime);
            break;
          } catch {
            objectUrl = null;
          }
        }

        if (cancelled) return;

        if (objectUrl) {
          video.querySelectorAll("source").forEach((node) => node.remove());
          video.removeAttribute("src");
          video.src = objectUrl;
          video.load();
        }
      }

      startCanvasMirror();
      softPlay();
    };

    const onCanPlay = () => softPlay();
    const onPlaying = () => {
      drawOnce();
      softPlay();
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onCanPlay);
    video.addEventListener("loadedmetadata", onCanPlay);
    video.addEventListener("playing", onPlaying);

    const onVisibility = () => {
      if (document.visibilityState === "visible") softPlay();
      else {
        try {
          video.pause();
        } catch {
          /* ignore */
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    void setup();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onCanPlay);
      video.removeEventListener("loadedmetadata", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisibility);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [useCanvas, useNativeVideo, sources.mp4, sources.webm]);

  const hideVideo = !useNativeVideo;
  const hideCanvas = !useCanvas || !hasFrame;
  const hidePoster = useNativeVideo && videoReady;

  return {
    videoRef,
    canvasRef,
    useNativeVideo,
    useCanvas,
    hasFrame,
    videoReady,
    hideVideo,
    hideCanvas,
    hidePoster,
  };
}
