"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import NavigationTabs from "../components/NavigationTabs";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { TableRow, Habits, Metrics, EditValues } from './types';
import HealthForm from './components/HealthForm';
import HealthTable from './components/HealthTable';
import ActivityGrid from './components/ActivityGrid';

const columns = [
  "Date",
  "Did you completed the Ring?",
  "Did you completed the Fast?",
  "Did you followed No Junk?",
  "Did you learned anything about health?",
  "Did you logged calories of food?",
  "Did you journaled?",
  "Did you followed no caffeine after 7 pm",
  "Did you followed no food after 9 pm",
  "Did you followed to dim lights after 12 am",
  "Were you in bed before 1 am?",
  "Strain today",
  "HRV next day",
  "RHR next day",
  "Sleep score next day",
  "Recovery score next day"
];

const habitColumns = [
  "Did you completed the Ring?",
  "Did you completed the Fast?",
  "Did you followed No Junk?",
  "Did you learned anything about health?",
  "Did you logged calories of food?",
  "Did you journaled?",
  "Did you followed no caffeine after 7 pm",
  "Did you followed no food after 9 pm",
  "Did you followed to dim lights after 12 am",
  "Were you in bed before 1 am?"
];

const metricColumns = [
  "Strain today",
  "HRV next day",
  "RHR next day",
  "Sleep score next day",
  "Recovery score next day"
];

const year = 2025;
const month = 4; // May (0-indexed)
const daysInMay = 31;

function getDefaultData(): TableRow[] {
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
  const [mounted, setMounted] = useState(false);
  const todayStr = useMemo(() => {
    if (!mounted) return format(new Date(year, month, 1), 'dd/MM/yyyy');
    return format(new Date(), 'dd/MM/yyyy');
  }, [mounted]);
  
  const [tableData, setTableData] = useState<TableRow[]>(getDefaultData());
  const [formDate, setFormDate] = useState(todayStr);
  const [formHabits, setFormHabits] = useState<Habits>(habitColumns.reduce((acc, h) => ({ ...acc, [h]: "" }), {}));
  const [formMetrics, setFormMetrics] = useState<Metrics>(metricColumns.reduce((acc, m) => ({ ...acc, [m]: "" }), {}));
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({ habits: {}, metrics: {} });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load persisted data from backend
    fetch('/api/health2/load-table')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTableData(data);
        }
      })
      .catch(() => {});
  }, []);

  function formatDateToTableString(dateObj: Date): string {
    return format(dateObj, 'dd/MM/yyyy');
  }

  function handleDateChangeMui(date: Date | null) {
    if (!date) return;
    const tableDate = formatDateToTableString(date);
    setFormDate(tableDate);
    const row = tableData.find((r) => r.date === tableDate);
    if (row) {
      const habits: Habits = {};
      habitColumns.forEach((h, idx) => {
        habits[h] = row.values[idx] === "green" ? "yes" : row.values[idx] === "red" ? "no" : "";
      });
      const metrics: Metrics = {};
      metricColumns.forEach((m, idx) => {
        const colIdx = columns.indexOf(m) - 1;
        metrics[m] = row.values[colIdx] && !isNaN(Number(row.values[colIdx])) ? row.values[colIdx] : "";
      });
      setFormHabits(habits);
      setFormMetrics(metrics);
    }
  }

  function handleHabitChange(h: string, val: string) {
    setFormHabits((prev) => ({ ...prev, [h]: val }));
  }

  function handleMetricChange(m: string, val: string) {
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
      const habits: Habits = {};
      habitColumns.forEach((h, idx) => {
        habits[h] = row.values[idx] === "green" ? "yes" : row.values[idx] === "red" ? "no" : "";
      });
      const metrics: Metrics = {};
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

  function handleEditClick(date: string) {
    const row = tableData.find((r) => r.date === date);
    if (row) {
      const habits: Habits = {};
      habitColumns.forEach((h, idx) => {
        habits[h] = row.values[idx] === "green" ? "yes" : row.values[idx] === "red" ? "no" : "";
      });
      const metrics: Metrics = {};
      metricColumns.forEach((m, idx) => {
        const colIdx = columns.indexOf(m) - 1;
        metrics[m] = row.values[colIdx] && !isNaN(Number(row.values[colIdx])) ? row.values[colIdx] : "";
      });
      setEditValues({ habits, metrics });
      setEditingRow(date);
    }
  }

  function handleEditSave(date: string) {
    const updated = tableData.map((row) => {
      if (row.date !== date) return row;
      const newValues = [...row.values];
      habitColumns.forEach((h, idx) => {
        newValues[idx] = editValues.habits[h] === "yes" ? "green" : editValues.habits[h] === "no" ? "red" : "";
      });
      metricColumns.forEach((m, idx) => {
        const colIdx = columns.indexOf(m) - 1;
        newValues[colIdx] = editValues.metrics[m] !== "" ? editValues.metrics[m] : "";
      });
      return { ...row, values: newValues };
    });
    setTableData(updated);
    setEditingRow(null);
    // Save to backend
    fetch("/api/health2/save-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  function handleEditCancel() {
    setEditingRow(null);
  }

  function handleEditHabitChange(h: string, val: string) {
    setEditValues((prev) => ({
      ...prev,
      habits: { ...prev.habits, [h]: val }
    }));
  }

  function handleTodayClick() {
    if (!mounted) return;
    const today = new Date();
    handleDateChangeMui(today);
  }

  function handlePrevDateClick() {
    if (!mounted) return;
    const current = parse(formDate, 'dd/MM/yyyy', new Date());
    const prev = new Date(current);
    prev.setDate(current.getDate() - 1);
    // Clamp to min date
    if (prev < new Date(2025, 4, 1)) return;
    handleDateChangeMui(prev);
  }

  function handleNextDateClick() {
    if (!mounted) return;
    const current = parse(formDate, 'dd/MM/yyyy', new Date());
    const next = new Date(current);
    next.setDate(current.getDate() + 1);
    // Clamp to max date
    if (next > new Date(2025, 4, 31)) return;
    handleDateChangeMui(next);
  }

  function handleDayClick(date: Date) {
    const formattedDate = format(date, 'dd/MM/yyyy');
    setFormDate(formattedDate);
    handleDateChangeMui(date);
  }

  // For MUI DatePicker value
  const formDateObj = useMemo(() => {
    try {
      return parse(formDate, 'dd/MM/yyyy', new Date());
    } catch {
      const [monthStr, dayStr, yearStr] = formDate.replace(",", "").split(" ");
      return new Date(`${monthStr} ${dayStr}, ${yearStr}`);
    }
  }, [formDate]);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <NavigationTabs />
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
          <h1 className="text-2xl font-bold text-purple-700 mb-6">Health Tracking</h1>
          
          <HealthForm
            formDateObj={formDateObj}
            formHabits={formHabits}
            formMetrics={formMetrics}
            habitColumns={habitColumns}
            metricColumns={metricColumns}
            onDateChange={handleDateChangeMui}
            onHabitChange={handleHabitChange}
            onMetricChange={handleMetricChange}
            onSave={handleSave}
            onTodayClick={handleTodayClick}
            onPrevDateClick={handlePrevDateClick}
            onNextDateClick={handleNextDateClick}
          />

          <HealthTable
            tableData={tableData}
            columns={columns}
            habitColumns={habitColumns}
            editingRow={editingRow}
            editValues={editValues}
            mounted={mounted}
            todayStr={todayStr}
            onEditClick={handleEditClick}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onEditHabitChange={handleEditHabitChange}
          />

          <div className="mt-6">
            <ActivityGrid
              data={tableData}
              currentMonth={new Date(year, month, 1)}
              onDayClick={handleDayClick}
            />
          </div>
        </div>
      </div>
    </>
  );
}