'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { toast } from 'sonner'; // If you want a nice toast instead of alert()
import { useNavbarSettings } from '@/components/layout/NavbarSettingsStore';

type FormData = {
  email: string;
  password: string;
};

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { enableShadow, enableAutoHide, setEnableShadow, setEnableAutoHide } = useNavbarSettings();

  const onSubmit = (data: FormData) => {
    console.log('Settings updated:', data);
    toast.success('Settings saved!'); // or alert if you don't use toast
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      {/* Form box */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >
        {/* Email and Password section */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Change Email</Label>
            <Input id="email" {...register('email')} />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password">Change Password</Label>
            <Input id="password" type="password" {...register('password')} />
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" className="w-32">
            Save Changes
          </Button>
        </div>
        {/* Divider */}
        <div className="my-6 h-px w-full bg-gray-200 dark:bg-gray-700" />

        {/* Preferences Section */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
          <ThemeToggle /> {/* NOT part of form state */}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Navbar Shadow on Scroll
            </span>
            <input
              type="checkbox"
              checked={enableShadow}
              onChange={(e) => setEnableShadow(e.target.checked)}
              className="accent-primary h-5 w-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-Hide Navbar
            </span>
            <input
              type="checkbox"
              checked={enableAutoHide}
              onChange={(e) => setEnableAutoHide(e.target.checked)}
              className="accent-primary h-5 w-5"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
