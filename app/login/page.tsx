// app/login/page.tsx

// Opt into dynamic (no static prerender)
export const dynamic = 'force-dynamic';

import LoginPageClient from '@/components/LoginPageClient';

export default async function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  // Await the promise before reading .error
  const { error } = await searchParams;
  return <LoginPageClient initialError={error ?? ''} />;
}
