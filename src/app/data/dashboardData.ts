// Dummy dashboard data for the Home (Overview) page

export const dashboardData = {
  user: {
    name: "John Doe",
    level: 3,
    xp: 2750,
    nextLevelXP: 3000,
    currentStreak: 4,
    bestStreak: 12,
    date: "May 11, 2025",
  },
  categories: [
    { name: "Health", completion: 80 },
    { name: "Career", completion: 60 },
    { name: "Atomic", completion: 70 },
    { name: "Tonics", completion: 50 },
    { name: "Core 5s", completion: 90 },
  ],
  radar: {
    labels: ["Health", "Career", "Atomic", "Tonics", "Core 5s"],
    data: [80, 60, 70, 50, 90],
  },
  weeklyPerformance: [
    { day: "Mon", Health: 90, Career: 60, Atomic: 80, Tonics: 70, Core5s: 90 },
    { day: "Tue", Health: 95, Career: 30, Atomic: 100, Tonics: 60, Core5s: 80 },
    { day: "Wed", Health: 80, Career: 50, Atomic: 90, Tonics: 50, Core5s: 100 },
    { day: "Thu", Health: 70, Career: 60, Atomic: 80, Tonics: 80, Core5s: 90 },
    { day: "Fri", Health: 90, Career: 40, Atomic: 70, Tonics: 60, Core5s: 60 },
    { day: "Sat", Health: 60, Career: 30, Atomic: 90, Tonics: 40, Core5s: 70 },
    { day: "Sun", Health: 70, Career: 50, Atomic: 80, Tonics: 60, Core5s: 80 },
  ],
};

// Simulate async data fetching for future API integration
export async function getDashboardData() {
  // In the future, replace this with an API call
  return dashboardData;
} 