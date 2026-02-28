// Evolvoom MVP - Seed Data (Japanese)
// LINE AI カート回収ツール for Japan SMB EC

export type Campaign = {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "completed";
  type: "cart_recovery" | "reengagement" | "upsell" | "welcome";
  startDate: string;
  endDate: string | null;
  sentCount: number;
  recoveredCount: number;
  recoveryRate: number;
  recoveredAmount: number;
  segmentId: string;
  templateId: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  lineId: string;
  company: string;
  totalPurchases: number;
  totalAmount: number;
  cartAbandons: number;
  recoveredCarts: number;
  lastActivity: string;
  segmentIds: string[];
  status: "active" | "inactive" | "blocked";
  createdAt: string;
};

export type Message = {
  id: string;
  sender: "ai" | "customer" | "system";
  content: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  customerId: string;
  customerName: string;
  campaignId: string;
  status: "active" | "resolved" | "escalated" | "pending";
  channel: "line";
  cartAmount: number;
  isRecovered: boolean;
  messages: Message[];
  startedAt: string;
  lastMessageAt: string;
};

export type Segment = {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  criteria: string[];
  createdAt: string;
};

export type Template = {
  id: string;
  name: string;
  type: "cart_recovery" | "reengagement" | "upsell" | "welcome" | "followup";
  content: string;
  variables: string[];
  usageCount: number;
  conversionRate: number;
  isActive: boolean;
  createdAt: string;
};

export type AnalyticsSnapshot = {
  date: string;
  recoveryRate: number;
  recoveredAmount: number;
  sentMessages: number;
  conversations: number;
  roi: number;
  activeConversations: number;
};

export type ActivityItem = {
  id: string;
  type: "recovery" | "conversation" | "campaign" | "alert";
  message: string;
  timestamp: string;
};

// --- Segments ---
export const segments: Segment[] = [
  {
    id: "seg-001",
    name: "新規顧客",
    description: "過去30日以内に初回購入した顧客",
    customerCount: 12,
    criteria: ["初回購入日 <= 30日前", "注文回数 == 1"],
    createdAt: "2025-11-01T09:00:00Z",
  },
  {
    id: "seg-002",
    name: "リピーター",
    description: "3回以上購入した優良顧客",
    customerCount: 18,
    criteria: ["注文回数 >= 3", "最終購入日 <= 60日前"],
    createdAt: "2025-11-01T09:00:00Z",
  },
  {
    id: "seg-003",
    name: "カゴ落ち常連",
    description: "カート放棄率が50%以上の顧客",
    customerCount: 8,
    criteria: ["カート放棄回数 >= 3", "放棄率 >= 50%"],
    createdAt: "2025-11-15T09:00:00Z",
  },
  {
    id: "seg-004",
    name: "高単価顧客",
    description: "平均注文金額が5万円以上の顧客",
    customerCount: 7,
    criteria: ["平均注文金額 >= 50000", "注文回数 >= 2"],
    createdAt: "2025-12-01T09:00:00Z",
  },
  {
    id: "seg-005",
    name: "休眠顧客",
    description: "90日以上アクティビティがない顧客",
    customerCount: 5,
    criteria: ["最終アクティビティ >= 90日前", "ステータス == active"],
    createdAt: "2025-12-15T09:00:00Z",
  },
];

// --- Templates ---
export const templates: Template[] = [
  {
    id: "tpl-001",
    name: "カゴ落ちリマインド（1時間後）",
    type: "cart_recovery",
    content:
      "{{customer_name}}様、お買い物の途中でしたね！\n\nカートに{{product_name}}が残っています。\n今なら在庫がございます。お早めにどうぞ！\n\n▶ カートを確認する\n{{cart_url}}",
    variables: ["customer_name", "product_name", "cart_url"],
    usageCount: 1240,
    conversionRate: 18.5,
    isActive: true,
    createdAt: "2025-11-01T09:00:00Z",
  },
  {
    id: "tpl-002",
    name: "カゴ落ちリマインド（24時間後）",
    type: "cart_recovery",
    content:
      "{{customer_name}}様\n\nまだカートに商品が残っております。\n{{product_name}} - ¥{{price}}\n\nお買い忘れはございませんか？\n\n▶ お買い物を続ける\n{{cart_url}}",
    variables: ["customer_name", "product_name", "price", "cart_url"],
    usageCount: 980,
    conversionRate: 12.3,
    isActive: true,
    createdAt: "2025-11-01T09:00:00Z",
  },
  {
    id: "tpl-003",
    name: "限定クーポン付きリカバリー",
    type: "cart_recovery",
    content:
      "{{customer_name}}様へ特別なお知らせです！\n\nカートの商品に{{discount}}%OFFクーポンをご用意しました。\nクーポンコード: {{coupon_code}}\n\n有効期限: {{expiry_date}}\n\n▶ クーポンを使う\n{{cart_url}}",
    variables: [
      "customer_name",
      "discount",
      "coupon_code",
      "expiry_date",
      "cart_url",
    ],
    usageCount: 560,
    conversionRate: 24.7,
    isActive: true,
    createdAt: "2025-11-15T09:00:00Z",
  },
  {
    id: "tpl-004",
    name: "再エンゲージメントメッセージ",
    type: "reengagement",
    content:
      "{{customer_name}}様、お久しぶりです！\n\n最近新商品が入荷しました。\n{{customer_name}}様にぴったりの商品をAIがセレクトしました。\n\n▶ おすすめを見る\n{{recommendation_url}}",
    variables: ["customer_name", "recommendation_url"],
    usageCount: 340,
    conversionRate: 8.2,
    isActive: true,
    createdAt: "2025-12-01T09:00:00Z",
  },
  {
    id: "tpl-005",
    name: "アップセル提案",
    type: "upsell",
    content:
      "{{customer_name}}様\n\nご購入いただいた{{purchased_product}}にぴったりの関連商品をご紹介します。\n\n{{recommended_product}} - ¥{{price}}\n\n▶ 詳細を見る\n{{product_url}}",
    variables: [
      "customer_name",
      "purchased_product",
      "recommended_product",
      "price",
      "product_url",
    ],
    usageCount: 210,
    conversionRate: 6.8,
    isActive: true,
    createdAt: "2025-12-01T09:00:00Z",
  },
  {
    id: "tpl-006",
    name: "ウェルカムメッセージ",
    type: "welcome",
    content:
      "{{customer_name}}様、LINE友だち追加ありがとうございます！\n\nEvolvoomをご利用いただきありがとうございます。\nこれからお得な情報をお届けします。\n\n初回限定{{discount}}%OFFクーポン:\n{{coupon_code}}",
    variables: ["customer_name", "discount", "coupon_code"],
    usageCount: 890,
    conversionRate: 32.1,
    isActive: true,
    createdAt: "2025-11-01T09:00:00Z",
  },
  {
    id: "tpl-007",
    name: "購入後フォローアップ",
    type: "followup",
    content:
      "{{customer_name}}様\n\nご購入ありがとうございました！\n商品はいかがでしょうか？\n\nご不明な点がございましたら、お気軽にご連絡ください。\n\n▶ レビューを書く\n{{review_url}}",
    variables: ["customer_name", "review_url"],
    usageCount: 450,
    conversionRate: 15.3,
    isActive: true,
    createdAt: "2025-12-15T09:00:00Z",
  },
  {
    id: "tpl-008",
    name: "在庫復活通知",
    type: "cart_recovery",
    content:
      "{{customer_name}}様にお知らせです！\n\n以前カートに入れていた{{product_name}}の在庫が復活しました！\n\n数量限定ですので、お早めにどうぞ。\n\n▶ 今すぐ購入\n{{product_url}}",
    variables: ["customer_name", "product_name", "product_url"],
    usageCount: 180,
    conversionRate: 21.4,
    isActive: false,
    createdAt: "2026-01-10T09:00:00Z",
  },
];

// --- Campaigns ---
export const campaigns: Campaign[] = [
  {
    id: "cmp-001",
    name: "カゴ落ちリカバリー春キャンペーン",
    status: "active",
    type: "cart_recovery",
    startDate: "2026-02-01",
    endDate: "2026-03-31",
    sentCount: 3420,
    recoveredCount: 615,
    recoveryRate: 18.0,
    recoveredAmount: 12850000,
    segmentId: "seg-003",
    templateId: "tpl-001",
    createdAt: "2026-01-25T09:00:00Z",
  },
  {
    id: "cmp-002",
    name: "新規顧客ウェルカムシリーズ",
    status: "active",
    type: "welcome",
    startDate: "2026-01-15",
    endDate: null,
    sentCount: 890,
    recoveredCount: 285,
    recoveryRate: 32.0,
    recoveredAmount: 4280000,
    segmentId: "seg-001",
    templateId: "tpl-006",
    createdAt: "2026-01-10T09:00:00Z",
  },
  {
    id: "cmp-003",
    name: "リピーター限定クーポン配布",
    status: "active",
    type: "cart_recovery",
    startDate: "2026-02-10",
    endDate: "2026-02-28",
    sentCount: 1560,
    recoveredCount: 390,
    recoveryRate: 25.0,
    recoveredAmount: 9750000,
    segmentId: "seg-002",
    templateId: "tpl-003",
    createdAt: "2026-02-05T09:00:00Z",
  },
  {
    id: "cmp-004",
    name: "休眠顧客再エンゲージメント",
    status: "paused",
    type: "reengagement",
    startDate: "2026-01-20",
    endDate: "2026-02-20",
    sentCount: 420,
    recoveredCount: 34,
    recoveryRate: 8.1,
    recoveredAmount: 1020000,
    segmentId: "seg-005",
    templateId: "tpl-004",
    createdAt: "2026-01-18T09:00:00Z",
  },
  {
    id: "cmp-005",
    name: "高単価顧客アップセル",
    status: "active",
    type: "upsell",
    startDate: "2026-02-15",
    endDate: "2026-03-15",
    sentCount: 280,
    recoveredCount: 42,
    recoveryRate: 15.0,
    recoveredAmount: 6300000,
    segmentId: "seg-004",
    templateId: "tpl-005",
    createdAt: "2026-02-12T09:00:00Z",
  },
  {
    id: "cmp-006",
    name: "バレンタイン特別リカバリー",
    status: "completed",
    type: "cart_recovery",
    startDate: "2026-02-01",
    endDate: "2026-02-14",
    sentCount: 2100,
    recoveredCount: 462,
    recoveryRate: 22.0,
    recoveredAmount: 8316000,
    segmentId: "seg-003",
    templateId: "tpl-003",
    createdAt: "2026-01-28T09:00:00Z",
  },
  {
    id: "cmp-007",
    name: "購入後フォローアップ自動化",
    status: "active",
    type: "cart_recovery",
    startDate: "2026-01-01",
    endDate: null,
    sentCount: 4500,
    recoveredCount: 675,
    recoveryRate: 15.0,
    recoveredAmount: 5400000,
    segmentId: "seg-002",
    templateId: "tpl-007",
    createdAt: "2025-12-28T09:00:00Z",
  },
  {
    id: "cmp-008",
    name: "在庫復活通知キャンペーン",
    status: "draft",
    type: "cart_recovery",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    sentCount: 0,
    recoveredCount: 0,
    recoveryRate: 0,
    recoveredAmount: 0,
    segmentId: "seg-003",
    templateId: "tpl-008",
    createdAt: "2026-02-25T09:00:00Z",
  },
  {
    id: "cmp-009",
    name: "年度末セールリマインダー",
    status: "draft",
    type: "cart_recovery",
    startDate: "2026-03-15",
    endDate: "2026-03-31",
    sentCount: 0,
    recoveredCount: 0,
    recoveryRate: 0,
    recoveredAmount: 0,
    segmentId: "seg-001",
    templateId: "tpl-002",
    createdAt: "2026-02-27T09:00:00Z",
  },
  {
    id: "cmp-010",
    name: "LINE友だち1000人記念",
    status: "completed",
    type: "welcome",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    sentCount: 1000,
    recoveredCount: 320,
    recoveryRate: 32.0,
    recoveredAmount: 4800000,
    segmentId: "seg-001",
    templateId: "tpl-006",
    createdAt: "2025-12-25T09:00:00Z",
  },
];

// --- Customers (50) ---
const customerNames = [
  "田中真一", "山田美咲", "佐藤健太", "鈴木由美", "高橋誠",
  "伊藤恵子", "渡辺大輔", "中村花子", "小林雅之", "加藤理恵",
  "吉田太郎", "山口愛", "松本浩二", "井上めぐみ", "木村達也",
  "林直子", "斎藤俊介", "清水彩", "山崎修", "池田真理",
  "阿部慎太郎", "森京子", "橋本翔太", "石川みどり", "前田康弘",
  "藤田さくら", "後藤正樹", "岡田瞳", "村上裕也", "近藤奈々",
  "遠藤武", "坂本麻衣", "青木光一", "藤井香織", "福田健司",
  "太田美穂", "三浦直人", "岡本優花", "菅原拓海", "久保田杏",
  "原田一馬", "市川紗英", "小川隆司", "柴田真奈", "宮崎孝之",
  "中島里美", "新井勝", "望月彩花", "野村圭介", "高木千尋",
];

const companyNames = [
  "株式会社サクラショップ", "有限会社みらい商店", "合同会社テクノマート",
  "株式会社花鳥風月", "有限会社日本堂", "合同会社デジタルベース",
  "株式会社グリーンライフ", "有限会社オーシャンコマース", "合同会社スマイルストア",
  "株式会社和心", "有限会社クラフトワークス", "合同会社ネクストステップ",
  "株式会社美風堂", "有限会社東京セレクト", "合同会社フューチャーマーケット",
  "株式会社大阪商会", "有限会社京都工房", "合同会社アクアマリン",
  "株式会社サンシャイン", "有限会社横浜トレード",
];

export const customers: Customer[] = customerNames.map((name, i) => {
  const idx = String(i + 1).padStart(3, "0");
  const totalPurchases = Math.floor(Math.random() * 20) + 1;
  const cartAbandons = Math.floor(Math.random() * 10);
  const recoveredCarts = Math.floor(Math.random() * Math.min(cartAbandons, 5));
  const totalAmount = (Math.floor(Math.random() * 500) + 10) * 1000;
  const daysAgo = Math.floor(Math.random() * 90);
  const segmentPool = ["seg-001", "seg-002", "seg-003", "seg-004", "seg-005"];
  const numSegments = Math.floor(Math.random() * 2) + 1;
  const segmentIds = segmentPool.sort(() => Math.random() - 0.5).slice(0, numSegments);

  return {
    id: `cust-${idx}`,
    name,
    email: `user${idx}@example.com`,
    lineId: `U${Math.random().toString(36).substring(2, 15)}`,
    company: companyNames[i % companyNames.length],
    totalPurchases,
    totalAmount,
    cartAbandons,
    recoveredCarts,
    lastActivity: new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString(),
    segmentIds,
    status: i < 40 ? "active" : i < 45 ? "inactive" : "blocked",
    createdAt: new Date(
      Date.now() - (180 + Math.floor(Math.random() * 180)) * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
});

// --- Conversations (30) ---
function generateMessages(custName: string, isRecovered: boolean): Message[] {
  const messages: Message[] = [
    {
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      sender: "system",
      content: `${custName}様のカート放棄を検出しました。自動メッセージを送信します。`,
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      sender: "ai",
      content: `${custName}様、お買い物の途中でしたね！カートに商品が残っています。今なら在庫がございます。お早めにどうぞ！`,
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    },
  ];

  if (isRecovered) {
    messages.push(
      {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        sender: "customer",
        content: "ありがとうございます！購入手続きを進めます。",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        sender: "ai",
        content:
          "ご購入ありがとうございます！何かご不明な点がございましたら、お気軽にお問い合わせください。",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      }
    );
  } else {
    messages.push({
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      sender: "customer",
      content: "少し検討してみます。",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    });
  }

  return messages;
}

export const conversations: Conversation[] = Array.from(
  { length: 30 },
  (_, i) => {
    const idx = String(i + 1).padStart(3, "0");
    const customer = customers[i % customers.length];
    const isRecovered = Math.random() > 0.5;
    const statuses: Conversation["status"][] = [
      "active",
      "resolved",
      "escalated",
      "pending",
    ];
    const status = isRecovered
      ? "resolved"
      : statuses[Math.floor(Math.random() * statuses.length)];
    const cartAmount = (Math.floor(Math.random() * 100) + 5) * 1000;
    const hoursAgo = Math.floor(Math.random() * 72);

    return {
      id: `conv-${idx}`,
      customerId: customer.id,
      customerName: customer.name,
      campaignId: campaigns[i % campaigns.length].id,
      status,
      channel: "line" as const,
      cartAmount,
      isRecovered,
      messages: generateMessages(customer.name, isRecovered),
      startedAt: new Date(
        Date.now() - hoursAgo * 3600000
      ).toISOString(),
      lastMessageAt: new Date(
        Date.now() - (hoursAgo - 1) * 3600000
      ).toISOString(),
    };
  }
);

// --- Analytics Snapshots (90 days) ---
export const analyticsSnapshots: AnalyticsSnapshot[] = Array.from(
  { length: 90 },
  (_, i) => {
    const date = new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000);
    const baseRate = 15 + Math.sin(i / 10) * 5 + Math.random() * 3;
    const sentMessages = Math.floor(80 + Math.random() * 60);
    const conversations = Math.floor(sentMessages * 0.3 + Math.random() * 10);
    const recoveredAmount =
      Math.floor((300 + Math.random() * 200) * sentMessages * (baseRate / 100));

    return {
      date: date.toISOString().split("T")[0],
      recoveryRate: Math.round(baseRate * 10) / 10,
      recoveredAmount,
      sentMessages,
      conversations,
      roi: Math.round((2 + Math.random() * 3) * 10) / 10,
      activeConversations: Math.floor(conversations * 0.4 + Math.random() * 5),
    };
  }
);

// --- Activity Feed ---
export const recentActivities: ActivityItem[] = [
  {
    id: "act-001",
    type: "recovery",
    message: "田中真一様がカートを回収しました（¥45,800）",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "act-002",
    type: "conversation",
    message: "山田美咲様との会話が開始されました",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: "act-003",
    type: "campaign",
    message: "「カゴ落ちリカバリー春キャンペーン」の送信が完了しました",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "act-004",
    type: "recovery",
    message: "佐藤健太様がカートを回収しました（¥128,000）",
    timestamp: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "act-005",
    type: "alert",
    message: "「休眠顧客再エンゲージメント」キャンペーンが一時停止されました",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "act-006",
    type: "conversation",
    message: "高橋誠様との会話がエスカレーションされました",
    timestamp: new Date(Date.now() - 9000000).toISOString(),
  },
  {
    id: "act-007",
    type: "recovery",
    message: "鈴木由美様がカートを回収しました（¥32,400）",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "act-008",
    type: "campaign",
    message: "「リピーター限定クーポン配布」の回収率が25%を突破しました",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "act-009",
    type: "recovery",
    message: "伊藤恵子様がカートを回収しました（¥67,200）",
    timestamp: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "act-010",
    type: "alert",
    message: "本日のカート回収率が20%を超えました",
    timestamp: new Date(Date.now() - 21600000).toISOString(),
  },
];

// --- KPI Summary ---
export function getKpiSummary() {
  const last30 = analyticsSnapshots.slice(-30);
  const last7 = analyticsSnapshots.slice(-7);
  const prev30 = analyticsSnapshots.slice(-60, -30);
  const prev7 = analyticsSnapshots.slice(-14, -7);

  const avg = (arr: AnalyticsSnapshot[], key: keyof AnalyticsSnapshot) =>
    arr.reduce((sum, s) => sum + (s[key] as number), 0) / arr.length;
  const sum = (arr: AnalyticsSnapshot[], key: keyof AnalyticsSnapshot) =>
    arr.reduce((s, snap) => s + (snap[key] as number), 0);

  return {
    recoveryRate: {
      value: Math.round(avg(last30, "recoveryRate") * 10) / 10,
      trend:
        Math.round(
          (avg(last30, "recoveryRate") - avg(prev30, "recoveryRate")) * 10
        ) / 10,
    },
    recoveredAmount: {
      value: sum(last30, "recoveredAmount"),
      trend:
        Math.round(
          ((sum(last30, "recoveredAmount") - sum(prev30, "recoveredAmount")) /
            sum(prev30, "recoveredAmount")) *
            1000
        ) / 10,
    },
    roi: {
      value: Math.round(avg(last30, "roi") * 10) / 10,
      trend:
        Math.round((avg(last30, "roi") - avg(prev30, "roi")) * 10) / 10,
    },
    activeConversations: {
      value: Math.round(avg(last7, "activeConversations")),
      trend:
        Math.round(avg(last7, "activeConversations")) -
        Math.round(avg(prev7, "activeConversations")),
    },
  };
}

// --- Segment-level recovery data for charts ---
export const segmentRecoveryData = segments.map((seg) => ({
  segment: seg.name,
  amount:
    Math.floor(Math.random() * 5000000) + 1000000,
  count: Math.floor(Math.random() * 200) + 50,
}));

// --- Helper: format JPY ---
export function formatJPY(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

// --- Helper: format date ---
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// --- Helper: format relative time ---
export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;
  if (diffHour < 24) return `${diffHour}時間前`;
  if (diffDay < 30) return `${diffDay}日前`;
  return formatDate(dateStr);
}

// --- Status labels ---
export const campaignStatusLabels: Record<Campaign["status"], string> = {
  active: "実行中",
  paused: "一時停止",
  draft: "下書き",
  completed: "完了",
};

export const campaignTypeLabels: Record<Campaign["type"], string> = {
  cart_recovery: "カート回収",
  reengagement: "再エンゲージメント",
  upsell: "アップセル",
  welcome: "ウェルカム",
};

export const conversationStatusLabels: Record<Conversation["status"], string> =
  {
    active: "対応中",
    resolved: "解決済み",
    escalated: "エスカレーション",
    pending: "保留中",
  };

export const customerStatusLabels: Record<Customer["status"], string> = {
  active: "アクティブ",
  inactive: "非アクティブ",
  blocked: "ブロック済み",
};

export const templateTypeLabels: Record<Template["type"], string> = {
  cart_recovery: "カート回収",
  reengagement: "再エンゲージメント",
  upsell: "アップセル",
  welcome: "ウェルカム",
  followup: "フォローアップ",
};
