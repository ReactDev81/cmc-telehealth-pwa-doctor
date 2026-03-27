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
import { Loader2, X } from "lucide-react";
import PaginationControls from "@/components/pagination/PaginationControls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  label: string;
  value: string;
}

export interface DataTableFilter {
  column: string;
  label: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];

  loading?: boolean;

  pageCount?: number;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;

  enableSearch?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;

  filters?: DataTableFilter[];
  onClearFilters?: () => void;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  pageCount = 1,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  enableSearch = true,
  searchValue = "",
  onSearch,
  filters = [],
  onClearFilters,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });


  return (
    <div className="space-y-4">
      {/* Toolbar: Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {enableSearch && (
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              className="h-8"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.column}
              value={filter.value || "all"}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="h-8 w-fit min-w-[130px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {onClearFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="h-8 px-2 lg:px-3 text-muted-foreground"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

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
      {onPageChange && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={pageCount}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}

    </div>
  );
}