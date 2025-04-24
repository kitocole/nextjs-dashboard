import { GripVertical } from 'lucide-react';
import { StatCard, StatCardProps } from './StatCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableCard({
  id,
  stats,
  details,
}: {
  id: string;
  stats: {
    revenue: number;
    users: number;
    retention: number;
    signups: number;
    subscriptions: number;
    churn: number;
  };
  details: StatCardProps;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle button */}
      <button
        {...listeners}
        {...attributes}
        className="absolute top-2 right-2 z-10 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <StatCard
        title={details.title}
        value={stats[id as keyof typeof stats]}
        unit={details.unit}
        icon={details.icon}
        trend={details.trend}
        trendValue={details.trendValue}
      />
    </div>
  );
}
