// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { accounts: true },
  });
  return NextResponse.json(users);
}
export async function POST(request: Request) {
  const { firstName, lastName, email, role } = await request.json();
  const user = await db.user.create({
    data: { firstName, lastName, email, role, passwordHash: '' },
  });
  return NextResponse.json(user, { status: 201 });
}
