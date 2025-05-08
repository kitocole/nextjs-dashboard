// app/(protected)/users/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/users/DataTable';
import UserModal, { User } from '@/components/users/UserModal';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<User>();

  // 1️⃣ Load users
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  // 2️⃣ Open modal & initialize form
  const openModal = useCallback(
    (user: User) => {
      setSelectedUser(user);
      reset(user);
      setIsModalOpen(true);
      setIsEditing(false);
    },
    [reset],
  );

  // 3️⃣ Save edits
  const onSave = async (data: User) => {
    if (!window.confirm('Save changes to this user?')) return;
    const res = await fetch(`/api/users/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      alert('Update failed');
      return;
    }
    const updated: User = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // 4️⃣ Delete user
  const onDelete = async () => {
    if (!selectedUser) return;
    if (
      !window.confirm(
        `Delete user ${selectedUser.firstName} ${selectedUser.lastName}? This cannot be undone.`,
      )
    )
      return;
    const res = await fetch(`/api/users/${selectedUser.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      alert('Delete failed');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // 5️⃣ Define columns (including ID)
  const columns: ColumnDef<User, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnFilter: true,
        cell: ({ row }) => (
          <button className="text-blue-600 hover:underline" onClick={() => openModal(row.original)}>
            {row.original.id}
          </button>
        ),
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
        cell: ({ getValue }) => getValue() ?? '—',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'suffix',
        header: 'Suffix',
        cell: ({ getValue }) => getValue() ?? '—',
        enableColumnFilter: true,
      },
      { accessorKey: 'email', header: 'Email', enableColumnFilter: true },
      { accessorKey: 'role', header: 'Role', enableColumnFilter: true },
      {
        header: 'Providers',
        accessorFn: (row) => row.accounts ?? [],
        cell: ({ getValue }) => {
          const accounts = getValue() as { provider: string }[];
          return accounts.length ? accounts.map((a) => a.provider).join(', ') : 'None';
        },
        enableColumnFilter: true,
      },
      {
        header: 'createdAt',
        accessorKey: 'createdAt',
        enableColumnFilter: true,
      },
    ],
    [openModal],
  );

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl">User Management</h1>
      <DataTable data={users} columns={columns} />

      <UserModal
        isOpen={isModalOpen}
        user={selectedUser}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        register={register}
        handleSubmit={handleSubmit}
        formState={formState}
        reset={reset}
        onSave={onSave}
        onDelete={onDelete}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
