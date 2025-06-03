// File: app/api/kanban/boards/[boardId]/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { boardId: string } }) {
  const board = await db.kanbanBoard.findUnique({
    where: { id: params.boardId },
    include: { columns: { include: { cards: true } } },
  });
  return NextResponse.json(board);
}

export async function PUT(req: Request, { params }: { params: { boardId: string } }) {
  const { title } = await req.json();
  const board = await db.kanbanBoard.update({
    where: { id: params.boardId },
    data: { title },
  });
  return NextResponse.json(board);
}

export async function DELETE(_: Request, { params }: { params: { boardId: string } }) {
  await db.kanbanBoard.delete({ where: { id: params.boardId } });
  return NextResponse.json({ message: 'Board deleted' });
}
