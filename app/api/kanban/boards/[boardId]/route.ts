import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const boardId = req.url.split('/').pop()!;
  const board = await db.kanbanBoard.findUnique({
    where: { id: boardId },
    include: { columns: { include: { cards: true } } },
  });
  return NextResponse.json(board);
}

export async function PUT(req: NextRequest) {
  const boardId = req.url.split('/').pop()!;
  const { title } = await req.json();
  const board = await db.kanbanBoard.update({
    where: { id: boardId },
    data: { title },
  });
  return NextResponse.json(board);
}

export async function DELETE(req: NextRequest) {
  const boardId = req.url.split('/').pop()!;
  await db.kanbanBoard.delete({
    where: { id: boardId },
  });
  return NextResponse.json({ message: 'Board deleted' });
}
