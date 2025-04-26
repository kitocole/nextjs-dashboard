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
  PaginationState,
  ColumnFiltersState,
  VisibilityState,
  ColumnSizingState,
  RowData,
} from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// dynamically import CSVLink to avoid SSR hydration mismatch
const CSVLink = dynamic(() => import('react-csv').then((mod) => mod.CSVLink), { ssr: false });

export type DataTableProps<T extends RowData> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
};

export function DataTable<T extends RowData>({ data, columns }: DataTableProps<T>) {
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  // Table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: { columnFilters, pagination, columnVisibility, columnSizing },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  const pageCount = table.getPageCount();

  return (
    <div className="w-full overflow-auto">
      {/* Column visibility toggles */}
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
        {/* CSV export (client-only) */}
        <CSVLink
          data={memoizedData as unknown as object[]}
          filename="export.csv"
          className="ml-auto text-sm font-medium underline"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Table wrapper with fixed header and scrollable body */}
      <div className="max-h-[400px] overflow-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-background sticky top-0 z-10 dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="relative cursor-pointer px-4 py-2 text-left"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="ml-1">
                      {header.column.getIsSorted() === 'asc'
                        ? '🔼'
                        : header.column.getIsSorted() === 'desc'
                          ? '🔽'
                          : ''}
                    </span>
                    {/* Resize handle */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
            {/* Filter row */}
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th key={header.id} className="px-4 py-1">
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
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
        </div>
      </div>
    </div>
  );
}
