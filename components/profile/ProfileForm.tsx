'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type FormData = {
  name: string;
  email: string;
  bio: string;
};

export function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      bio: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Profile Updated:', data);
    toast.success('Profile updated!');
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-xl space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div>
        <Label htmlFor="name" className="mb-2 text-gray-700 dark:text-gray-300">
          Name
        </Label>
        <Input id="name" {...register('name', { required: true })} />

        {errors.name && <p className="mt-1 text-sm text-red-500">Name is required</p>}
      </div>

      <div>
        <Label htmlFor="email" className="mb-2 text-gray-700 dark:text-gray-300">
          Email
        </Label>
        <Input id="email" type="email" {...register('email', { required: true })} />
        {errors.email && <p className="mt-1 text-sm text-red-500">Email is required</p>}
      </div>

      <div>
        <Label htmlFor="bio" className="mb-2 text-gray-700 dark:text-gray-300">
          Bio
        </Label>
        <Textarea id="bio" {...register('bio')} />{' '}
      </div>

      <Button type="submit" className="w-full">
        Update Profile
      </Button>
    </form>
  );
}
