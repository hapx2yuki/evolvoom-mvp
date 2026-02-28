"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { segments, templates } from "@/lib/seed-data";

const newCampaignSchema = z.object({
  name: z.string().min(1, "キャンペーン名を入力してください"),
  type: z.enum(["cart_recovery", "reengagement", "upsell", "welcome"]),
  segmentId: z.string().min(1, "セグメントを選択してください"),
  templateId: z.string().min(1, "テンプレートを選択してください"),
  startDate: z.string().min(1, "開始日を入力してください"),
  endDate: z.string().optional(),
});

type NewCampaignFormValues = z.infer<typeof newCampaignSchema>;

export default function NewCampaignPage() {
  const router = useRouter();

  const form = useForm<NewCampaignFormValues>({
    resolver: zodResolver(newCampaignSchema),
    defaultValues: {
      name: "",
      type: "cart_recovery",
      segmentId: "",
      templateId: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (data: NewCampaignFormValues) => {
    console.log("New campaign:", data);
    toast.success("キャンペーンを作成しました");
    router.push("/campaigns");
  };

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "ダッシュボード", href: "/" },
          { label: "キャンペーン", href: "/campaigns" },
          { label: "新規作成" },
        ]}
        title="新規キャンペーン作成"
        description="新しいカート回収キャンペーンを設定します"
      />

      <Card>
        <CardHeader>
          <CardTitle>キャンペーン情報</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>キャンペーン名</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例: カゴ落ちリカバリー春キャンペーン"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>キャンペーンタイプ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="タイプを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cart_recovery">カート回収</SelectItem>
                        <SelectItem value="reengagement">
                          再エンゲージメント
                        </SelectItem>
                        <SelectItem value="upsell">アップセル</SelectItem>
                        <SelectItem value="welcome">ウェルカム</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="segmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>対象セグメント</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="セグメントを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {segments.map((seg) => (
                            <SelectItem key={seg.id} value={seg.id}>
                              {seg.name}（{seg.customerCount}名）
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
                      <FormLabel>メッセージテンプレート</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="テンプレートを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates
                            .filter((t) => t.isActive)
                            .map((tpl) => (
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
                <Button type="submit">作成</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/campaigns")}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
