import { useSortable } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

export default function SortableChartItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative' as const,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <GripVertical
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      />
      {children}
    </div>
  );
}
