// File: app/api/kanban/columns/[columnId]/route.ts
import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ columnId: string }> },
) {
  const { columnId } = await params;
  const { title, order } = await req.json();

  const column = await db.kanbanColumn.update({
    where: { id: columnId },
    data: { title, order },
  });

  return NextResponse.json(column);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ columnId: string }> },
) {
  const { columnId } = await params;

  await db.kanbanColumn.delete({
    where: { id: columnId },
  });

  return NextResponse.json({ message: 'Column deleted' });
}
