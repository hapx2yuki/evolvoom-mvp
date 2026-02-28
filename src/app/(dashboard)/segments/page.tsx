"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Users, Trash2, AlertCircle, Inbox } from "lucide-react";
import { segments, formatDate } from "@/lib/seed-data";

const segmentSchema = z.object({
  name: z.string().min(1, "セグメント名を入力してください"),
  description: z.string().min(1, "説明を入力してください"),
  criteria: z.string().min(1, "条件を入力してください"),
});

type SegmentFormValues = z.infer<typeof segmentSchema>;

export default function SegmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(segmentSchema),
    defaultValues: {
      name: "",
      description: "",
      criteria: "",
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (data: SegmentFormValues) => {
    console.log("New segment:", data);
    toast.success("セグメントを作成しました");
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (name: string) => {
    toast.success(`「${name}」を削除しました`);
  };

  if (isError) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>
            セグメントの読み込みに失敗しました。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
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
          { label: "セグメント" },
        ]}
        title="セグメント管理"
        description="顧客セグメントの作成・管理を行います"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新規セグメント
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新規セグメント作成</DialogTitle>
              </DialogHeader>
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
                        <FormLabel>セグメント名</FormLabel>
                        <FormControl>
                          <Input placeholder="例: VIP顧客" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>説明</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="セグメントの説明..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="criteria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>条件（カンマ区切り）</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="例: 注文回数 >= 5, 累計金額 >= 100000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button type="submit">作成</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      {segments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Inbox className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            セグメントがまだありません。
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            最初のセグメントを作成
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <Card key={segment.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{segment.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {segment.description}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        「{segment.name}」を削除しますか？
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。セグメントに関連するキャンペーン設定にも影響します。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(segment.name)}
                      >
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {segment.customerCount}名
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {segment.criteria.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  作成日: {formatDate(segment.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
