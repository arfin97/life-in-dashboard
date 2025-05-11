import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { Habits, Metrics } from '../types';

interface HealthFormProps {
  formDateObj: Date;
  formHabits: Habits;
  formMetrics: Metrics;
  habitColumns: string[];
  metricColumns: string[];
  onDateChange: (date: Date | null) => void;
  onHabitChange: (habit: string, value: string) => void;
  onMetricChange: (metric: string, value: string) => void;
  onSave: () => void;
  onTodayClick: () => void;
  onPrevDateClick: () => void;
  onNextDateClick: () => void;
}

export default function HealthForm({
  formDateObj,
  formHabits,
  formMetrics,
  habitColumns,
  metricColumns,
  onDateChange,
  onHabitChange,
  onMetricChange,
  onSave,
  onTodayClick,
  onPrevDateClick,
  onNextDateClick,
}: HealthFormProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={formDateObj}
            onChange={onDateChange}
            format="dd/MM/yyyy"
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={onTodayClick}>
          Today
        </Button>
        <Button variant="outlined" onClick={onPrevDateClick}>
          Previous
        </Button>
        <Button variant="outlined" onClick={onNextDateClick}>
          Next
        </Button>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Habits</Typography>
          {habitColumns.map((habit) => (
            <FormControl key={habit} fullWidth margin="normal">
              <InputLabel>{habit}</InputLabel>
              <Select
                value={formHabits[habit] || ""}
                onChange={(e) => onHabitChange(habit, e.target.value)}
                label={habit}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Metrics</Typography>
          {metricColumns.map((metric) => (
            <TextField
              key={metric}
              fullWidth
              margin="normal"
              label={metric}
              type="number"
              value={formMetrics[metric] || ""}
              onChange={(e) => onMetricChange(metric, e.target.value)}
            />
          ))}
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
      </Box>
    </div>
  );
} 