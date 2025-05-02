import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let id: string;
  try {
    ({ id } = await params);
  } catch {
    return NextResponse.json({ error: 'Missing or invalid route parameter' }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // remove relations so Prisma only sees real columns
  delete body.accounts;
  delete body.sessions;

  try {
    const updated = await db.user.update({
      where: { id },
      data: body,
      include: { accounts: true },
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.error('PUT /api/users/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.error('DELETE /api/users/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
