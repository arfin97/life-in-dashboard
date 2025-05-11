export interface TableRow {
  date: string;
  raw: Date;
  values: string[];
}

export interface Habits {
  [key: string]: string;
}

export interface Metrics {
  [key: string]: string;
}

export interface EditValues {
  habits: Habits;
  metrics: Metrics;
}

export interface ActivityData {
  date: Date;
  level: number;
  details: {
    habits: number;
    metrics: number;
  };
  rawData?: TableRow;
} 