"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: LucideIcon;
};

export function KpiCard({ title, value, trend, trendLabel, icon: Icon }: KpiCardProps) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          {isNeutral ? (
            <Minus className="h-3 w-3" />
          ) : isPositive ? (
            <TrendingUp className="h-3 w-3 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span
            className={cn(
              isNeutral
                ? "text-muted-foreground"
                : isPositive
                ? "text-emerald-600"
                : "text-red-600"
            )}
          >
            {isPositive ? "+" : ""}
            {trend}
            {trendLabel.includes("%") ? "%" : ""}
          </span>
          <span>{trendLabel.replace("%", "")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
