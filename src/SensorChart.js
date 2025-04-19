import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  subYears
} from 'date-fns';

const SensorChart = ({ title, data, dataKey, color, timeRange, startDate, endDate }) => {
  const now = new Date();

  // Define Y-axis labels for different sensors
  const yAxisLabels = {
    temperature: 'Temperature (°C)',
    conductivity: 'Conductivity (µS/cm)',
    salinity: 'Salinity (ppt)',
    dissolved_solids: 'Total Dissolved Solids (mg/L)',
    dissolved_oxygen: 'Dissolved Oxygen (mg/L)',
    water_level: 'Water Level (m)' // ✅ Updated to meters
  };

  // Get the default start date based on the selected range
  const defaultStartDate = useMemo(() => {
    switch (timeRange) {
      case 'Day': return subDays(now, 1);
      case 'Week': return subWeeks(now, 1);
      case 'Month': return subMonths(now, 1);
      case 'Year': return subYears(now, 1);
      default: return subDays(now, 1);
    }
  }, [timeRange]);

  // Final date range to apply (custom or default)
  const finalStartDate = startDate || defaultStartDate;
  const finalEndDate = endDate || now;

  // Optimize data processing with useMemo
  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return [];

    return Object.keys(data)
      .map((timestamp) => {
        const entry = data[timestamp];
        const parsedDate = new Date(entry.time);
        if (isNaN(parsedDate.getTime())) return null;

        // ✅ Filter by date range
        if (!(parsedDate >= finalStartDate && parsedDate <= finalEndDate)) return null;

        // ✅ Convert water level from cm to m
        const value = dataKey === 'water_level'
          ? (entry[dataKey] || 0) / 100
          : entry[dataKey] || 0;

        return { time: parsedDate, [dataKey]: value };
      })
      .filter((entry) => entry !== null);
  }, [data, dataKey, finalStartDate, finalEndDate]);

  console.log(`Processed Data for ${title}:`, chartData); // Debugging

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickFormatter={(time) => format(time, 'MMM d, HH:mm')}
          tick={{ fontSize: 12 }}
          label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
        />
        <YAxis
          label={{
            value: yAxisLabels[dataKey] || 'Sensor Value',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip labelFormatter={(time) => format(time, 'PPPpp')} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;
