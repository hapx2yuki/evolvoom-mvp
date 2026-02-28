"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { ShoppingCart, Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";

const step1Schema = z.object({
  shopName: z.string().min(1, "ショップ名を入力してください"),
  shopUrl: z.string().url("有効なURLを入力してください"),
  platform: z.string().min(1, "プラットフォームを選択してください"),
});

const step2Schema = z.object({
  lineChannelId: z.string().min(1, "LINE Channel IDを入力してください"),
  lineChannelSecret: z.string().min(1, "Channel Secretを入力してください"),
});

const step3Schema = z.object({
  monthlyOrders: z.string().min(1, "月間注文数を選択してください"),
  cartAbandonRate: z.string().min(1, "カート放棄率を選択してください"),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { shopName: "", shopUrl: "", platform: "" },
  });

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: { lineChannelId: "", lineChannelSecret: "" },
  });

  const step3Form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: { monthlyOrders: "", cartAbandonRate: "" },
  });

  const handleStep1 = (data: Step1Values) => {
    console.log("Step 1:", data);
    setStep(2);
  };

  const handleStep2 = (data: Step2Values) => {
    console.log("Step 2:", data);
    setStep(3);
  };

  const handleStep3 = async (data: Step3Values) => {
    setIsSubmitting(true);
    console.log("Step 3:", data);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("セットアップが完了しました！");
    setIsSubmitting(false);
    router.push("/");
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShoppingCart className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-xl">初期設定</CardTitle>
        <CardDescription>
          ステップ {step} / 3
        </CardDescription>
        <Progress value={(step / 3) * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <Form {...step1Form}>
            <form
              onSubmit={step1Form.handleSubmit(handleStep1)}
              className="space-y-4"
            >
              <FormField
                control={step1Form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ショップ名</FormLabel>
                    <FormControl>
                      <Input placeholder="マイショップ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step1Form.control}
                name="shopUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ショップURL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://myshop.example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step1Form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ECプラットフォーム</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="shopify">Shopify</SelectItem>
                        <SelectItem value="base">BASE</SelectItem>
                        <SelectItem value="stores">STORES</SelectItem>
                        <SelectItem value="makeshop">MakeShop</SelectItem>
                        <SelectItem value="futureshop">futureshop</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                次へ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...step2Form}>
            <form
              onSubmit={step2Form.handleSubmit(handleStep2)}
              className="space-y-4"
            >
              <FormField
                control={step2Form.control}
                name="lineChannelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LINE Channel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step2Form.control}
                name="lineChannelSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Secret</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs text-muted-foreground">
                LINE Developers コンソールからChannel IDとSecretを取得してください。
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  戻る
                </Button>
                <Button type="submit" className="flex-1">
                  次へ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...step3Form}>
            <form
              onSubmit={step3Form.handleSubmit(handleStep3)}
              className="space-y-4"
            >
              <FormField
                control={step3Form.control}
                name="monthlyOrders"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>月間注文数</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-50">1〜50件</SelectItem>
                        <SelectItem value="51-200">51〜200件</SelectItem>
                        <SelectItem value="201-500">201〜500件</SelectItem>
                        <SelectItem value="501-1000">501〜1,000件</SelectItem>
                        <SelectItem value="1001+">1,001件以上</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step3Form.control}
                name="cartAbandonRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>推定カート放棄率</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unknown">分からない</SelectItem>
                        <SelectItem value="under-50">50%未満</SelectItem>
                        <SelectItem value="50-65">50〜65%</SelectItem>
                        <SelectItem value="65-75">65〜75%</SelectItem>
                        <SelectItem value="over-75">75%以上</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  戻る
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  完了
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
