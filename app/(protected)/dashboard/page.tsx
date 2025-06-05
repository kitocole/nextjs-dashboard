// app/dashboard/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { StatCardProps } from '@/components/dashboard/StatCard';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { Chart } from '@/components/dashboard/Chart';
import {
  DollarSign,
  Users as UsersIcon,
  BarChart2,
  UserPlus,
  CreditCard,
  UserX,
} from 'lucide-react';
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
import SortableChartItem from '@/components/dashboard/SortableChartItem';

export default function DashboardPage() {
  // --- Stats cards + DnD setup ---
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    revenue: number;
    users: number;
    retention: number;
    signups: number;
    subscriptions: number;
    churn: number;
  } | null>(null);

  const [cards, setCards] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(
        localStorage.getItem('dashboard-cards') ||
          '["revenue","users","retention","signups","subscriptions","churn"]',
      ) as string[];
    }
    return ['revenue', 'users', 'retention', 'signups', 'subscriptions', 'churn'];
  });

  // --- Charts DnD setup ---
  const [charts, setCharts] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(
        localStorage.getItem('dashboard-charts') || '["line","pie","bar"]',
      ) as string[];
    }
    return ['line', 'pie', 'bar'];
  });

  const cardDetails: Record<string, StatCardProps> = useMemo(
    () => ({
      revenue: {
        title: 'Monthly Revenue',
        value: stats?.revenue ?? 0,
        unit: '$',
        icon: <DollarSign />,
        trend: 'up',
        trendValue: 15.2,
      },
      users: {
        title: 'Users',
        value: stats?.users ?? 0,
        icon: <UsersIcon />,
        trend: 'up',
        trendValue: 8.5,
      },
      retention: {
        title: 'Retention',
        value: stats?.retention ?? 0,
        unit: '%',
        icon: <BarChart2 />,
        trend: 'up',
        trendValue: 3.2,
      },
      signups: {
        title: 'New Signups',
        value: stats?.signups ?? 0,
        icon: <UserPlus />,
        trend: 'up',
        trendValue: 12.7,
      },
      subscriptions: {
        title: 'Active Subscriptions',
        value: stats?.subscriptions ?? 0,
        icon: <CreditCard />,
        trend: 'up',
        trendValue: 10.4,
      },
      churn: {
        title: 'Churn Rate',
        value: stats?.churn ?? 0,
        unit: '%',
        icon: <UserX />,
        trend: 'down',
        trendValue: 2.1,
      },
    }),
    [stats],
  );

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // 1️⃣ Load layout from server, then localStorage fallback
  useEffect(() => {
    fetch('/api/dashboard/layout')
      .then((res) => res.json())
      .then((user) => {
        if (user.dashboardCards) setCards(user.dashboardCards);
        else if (typeof window !== 'undefined') {
          setCards(
            JSON.parse(
              localStorage.getItem('dashboard-cards') ||
                '["revenue","users","retention","signups","subscriptions","churn"]',
            ),
          );
        }
        if (user.dashboardCharts) setCharts(user.dashboardCharts);
        else if (typeof window !== 'undefined') {
          setCharts(JSON.parse(localStorage.getItem('dashboard-charts') || '["line","pie","bar"]'));
        }
      })
      .catch(() => {
        // fallback if API fails
        if (typeof window !== 'undefined') {
          setCards(
            JSON.parse(
              localStorage.getItem('dashboard-cards') ||
                '["revenue","users","retention","signups","subscriptions","churn"]',
            ),
          );
          setCharts(JSON.parse(localStorage.getItem('dashboard-charts') || '["line","pie","bar"]'));
        }
      });
  }, []);

  // 2️⃣ On drag end, update both localStorage & API
  const handleCardDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const reordered = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('dashboard-cards', JSON.stringify(reordered));
        // fire API update (no need to await UI)
        fetch('/api/dashboard/layout', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dashboardCards: reordered }),
        }).catch(console.error);
        return reordered;
      });
    }
  };

  const handleChartDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCharts((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const reordered = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('dashboard-charts', JSON.stringify(reordered));
        fetch('/api/dashboard/layout', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dashboardCharts: reordered }),
        }).catch(console.error);
        return reordered;
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Stat cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCardDragEnd}
      >
        <SortableContext items={cards}>
          <div className="animate-fade-in grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {loading || !stats
              ? cards.map((_, i) => <SkeletonCard key={i} />)
              : cards.map((id) => (
                  <SortableCard key={id} id={id} stats={stats} details={cardDetails[id]} />
                ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Charts */}
      {loading ? (
        <SkeletonChart />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleChartDragEnd}
        >
          <SortableContext items={charts}>
            <div className="animate-fade-in grid gap-6 md:grid-cols-2">
              {charts.map((id) => (
                <SortableChartItem key={id} id={id}>
                  {
                    {
                      line: <Chart />,
                      pie: <UserTypePie />,
                      bar: <NewSignupsBar />,
                    }[id]
                  }
                </SortableChartItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// Sortable wrapper for chart components with drag-handle
