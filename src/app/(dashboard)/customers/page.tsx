"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  customers,
  type Customer,
  customerStatusLabels,
  formatJPY,
  formatRelativeTime,
} from "@/lib/seed-data";

const statusVariants: Record<Customer["status"], "default" | "secondary" | "destructive"> = {
  active: "default",
  inactive: "secondary",
  blocked: "destructive",
};

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        顧客名
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        href={`/customers/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "company",
    header: "会社名",
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.getValue("status") as Customer["status"];
      return (
        <Badge variant={statusVariants[status]}>
          {customerStatusLabels[status]}
        </Badge>
      );
    },
    filterFn: (row, _id, filterValue) => {
      if (!filterValue) return true;
      return row.getValue("status") === filterValue;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        累計金額
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatJPY(row.getValue("totalAmount") as number),
  },
  {
    accessorKey: "totalPurchases",
    header: "購入回数",
    cell: ({ row }) => `${row.getValue("totalPurchases")}回`,
  },
  {
    accessorKey: "cartAbandons",
    header: "カゴ落ち",
    cell: ({ row }) => `${row.getValue("cartAbandons")}回`,
  },
  {
    accessorKey: "recoveredCarts",
    header: "回収数",
    cell: ({ row }) => `${row.getValue("recoveredCarts")}回`,
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        最終活動
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      formatRelativeTime(row.getValue("lastActivity") as string),
  },
];

export default function CustomersPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "ダッシュボード", href: "/" },
          { label: "顧客管理" },
        ]}
        title="顧客管理"
        description="顧客情報とカート回収履歴を管理します"
      />
      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="顧客名で検索..."
        searchColumn="name"
        filterColumn="status"
        filterPlaceholder="ステータス"
        filterOptions={[
          { label: "アクティブ", value: "active" },
          { label: "非アクティブ", value: "inactive" },
          { label: "ブロック済み", value: "blocked" },
        ]}
        isLoading={isLoading}
        emptyMessage="顧客データがありません。"
      />
    </div>
  );
}
