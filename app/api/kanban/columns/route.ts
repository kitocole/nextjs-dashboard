// File: app/api/kanban/columns/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { title, order, boardId } = await req.json();
  const column = await db.kanbanColumn.create({
    data: { title, order, boardId },
  });
  return NextResponse.json(column);
}
