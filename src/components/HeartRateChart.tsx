import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HeartRateData {
  time: string;
  bpm: number;
}

function HeartRateChart() {
  const [data, setData] = useState<HeartRateData[]>([]);

  // ✅ Random BPM 60–100
  const generateRandomHeartRate = () => {
    return 60 + Math.floor(Math.random() * 41); // 60 → 100
  };

  const addHeartBeat = () => {
    const now = new Date();
    const newData: HeartRateData = {
      time: now.toLocaleTimeString("vi-VN", {
        minute: "2-digit",
        second: "2-digit",
      }),
      bpm: generateRandomHeartRate(),
    };

    setData((prev) => {
      const updated = [...prev, newData];
      return updated.slice(-30); // giữ 30 điểm
    });
  };

  useEffect(() => {
    addHeartBeat(); // điểm đầu tiên
    const interval = setInterval(addHeartBeat, 2000); // mỗi 2 giây tạo 1 nhịp
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[380px] h-[220px] bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-center text-sm font-semibold text-gray-700 mb-2">
        ❤️ Biểu đồ nhịp tim (60–100 BPM)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="bpm"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default React.memo(HeartRateChart);
