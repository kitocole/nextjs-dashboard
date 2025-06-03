// File: app/api/kanban/columns/[columnId]/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { columnId: string } }) {
  const { title, order } = await req.json();
  const column = await db.kanbanColumn.update({
    where: { id: params.columnId },
    data: { title, order },
  });
  return NextResponse.json(column);
}

export async function DELETE(_: Request, { params }: { params: { columnId: string } }) {
  await db.kanbanColumn.delete({ where: { id: params.columnId } });
  return NextResponse.json({ message: 'Column deleted' });
}
