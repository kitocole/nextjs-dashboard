import { NextResponse } from 'next/server';

export async function GET() {
  const baseRevenue = 12430;
  const baseUsers = 1234;
  const baseRetention = 88;
  const baseNewSignups = 523;
  const baseActiveSubscriptions = 1025;
  const baseChurnRate = 4.2;

  return NextResponse.json({
    revenue: baseRevenue + Math.floor(Math.random() * 500 - 250), // +/- 250 dollars
    users: baseUsers + Math.floor(Math.random() * 100 - 50), // +/- 50 users
    retention: baseRetention + Math.floor(Math.random() * 5 - 2), // +/- 2%
    signups: baseNewSignups + Math.floor(Math.random() * 50 - 25), // +/- 25
    subscriptions: baseActiveSubscriptions + Math.floor(Math.random() * 50 - 25), // +/- 25
    churn: parseFloat((baseChurnRate + (Math.random() * 1 - 0.5)).toFixed(1)), // +/- 0.5%
  });
}
