// File: app/api/kanban/cards/[cardId]/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { cardId: string } }) {
  const { content, order, columnId } = await req.json();
  const card = await db.kanbanCard.update({
    where: { id: params.cardId },
    data: { content, order, columnId },
  });
  return NextResponse.json(card);
}

export async function DELETE(_: Request, { params }: { params: { cardId: string } }) {
  await db.kanbanCard.delete({ where: { id: params.cardId } });
  return NextResponse.json({ message: 'Card deleted' });
}
