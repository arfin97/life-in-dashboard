export const healthData = {
  trends: [
    { date: "May 5", HRV: 34, RHR: 65, Recovery: 75, Sleep: 60 },
    { date: "May 6", HRV: 35, RHR: 66, Recovery: 74, Sleep: 62 },
    { date: "May 7", HRV: 33, RHR: 64, Recovery: 70, Sleep: 65 },
    { date: "May 8", HRV: 36, RHR: 63, Recovery: 72, Sleep: 68 },
    { date: "May 9", HRV: 37, RHR: 62, Recovery: 76, Sleep: 70 },
    { date: "May 10", HRV: 38, RHR: 64, Recovery: 78, Sleep: 80 },
    { date: "May 11", HRV: 36, RHR: 64, Recovery: 75, Sleep: 54 },
  ],
  metrics: {
    HRV: {
      value: 36,
      unit: "ms",
      change: 2,
      direction: "up",
      color: "purple",
    },
    RHR: {
      value: 64,
      unit: "bpm",
      change: 2,
      direction: "down",
      color: "red",
    },
    Recovery: {
      value: 75,
      unit: "%",
      change: 0,
      direction: "same",
      color: "yellow",
    },
    Sleep: {
      value: 54,
      unit: "%",
      change: 26,
      direction: "down",
      color: "blue",
    },
  },
};

export async function getHealthData() {
  // In the future, replace this with an API call
  return healthData;
} 