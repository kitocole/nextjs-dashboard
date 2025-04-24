'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNavbarSettings } from '@/components/layout/NavbarSettingsStore';
import Link from 'next/link';

export function Navbar() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const router = useRouter();
  const { enableShadow, enableAutoHide } = useNavbarSettings();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (enableShadow) {
        setScrolled(scrollTop > 10);
      }

      if (enableAutoHide) {
        if (scrollTop > lastScrollTop) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        setLastScrollTop(scrollTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableShadow, enableAutoHide, lastScrollTop]);

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between p-4 transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      } ${hidden ? '-translate-y-full' : 'translate-y-0'} border-b border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)]`}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="pr-20 text-xl font-bold">
          Company Name
        </Link>
        <div className="cursor-pointer text-lg font-semibold" onClick={() => router.push('/')}>
          {isLoggedIn && user ? `Welcome, ${user}!` : 'Welcome'}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <Button onClick={login}>Login</Button>
        )}
      </div>
    </div>
  );
}
