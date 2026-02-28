"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Check, CreditCard } from "lucide-react";
import { formatJPY } from "@/lib/seed-data";

const plans = [
  {
    name: "スターター",
    price: 9800,
    features: [
      "月間メッセージ 1,000通",
      "キャンペーン 3件",
      "基本分析レポート",
      "メールサポート",
    ],
    isCurrent: false,
  },
  {
    name: "プロ",
    price: 29800,
    features: [
      "月間メッセージ 10,000通",
      "キャンペーン無制限",
      "高度な分析レポート",
      "AIカスタマイズ",
      "優先サポート",
    ],
    isCurrent: true,
  },
  {
    name: "エンタープライズ",
    price: 98000,
    features: [
      "月間メッセージ無制限",
      "キャンペーン無制限",
      "カスタム分析",
      "専任担当者",
      "API アクセス",
      "SLA保証",
    ],
    isCurrent: false,
  },
];

const invoices = [
  {
    id: "INV-2026-003",
    date: "2026-02-01",
    amount: 29800,
    status: "支払い済み",
  },
  {
    id: "INV-2026-002",
    date: "2026-01-01",
    amount: 29800,
    status: "支払い済み",
  },
  {
    id: "INV-2026-001",
    date: "2025-12-01",
    amount: 29800,
    status: "支払い済み",
  },
];

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "ダッシュボード", href: "/" },
          { label: "請求・プラン" },
        ]}
        title="請求・プラン"
        description="プランの変更や請求履歴を確認できます"
      />

      {/* Current Usage */}
      <Card>
        <CardHeader>
          <CardTitle>今月の利用状況</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>メッセージ送信数</span>
              <span>6,420 / 10,000</span>
            </div>
            <Progress value={64.2} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>アクティブキャンペーン</span>
              <span>5 / 無制限</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">請求期間</span>
            <span>2026年2月1日 〜 2026年2月28日</span>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">プラン</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.isCurrent ? "border-primary ring-1 ring-primary" : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.isCurrent && <Badge>現在のプラン</Badge>}
                </div>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    {formatJPY(plan.price)}
                  </span>
                  <span className="text-sm">/月</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.isCurrent ? "outline" : "default"}
                  disabled={plan.isCurrent}
                  onClick={() =>
                    toast.success(`${plan.name}プランに変更リクエストを送信しました`)
                  }
                >
                  {plan.isCurrent ? "現在のプラン" : "このプランに変更"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>お支払い方法</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">VISA **** 4242</p>
                <p className="text-xs text-muted-foreground">
                  有効期限: 2028/12
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info("カード情報の更新はデモでは利用できません")
              }
            >
              変更
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle>請求履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>請求書番号</TableHead>
                <TableHead>日付</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{formatJPY(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info("PDFダウンロードはデモでは利用できません")}
                    >
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
