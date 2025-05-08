// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await getAuthenticatedUser(req);

    // Fetch users from the database
    const users = await db.user.findMany({
      orderBy: { firstName: 'desc' },
      include: { accounts: true },
    });

    return NextResponse.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Validate the token
    await getAuthenticatedUser(req);

    // Parse the request body
    const { firstName, lastName, email, role } = await req.json();

    // Create a new user in the database
    const user = await db.user.create({
      data: { firstName, lastName, email, role, passwordHash: '' },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
