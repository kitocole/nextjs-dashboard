import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      message: 'New user signed up!',
      time: '2 minutes ago',
    },
    {
      id: 2,
      message: 'Server restarted successfully.',
      time: '10 minutes ago',
    },
    {
      id: 3,
      message: 'New payment received.',
      time: '30 minutes ago',
    },
    {
      id: 4,
      message: 'Database backup completed.',
      time: '1 hour ago',
    },
  ]);
}
