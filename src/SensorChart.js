import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parse, isAfter, isBefore, isValid } from 'date-fns';

const SensorChart = ({ title, data, dataKey, color, startDate, endDate }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-center">No data available for the selected range.</p>;
  }

  // Define Y-axis labels for different sensors
  const yAxisLabels = {
    temperature: 'Temperature (°C)',
    conductivity: 'Conductivity (µS/cm)',
    salinity: 'Salinity (ppt)',
    dissolved_solids: 'Total Dissolved Solids (mg/L)',
    dissolved_oxygen: 'Dissolved Oxygen (mg/L)',
  };

  // Convert the database timestamps into JavaScript Date objects and filter by selected range
  const filteredData = Object.keys(data)
    .map((timestamp) => {
      let entryDate = parse(timestamp, 'yyyy-MM-dd_HH-mm-ss', new Date()); // Ensure correct parsing
      if (!isValid(entryDate)) {
        console.warn("Invalid timestamp detected:", timestamp);
        return null; // Skip invalid timestamps
      }
      return {
        time: entryDate,
        [dataKey]: data[timestamp][dataKey],
      };
    })
    .filter(entry => entry !== null) // Remove invalid entries
    .filter(({ time }) => (!startDate || isAfter(time, startDate)) && (!endDate || isBefore(time, endDate)));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-Axis with label */}
        <XAxis
          dataKey="time"
          tickFormatter={(time) => (isValid(time) ? format(time, 'MMM d, HH:mm') : "")}
          tick={{ fontSize: 12 }}
          label={{ value: "Time", position: "insideBottom", offset: -5 }}
        />

        {/* Y-Axis with dynamic label */}
        <YAxis
          label={{ value: yAxisLabels[dataKey] || "Sensor Value", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
        />

        <Tooltip labelFormatter={(time) => (isValid(time) ? format(time, 'PPPpp') : "Invalid Date")} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;
