'use client';

import { useEffect, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AutoDemoLogin() {
  const { status } = useSession();
  const router = useRouter();
  const tried = useRef(false);

  useEffect(() => {
    const disable = new URLSearchParams(window.location.search).get('noAuto');
    if (status === 'unauthenticated' && !disable && !tried.current) {
      tried.current = true;
      signIn('credentials', {
        email: 'editor@example.com',
        password: 'changeme',
        redirect: false,
      }).then((res) => {
        if (!res?.error) {
          router.replace('/dashboard');
        }
      });
    }
  }, [status, router]);

  return null;
}
