import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceAnalyzer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expressions, setExpressions] = useState<faceapi.FaceExpressions | null>(null);

  // ✅ 1. Bật camera ngay khi vào trang
  useEffect(() => {
    let stream: MediaStream | null = null;
  
    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        console.log("🎥 Camera started");
      } catch (err) {
        console.error("❌ Không thể truy cập camera:", err);
        alert("Vui lòng bật quyền truy cập camera trong trình duyệt.");
      }
    };
  
    startVideo();
  
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        console.log("✅ Model loaded");
      } catch (e) {
        console.error("❌ Lỗi tải model:", e);
      }
    };
  
    loadModels();
  
    // 👇 Cleanup khi rời component
    return () => {
      console.log("🧹 Cleaning up FaceAnalyzer...");
      if (stream) {
        stream.getTracks().forEach(track => {
          console.log("🛑 Stopping track:", track.kind);
          track.stop();
        });
        if (videoRef.current) videoRef.current.srcObject = null;
        console.log("✅ Camera stopped completely");
      }
    };    
  }, []);  

  // ✅ 3. Khi video chạy, bắt đầu detect
  const handleVideoPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    const detect = async () => {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        setExpressions(detections.expressions);
      }

      requestAnimationFrame(detect);
    };
    detect();
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onPlay={handleVideoPlay}
        width="320"
        height="260"
        className="rounded-xl shadow-md bg-black"
      />
      {expressions && (
        <div className="mt-4 text-sm text-gray-200">
          {Object.entries(expressions).map(([key, value]) => (
            <p key={key}>
              {key}: {(value * 100).toFixed(1)}%
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
