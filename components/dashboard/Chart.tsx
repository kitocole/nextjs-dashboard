'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4780 },
  { name: 'May', revenue: 5890 },
  { name: 'Jun', revenue: 4390 },
];

export function Chart() {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Revenue Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
            itemStyle={{ color: '#f9fafb' }}
            cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
