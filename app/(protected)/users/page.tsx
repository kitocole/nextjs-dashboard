// app/(protected)/users/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/dashboard/DataTable';

type User = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const userColumns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
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
      {
        accessorKey: 'email',
        header: 'Email',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableColumnFilter: true,
      },
    ],
    [],
  );

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Users</h1>
      <DataTable<User> data={users} columns={userColumns} />
    </div>
  );
}
