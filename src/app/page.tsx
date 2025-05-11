import NavigationTabs from "./components/NavigationTabs";
import UserInfo from "./components/UserInfo";
import { getDashboardData } from "./data/dashboardData";
import LevelProgressCard from "./components/LevelProgressCard";
import StreakStatsCard from "./components/StreakStatsCard";
import CategoryCompletionCard from "./components/CategoryCompletionCard";
import WeeklyPerformanceCard from "./components/WeeklyPerformanceCard";
import ActionButton from "./components/ActionButton";

export default async function Home() {
  const data = await getDashboardData();
  const { user } = data;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationTabs />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex justify-between items-center mb-8">
          <ActionButton 
            label="Start New Session"
            tooltip="Begin a new learning session to earn XP and maintain your streak"
            variant="primary"
          />
          <UserInfo
            name={user.name}
            level={user.level}
            currentStreak={user.currentStreak}
            date={user.date}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <LevelProgressCard level={user.level} xp={user.xp} nextLevelXP={user.nextLevelXP} />
          <StreakStatsCard currentStreak={user.currentStreak} bestStreak={user.bestStreak} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <CategoryCompletionCard labels={data.radar.labels} data={data.radar.data} />
          <WeeklyPerformanceCard data={data.weeklyPerformance} />
        </div>
      </div>
    </div>
  );
}
