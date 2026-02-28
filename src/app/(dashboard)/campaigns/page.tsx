"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import {
  campaigns,
  type Campaign,
  campaignStatusLabels,
  campaignTypeLabels,
  formatJPY,
  formatDate,
} from "@/lib/seed-data";

const statusVariants: Record<Campaign["status"], "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  paused: "secondary",
  draft: "outline",
  completed: "secondary",
};

const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        キャンペーン名
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        href={`/campaigns/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.getValue("status") as Campaign["status"];
      return (
        <Badge variant={statusVariants[status]}>
          {campaignStatusLabels[status]}
        </Badge>
      );
    },
    filterFn: (row, _id, filterValue) => {
      if (!filterValue) return true;
      return row.getValue("status") === filterValue;
    },
  },
  {
    accessorKey: "type",
    header: "タイプ",
    cell: ({ row }) => campaignTypeLabels[row.getValue("type") as Campaign["type"]],
  },
  {
    accessorKey: "recoveryRate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        回収率
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${row.getValue("recoveryRate")}%`,
  },
  {
    accessorKey: "recoveredAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        回収金額
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatJPY(row.getValue("recoveredAmount") as number),
  },
  {
    accessorKey: "sentCount",
    header: "送信数",
    cell: ({ row }) =>
      (row.getValue("sentCount") as number).toLocaleString("ja-JP"),
  },
  {
    accessorKey: "startDate",
    header: "開始日",
    cell: ({ row }) => formatDate(row.getValue("startDate") as string),
  },
];

export default function CampaignsPage() {
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
          { label: "キャンペーン" },
        ]}
        title="キャンペーン管理"
        description="カート回収キャンペーンの作成・管理を行います"
        action={
          <Button asChild>
            <Link href="/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              新規キャンペーン
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={campaigns}
        searchPlaceholder="キャンペーン名で検索..."
        searchColumn="name"
        filterColumn="status"
        filterPlaceholder="ステータス"
        filterOptions={[
          { label: "実行中", value: "active" },
          { label: "一時停止", value: "paused" },
          { label: "下書き", value: "draft" },
          { label: "完了", value: "completed" },
        ]}
        isLoading={isLoading}
        emptyMessage="キャンペーンがありません。"
        emptyAction={
          <Button asChild size="sm">
            <Link href="/campaigns/new">最初のキャンペーンを作成</Link>
          </Button>
        }
      />
    </div>
  );
}
