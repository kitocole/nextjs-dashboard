// components/dashboard/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  RowData,
  ColumnFiltersState,
  VisibilityState,
  ColumnSizingState,
  PaginationState,
} from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Download } from 'lucide-react';
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';

// dynamically import CSVLink to avoid SSR hydration mismatch
const CSVLink = dynamic(() => import('react-csv').then((mod) => mod.CSVLink), { ssr: false });

export type DataTableProps<T extends RowData> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
};

export function DataTable<T extends RowData>({ data, columns }: DataTableProps<T>) {
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: { columnFilters, pagination, columnVisibility, columnSizing },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility(updater);
      setColumnSizing({}); // Optional: reset sizing when visibility changes
    },
    onColumnSizingChange: (updater) => {
      setColumnSizing((old) => {
        const newSizing = typeof updater === 'function' ? updater(old) : updater;

        const visibleColumns = table.getVisibleLeafColumns();
        const diff = Object.entries(newSizing).find(([id, size]) => {
          const oldSize = old[id] ?? table.getColumn(id)?.getSize() ?? 0;
          return size !== oldSize;
        });

        if (!diff) return newSizing;

        const [resizedId, newSize] = diff;
        const oldSize = old[resizedId] ?? table.getColumn(resizedId)?.getSize() ?? 0;
        const delta = newSize - oldSize;

        const resizedColumnIndex = visibleColumns.findIndex((c) => c.id === resizedId);
        if (resizedColumnIndex === -1 || resizedColumnIndex === visibleColumns.length - 1) {
          return newSizing;
        }

        const nextColumn = visibleColumns[resizedColumnIndex + 1];
        const nextId = nextColumn.id;
        const oldNextSize = old[nextId] ?? table.getColumn(nextId)?.getSize() ?? 0;
        const nextSize = Math.max(30, oldNextSize - delta);

        return {
          ...old,
          [resizedId]: newSize,
          [nextId]: nextSize,
        };
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  const pageCount = table.getPageCount();

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="font-medium">Columns:</span>
        {table.getAllLeafColumns().map((column) => (
          <label key={column.id} className="mr-3 inline-flex items-center">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={() => column.toggleVisibility()}
              className="mr-1"
            />
            {String(column.columnDef.header)}
          </label>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Menu as="div" className="relative">
            <MenuButton as={Button} variant="outline" size="sm">
              <Download size={16} />
            </MenuButton>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-20 mt-2 w-40 rounded border bg-white shadow-md dark:bg-gray-800">
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <CSVLink
                        data={memoizedData as object[]}
                        filename="export.csv"
                        className={`block px-4 py-2 text-sm ${
                          focus ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        Export CSV
                      </CSVLink>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
          <Button variant="outline" size="sm" onClick={() => setIsExpanded((e) => !e)}>
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>

      <div className={`overflow-auto ${isExpanded ? 'max-h-screen' : 'max-h-[600px]'}`}>
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {table.getVisibleLeafColumns().map((col) => (
              <col key={col.id} style={{ width: `${col.getSize()}px` }} />
            ))}
          </colgroup>

          <thead className="bg-background sticky top-0 z-10 dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="relative truncate px-4 py-2 text-left"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="ml-1">
                      {header.column.getIsSorted() === 'asc'
                        ? '🔼'
                        : header.column.getIsSorted() === 'desc'
                          ? '🔽'
                          : null}
                    </span>
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600 ${
                          header.column.getIsResizing() ? 'bg-gray-400' : ''
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th key={header.id} className="truncate px-4 py-1">
                  {header.column.getCanFilter() ? (
                    <Input
                      placeholder={`Filter ${String(header.column.id)}`}
                      value={(header.column.getFilterValue() as string) ?? ''}
                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                      className="w-full"
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="truncate px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>Page</span>
          <select
            value={pagination.pageIndex + 1}
            onChange={(e) => table.setPageIndex(Number(e.target.value) - 1)}
            className="rounded border bg-white px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          >
            {Array.from({ length: pageCount }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span>of {pageCount}</span>
          <span>| Rows per page:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded border bg-white px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
