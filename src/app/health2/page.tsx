"use client";
import { useMemo, useState } from "react";
import NavigationTabs from "../components/NavigationTabs";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parse } from 'date-fns';

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
    return {
      date: format(d, 'dd/MM/yyyy'),
      raw: d,
      values: Array.from({ length: columns.length - 1 }, () => "")
    };
  });
}

export default function Health2Page() {
  const todayStr = useMemo(() => today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), []);
  const [tableData, setTableData] = useState(getDefaultData());
  const [formDate, setFormDate] = useState(todayStr);
  const [formHabits, setFormHabits] = useState(habitColumns.reduce((acc, h) => ({ ...acc, [h]: "" }), {}));
  const [formMetrics, setFormMetrics] = useState(metricColumns.reduce((acc, m) => ({ ...acc, [m]: "" }), {}));

  // Helper to convert yyyy-mm-dd to table date string
  function formatDateToTableString(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // For MUI DatePicker value
  const formDateObj = useMemo(() => {
    // Parse dd/MM/yyyy to Date
    try {
      return parse(formDate, 'dd/MM/yyyy', new Date());
    } catch {
      // fallback to old parsing if needed
      const [monthStr, dayStr, yearStr] = formDate.replace(",", "").split(" ");
      return new Date(`${monthStr} ${dayStr}, ${yearStr}`);
    }
  }, [formDate]);

  // Helper to format Date to dd/MM/yyyy
  function formatDateToTableString(dateObj) {
    return format(dateObj, 'dd/MM/yyyy');
  }

  // Update form when date changes
  function handleDateChangeMui(date) {
    if (!date) return;
    const tableDate = formatDateToTableString(date);
    setFormDate(tableDate);
    const row = tableData.find((r) => r.date === tableDate);
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

  async function handleSave() {
    const updated = tableData.map((row) => {
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
    });
    setTableData(updated);
    // Update form state to reflect new table data
    const row = updated.find((r) => r.date === formDate);
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
    await fetch("/api/health2/save-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
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
        {/* Data Input Section with Material UI */}
        <Box className="bg-white rounded-xl shadow p-6 mt-8">
          <Typography variant="h6" sx={{ color: 'black' }} fontWeight={700} mb={2}>
            Input Data
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={formDateObj}
                  minDate={new Date(2025, 4, 1)}
                  maxDate={new Date(2025, 4, 31)}
                  onChange={handleDateChangeMui}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true, size: 'small', InputLabelProps: { style: { color: 'black' } }, InputProps: { style: { color: 'black' } } } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight={600} mb={1}>
            Daily Habits
          </Typography>
          <Grid container spacing={2} mb={2}>
            {habitColumns.map((h) => (
              <Grid item xs={12} md={6} key={h}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography sx={{ width: 180, color: 'black' }}>{h}</Typography>
                  <Button
                    variant={formHabits[h] === "yes" ? "contained" : "outlined"}
                    color={formHabits[h] === "yes" ? "success" : "inherit"}
                    onClick={() => handleHabitChange(h, "yes")}
                    size="small"
                    sx={{ color: formHabits[h] === "yes" ? 'white' : 'black', borderColor: formHabits[h] === "yes" ? '#22c55e' : 'black' }}
                  >Yes</Button>
                  <Button
                    variant={formHabits[h] === "no" ? "contained" : "outlined"}
                    color={formHabits[h] === "no" ? "error" : "inherit"}
                    onClick={() => handleHabitChange(h, "no")}
                    size="small"
                    sx={{ color: formHabits[h] === "no" ? 'white' : 'black', borderColor: formHabits[h] === "no" ? '#ef4444' : 'black' }}
                  >No</Button>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight={600} mb={1}>
            Health Metrics
          </Typography>
          <Grid container spacing={2} mb={2}>
            {metricColumns.map((m) => (
              <Grid item xs={12} md={6} key={m}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography sx={{ width: 180, color: 'black' }}>{m}</Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={formMetrics[m]}
                    onChange={e => handleMetricChange(m, e.target.value)}
                    sx={{ width: 120, input: { color: 'black' } }}
                    InputLabelProps={{ style: { color: 'black' } }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2, color: 'white' }}
          >
            Save
          </Button>
        </Box>
      </div>
    </div>
  );
} 