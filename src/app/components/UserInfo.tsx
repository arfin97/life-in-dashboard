type UserInfoProps = {
  name: string;
  level: number;
  currentStreak: number;
  date: string;
};

export default function UserInfo({ name, level, currentStreak, date }: UserInfoProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="text-gray-500 text-sm">{date}</div>
      <div className="flex items-center gap-2">
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold text-sm">L{level}</span>
        <span className="text-gray-700 text-sm">Current Streak: <span className="font-bold">{currentStreak} days</span></span>
      </div>
    </div>
  );
} 