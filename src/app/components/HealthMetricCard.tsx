type HealthMetricCardProps = {
  label: string;
  value: number;
  unit: string;
  change: number;
  direction: "up" | "down" | "same";
  color: string;
};

const directionIcons = {
  up: "▲",
  down: "▼",
  same: "●",
};

const directionColors = {
  up: "text-green-600",
  down: "text-red-600",
  same: "text-gray-400",
};

export default function HealthMetricCard({
  label,
  value,
  unit,
  change,
  direction,
  color,
}: HealthMetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 h-40 justify-center">
      <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold text-${color}-600`}>{value}</span>
        <span className="text-sm text-gray-400 mb-1">{unit}</span>
      </div>
      <div className="flex items-center gap-1 text-xs mt-2">
        <span className={directionColors[direction]}>{directionIcons[direction]}</span>
        <span className={directionColors[direction]}>{change !== 0 ? `${change} from yesterday` : "same as yesterday"}</span>
      </div>
    </div>
  );
} 