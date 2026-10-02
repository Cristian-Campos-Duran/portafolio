"use client";

import { useEffect, useRef, useState } from "react";

type OnDemandVideoProps = {
  src: string;
  poster: string;
  label: string;
};

export function OnDemandVideo({ src, poster, label }: OnDemandVideoProps) {
  const [requested, setRequested] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!requested || !videoRef.current) return;
    const video = videoRef.current;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.load();
    void video.play().catch(() => {
      // Native controls remain available when a browser requires another gesture.
    });
  }, [requested]);

  return (
    <div className="on-demand-media">
      <video
        ref={videoRef}
        className="on-demand-video"
        src={requested ? src : undefined}
        poster={poster}
        controls={requested}
        preload={requested ? "metadata" : "none"}
        muted
        playsInline
        disablePictureInPicture
        aria-label={label}
      />
      {!requested && (
        <button
          type="button"
          className="on-demand-trigger"
          onClick={() => setRequested(true)}
          aria-label={`Reproducir ${label}`}
        >
          <span className="play-icon" aria-hidden="true" />
          <span>Reproducir vista</span>
        </button>
      )}
    </div>
  );
}

