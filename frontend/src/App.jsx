import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function App() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/stats")
        .then((res) => res.json())
        .then((d) => {
          setData(d);

          // keep last 20 points for graph
          setHistory((prev) => [
            ...prev.slice(-19),
            {
              time: new Date().toLocaleTimeString(),
              throughput: d.packets_per_sec,
            },
          ]);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0f19] text-white">
        Loading dashboard...
      </div>
    );
  }

  const labelMap = {
    FP0: "Worker 0",
    FP1: "Worker 1",
    FP2: "Worker 2",
    FP3: "Worker 3",
    LB0: "LB 0",
    LB1: "LB 1",
  };

  const appData = Object.entries(data.applications).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  const threadData = Object.entries(data.threads).map(([k, v]) => ({
    name: labelMap[k] || k,
    value: v,
    raw: k,
  }));

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 p-6">

      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6 tracking-wide">
        DPI Monitoring Dashboard
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Metric title="Total Packets" value={data.total_packets} />
        <Metric title="Throughput" value={`${data.packets_per_sec.toFixed(1)} pkt/s`} />
        <Metric title="Processing Time" value={`${data.processing_time_ms.toFixed(1)} ms`} />
        <Metric title="Dropped" value={data.dropped} />
      </div>

      {/* Throughput Graph */}
      <div className="bg-[#111827] rounded-xl p-4 mb-6 border border-gray-800">
        <h2 className="text-sm mb-3 text-gray-400">Throughput Over Time</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history}>
            <XAxis dataKey="time" hide />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="throughput"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* App Traffic */}
        <div className="bg-[#111827] rounded-xl p-4 border border-gray-800">
          <h2 className="text-sm mb-3 text-gray-400">Application Traffic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appData}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Thread Load */}
        <div className="bg-[#111827] rounded-xl p-4 border border-gray-800">
          <h2 className="text-sm mb-3 text-gray-400">Thread Load Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threadData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {threadData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n, p) => [
                  `${v} packets`,
                  p.payload.raw,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 text-sm text-gray-400">
        <p><b>LB:</b> distributes packets</p>
        <p><b>Workers:</b> process & classify traffic</p>
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}