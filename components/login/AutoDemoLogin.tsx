'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function AutoDemoLogin() {
  const { status } = useSession();

  useEffect(() => {
    const disable = new URLSearchParams(window.location.search).get('noAuto');
    if (status === 'unauthenticated' && !disable) {
      // silently sign in with the demo account
      signIn('credentials', {
        email: 'demo@example.com',
        password: 'demo',
        callbackUrl: '/dashboard',
      });
    }
  }, [status]);

  return null;
}
