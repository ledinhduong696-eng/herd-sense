import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";
import HeartRateChart from './HeartRateChart';

interface SituationAIProps {
  onComplete: () => void;
  onBack: () => void;
  surveyId: string;
}

export default function SituationAI({ onComplete, onBack }: SituationAIProps) {
  const [situation, setSituation] = useState("");
  const [answer, setAnswer] = useState("");

  // 🆕 Thêm state để điều khiển hiển thị camera
  const [showCamera, setShowCamera] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Không thể truy cập camera:", err);
      }
    };
    startCamera();
    return () => {
      stopCamera();
    }
  }, []);

  const stopCamera = async () => {
    console.log("🔴 Đang dừng camera...");
  
    try {
      // 1) Gỡ video srcObject TRƯỚC (giúp trình duyệt giải phóng nhanh hơn)
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) { /* ignore */ }
        try {
          // gỡ srcObject ngay
          videoRef.current.srcObject = null;
          console.log("📷 Video srcObject đã gỡ");
        } catch (e) {
          console.warn("Không thể gỡ srcObject:", e);
        }
      }
  
      // 2) Dừng toàn bộ tracks nếu stream còn
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
            console.log(`🛑 Track ${track.kind} đã stop`);
          } catch (e) {
            console.warn("Lỗi stop track:", e);
          }
        });
        streamRef.current = null;
      }
  
      // 3) Dừng worker và interval nếu có
      if (workerRef.current) {
        try {
          workerRef.current.postMessage({ type: "STOP" });
        } catch (e) { /* ignore */ }
        try {
          workerRef.current.terminate();
        } catch (e) { /* ignore */ }
        workerRef.current = null;
        console.log("🧠 Worker đã dừng");
      }
  
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("⏹ Interval đã dừng");
      }
  
      // 4) Đợi trình duyệt giải phóng thiết bị
      await new Promise((r) => setTimeout(r, 500));
  
      // 5) Kiểm tra lại thiết bị còn label (tức vẫn đang active)
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const activeCams = devices.filter((d) => d.kind === "videoinput" && d.label);
        if (activeCams.length > 0) {
          console.warn("⚠️ Một số camera vẫn đang active:", activeCams);
        } else {
          console.log("✅ Camera đã tắt hoàn toàn");
        }
      } catch (err) {
        console.warn("Không thể kiểm tra thiết bị:", err);
      }
    } catch (error) {
      console.error("❌ Lỗi khi dừng camera:", error);
    }
  }; 

  const generateSituation = () => {
    const examples = [
      "Nhóm bạn của bạn rủ đi trốn học để chơi game. Bạn sẽ làm gì?",
      "Một người bạn trong nhóm bị mọi người cô lập vì ý kiến khác biệt. Bạn sẽ phản ứng ra sao?",
      "Bạn thấy bạn mình gian lận trong bài kiểm tra và được cả nhóm ủng hộ. Bạn có làm theo không?",
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setSituation(random);
  };

  useEffect(() => {
    generateSituation();
  }, []);

  // ✅ Khi nhấn nút "Xem kết quả" → tắt camera và ẩn video ngay
  const handleComplete = async () => {
    await stopCamera();           // chờ đảm bảo dọn xong
    setShowCamera(false);         // ẩn video ngay
    onComplete();
  };

  const handleBack = async () => {
    await stopCamera();
    setShowCamera(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại khảo sát
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Giải Quyết Tình Huống
          </h2>

          {/* ✅ Chỉ hiển thị video nếu showCamera = true */}
          {showCamera && (
            <div className="flex justify-center items-center gap-8 mb-6">
              {/* 💓 Biểu đồ nhịp tim */}
              <div className="flex flex-col items-center">
                <div className="w-64 h-56 bg-white rounded-xl shadow-md border border-gray-200 p-2 flex flex-col">
                  <div className="flex-1 flex justify-center items-center">
                    <HeartRateChart />
                  </div>
                </div>
              </div>

              {/* 📷 Camera */}
              <div className="flex flex-col items-center">
                <div className="w-64 h-56 bg-white rounded-xl shadow-md border border-gray-200 p-2 flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    📷 <span>Camera</span>
                   </h3>
                  <div className="flex-1 flex justify-center items-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="rounded-lg w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-gray-700 whitespace-pre-line">{situation}</p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập cách giải quyết của bạn..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
          />

          <div className="flex justify-between mt-8">
            <button
              onClick={generateSituation}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Tình huống khác
            </button>

            <button
              onClick={handleComplete}
              disabled={!answer.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              Xem kết quả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
