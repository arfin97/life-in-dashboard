"use client";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type CategoryCompletionCardProps = {
  labels: string[];
  data: number[];
};

export default function CategoryCompletionCard({ labels, data }: CategoryCompletionCardProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Completion",
        data,
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "#8B5CF6",
        borderWidth: 2,
        pointBackgroundColor: "#8B5CF6",
      },
    ],
  };
  const options = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: { font: { size: 14 } },
        ticks: { stepSize: 20, font: { size: 12 } },
      },
    },
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-full">
      <div className="font-semibold text-lg mb-2">Category Completion</div>
      <div className="h-64">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
} 