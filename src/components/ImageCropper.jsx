"use client";

import Cropper from "react-easy-crop";
import { getCroppedBlob } from "@/lib/cropUtils";
import { useState, useCallback, useRef } from "react";


export default function ImageCropper({ onCrop, onCancel }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [aspect, setAspect] = useState(4 / 5)

  // ── File selected ──────────────────────────────────────────────────────────
  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (imageSrc) URL.revokeObjectURL(imageSrc);

    setImageSrc(URL.createObjectURL(file));
    setFileName(file.name);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError("");
  }, [imageSrc]);

  // ── Save crop ──────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setProcessing(true);
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      URL.revokeObjectURL(imageSrc); // discard original immediately
      setImageSrc(null);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onCrop?.(blob); // hand only the blob back to parent
    } catch (err) {
      setError(err.message || "Crop failed.");
    } finally {
      setProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onCrop]);

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setFileName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onCancel?.(); // tell parent to hide the cropper
  }, [imageSrc, onCancel]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-3">

      {/* Aspect ratio badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm text-muted-foreground">
          Drag to reposition · scroll to zoom
        </span>
        <span className="flex gap-2">
          <span onClick={() => setAspect(4 / 5)} className={`text-xs font-medium px-2.5 py-1 rounded-full bg-label hover:bg-primary text-bg hover:text-secondary cursor-pointer ${aspect === (4 / 5) ? "bg-primary text-secondary" : ""}`}>
            4:5
          </span>
          <span onClick={() => setAspect(16 / 9)} className={`text-xs font-medium px-2.5 py-1 rounded-full bg-label hover:bg-primary text-bg hover:text-secondary cursor-pointer ${aspect === (4 / 5) ? "" : "bg-primary text-secondary"}`}>
            16:9
          </span>
        </span>
      </div>

      {/* ── No image yet: file picker ── */}
      {!imageSrc && (
        <div>
          <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-label hover:border-primary cursor-pointer hover:bg-label2 transition-colors group">
            <svg className="w-7 h-7 text-gray-300 group-hover:text-blue-400 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm text-gray-400 group-hover:text-blue-500 transition-colors">
              Select an image
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          {/* Cancel with no image selected just calls onCancel */}
          <button
            onClick={handleCancel}
            className="mt-3 w-full py-2 rounded-lg text-sm font-medium text-label bg-bg hover:bg-card border border-border transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Image loaded: crop UI ── */}
      {imageSrc && (
        <>
          {/* File name */}
          {fileName && (
            <p className="text-xs text-muted-foreground truncate text-primary font-bold">{fileName}</p>
          )}

          {/* Crop canvas */}
          <div
            className="relative w-full bg-black rounded-lg overflow-hidden"
            style={{ height: aspect >= 1 ? "260px" : "340px" }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-label shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="range" min={1} max={3} step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-primary cursor-pointer"
              aria-label="Zoom"
            />
            <svg className="w-5 h-5 text-label shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Action buttons — matches your existing dialog button style */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={processing}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-label bg-bg hover:bg-card hover:border border-border disabled:opacity-40 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={processing || !croppedAreaPixels}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold text-secondary hover:text-primary bg-primary hover:bg-card hover:border border-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {processing ? "Cropping…" : "Apply crop"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
