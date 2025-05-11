"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type WeeklyPerformance = {
  day: string;
  Health: number;
  Career: number;
  Atomic: number;
  Tonics: number;
  Core5s: number;
};

type WeeklyPerformanceCardProps = {
  data: WeeklyPerformance[];
};

const categoryColors: Record<string, string> = {
  Health: "#ef4444", // red
  Career: "#3b82f6", // blue
  Atomic: "#f59e42", // orange
  Tonics: "#22c55e", // green
  Core5s: "#a21caf", // purple
};

export default function WeeklyPerformanceCard({ data }: WeeklyPerformanceCardProps) {
  const labels = data.map((d) => d.day);
  const categories = ["Health", "Career", "Atomic", "Tonics", "Core5s"];
  const chartData = {
    labels,
    datasets: categories.map((cat) => ({
      label: cat,
      data: data.map((d) => d[cat as keyof WeeklyPerformance]),
      backgroundColor: categoryColors[cat],
    })),
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true, max: 100 },
    },
    maintainAspectRatio: false,
  };
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-full">
      <div className="font-semibold text-lg mb-2 text-gray-800">Weekly Performance</div>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
} 