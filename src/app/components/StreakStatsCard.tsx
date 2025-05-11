type StreakStatsCardProps = {
  currentStreak: number;
  bestStreak: number;
};

export default function StreakStatsCard({ currentStreak, bestStreak }: StreakStatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
      <div className="font-semibold text-lg mb-2 text-gray-800">Streak Stats</div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-600">{currentStreak}</span>
          <span className="text-xs text-gray-500">Current Streak</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-400">{bestStreak}</span>
          <span className="text-xs text-gray-500">Best Streak</span>
        </div>
      </div>
    </div>
  );
} 