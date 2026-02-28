"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";

const profileSchema = z.object({
  companyName: z.string().min(1, "会社名を入力してください"),
  name: z.string().min(1, "氏名を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [lineNotif, setLineNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: "株式会社サクラショップ",
      name: "田中真一",
      email: "tanaka@sakura-shop.co.jp",
      phone: "03-1234-5678",
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Profile updated:", data);
    toast.success("プロフィールを更新しました");
  };

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "ダッシュボード", href: "/" },
          { label: "アカウント設定" },
        ]}
        title="アカウント設定"
        description="プロフィールと通知設定を管理します"
      />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>会社名</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>電話番号</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">保存</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">メール通知</p>
              <p className="text-sm text-muted-foreground">
                カート回収やアラートをメールで受信
              </p>
            </div>
            <Switch
              checked={emailNotif}
              onCheckedChange={(checked) => {
                setEmailNotif(checked);
                toast.success(
                  `メール通知を${checked ? "有効" : "無効"}にしました`
                );
              }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">LINE通知</p>
              <p className="text-sm text-muted-foreground">
                重要なアラートをLINEで受信
              </p>
            </div>
            <Switch
              checked={lineNotif}
              onCheckedChange={(checked) => {
                setLineNotif(checked);
                toast.success(
                  `LINE通知を${checked ? "有効" : "無効"}にしました`
                );
              }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">週次レポート</p>
              <p className="text-sm text-muted-foreground">
                毎週月曜日にパフォーマンスレポートを配信
              </p>
            </div>
            <Switch
              checked={weeklyReport}
              onCheckedChange={(checked) => {
                setWeeklyReport(checked);
                toast.success(
                  `週次レポートを${checked ? "有効" : "無効"}にしました`
                );
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">危険な操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">アカウント削除</p>
              <p className="text-sm text-muted-foreground">
                アカウントと全データを永久に削除します
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("この操作はデモでは実行できません")}
            >
              アカウント削除
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
