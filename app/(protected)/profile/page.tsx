import { ProfileForm } from '@/components/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="flex justify-center rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <ProfileForm />
    </div>
  );
}
