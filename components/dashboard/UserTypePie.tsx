// app/components/dashboard/UserTypePie.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Free Users', value: 400 },
  { name: 'Pro Users', value: 300 },
  { name: 'Business Users', value: 300 },
];

const COLORS = ['#6366F1', '#F59E0B', '#10B981'];

export function UserTypePie() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        User Types Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label={({ name, percent }) => `${name} - ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderColor: '#E5E7EB', // gray-200
            }}
            itemStyle={{
              color: '#111827', // gray-900
            }}
            wrapperStyle={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            // dark-mode overrides
            cursor={{ fill: 'rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
