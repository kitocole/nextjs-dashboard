// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  // Query all users, ordered by creation date
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}
