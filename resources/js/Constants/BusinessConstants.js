/**
 * ビジネス関連の共通定数
 * 価格設定、サービス設定など、アプリケーション全体で使用される定数を管理
 */

export const BusinessConstants = {
    // 料金体系
    pricingModels: {
        fixed: "固定価格",
        subscription: "サブスクリプション",
        custom: "カスタム価格",
        hybrid: "ハイブリッド",
        tiered: "段階料金",
        usage: "従量課金",
    },

    // 価格単位
    priceUnits: [
        "ページ",
        "式",
        "ライセンス",
        "ユーザー",
        "アカウント",
        "プロジェクト",
        "時間",
        "日",
        "週",
        "月",
        "年",
        "GB",
        "TB",
        "件",
        "回",
    ],

    // 通貨
    currencies: {
        JPY: "¥",
        USD: "$",
        EUR: "€",
        GBP: "£",
    },

    // サービス期間単位
    durationUnits: ["時間", "日", "週", "月", "年"],

    // 支払いサイクル
    paymentCycles: {
        once: "一回払い",
        monthly: "月払い",
        quarterly: "四半期払い",
        annually: "年払い",
        biannually: "半年払い",
    },

    // プロジェクトステータス
    projectStatuses: {
        draft: "下書き",
        estimate: "見積り中",
        quoted: "見積り提出済み",
        negotiation: "交渉中",
        contracted: "契約済み",
        inProgress: "進行中",
        review: "レビュー中",
        completed: "完了",
        cancelled: "キャンセル",
        onHold: "保留",
    },

    // 契約ステータス
    contractStatuses: {
        draft: "下書き",
        pending: "承認待ち",
        active: "有効",
        expired: "期限切れ",
        terminated: "解除",
        suspended: "停止中",
    },

    // 優先度
    priorities: {
        low: "低",
        normal: "通常",
        high: "高",
        urgent: "緊急",
    },

    // 進捗率の段階
    progressSteps: [
        { value: 0, label: "未開始" },
        { value: 10, label: "開始" },
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
        { value: 90, label: "90%" },
        { value: 100, label: "完了" },
    ],
};
