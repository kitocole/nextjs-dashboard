// app/login/page.tsx

// Opt into dynamic (no static prerender)
export const dynamic = 'force-dynamic';

import LoginPageClient from '@/components/login/LoginPageClient';

export default async function LoginPage({
  searchParams,
}: {
  // Next.js 15+ passes searchParams as a Promise you must await
  searchParams: Promise<{ error?: string }>;
}) {
  // wait for the URL params to resolve
  const { error } = await searchParams;
  return <LoginPageClient initialError={error ?? ''} />;
}
