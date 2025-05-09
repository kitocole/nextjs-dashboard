import CountUp from 'react-countup';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: number;
}

export function StatCard({ title, value, unit, icon, trend, trendValue }: StatCardProps) {
  return (
    <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mr-3 flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
            <div className="text-gray-400 dark:text-gray-500">{icon}</div>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
        <CountUp end={value} duration={0.5} separator="," />
        {unit && (
          <span className="ml-1 text-base font-medium text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
      {trend && trendValue != null && (
        <div
          className={`mt-2 flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
          }`}
        >
          {trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span className="ml-1">{trendValue}%</span>
        </div>
      )}
    </div>
  );
}
