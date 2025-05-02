// components/users/UserModal.tsx
'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import { UseFormRegister, UseFormHandleSubmit, FormState, UseFormReset } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { X as CloseIcon } from 'lucide-react';

type Account = { provider: string };
export type User = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  email?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  accounts: Account[];
};

interface UserModalProps {
  isOpen: boolean;
  user: User | null;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  register: UseFormRegister<User>;
  handleSubmit: UseFormHandleSubmit<User>;
  formState: FormState<User>;
  reset: UseFormReset<User>;
  onSave: (data: User) => void;
  onDelete: () => void;
  onClose: () => void;
}

const UserModal: FC<UserModalProps> = ({
  isOpen,
  user,
  isEditing,
  setIsEditing,
  register,
  handleSubmit,
  formState,
  reset,
  onSave,
  onDelete,
  onClose,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <CloseIcon size={20} />
        </button>

        <h2 className="mb-4 text-2xl">Edit User</h2>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <input type="hidden" {...register('id')} />

          {[
            { name: 'firstName', label: 'First Name' },
            { name: 'middleName', label: 'Middle Name' },
            { name: 'lastName', label: 'Last Name' },
            { name: 'suffix', label: 'Suffix' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'role', label: 'Role', type: 'select', options: ['User', 'Admin'] },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded border px-2 py-1"
                  {...register(field.name as keyof User)}
                >
                  {field.options!.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? 'text'}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded border px-2 py-1"
                  {...register(field.name as keyof User)}
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium">OAuth Providers</label>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {(user.accounts ?? []).length > 0
                ? user.accounts.map((a) => a.provider).join(', ')
                : 'None'}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {!isEditing ? (
              <Button type="button" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    reset(user);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={formState.isSubmitting}>
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
