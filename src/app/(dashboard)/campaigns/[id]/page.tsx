"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import {
  campaigns,
  segments,
  templates,
  campaignStatusLabels,
  campaignTypeLabels,
  formatJPY,
  formatDate,
} from "@/lib/seed-data";

const campaignSchema = z.object({
  name: z.string().min(1, "キャンペーン名を入力してください"),
  status: z.enum(["active", "paused", "draft", "completed"]),
  type: z.enum(["cart_recovery", "reengagement", "upsell", "welcome"]),
  segmentId: z.string().min(1, "セグメントを選択してください"),
  templateId: z.string().min(1, "テンプレートを選択してください"),
  startDate: z.string().min(1, "開始日を入力してください"),
  endDate: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const campaign = campaigns.find((c) => c.id === id);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign
      ? {
          name: campaign.name,
          status: campaign.status,
          type: campaign.type,
          segmentId: campaign.segmentId,
          templateId: campaign.templateId,
          startDate: campaign.startDate,
          endDate: campaign.endDate || "",
        }
      : undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>
            キャンペーンが見つかりません。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const onSubmit = (data: CampaignFormValues) => {
    console.log("Campaign updated:", data);
    toast.success("キャンペーンを更新しました");
    setIsEditing(false);
  };

  const handleDelete = () => {
    toast.success("キャンペーンを削除しました");
    router.push("/campaigns");
  };

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    paused: "secondary",
    draft: "outline",
    completed: "secondary",
  };

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "ダッシュボード", href: "/" },
          { label: "キャンペーン", href: "/campaigns" },
          { label: campaign.name },
        ]}
        title={campaign.name}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {isEditing ? "キャンセル" : "編集"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>キャンペーンを削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    この操作は取り消せません。キャンペーンに関連するすべてのデータが削除されます。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    削除する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>キャンペーン編集</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>キャンペーン名</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ステータス</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">実行中</SelectItem>
                            <SelectItem value="paused">一時停止</SelectItem>
                            <SelectItem value="draft">下書き</SelectItem>
                            <SelectItem value="completed">完了</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>タイプ</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cart_recovery">カート回収</SelectItem>
                            <SelectItem value="reengagement">再エンゲージメント</SelectItem>
                            <SelectItem value="upsell">アップセル</SelectItem>
                            <SelectItem value="welcome">ウェルカム</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="segmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>対象セグメント</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {segments.map((seg) => (
                              <SelectItem key={seg.id} value={seg.id}>
                                {seg.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>テンプレート</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.map((tpl) => (
                              <SelectItem key={tpl.id} value={tpl.id}>
                                {tpl.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>開始日</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>終了日（任意）</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">保存</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ステータス</span>
                <Badge variant={statusVariant[campaign.status]}>
                  {campaignStatusLabels[campaign.status]}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">タイプ</span>
                <span>{campaignTypeLabels[campaign.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">対象セグメント</span>
                <span>
                  {segments.find((s) => s.id === campaign.segmentId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">テンプレート</span>
                <span className="text-right max-w-[200px] truncate">
                  {templates.find((t) => t.id === campaign.templateId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">開始日</span>
                <span>{formatDate(campaign.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">終了日</span>
                <span>
                  {campaign.endDate ? formatDate(campaign.endDate) : "未設定"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>パフォーマンス</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">送信数</span>
                <span>{campaign.sentCount.toLocaleString("ja-JP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">回収数</span>
                <span>{campaign.recoveredCount.toLocaleString("ja-JP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">回収率</span>
                <span className="font-bold text-emerald-600">
                  {campaign.recoveryRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">回収金額</span>
                <span className="font-bold">
                  {formatJPY(campaign.recoveredAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
