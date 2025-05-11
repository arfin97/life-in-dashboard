"use client";
import { useMemo, useState } from "react";
import NavigationTabs from "../components/NavigationTabs";

const columns = [
  "Date", "Ring", "Fast", "No Junk", "Learn Health", "No caffeine after 7 pm", "No food after 9 pm", "Dim lights after 12 am", "In bed before 1 am", "Strain", "Impact", "HRV next day", "RHR next day", "Sleep score next day", "Recovery score next day", "Did you logged food?"
];

const habitColumns = [
  "Ring", "Fast", "No Junk", "Learn Health", "No caffeine after 7 pm", "No food after 9 pm", "Dim lights after 12 am", "In bed before 1 am", "Strain", "Impact", "Did you logged food?"
];
const metricColumns = [
  "HRV next day", "RHR next day", "Sleep score next day", "Recovery score next day"
];

const year = 2025;
const month = 4; // May (0-indexed)
const daysInMay = 31;
const today = new Date();

function getDefaultData() {
  return Array.from({ length: daysInMay }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const isFuture = d > new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      raw: d,
      values: isFuture
        ? Array.from({ length: columns.length - 1 }, () => "")
        : Array.from({ length: columns.length - 1 }, () => Math.random() > 0.7 ? "red" : Math.random() > 0.5 ? "green" : "")
    };
  });
}

export default function Health2Page() {
  const todayStr = useMemo(() => today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), []);
  const [tableData, setTableData] = useState(getDefaultData());
  const [formDate, setFormDate] = useState(todayStr);
  const [formHabits, setFormHabits] = useState(habitColumns.reduce((acc, h) => ({ ...acc, [h]: "" }), {}));
  const [formMetrics, setFormMetrics] = useState(metricColumns.reduce((acc, m) => ({ ...acc, [m]: "" }), {}));

  // Update form when date changes
  function handleDateChange(e) {
    const val = e.target.value;
    setFormDate(val);
    const row = tableData.find((r) => r.date === val);
    if (row) {
      const habits = {};
      habitColumns.forEach((h, idx) => {
        habits[h] = row.values[idx] === "green" ? "yes" : row.values[idx] === "red" ? "no" : "";
      });
      const metrics = {};
      metricColumns.forEach((m, idx) => {
        const colIdx = columns.indexOf(m) - 1;
        metrics[m] = row.values[colIdx] && !isNaN(Number(row.values[colIdx])) ? row.values[colIdx] : "";
      });
      setFormHabits(habits);
      setFormMetrics(metrics);
    }
  }

  function handleHabitChange(h, val) {
    setFormHabits((prev) => ({ ...prev, [h]: val }));
  }
  function handleMetricChange(m, val) {
    setFormMetrics((prev) => ({ ...prev, [m]: val }));
  }

  function handleSave() {
    setTableData((prev) => prev.map((row) => {
      if (row.date !== formDate) return row;
      const newValues = [...row.values];
      habitColumns.forEach((h, idx) => {
        newValues[idx] = formHabits[h] === "yes" ? "green" : formHabits[h] === "no" ? "red" : "";
      });
      metricColumns.forEach((m, idx) => {
        const colIdx = columns.indexOf(m) - 1;
        newValues[colIdx] = formMetrics[m] !== "" ? formMetrics[m] : "";
      });
      return { ...row, values: newValues };
    }));
  }

  // Helper to convert yyyy-mm-dd to table date string
  function formatDateToTableString(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

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
                  for (let i = 0; i < tableData.length; i++) {
                    const row = tableData[i];
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
                        {row.values.map((val, idx) => {
                          // Show numbers for metrics
                          const colName = columns[idx + 1];
                          if (metricColumns.includes(colName) && val && !isNaN(Number(val))) {
                            return <td key={idx} className="px-2 py-2 text-center border border-gray-200">{val}</td>;
                          }
                          return (
                            <td key={idx} className="px-2 py-2 text-center border border-gray-200">
                              {val === "green" && <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>}
                              {val === "red" && <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>}
                              {val === "" && ""}
                            </td>
                          );
                        })}
                      </tr>
                    );
                    // After every 3 days, add a report row
                    if ((i + 1) % 3 === 0) {
                      const last3 = tableData.slice(i - 2, i + 1);
                      const report = last3.length === 3
                        ? last3[0].values.map((_, colIdx) => {
                            const colName = columns[colIdx + 1];
                            if (metricColumns.includes(colName)) {
                              // For metrics, show average (rounded to 1 decimal)
                              const nums = last3.map(day => Number(day.values[colIdx])).filter(n => !isNaN(n));
                              return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : "";
                            }
                            // For habits, sum green
                            return last3.reduce((sum, day) => sum + (day.values[colIdx] === "green" ? 1 : 0), 0);
                          })
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
        {/* Data Input Section */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h2 className="text-lg font-bold text-purple-700 mb-4">Input Data</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">Select Date</label>
              <input
                type="date"
                className="border rounded px-2 py-1 text-gray-900"
                min={`2025-05-01`}
                max={`2025-05-31`}
                value={(() => {
                  // Convert formDate (e.g. May 11, 2025) to yyyy-mm-dd
                  const d = new Date(formDate);
                  return d.toISOString().slice(0, 10);
                })()}
                onChange={e => {
                  const tableDate = formatDateToTableString(e.target.value);
                  setFormDate(tableDate);
                  handleDateChange({ target: { value: tableDate } });
                }}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold text-purple-700 mb-2">Daily Habits</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habitColumns.map((h) => (
                <div key={h} className="flex items-center gap-4">
                  <span className="w-48 text-sm text-gray-900">{h}</span>
                  <button
                    className={`px-3 py-1 rounded ${formHabits[h] === "yes" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-900"}`}
                    onClick={() => handleHabitChange(h, "yes")}
                  >Yes</button>
                  <button
                    className={`px-3 py-1 rounded ${formHabits[h] === "no" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-900"}`}
                    onClick={() => handleHabitChange(h, "no")}
                  >No</button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold text-purple-700 mb-2">Health Metrics</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metricColumns.map((m) => (
                <div key={m} className="flex items-center gap-4">
                  <span className="w-48 text-sm text-gray-900">{m}</span>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-32 text-gray-900"
                    value={formMetrics[m]}
                    onChange={e => handleMetricChange(m, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition"
            onClick={handleSave}
          >Save</button>
        </div>
      </div>
    </div>
  );
} 