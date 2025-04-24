'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
      toast.success('Welcome back!');
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-100">Login</h1>
      <Button variant="default" onClick={handleLogin} disabled={loading}>
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in...
          </div>
        ) : (
          'Log In'
        )}
      </Button>
    </div>
  );
}
