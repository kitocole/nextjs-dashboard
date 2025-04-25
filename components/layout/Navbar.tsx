'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useNavbarSettings } from '@/components/layout/NavbarSettingsStore';
import { useEffect, useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const { enableShadow, enableAutoHide } = useNavbarSettings();

  // NextAuth hooks
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // scroll + hide logic stays the same
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (enableShadow) setScrolled(scrollTop > 10);
      if (enableAutoHide) {
        setHidden(scrollTop > lastScrollTop);
        setLastScrollTop(scrollTop);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableShadow, enableAutoHide, lastScrollTop]);

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between p-4 transition-all duration-300 ${scrolled ? 'shadow-md' : ''} ${hidden ? '-translate-y-full' : 'translate-y-0'} border-b border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)]`}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          Company Name
        </Link>
        <span
          className="cursor-pointer font-semibold"
          onClick={() => (isAuthenticated ? router.push('/7') : null)}
        >
          {isAuthenticated ? `Welcome, ${session?.user?.name?.split(' ')[0]}!` : 'Welcome'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Button
            className="cursor-pointer"
            variant="secondary"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            Dashboard
          </Button>
        )}
        {status === 'loading' ? (
          <Button disabled size="sm">
            ...
          </Button>
        ) : isAuthenticated ? (
          <Button size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
            Logout
          </Button>
        ) : (
          <Button size="sm" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}
