//app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, middleName, lastName, suffix, email, password } = body;

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      firstName,
      middleName,
      lastName,
      suffix,
      role: 'USER',
      passwordHash,
    },
  });

  return NextResponse.json(user);
}
