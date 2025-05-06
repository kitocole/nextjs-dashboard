'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortableCard from '@/components/dashboard/SortableCard';
import SortableChartItem from '@/components/dashboard/SortableChartItem';

type FormValues = {
  dashboardCards: string[];
  dashboardCharts: string[];
};

const DEFAULT_CARDS = ['revenue', 'users', 'retention', 'signups', 'subscriptions', 'churn'];
const DEFAULT_CHARTS = ['line', 'pie', 'bar'];

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      dashboardCards: DEFAULT_CARDS,
      dashboardCharts: DEFAULT_CHARTS,
    },
  });

  const cards = watch('dashboardCards');
  const charts = watch('dashboardCharts');

  // sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // load initial order from localStorage
  useEffect(() => {
    const storedCards = localStorage.getItem('dashboard-cards');
    const storedCharts = localStorage.getItem('dashboard-charts');

    reset({
      dashboardCards: storedCards ? JSON.parse(storedCards) : DEFAULT_CARDS,
      dashboardCharts: storedCharts ? JSON.parse(storedCharts) : DEFAULT_CHARTS,
    });
  }, [reset]);

  // handle cards drag end
  const handleCardsDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over || active.id === over.id) return;

      const oldIndex = cards.indexOf(active.id as string);
      const newIndex = cards.indexOf(over.id as string);
      const reordered = arrayMove(cards, oldIndex, newIndex);

      setValue('dashboardCards', reordered);
      localStorage.setItem('dashboard-cards', JSON.stringify(reordered));
    },
    [cards, setValue],
  );

  // handle charts drag end
  const handleChartsDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over || active.id === over.id) return;

      const oldIndex = charts.indexOf(active.id as string);
      const newIndex = charts.indexOf(over.id as string);
      const reordered = arrayMove(charts, oldIndex, newIndex);

      setValue('dashboardCharts', reordered);
      localStorage.setItem('dashboard-charts', JSON.stringify(reordered));
    },
    [charts, setValue],
  );

  // save handler (could also PUT to your API here)
  const onSubmit = async (data: FormValues) => {
    // example: send to server
    await fetch('/api/dashboard/layout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dashboardCards: data.dashboardCards,
        dashboardCharts: data.dashboardCharts,
      }),
    });
    alert('Settings saved!');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Theme toggle */}
      <div className="flex items-center justify-between">
        <span>Dark Mode</span>
        <ThemeToggle />
      </div>

      {/* Card ordering */}
      <div>
        <h2 className="mb-2 text-lg font-medium">Dashboard Cards</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCardsDragEnd}
        >
          <SortableContext items={cards}>
            <div className="grid grid-cols-2 gap-4">
              {cards.map((id) => (
                <SortableCard
                  key={id}
                  id={id}
                  stats={{
                    revenue: 0,
                    users: 0,
                    retention: 0,
                    signups: 0,
                    subscriptions: 0,
                    churn: 0,
                  }}
                  details={{ title: id, value: 0, icon: null }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      {/* Chart ordering */}
      <div>
        <h2 className="mb-2 text-lg font-medium">Dashboard Charts</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleChartsDragEnd}
        >
          <SortableContext items={charts}>
            <div className="grid grid-cols-3 gap-4">
              {charts.map((id) => (
                <SortableChartItem key={id} id={id}>
                  {
                    {
                      line: <div className="h-24 w-full bg-gray-200 dark:bg-gray-800" />,
                      pie: <div className="h-24 w-full bg-gray-200 dark:bg-gray-800" />,
                      bar: <div className="h-24 w-full bg-gray-200 dark:bg-gray-800" />,
                    }[id]
                  }
                </SortableChartItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden inputs so RHF captures them */}
        <input type="hidden" {...register('dashboardCards')} />
        <input type="hidden" {...register('dashboardCharts')} />

        {/* Save button */}
        <Button type="submit" disabled={isSubmitting}>
          Save Settings
        </Button>
      </form>
    </div>
  );
}
