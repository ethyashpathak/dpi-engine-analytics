import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/stats")
        .then(res => res.json())
        .then(setData);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div style={{ padding: 20 }}>Loading...</div>;

  const appData = Object.entries(data.applications).map(([k, v]) => ({
    name: k,
    value: v
  }));

  const threadData = Object.entries(data.threads).map(([k, v]) => ({
    name: k,
    value: v
  }));

  return (
    <div style={{ padding: 20 }}>
      <h1>DPI Dashboard</h1>

      <h2>Overview</h2>
      <p>Total Packets: {data.total_packets}</p>
      <p>Throughput: {data.packets_per_sec.toFixed(2)} pkt/s</p>
      <p>Processing Time: {data.processing_time_ms.toFixed(2)} ms</p>

      <h2>Application Distribution</h2>
      <BarChart width={600} height={300} data={appData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

      <h2>Thread Load</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={threadData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
        >
          {threadData.map((_, i) => (
            <Cell key={i} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default App;