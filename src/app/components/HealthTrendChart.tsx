"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export type HealthTrend = {
  date: string;
  HRV: number;
  RHR: number;
  Recovery: number;
  Sleep: number;
};

type HealthTrendChartProps = {
  trends: HealthTrend[];
};

const metricColors = {
  HRV: "#a855f7",      // purple
  RHR: "#ef4444",     // red
  Recovery: "#eab308", // yellow
  Sleep: "#3b82f6",    // blue
};

export default function HealthTrendChart({ trends }: HealthTrendChartProps) {
  const labels = trends.map((t) => t.date);
  const chartData = {
    labels,
    datasets: [
      {
        label: "HRV",
        data: trends.map((t) => t.HRV),
        borderColor: metricColors.HRV,
        backgroundColor: metricColors.HRV,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
      },
      {
        label: "RHR",
        data: trends.map((t) => t.RHR),
        borderColor: metricColors.RHR,
        backgroundColor: metricColors.RHR,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
      },
      {
        label: "Recovery %",
        data: trends.map((t) => t.Recovery),
        borderColor: metricColors.Recovery,
        backgroundColor: metricColors.Recovery,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
      },
      {
        label: "Sleep %",
        data: trends.map((t) => t.Sleep),
        borderColor: metricColors.Sleep,
        backgroundColor: metricColors.Sleep,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: { beginAtZero: true, max: 80, grid: { color: "#e5e7eb" } },
      x: { grid: { color: "#e5e7eb" } },
    },
    maintainAspectRatio: false,
  };
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="font-semibold text-lg mb-2 text-gray-800">Health Metrics</div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
} 