"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Users,
  Target,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "ダッシュボード", href: "/", icon: LayoutDashboard },
  { title: "キャンペーン", href: "/campaigns", icon: Megaphone },
  { title: "会話モニター", href: "/conversations", icon: MessageCircle },
  { title: "顧客管理", href: "/customers", icon: Users },
  { title: "セグメント", href: "/segments", icon: Target },
  { title: "テンプレート", href: "/templates", icon: FileText },
  { title: "分析レポート", href: "/analytics", icon: BarChart3 },
];

const settingsNavItems = [
  { title: "アカウント設定", href: "/settings", icon: Settings },
  { title: "請求・プラン", href: "/billing", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Evolvoom</span>
            <span className="text-[10px] text-muted-foreground">
              LINE AI カート回収
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メインメニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>設定</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
