"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  AlertCircle,
  Mail,
  MessageSquare,
  Building2,
  ShoppingBag,
  ShoppingCart,
  RefreshCcw,
  Ban,
} from "lucide-react";
import {
  customers,
  segments,
  conversations,
  customerStatusLabels,
  formatJPY,
  formatDate,
  formatRelativeTime,
  conversationStatusLabels,
} from "@/lib/seed-data";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);

  const customer = customers.find((c) => c.id === id);
  const customerConversations = conversations.filter(
    (c) => c.customerId === id
  );
  const customerSegments = customer
    ? segments.filter((s) => customer.segmentIds.includes(s.id))
    : [];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>顧客が見つかりません。</AlertDescription>
        </Alert>
      </div>
    );
  }

  const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    active: "default",
    inactive: "secondary",
    blocked: "destructive",
  };

  const handleBlock = () => {
    toast.success("顧客をブロックしました");
  };

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "ダッシュボード", href: "/" },
          { label: "顧客管理", href: "/customers" },
          { label: customer.name },
        ]}
        title={customer.name}
        action={
          customer.status !== "blocked" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Ban className="mr-2 h-4 w-4" />
                  ブロック
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {customer.name}様をブロックしますか？
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ブロックすると、この顧客へのメッセージ送信が停止されます。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBlock}>
                    ブロックする
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : undefined
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ステータス</span>
              <Badge variant={statusVariant[customer.status]}>
                {customerStatusLabels[customer.status]}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{customer.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                LINE: {customer.lineId}
              </span>
            </div>
            <Separator />
            <div>
              <span className="text-muted-foreground">セグメント</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {customerSegments.map((seg) => (
                  <Badge key={seg.id} variant="secondary" className="text-xs">
                    {seg.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">登録日</span>
              <span>{formatDate(customer.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">最終活動</span>
              <span>{formatRelativeTime(customer.lastActivity)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">購入統計</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">累計購入回数</p>
                <p className="text-lg font-bold">
                  {customer.totalPurchases}回
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">累計購入金額</p>
                <p className="text-lg font-bold">
                  {formatJPY(customer.totalAmount)}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <RefreshCcw className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  カゴ落ち / 回収
                </p>
                <p className="text-lg font-bold">
                  {customer.cartAbandons}回 / {customer.recoveredCarts}回
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近の会話</CardTitle>
          </CardHeader>
          <CardContent>
            {customerConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                会話履歴がありません
              </p>
            ) : (
              <div className="space-y-3">
                {customerConversations.slice(0, 5).map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/conversations/${conv.id}`}
                    className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={
                          conv.status === "resolved"
                            ? "secondary"
                            : conv.status === "escalated"
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {conversationStatusLabels[conv.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">
                      カート: {formatJPY(conv.cartAmount)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
