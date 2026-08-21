"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

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

type Options = {
  /** Delay media start until the host element is near the viewport. */
  lazy?: boolean;
};

/**
 * Background video.
 * - Mobile / normal desktop → native `<video>` (cheap)
 * - Yandex desktop → canvas mirror (scroll glitch workaround)
 * Pauses when off-screen or tab hidden.
 */
export function useYandexVideoBg(sources: Sources, options: Options = {}) {
  const { lazy = false } = options;
  const hostRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [profile, setProfile] = useState<"pending" | "native" | "canvas">(
    "pending",
  );
  const [active, setActive] = useState(!lazy);
  const [hasFrame, setHasFrame] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const yandex = isYandexBrowser();
    const mobile = isMobileUa();
    setProfile(yandex && !mobile ? "canvas" : "native");
  }, []);

  useEffect(() => {
    if (!lazy) {
      setActive(true);
      return;
    }
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [lazy]);

  const useCanvas = profile === "canvas";
  const useNativeVideo = profile === "native";

  useEffect(() => {
    if (!active || profile === "pending") return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let objectUrl: string | null = null;
    let raf = 0;
    let framed = false;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";

    const softPlay = () => {
      if (cancelled || !pageVisible || !inView) return;
      video.muted = true;
      video.defaultMuted = true;
      void video.play().catch(() => undefined);
    };

    const softPause = () => {
      try {
        video.pause();
      } catch {
        /* ignore */
      }
    };

    const syncPlayback = () => {
      if (pageVisible && inView) softPlay();
      else softPause();
    };

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
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

    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      syncPlayback();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const host = hostRef.current ?? video.parentElement;
    let io: IntersectionObserver | null = null;
    if (host && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = Boolean(entry?.isIntersecting);
          syncPlayback();
          if (useCanvas) {
            if (inView && pageVisible) startCanvasMirror();
            else stopCanvasMirror();
          }
        },
        { threshold: 0.08 },
      );
      io.observe(host);
    }

    let drawing = false;

    const drawOnce = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
      if (!canvas || !ctx) return false;
      if (video.readyState < 2 || video.videoWidth <= 0) return false;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      if (cancelled || !drawing) return;
      if (pageVisible && inView) drawOnce();
      raf = window.requestAnimationFrame(loop);
    };

    const startCanvasMirror = () => {
      if (!useCanvas || drawing) return;
      drawing = true;
      raf = window.requestAnimationFrame(loop);
    };

    const stopCanvasMirror = () => {
      drawing = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const setup = async () => {
      if (useCanvas) {
        // Blob URL helps Yandex range-request / scroll issues.
        const order = [
          [sources.webm, "video/webm"],
          [sources.mp4, "video/mp4"],
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
        startCanvasMirror();
      }

      softPlay();
    };

    void setup();

    return () => {
      cancelled = true;
      stopCanvasMirror();
      io?.disconnect();
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("playing", onReady);
      document.removeEventListener("visibilitychange", onVisibility);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [active, profile, useCanvas, sources.mp4, sources.webm]);

  const hideVideo = useCanvas;
  const hideCanvas = !useCanvas || !hasFrame;
  const hidePoster = videoReady && (useNativeVideo || hasFrame);

  return {
    hostRef: hostRef as RefObject<HTMLElement | null>,
    setHost: (el: HTMLElement | null) => {
      hostRef.current = el;
    },
    videoRef,
    canvasRef,
    useNativeVideo,
    useCanvas,
    active,
    hasFrame,
    videoReady,
    hideVideo,
    hideCanvas,
    hidePoster,
  };
}
