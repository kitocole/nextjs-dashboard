// File: app/api/kanban/cards/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { content, order, columnId } = await req.json();
  const card = await db.kanbanCard.create({
    data: { content, order, columnId },
  });
  return NextResponse.json(card);
}
