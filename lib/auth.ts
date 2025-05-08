import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function getAuthenticatedUser(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token || !token.email) {
    throw new Error('Not authenticated');
  }
  return token; // Contains user info like email, role, etc.
}
