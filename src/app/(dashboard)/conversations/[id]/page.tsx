"use client";

import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertCircle, Send, Bot, User, Monitor } from "lucide-react";
import {
  conversations,
  conversationStatusLabels,
  formatJPY,
  formatRelativeTime,
} from "@/lib/seed-data";
import { cn } from "@/lib/utils";

export default function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");

  const conversation = conversations.find((c) => c.id === id);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>会話が見つかりません。</AlertDescription>
        </Alert>
      </div>
    );
  }

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    resolved: "secondary",
    escalated: "destructive",
    pending: "outline",
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    toast.success("メッセージを送信しました");
    setReplyText("");
  };

  const senderIcon = (sender: string) => {
    switch (sender) {
      case "ai":
        return <Bot className="h-4 w-4" />;
      case "customer":
        return <User className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const senderLabel = (sender: string) => {
    switch (sender) {
      case "ai":
        return "AI";
      case "customer":
        return conversation.customerName;
      default:
        return "システム";
    }
  };

  return (
    <div className="pt-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "ダッシュボード", href: "/" },
          { label: "会話モニター", href: "/conversations" },
          { label: `${conversation.customerName}様との会話` },
        ]}
        title={`${conversation.customerName}様との会話`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Conversation Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">会話情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ステータス</span>
              <Badge variant={statusVariant[conversation.status]}>
                {conversationStatusLabels[conversation.status]}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">カート金額</span>
              <span className="font-bold">
                {formatJPY(conversation.cartAmount)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">回収状況</span>
              <Badge
                variant={conversation.isRecovered ? "default" : "outline"}
              >
                {conversation.isRecovered ? "回収済み" : "未回収"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">開始</span>
              <span>{formatRelativeTime(conversation.startedAt)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">チャネル</span>
              <Badge variant="secondary">LINE</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">メッセージ履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {conversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.sender === "customer" && "flex-row-reverse"
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={cn(
                          "text-xs",
                          msg.sender === "ai" && "bg-primary text-primary-foreground",
                          msg.sender === "customer" && "bg-blue-100 text-blue-700",
                          msg.sender === "system" && "bg-muted"
                        )}
                      >
                        {senderIcon(msg.sender)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[80%] space-y-1",
                        msg.sender === "customer" && "text-right"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          {senderLabel(msg.sender)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(msg.timestamp)}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "rounded-lg p-3 text-sm",
                          msg.sender === "ai" && "bg-primary/5 border",
                          msg.sender === "customer" &&
                            "bg-blue-50 border border-blue-100",
                          msg.sender === "system" && "bg-muted italic"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex gap-2">
              <Textarea
                placeholder="メッセージを入力..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
              />
              <Button onClick={handleSend} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
