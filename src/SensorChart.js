import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subWeeks, subMonths, subYears, isAfter, isBefore } from 'date-fns';

const SensorChart = ({ title, data, dataKey, color, timeRange, startDate, endDate }) => {
  const now = new Date();

  // Define Y-axis labels for different sensors
  const yAxisLabels = {
    temperature: 'Temperature (°C)',
    conductivity: 'Conductivity (µS/cm)',
    salinity: 'Salinity (ppt)',
    dissolved_solids: 'Total Dissolved Solids (mg/L)',
    dissolved_oxygen: 'Dissolved Oxygen (mg/L)',
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

  // Use user-selected start/end dates or default to time range selection
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
  
        // ✅ Fix: Allow both single-day and range selection
        if (startDate && endDate) {
          const startOfDay = new Date(startDate);
          startOfDay.setHours(0, 0, 0, 0);
  
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
  
          if (!(parsedDate >= startOfDay && parsedDate <= endOfDay)) {
            return null;
          }
        }
  
        return { time: parsedDate, [dataKey]: entry[dataKey] || 0 };
      })
      .filter((entry) => entry !== null);
  }, [data, dataKey, startDate, endDate]);
  

  console.log(`Processed Data for ${title}:`, chartData); // Debugging

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
