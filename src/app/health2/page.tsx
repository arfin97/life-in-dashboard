import { useMemo } from "react";
import NavigationTabs from "../components/NavigationTabs";

const columns = [
  "Date", "Ring", "Fast", "No Junk", "Learn Health", "No caffeine after 7 pm", "No food after 9 pm", "Dim lights after 12 am", "In bed before 1 am", "Strain", "Impact", "HRV next day", "RHR next day", "Sleep score next day", "Recovery score next day", "Did you logged food?"
];

// Generate all dates in May 2025
const year = 2025;
const month = 4; // May (0-indexed)
const daysInMay = 31;
const today = new Date();
const mayDates = Array.from({ length: daysInMay }, (_, i) => {
  const d = new Date(year, month, i + 1);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    raw: d,
    values: Array.from({ length: columns.length - 1 }, () => Math.random() > 0.7 ? "red" : Math.random() > 0.5 ? "green" : "")
  };
});

export default function Health2Page() {
  const todayStr = useMemo(() => today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), []);
  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationTabs />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">Health Tracking</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow p-6">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="text-xs font-semibold text-gray-700 px-2 py-2 text-left whitespace-nowrap border border-gray-200">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows = [];
                  for (let i = 0; i < mayDates.length; i++) {
                    const row = mayDates[i];
                    const isToday = row.date === todayStr;
                    const isPast = row.raw < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    let rowClass = "";
                    let textClass = "";
                    if (isToday) {
                      rowClass = "bg-purple-100";
                      textClass = "text-gray-900";
                    } else if (isPast) {
                      rowClass = "bg-gray-100";
                      textClass = "text-gray-400";
                    } else {
                      rowClass = "bg-white";
                      textClass = "text-gray-900";
                    }
                    rows.push(
                      <tr
                        key={row.date}
                        className={`${rowClass} ${textClass} rounded-lg transition hover:bg-purple-50 hover:shadow`}
                      >
                        <td className="px-2 py-2 font-medium whitespace-nowrap border border-gray-200">{row.date}</td>
                        {row.values.map((val, idx) => (
                          <td key={idx} className="px-2 py-2 text-center border border-gray-200">
                            {val === "green" && <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>}
                            {val === "red" && <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>}
                            {val === "" && ""}
                          </td>
                        ))}
                      </tr>
                    );
                    // After every 3 days, add a report row
                    if ((i + 1) % 3 === 0) {
                      const last3 = mayDates.slice(i - 2, i + 1);
                      const report = last3.length === 3
                        ? last3[0].values.map((_, colIdx) =>
                            last3.reduce((sum, day) => sum + (day.values[colIdx] === "green" ? 1 : 0), 0)
                          )
                        : Array(columns.length - 1).fill(0);
                      rows.push(
                        <tr key={`report-${i}`} className="bg-gray-50 font-bold text-purple-700">
                          <td className="px-2 py-2 border border-gray-200">Report</td>
                          {report.map((val, idx) => (
                            <td key={idx} className="px-2 py-2 text-center border border-gray-200">{val}</td>
                          ))}
                        </tr>
                      );
                    }
                  }
                  return rows;
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 