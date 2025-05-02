// app/api/dashboard/layout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { db } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { dashboardCards: true, dashboardCharts: true },
  });
  return NextResponse.json(user);
}
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { dashboardCards, dashboardCharts } = await req.json();
  const updated = await db.user.update({
    where: { email: session.user.email },
    data: {
      dashboardCards,
      dashboardCharts,
    },
  });
  return NextResponse.json(updated);
}
