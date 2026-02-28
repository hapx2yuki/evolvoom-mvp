"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Percent,
  DollarSign,
  TrendingUp,
  MessageCircle,
  ChevronDown,
  AlertCircle,
  ShoppingCart,
  Megaphone,
  Bell,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getKpiSummary,
  analyticsSnapshots,
  segmentRecoveryData,
  recentActivities,
  formatJPY,
  formatRelativeTime,
} from "@/lib/seed-data";

type Period = "today" | "7d" | "30d" | "90d";

const periodLabels: Record<Period, string> = {
  today: "今日",
  "7d": "7日間",
  "30d": "30日間",
  "90d": "90日間",
};

const periodDays: Record<Period, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const activityIcons: Record<string, React.ReactNode> = {
  recovery: <ShoppingCart className="h-4 w-4 text-emerald-600" />,
  conversation: <MessageCircle className="h-4 w-4 text-blue-600" />,
  campaign: <Megaphone className="h-4 w-4 text-purple-600" />,
  alert: <Bell className="h-4 w-4 text-orange-600" />,
};

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const kpi = getKpiSummary();
  const chartData = analyticsSnapshots.slice(-periodDays[period]).map((s) => ({
    date: s.date.slice(5),
    回収率: s.recoveryRate,
    回収額: s.recoveredAmount,
  }));

  if (isError) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>
            ダッシュボードの読み込みに失敗しました。ページを再読み込みしてください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "ダッシュボード" }]}
        title="ダッシュボード"
        description="カート回収の状況をリアルタイムで確認できます"
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {periodLabels[period]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(periodLabels) as Period[]).map((p) => (
                <DropdownMenuItem key={p} onClick={() => setPeriod(p)}>
                  {periodLabels[p]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="カート回収率"
          value={`${kpi.recoveryRate.value}%`}
          trend={kpi.recoveryRate.trend}
          trendLabel="% 前月比"
          icon={Percent}
        />
        <KpiCard
          title="回収売上"
          value={formatJPY(kpi.recoveredAmount.value)}
          trend={kpi.recoveredAmount.trend}
          trendLabel="% 前月比"
          icon={DollarSign}
        />
        <KpiCard
          title="ROI倍率"
          value={`${kpi.roi.value}x`}
          trend={kpi.roi.trend}
          trendLabel="x 前月比"
          icon={TrendingUp}
        />
        <KpiCard
          title="アクティブ会話数"
          value={String(kpi.activeConversations.value)}
          trend={kpi.activeConversations.trend}
          trendLabel="件 前週比"
          icon={MessageCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">回収率推移</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip
                  formatter={(value) => [`${value}%`, "回収率"]}
                />
                <Area
                  type="monotone"
                  dataKey="回収率"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">セグメント別回収金額</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={segmentRecoveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${(Number(v) / 10000).toFixed(0)}万`}
                />
                <Tooltip
                  formatter={(value) => [formatJPY(Number(value)), "回収額"]}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="mt-0.5">
                    {activityIcons[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.type === "alert" ? "destructive" : "secondary"
                    }
                  >
                    {activity.type === "recovery"
                      ? "回収"
                      : activity.type === "conversation"
                      ? "会話"
                      : activity.type === "campaign"
                      ? "キャンペーン"
                      : "通知"}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
