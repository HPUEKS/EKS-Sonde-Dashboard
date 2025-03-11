import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subWeeks, subMonths, subYears, isAfter } from 'date-fns';

const SensorChart = ({ title, data, dataKey, color, timeRange }) => {
  const now = new Date();

  // Define Y-axis labels for different sensors
  const yAxisLabels = {
    temperature: 'Temperature (°C)',
    conductivity: 'Conductivity (µS/cm)',
    salinity: 'Salinity (ppt)',
    dissolved_solids: 'Total Dissolved Solids (mg/L)',
    dissolved_oxygen: 'Dissolved Oxygen (mg/L)',
  };

  // Get the appropriate start date based on the selected range
  const startDate = useMemo(() => {
    switch (timeRange) {
      case 'Day': return subDays(now, 1);
      case 'Week': return subWeeks(now, 1);
      case 'Month': return subMonths(now, 1);
      case 'Year': return subYears(now, 1);
      default: return subDays(now, 1);
    }
  }, [timeRange]);

  // ✅ Optimize data processing with useMemo
  const chartData = useMemo(() => {
    return Object.keys(data)
      .map((timestamp) => {
        const entry = data[timestamp];

        // ✅ Ensure time exists and is a valid date
        let parsedDate;
        if (typeof entry.time === "string") {
          parsedDate = new Date(entry.time); // Convert string to Date
        } else if (entry.time instanceof Date) {
          parsedDate = entry.time; // Already a Date object
        } else {
          console.error("❌ Invalid time format:", entry.time);
          return null; // Skip invalid data points
        }

        return {
          time: parsedDate,
          [dataKey]: entry[dataKey] || 0, // Handle missing values
        };
      })
      .filter((entry) => entry !== null && isAfter(entry.time, startDate)); // ✅ Remove invalid entries
  }, [data, dataKey, startDate]);

  console.log(`📊 Processed Data for ${title}:`, chartData); // Debugging

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-Axis with label */}
        <XAxis
          dataKey="time"
          tickFormatter={(time) => format(time, 'MMM d, HH:mm')}
          tick={{ fontSize: 12 }}
          label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
        />

        {/* Y-Axis with dynamic label */}
        <YAxis
          label={{ 
            value: yAxisLabels[dataKey] || 'Sensor Value', 
            angle: -90, 
            position: 'insideLeft', 
            style: { textAnchor: 'middle' } 
          }}
        />

        <Tooltip labelFormatter={(time) => format(time, 'PPPpp')} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;
