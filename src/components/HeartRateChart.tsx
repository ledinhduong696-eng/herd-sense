import React, { useEffect, useState } from "react";
import { supabaseHeart } from "../lib/supabase";
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
  created_at: string;
  bpm: number;
}

function HeartRateChart() {
  const [data, setData] = useState<HeartRateData[]>([]);

  const fetchHeartData = async () => {
    const { data: heartData, error } = await supabaseHeart
      .from("heart_data")
      .select("created_at, bpm")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Lỗi lấy dữ liệu nhịp tim:", error);
    } else if (heartData) {
      setData(heartData.reverse());
    }
  };

  useEffect(() => {
    fetchHeartData();
    const interval = setInterval(fetchHeartData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[520px] h-[220px] bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-center text-sm font-semibold text-gray-700 mb-2">
        ❤️ Biểu đồ nhịp tim
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="created_at"
            tickFormatter={(time) =>
              new Date(time).toLocaleTimeString("vi-VN", {
                minute: "2-digit",
                second: "2-digit",
              })
            }
            tick={{ fontSize: 10 }}
          />
          <YAxis domain={[40, 130]} tick={{ fontSize: 10 }} />
          <Tooltip
            labelFormatter={(time) =>
              new Date(time).toLocaleTimeString("vi-VN")
            }
          />
          <Line
            type="monotone"
            dataKey="bpm"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default React.memo(HeartRateChart);
