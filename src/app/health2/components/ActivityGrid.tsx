import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import Typography from '@mui/material/Typography';
import { TableRow, ActivityData } from '../types';

interface ActivityGridProps {
  data: TableRow[];
  currentMonth: Date;
  onDayClick: (date: Date) => void;
}

function getActivityLevel(data: string[]): number {
  return data.reduce((count, val) => {
    if (val === "green") return count + 2;
    if (val === "red") return count + 1;
    if (val && !isNaN(Number(val))) return count + 1;
    return count;
  }, 0);
}

function getActivityDetails(data: string[]): { habits: number, metrics: number } {
  return data.reduce((acc, val) => {
    if (val === "green" || val === "red") {
      acc.habits++;
    } else if (val && !isNaN(Number(val))) {
      acc.metrics++;
    }
    return acc;
  }, { habits: 0, metrics: 0 });
}

export default function ActivityGrid({ data, currentMonth, onDayClick }: ActivityGridProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentMonth]);

  const activityData = useMemo(() => {
    return days.map(day => {
      const dayData = data.find(d => format(d.raw, 'dd/MM/yyyy') === format(day, 'dd/MM/yyyy'));
      return {
        date: day,
        level: dayData ? getActivityLevel(dayData.values) : 0,
        details: dayData ? getActivityDetails(dayData.values) : { habits: 0, metrics: 0 },
        rawData: dayData
      };
    });
  }, [days, data]);

  const maxLevel = useMemo(() => {
    return Math.max(...activityData.map(d => d.level), 1);
  }, [activityData]);

  const getColorIntensity = (intensity: number): string => {
    // GitHub-like 5-step color scale
    // 0: gray, 1: dark green, 2: medium green, 3: light green, 4: bright green
    const steps = [
      'bg-gray-800',      // 0 - no activity
      'bg-green-900',     // 1 - least activity
      'bg-green-700',     // 2
      'bg-green-500',     // 3
      'bg-green-300'      // 4 - most activity
    ];
    if (intensity === 0) return steps[0];
    // Map intensity (0-1) to 1-4
    const idx = Math.min(4, Math.max(1, Math.ceil(intensity * 4)));
    return steps[idx];
  };

  const getTooltipContent = (dayData: ActivityData) => {
    const { date, level, details, rawData } = dayData;
    const dateStr = format(date, 'MMMM d, yyyy');
    const isToday = format(date, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy');
    
    let content = `${dateStr}${isToday ? ' (Today)' : ''}\n`;
    content += `Activity Level: ${level}\n`;
    content += `Habits Tracked: ${details.habits}\n`;
    content += `Metrics Recorded: ${details.metrics}\n`;
    
    if (rawData) {
      const greenHabits = rawData.values.filter(v => v === "green").length;
      const redHabits = rawData.values.filter(v => v === "red").length;
      content += `\nCompleted Habits: ${greenHabits}\n`;
      content += `Missed Habits: ${redHabits}`;
    }
    
    return content;
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <Typography variant="h6" sx={{ color: 'black' }} fontWeight={700} mb={2}>
        Activity Overview
      </Typography>
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-xs text-gray-500 text-center mb-1">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayData = activityData[index];
          const intensity = dayData.level / maxLevel;
          const bgColor = getColorIntensity(intensity);
          const isToday = format(day, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy');
          const dayOfWeek = format(day, 'EEE');
          
          // Calculate the correct position for Monday start
          const adjustedIndex = (index + 1) % 7; // Shift by 1 to make Monday first
          const position = adjustedIndex === 0 ? 7 : adjustedIndex; // Convert Sunday (0) to 7
          
          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={`
                ${bgColor} 
                aspect-square 
                rounded-sm 
                hover:ring-2 
                hover:ring-purple-500 
                cursor-pointer 
                transition-all
                ${isToday ? 'ring-2 ring-purple-500' : ''}
                relative
                group
                ${index === 0 ? `col-start-${position}` : ''}
              `}
              title={getTooltipContent(dayData)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {format(day, 'd')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 