"use client";

import { useCallback, useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export type PhotoItem = {
  id: string;
  caption: string;
  src?: string;
  hue?: number;
};

export function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  const [active, setActive] = useState<PhotoItem | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p)}
            className="group overflow-hidden rounded-xl border border-line/60 text-left transition hover:border-accent"
          >
            <div
              className="aspect-video w-full bg-gradient-to-br from-navy/20 to-navy/5"
              style={{ filter: p.hue ? `hue-rotate(${p.hue}deg)` : undefined }}
            />
            <p className="px-2 py-2 text-xs text-navy/70 group-hover:text-navy">{p.caption}</p>
          </button>
        ))}
      </div>
      {active && <PhotoLightbox photo={active} onClose={() => setActive(null)} />}
    </>
  );
}

function PhotoLightbox({ photo, onClose }: { photo: PhotoItem; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-sm font-medium text-cream">{photo.caption}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScale((s) => Math.min(3, s + 0.25));
            }}
            className="rounded-full border border-cream/20 p-2 text-cream"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScale((s) => Math.max(0.5, s - 0.25));
            }}
            className="rounded-full border border-cream/20 p-2 text-cream"
          >
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-cream/20 p-2 text-cream"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div
        className="flex flex-1 cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          setDragging(true);
          setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
        }}
        onMouseMove={(e) => {
          if (!dragging) return;
          setOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
        }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <div
          className="h-[60vh] w-[80vw] max-w-3xl rounded-xl bg-gradient-to-br from-accent/30 via-navy-light to-navy shadow-2xl"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 0.15s ease",
          }}
        />
      </div>
    </div>
  );
}
