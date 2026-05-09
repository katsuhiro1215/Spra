/**
 * UI関連の共通定数
 * アイコン、色、サイズ、共通UI文言など、ユーザーインターフェースで使用される定数を統合管理
 */
export const CommonUIConstants = {
    // 基本アクション
    actions: {
        create: "新規作成",
        edit: "編集",
        delete: "削除",
        view: "詳細",
        save: "保存",
        cancel: "キャンセル",
        close: "閉じる",
        back: "戻る",
        next: "次へ",
        previous: "前へ",
        search: "検索",
        reset: "リセット",
        clear: "クリア",
        duplicate: "複製",
        export: "エクスポート",
        import: "インポート",
        viewLogs: "ログ一覧を見る",
    },

    // 共通ステータス
    status: {
        active: "アクティブ",
        inactive: "非アクティブ",
        draft: "下書き",
        published: "公開",
        archived: "アーカイブ",
        pending: "保留中",
        completed: "完了",
        cancelled: "キャンセル",
    },

    // 共通アイコン（Font Awesome）
    commonIcons: [
        "fas fa-globe",
        "fas fa-shopping-cart",
        "fas fa-mobile-alt",
        "fas fa-code",
        "fas fa-cloud",
        "fas fa-database",
        "fas fa-cogs",
        "fas fa-paint-brush",
        "fas fa-chart-bar",
        "fas fa-shield-alt",
        "fas fa-users",
        "fas fa-rocket",
        "fas fa-laptop",
        "fas fa-tablet-alt",
        "fas fa-server",
        "fas fa-lock",
        "fas fa-search",
        "fas fa-envelope",
        "fas fa-phone",
        "fas fa-map-marker-alt",
        "fas fa-camera",
        "fas fa-video",
        "fas fa-music",
        "fas fa-file-alt",
        "fas fa-download",
        "fas fa-upload",
        "fas fa-star",
        "fas fa-heart",
        "fas fa-thumbs-up",
        "fas fa-trophy",
    ],

    // カテゴリ別アイコン
    categoryIcons: {
        web: [
            "fas fa-globe",
            "fas fa-laptop",
            "fas fa-code",
            "fas fa-paint-brush",
        ],
        mobile: ["fas fa-mobile-alt", "fas fa-tablet-alt", "fas fa-download"],
        ecommerce: [
            "fas fa-shopping-cart",
            "fas fa-credit-card",
            "fas fa-store",
        ],
        system: [
            "fas fa-server",
            "fas fa-database",
            "fas fa-cogs",
            "fas fa-cloud",
        ],
        marketing: [
            "fas fa-chart-bar",
            "fas fa-search",
            "fas fa-envelope",
            "fas fa-bullhorn",
        ],
        security: ["fas fa-shield-alt", "fas fa-lock", "fas fa-key"],
    },

    // テーマカラー（プリセット）
    themeColors: [
        { name: "ブルー", value: "#3B82F6" },
        { name: "インディゴ", value: "#6366F1" },
        { name: "パープル", value: "#8B5CF6" },
        { name: "ピンク", value: "#EC4899" },
        { name: "レッド", value: "#EF4444" },
        { name: "オレンジ", value: "#F97316" },
        { name: "イエロー", value: "#EAB308" },
        { name: "グリーン", value: "#22C55E" },
        { name: "ティール", value: "#14B8A6" },
        { name: "シアン", value: "#06B6D4" },
        { name: "グレー", value: "#6B7280" },
        { name: "スレート", value: "#475569" },
    ],

    // バッジの色
    badgeColors: {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-blue-100 text-blue-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-cyan-100 text-cyan-800",
    },

    // カードのバリアント
    cardVariants: {
        default: {
            card: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            header: "bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700",
            footer: "bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",
        },
        primary: {
            card: "bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 border border-gray-200 dark:border-gray-700",
            header: "bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800",
            footer: "bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800",
        },
        success: {
            card: "bg-white dark:bg-gray-800 border-l-4 border-l-green-500 border border-gray-200 dark:border-gray-700",
            header: "bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800",
            footer: "bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800",
        },
        warning: {
            card: "bg-white dark:bg-gray-800 border-l-4 border-l-yellow-500 border border-gray-200 dark:border-gray-700",
            header: "bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800",
            footer: "bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800",
        },
        danger: {
            card: "bg-white dark:bg-gray-800 border-l-4 border-l-red-500 border border-gray-200 dark:border-gray-700",
            header: "bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800",
            footer: "bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800",
        },
        info: {
            card: "bg-white dark:bg-gray-800 border-l-4 border-l-cyan-500 border border-gray-200 dark:border-gray-700",
            header: "bg-cyan-50 dark:bg-cyan-900/20 border-b border-cyan-200 dark:border-cyan-800",
            footer: "bg-cyan-50 dark:bg-cyan-900/20 border-t border-cyan-200 dark:border-cyan-800",
        },
        bordered: {
            card: "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600",
            header: "bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600",
            footer: "bg-white dark:bg-gray-800 border-t-2 border-gray-300 dark:border-gray-600",
        },
        elevated: {
            card: "bg-white dark:bg-gray-800 shadow-lg",
            header: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
            footer: "bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",
        },
    },

    // ボタンサイズ
    buttonSizes: {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg",
    },

    // ページサイズオプション
    pageSizeOptions: [10, 25, 50, 100],

    // ソートオプション
    sortOrders: {
        asc: "昇順",
        desc: "降順",
    },

    // 共通確認メッセージ
    confirmMessages: {
        delete: "このアイテムを削除しますか？",
        discard: "変更を破棄しますか？",
        leave: "このページを離れますか？未保存の変更があります。",
    },

    // 共通通知メッセージ
    notifications: {
        saved: "保存しました",
        deleted: "削除しました",
        updated: "更新しました",
        created: "作成しました",
        error: "エラーが発生しました",
        loading: "読み込み中...",
        noData: "データがありません",
    },

    // ページネーション
    pagination: {
        showing: "件を表示",
        of: "件中",
        from: "から",
        to: "まで",
        previous: "前へ",
        next: "次へ",
    },

    // フィルター共通
    filters: {
        all: "すべて",
        reset: "フィルターをリセット",
        apply: "適用",
    },

    // ServiceCategory固有の定数
    serviceCategory: {
        /**
         * アイコンオプション（Heroicons）
         */
        iconOptions: [
            { value: "globe-alt", label: "グローブ" },
            { value: "code-bracket", label: "コード" },
            { value: "device-phone-mobile", label: "モバイル" },
            { value: "paint-brush", label: "ペイントブラシ" },
            { value: "megaphone", label: "メガホン" },
            { value: "lightbulb", label: "ライトバルブ" },
            { value: "wrench-screwdriver", label: "レンチ" },
            { value: "ellipsis-horizontal", label: "その他" },
        ],

        /**
         * ステータスオプション
         */
        statusOptions: [
            {
                value: "active",
                label: "稼働中（アクティブ）",
                description: "カテゴリが表示されます",
            },
            {
                value: "inactive",
                label: "停止中（非表示）",
                description: "カテゴリは表示されません",
            },
            {
                value: "suspended",
                label: "一時停止（メンテナンス等）",
                description: "メンテナンスや一時的な停止",
            },
        ],

        /**
         * カラーオプション（themeColorsから生成）
         */
        get colorOptions() {
            return [
                { value: "#3B82F6", label: "ブルー", color: "#3B82F6" },
                { value: "#10B981", label: "グリーン", color: "#10B981" },
                { value: "#F59E0B", label: "イエロー", color: "#F59E0B" },
                { value: "#EF4444", label: "レッド", color: "#EF4444" },
                { value: "#8B5CF6", label: "パープル", color: "#8B5CF6" },
                { value: "#06B6D4", label: "シアン", color: "#06B6D4" },
                { value: "#F97316", label: "オレンジ", color: "#F97316" },
                { value: "#6B7280", label: "グレー", color: "#6B7280" },
            ];
        },

        /**
         * デフォルト値
         */
        defaults: {
            color: "#3B82F6",
            sortOrder: 0,
            status: "active",
        },
    },
};
