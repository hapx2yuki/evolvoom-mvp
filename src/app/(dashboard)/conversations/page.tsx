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
  conversations,
  type Conversation,
  conversationStatusLabels,
  formatJPY,
  formatRelativeTime,
} from "@/lib/seed-data";

const statusVariants: Record<Conversation["status"], "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  resolved: "secondary",
  escalated: "destructive",
  pending: "outline",
};

const columns: ColumnDef<Conversation>[] = [
  {
    accessorKey: "customerName",
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
        href={`/conversations/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("customerName")}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.getValue("status") as Conversation["status"];
      return (
        <Badge variant={statusVariants[status]}>
          {conversationStatusLabels[status]}
        </Badge>
      );
    },
    filterFn: (row, _id, filterValue) => {
      if (!filterValue) return true;
      return row.getValue("status") === filterValue;
    },
  },
  {
    accessorKey: "cartAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        カート金額
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatJPY(row.getValue("cartAmount") as number),
  },
  {
    accessorKey: "isRecovered",
    header: "回収状況",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isRecovered") ? "default" : "outline"}>
        {row.getValue("isRecovered") ? "回収済み" : "未回収"}
      </Badge>
    ),
  },
  {
    accessorKey: "messages",
    header: "メッセージ数",
    cell: ({ row }) => {
      const messages = row.getValue("messages") as Conversation["messages"];
      return `${messages.length}件`;
    },
  },
  {
    accessorKey: "lastMessageAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        最終メッセージ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      formatRelativeTime(row.getValue("lastMessageAt") as string),
  },
];

export default function ConversationsPage() {
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
          { label: "会話モニター" },
        ]}
        title="会話モニター"
        description="AIが対応中の会話をリアルタイムで監視します"
      />
      <DataTable
        columns={columns}
        data={conversations}
        searchPlaceholder="顧客名で検索..."
        searchColumn="customerName"
        filterColumn="status"
        filterPlaceholder="ステータス"
        filterOptions={[
          { label: "対応中", value: "active" },
          { label: "解決済み", value: "resolved" },
          { label: "エスカレーション", value: "escalated" },
          { label: "保留中", value: "pending" },
        ]}
        isLoading={isLoading}
        emptyMessage="会話データがありません。"
      />
    </div>
  );
}
