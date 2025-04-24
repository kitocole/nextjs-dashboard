'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const data = [
  { month: 'Jan', signups: 400 },
  { month: 'Feb', signups: 300 },
  { month: 'Mar', signups: 500 },
  { month: 'Apr', signups: 600 },
  { month: 'May', signups: 700 },
  { month: 'Jun', signups: 500 },
];

export function NewSignupsBar() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        New Signups Per Month
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="signups" fill="#6366F1" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="signups" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
