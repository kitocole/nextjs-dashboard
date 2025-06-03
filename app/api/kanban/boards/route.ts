// File: app/api/kanban/boards/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const boards = await db.kanbanBoard.findMany({
    where: { ownerId: session.user.id },
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
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title } = await req.json();

  const board = await db.kanbanBoard.create({
    data: {
      title,
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(board);
}
