"use client";
import { useState, useEffect } from "react";
interface SanityImageProps {
  imageKey: string;
  alt?: string;
  className?: string;
  placeholderLabel?: string;
}
/**
 * Shows a Sanity-managed image by key. Falls back to a dashed placeholder if not uploaded yet.
 * 
 * Upload images in Sanity Studio → Site Image → create with matching key.
 * 
 * Example keys: "step-1", "feature-gmail", "about-samba"
 */
export default function SanityImage({ imageKey, alt, className, placeholderLabel }: SanityImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch(`/api/sanity-image?key=${encodeURIComponent(imageKey)}`)
      .then((r) => r.json())
      .then((d) => { if (d.url) setSrc(d.url); })
      .catch(() => {});
  }, [imageKey]);
  if (src) {
    return (
      <div className={className || "w-full rounded-lg"}>
        <img
          src={src}
          alt={alt || placeholderLabel || imageKey}
          className="w-full h-full object-contain rounded-lg"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        />
      </div>
    );
  }
  // Placeholder — shows until you upload the image in Sanity
  return (
    <div className={className || "w-full rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center gap-2"}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-40">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span className="text-[10px] text-[var(--muted)] opacity-60">{placeholderLabel || imageKey}</span>
    </div>
  );
}
