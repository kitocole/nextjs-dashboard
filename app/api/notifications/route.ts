import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      message: 'New user signed up!',
      createdAt: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'Server restarted successfully.',
      createdAt: '10 minutes ago',
      read: false,
    },
    {
      id: 3,
      message: 'New payment received.',
      createdAt: '30 minutes ago',
      read: false,
    },
    {
      id: 4,
      message: 'Database backup completed.',
      createdAt: '1 hour ago',
      read: false,
    },
    {
      id: 5,
      message: 'System update available.',
      createdAt: '2 hours ago',
      read: false,
    },
  ]);
}
