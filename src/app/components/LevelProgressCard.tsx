type LevelProgressCardProps = {
  level: number;
  xp: number;
  nextLevelXP: number;
};

export default function LevelProgressCard({ level, xp, nextLevelXP }: LevelProgressCardProps) {
  const percent = Math.min((xp / nextLevelXP) * 100, 100);
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-semibold">Level {level}</span>
        <span className="ml-auto text-sm text-gray-400">Level {level + 1}</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">
        {xp} / {nextLevelXP} XP
      </div>
    </div>
  );
} 