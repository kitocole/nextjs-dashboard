// app/api/dashboard/layout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthenticatedUser(req);
    // Fetch user data from the database
    const user = await db.user.findUnique({
      where: { email: token.email ?? undefined },
      select: { dashboardCards: true, dashboardCharts: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getAuthenticatedUser(req);
    // Parse the request body
    const { dashboardCards, dashboardCharts } = await req.json();
    // Update user data in the database
    const updated = await db.user.update({
      where: { email: token.email ?? undefined },
      data: {
        dashboardCards,
        dashboardCharts,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
