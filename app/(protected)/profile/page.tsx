//app/(protected)/profile/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type FormData = {
  name: string;
  email: string;
  bio: string;
};

// Utility function to construct the name dynamically
const constructName = (
  name: string | null | undefined,
  firstName: string | null | undefined,
  middleName: string | null | undefined,
  lastName: string | null | undefined,
  suffix: string | null | undefined,
) => {
  if (name) return name;
  const fullName = [firstName, middleName, lastName, suffix ? `(${suffix})` : null]
    .filter(Boolean)
    .join(' ');
  return fullName || 'N/A';
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      bio: 'This is your bio. You can edit it to add more details about yourself.',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate an API call to update user info
      console.log('Updated Profile:', data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  const displayName = constructName(
    session?.user?.name,
    session?.user?.firstName,
    session?.user?.middleName,
    session?.user?.lastName,
    session?.user?.suffix,
  );

  return (
    <div className="flex justify-center p-10">
      <div className="w-full max-w-3xl rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Your Profile</h1>

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Name</Label>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Email</Label>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {session?.user?.email || 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Bio</Label>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                This is your bio. You can edit it to add more details about yourself.
              </p>
            </div>
            <Button onClick={() => setIsEditing(true)} className="mt-4">
              Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input id="name" {...register('name', { required: true })} />
              {formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">Name is required</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input id="email" type="email" {...register('email', { required: true })} />
              {formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">Email is required</p>
              )}
            </div>
            <div>
              <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                Bio
              </Label>
              <Input id="bio" {...register('bio')} />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
