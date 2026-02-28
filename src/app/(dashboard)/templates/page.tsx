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
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Plus, AlertCircle, Inbox, FileText, Send, TrendingUp } from "lucide-react";
import { templates, templateTypeLabels, type Template } from "@/lib/seed-data";
import { useDebounce } from "@/hooks/use-debounce";
import { DEBOUNCE_MS } from "@/lib/constants";

const templateSchema = z.object({
  name: z.string().min(1, "テンプレート名を入力してください"),
  type: z.enum(["cart_recovery", "reengagement", "upsell", "welcome", "followup"]),
  content: z.string().min(1, "メッセージ内容を入力してください"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function TemplatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_MS);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      type: "cart_recovery",
      content: "",
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const onSubmit = (data: TemplateFormValues) => {
    console.log("New template:", data);
    toast.success("テンプレートを作成しました");
    setIsDialogOpen(false);
    form.reset();
  };

  if (isError) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>
            テンプレートの読み込みに失敗しました。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
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
          { label: "テンプレート" },
        ]}
        title="テンプレート管理"
        description="LINEメッセージテンプレートの作成・管理を行います"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新規テンプレート
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>新規テンプレート作成</DialogTitle>
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
                        <FormLabel>テンプレート名</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="例: カゴ落ちリマインド（1時間後）"
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
                            {(
                              Object.entries(templateTypeLabels) as [
                                Template["type"],
                                string,
                              ][]
                            ).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
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
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メッセージ内容</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="{{customer_name}}様..."
                            className="min-h-[150px]"
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

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="テンプレート名で検索..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="タイプ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {(
              Object.entries(templateTypeLabels) as [
                Template["type"],
                string,
              ][]
            ).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Inbox className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            該当するテンプレートがありません。
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {template.name}
                    </CardTitle>
                    <Switch
                      checked={template.isActive}
                      onCheckedChange={() =>
                        toast.success(
                          `テンプレートを${
                            template.isActive ? "無効化" : "有効化"
                          }しました`
                        )
                      }
                    />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {templateTypeLabels[template.type]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm whitespace-pre-wrap line-clamp-4">
                    {template.content}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs font-mono">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      <span>{template.usageCount.toLocaleString("ja-JP")}回</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{template.conversionRate}%</span>
                    </div>
                  </div>
                  <FileText className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
