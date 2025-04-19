import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useSensorData from '../hooks/useSensorData'; // adjust path if needed

export default function WaterLevelGraph() {
  const data = useSensorData('water_level');

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">WATER LEVEL</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis
            label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
          />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
