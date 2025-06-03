// File: app/api/kanban/boards/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const boards = await db.kanbanBoard.findMany({
    include: {
      columns: {
        include: {
          cards: true,
        },
      },
    },
  });
  return NextResponse.json(boards);
}

export async function POST(req: Request) {
  const { title, ownerId } = await req.json();
  const board = await db.kanbanBoard.create({
    data: { title, ownerId },
  });
  return NextResponse.json(board);
}
