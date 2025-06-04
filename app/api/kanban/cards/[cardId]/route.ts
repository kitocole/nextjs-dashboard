import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const cardId = req.nextUrl.pathname.split('/').pop()!;
  const { content, order, columnId } = await req.json();

  const card = await db.kanbanCard.update({
    where: { id: cardId },
    data: { content, order, columnId },
  });

  return NextResponse.json(card);
}

export async function DELETE(req: NextRequest) {
  const cardId = req.nextUrl.pathname.split('/').pop()!;

  await db.kanbanCard.delete({
    where: { id: cardId },
  });

  return NextResponse.json({ message: 'Card deleted' });
}
