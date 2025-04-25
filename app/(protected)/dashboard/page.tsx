//dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { StatCardProps } from '@/components/dashboard/StatCard';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { Chart } from '@/components/dashboard/Chart';
import { DollarSign, Users, BarChart2, UserPlus, CreditCard, UserX } from 'lucide-react';
import { SkeletonChart } from '@/components/dashboard/SkeletonChart';
import { UserTypePie } from '@/components/dashboard/UserTypePie';
import { NewSignupsBar } from '@/components/dashboard/NewSignupsBar';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortableCard from '@/components/dashboard/SortableCard';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<null | {
    revenue: number;
    users: number;
    retention: number;
    signups: number;
    subscriptions: number;
    churn: number;
  }>(null);

  const [cards, setCards] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(
        localStorage.getItem('dashboard-cards') ||
          '["revenue","users","retention","signups","subscriptions","churn"]',
      );
    }
    return ['revenue', 'users', 'retention', 'signups', 'subscriptions', 'churn'];
  });

  const cardDetails: { [key: string]: StatCardProps } = {
    revenue: {
      title: 'Monthly Revenue',
      value: stats?.revenue || 0,
      unit: '$',
      icon: <DollarSign />,
      trend: 'up',
      trendValue: 15.2,
    },
    users: {
      title: 'Users',
      value: stats?.users || 0,
      icon: <Users />,
      trend: 'up',
      trendValue: 8.5,
    },
    retention: {
      title: 'Retention',
      value: stats?.retention || 0,
      unit: '%',
      icon: <BarChart2 />,
      trend: 'up',
      trendValue: 3.2,
    },
    signups: {
      title: 'New Signups',
      value: stats?.signups || 0,
      icon: <UserPlus />,
      trend: 'up',
      trendValue: 12.7,
    },
    subscriptions: {
      title: 'Active Subscriptions',
      value: stats?.subscriptions || 0,
      icon: <CreditCard />,
      trend: 'up',
      trendValue: 10.4,
    },
    churn: {
      title: 'Churn Rate',
      value: stats?.churn || 0,
      unit: '%',
      icon: <UserX />,
      trend: 'down',
      trendValue: 2.1,
    },
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newItems = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('dashboard-cards', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 md:p-10">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cards}>
          <div className="animate-fade-in grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {loading || !stats
              ? Array(cards.length)
                  .fill(null)
                  .map((_, idx) => <SkeletonCard key={idx} />)
              : cards.map((id) => (
                  <SortableCard key={id} id={id} stats={stats} details={cardDetails[id]} />
                ))}
          </div>
        </SortableContext>
      </DndContext>

      {loading ? (
        <SkeletonChart />
      ) : (
        <div className="animate-fade-in grid gap-4 md:grid-cols-2">
          <Chart />
          <UserTypePie />
          <NewSignupsBar />
        </div>
      )}
    </div>
  );
}
