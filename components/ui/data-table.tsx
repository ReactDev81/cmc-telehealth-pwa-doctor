"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];

  loading?: boolean;

  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;

  enableSearch?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  pageCount = 1,
  currentPage = 1,
  onPageChange,
  enableSearch = true,
  searchValue = "",
  onSearch,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < pageCount;

  return (
    <div className="space-y-4">
      {/* Search */}
      {enableSearch && (
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white [&_td]:border-b [&_th]:border-b">
        <Table className="w-full text-sm">
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 text-sm font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  <Loader2 className="animate-spin mx-auto h-5 w-5" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={!canPreviousPage || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {pageCount}
        </p>

        <Button
          variant="outline"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={!canNextPage || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}