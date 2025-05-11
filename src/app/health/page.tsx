"use client";
import { useEffect, useState } from "react";
import NavigationTabs from "../components/NavigationTabs";
import HealthTrendChart from "../components/HealthTrendChart";
import HealthMetricCard from "../components/HealthMetricCard";
import { getHealthData } from "../data/healthData";

export default function HealthPage() {
  const [trends, setTrends] = useState([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    getHealthData().then((data) => {
      setTrends(data.trends);
      setMetrics(data.metrics);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationTabs />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">Health Dashboard</h1>
        {trends.length > 0 && <HealthTrendChart trends={trends} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {metrics && (
            <>
              <HealthMetricCard
                label="HRV"
                value={metrics.HRV.value}
                unit={metrics.HRV.unit}
                change={metrics.HRV.change}
                direction={metrics.HRV.direction}
                color={metrics.HRV.color}
              />
              <HealthMetricCard
                label="RHR"
                value={metrics.RHR.value}
                unit={metrics.RHR.unit}
                change={metrics.RHR.change}
                direction={metrics.RHR.direction}
                color={metrics.RHR.color}
              />
              <HealthMetricCard
                label="Recovery"
                value={metrics.Recovery.value}
                unit={metrics.Recovery.unit}
                change={metrics.Recovery.change}
                direction={metrics.Recovery.direction}
                color={metrics.Recovery.color}
              />
              <HealthMetricCard
                label="Sleep"
                value={metrics.Sleep.value}
                unit={metrics.Sleep.unit}
                change={metrics.Sleep.change}
                direction={metrics.Sleep.direction}
                color={metrics.Sleep.color}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
} 