'use client';

import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/components/auth/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function ProfilePage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, router]);
  return (
    <div className="flex justify-center rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <ProfileForm />
    </div>
  );
}
