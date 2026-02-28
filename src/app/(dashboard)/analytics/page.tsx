"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  analyticsSnapshots,
  segmentRecoveryData,
  campaigns,
  formatJPY,
  campaignTypeLabels,
} from "@/lib/seed-data";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const days = parseInt(dateRange);
  const chartData = analyticsSnapshots.slice(-days).map((s) => ({
    date: s.date.slice(5),
    回収率: s.recoveryRate,
    回収額: Math.round(s.recoveredAmount / 10000),
    送信数: s.sentMessages,
    会話数: s.conversations,
    ROI: s.roi,
  }));

  // Campaign type distribution for pie chart
  const campaignTypeData = Object.entries(
    campaigns.reduce<Record<string, number>>((acc, c) => {
      const label = campaignTypeLabels[c.type];
      acc[label] = (acc[label] || 0) + c.recoveredAmount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (isError) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>
            分析データの読み込みに失敗しました。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
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
          { label: "分析レポート" },
        ]}
        title="分析レポート"
        description="カート回収のパフォーマンスを詳細に分析します"
        action={
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">過去7日間</SelectItem>
              <SelectItem value="30">過去30日間</SelectItem>
              <SelectItem value="90">過去90日間</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="segments">セグメント比較</TabsTrigger>
          <TabsTrigger value="campaigns">キャンペーン分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recovery Rate Trend */}
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

            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">回収金額推移（万円）</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${v}万`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toLocaleString("ja-JP")}万円`,
                        "回収額",
                      ]}
                    />
                    <Bar
                      dataKey="回収額"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Message & Conversation Volume */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  メッセージ・会話ボリューム
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="送信数"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="会話数"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ROI Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ROI推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="x" />
                    <Tooltip
                      formatter={(value) => [`${value}x`, "ROI"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="ROI"
                      stroke="hsl(var(--chart-5))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  セグメント別回収金額
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={segmentRecoveryData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) =>
                        `${(Number(v) / 10000).toFixed(0)}万`
                      }
                    />
                    <YAxis
                      dataKey="segment"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatJPY(Number(value)),
                        "回収額",
                      ]}
                    />
                    <Bar
                      dataKey="amount"
                      fill="hsl(var(--chart-1))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  セグメント別回収件数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={segmentRecoveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${value}件`, "回収数"]}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-3))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  キャンペーンタイプ別回収金額
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={campaignTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {campaignTypeData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatJPY(Number(value)),
                        "回収額",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  キャンペーン別回収率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={campaigns
                      .filter((c) => c.sentCount > 0)
                      .map((c) => ({
                        name:
                          c.name.length > 12
                            ? c.name.slice(0, 12) + "..."
                            : c.name,
                        回収率: c.recoveryRate,
                      }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} unit="%" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 10 }}
                      width={120}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "回収率"]}
                    />
                    <Bar
                      dataKey="回収率"
                      fill="hsl(var(--chart-4))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
