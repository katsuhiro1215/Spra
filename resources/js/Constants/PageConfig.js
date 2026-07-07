import { CommonUIConstants } from "@/Constants/CommonUIConstants";

const createPageTemplates = (baseName) => ({
    index: {
        title: `${baseName}一覧`,
        description: `${baseName}の一覧を表示します`,
        breadcrumb: `${baseName}一覧`,
    },
    show: {
        title: `${baseName}詳細`,
        description: `${baseName}の詳細情報を表示します`,
        breadcrumb: "詳細",
    },
    create: {
        title: `${baseName}作成`,
        description: `新しい${baseName}を作成します`,
        breadcrumb: "新規作成",
    },
    edit: {
        title: `${baseName}編集`,
        description: `${baseName}の情報を編集します`,
        breadcrumb: "編集",
    },
});

const createSearchTemplate = (baseName) => ({
    placeholder: `${baseName}名で検索...`,
});

const createConfirmMessageTemplates = (baseName) => ({
    delete: `この${baseName}を削除しますか？`,
    bulkAction: (count, action) =>
        `選択した${count}件のアイテムに対して「${action}」を実行しますか？`,
});

const createFormTemplates = (baseName) => ({
    create: {
        title: `新しい${baseName}を作成`,
        description: `${baseName}の詳細情報を入力してください`,
        documentTitle: `${baseName}作成`,
    },
    edit: {
        title: `${baseName}を編集`,
        description: `${baseName}の詳細情報を編集してください`,
        documentTitle: `${baseName}編集`,
    },
});

const createNotificationTemplates = (baseName) => ({
    created: `${baseName}を作成しました`,
    updated: `${baseName}を更新しました`,
    deleted: `${baseName}を削除しました`,
    bulkUpdated: (count) => `${count}件の${baseName}を更新しました`,
});

const createIndexPageUITemplates = (baseName, searchPlaceholder = null) => ({
    tabs: {
        all: "すべて",
        list: "一覧",
        trashed: "削除済み",
    },
    search: {
        placeholder: searchPlaceholder || `${baseName}名で検索...`,
    },
    filter: {
        button: "フィルター",
        clear: "クリア",
    },
    empty: {
        noResults: `検索条件に一致する${baseName}が見つかりませんでした。`,
        noTrashed: `削除された${baseName}はありません。`,
        noData: `まだ${baseName}が登録されていません。`,
        createFirst: `最初の${baseName}を作成`,
    },
});

export const PageConfig = {
    /**
     * ダッシュボード管理
     */
    dashboard: {
        title: "📊 管理者ダッシュボード",
        description: "管理者ダッシュボードへようこそ",
        documentTitle: "ダッシュボード",
        breadcrumbs: ["ホーム", "ダッシュボード"],
        actions: {
            ...CommonUIConstants.actions,
        },
    },

    /**
     * 管理者管理
     */
    admins: {
        title: "👥 管理者管理",
        description: "管理者を管理します",
        documentTitle: "管理者管理",
        breadcrumbs: ["ホーム", "管理者管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("管理者"),
        search: createSearchTemplate("管理者"),
        ui: createIndexPageUITemplates(
            "管理者",
            "ユーザー名またはメールアドレスで検索...",
        ),
        filters: {
            role: {
                label: "役割",
                placeholder: "すべての役割",
            },
            status: {
                label: "ステータス",
                placeholder: "すべてのステータス",
            },
        },
    },

    /**
     * 管理者プロフィール管理
     */
    adminProfiles: {
        title: "📝 管理者プロフィール管理",
        description: "管理者プロフィールを管理します",
        documentTitle: "管理者プロフィール管理",
        breadcrumbs: ["ホーム", "管理者プロフィール管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("管理者プロフィール"),
        search: createSearchTemplate("管理者プロフィール"),
    },

    /**
     * ユーザー管理
     */
    users: {
        title: "👥 ユーザー管理",
        description: "ユーザーを管理します",
        documentTitle: "ユーザー管理",
        breadcrumbs: ["ホーム", "ユーザー管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("ユーザー"),
        search: createSearchTemplate("ユーザー"),
        ui: createIndexPageUITemplates(
            "ユーザー",
            "ユーザー名またはメールアドレスで検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべてのステータス",
            },
        },
    },

    /**
     * ユーザープロフィール管理
     */
    userProfiles: {
        title: "📝 ユーザープロフィール管理",
        description: "ユーザープロフィールを管理します",
        documentTitle: "ユーザープロフィール管理",
        breadcrumbs: ["ホーム", "ユーザープロフィール管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("ユーザープロフィール"),
        search: createSearchTemplate("ユーザープロフィール"),
    },

    // 会社管理
    companies: {
        title: "🏢 会社管理",
        description: "顧客の会社情報を管理します",
        documentTitle: "会社管理",
        breadcrumbs: ["ホーム", "会社管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("会社"),
        ui: createIndexPageUITemplates("会社", "企業名、代表者名で検索..."),
        filters: {
            companyType: {
                label: "企業タイプ",
                placeholder: "すべて",
            },
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
            industry: {
                label: "業界",
                placeholder: "すべて",
            },
        },
    },

    /**
     * メディア管理
     */
    media: {
        title: "🖼️ メディア管理",
        description: "画像、動画、ドキュメントを管理します",
        documentTitle: "メディア管理",
        breadcrumbs: ["ホーム", "メディア管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("メディア"),
        search: createSearchTemplate("メディア"),
    },

    /**
     * サービスカテゴリ管理
     */
    serviceCategories: {
        title: "🛠️ サービスカテゴリ管理",
        description: "サービスカテゴリを管理します",
        documentTitle: "サービスカテゴリー管理",
        breadcrumbs: ["ホーム", "サービスカテゴリ管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("サービスカテゴリ"),
        search: createSearchTemplate("サービスカテゴリ"),
        ui: createIndexPageUITemplates(
            "サービスカテゴリ",
            "カテゴリ名またはスラッグで検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべてのステータス",
            },
        },
    },

    // サービス管理
    services: {
        title: "🛠️ サービス管理",
        description: "ホームページのサービス内容を管理します",
        documentTitle: "サービス管理",
        breadcrumbs: ["ホーム", "サービス管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("サービス"),
        form: createFormTemplates("サービス"),
        ui: createIndexPageUITemplates(
            "サービス",
            "サービス名またはスラッグで検索...",
        ),
        filters: {
            category: {
                label: "カテゴリ",
                placeholder: "すべて",
            },
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
            featured: {
                label: "注目",
                placeholder: "すべて",
            },
        },
    },

    // サービス項目管理
    serviceItems: {
        title: "🛠️ サービス項目管理",
        description: "サービス項目を管理します",
        documentTitle: "サービス項目管理",
        breadcrumbs: ["ホーム", "サービス項目管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("サービス項目"),
        form: createFormTemplates("サービス項目"),
        ui: createIndexPageUITemplates(
            "サービス項目",
            "サービス項目名またはスラッグで検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
            service: {
                label: "サービス",
                placeholder: "すべて",
            },
            plan: {
                label: "プラン",
                placeholder: "すべて",
            },
            type: {
                label: "タイプ",
                placeholder: "すべて",
            },
        },
    },

    // サービスプラン管理
    servicePlans: {
        title: "🛠️ サービスプラン管理",
        description: "サービスプランを管理します",
        documentTitle: "サービスプラン管理",
        breadcrumbs: ["ホーム", "サービスプラン管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("サービスプラン"),
        form: createFormTemplates("サービスプラン"),
        ui: createIndexPageUITemplates(
            "サービスプラン",
            "サービスプラン名またはスラッグで検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
            type: {
                label: "タイプ",
                placeholder: "すべて",
            },
        },
    },

    /**
     * スケジュール管理
     */
    schedules: {
        title: "📅 スケジュール管理",
        description: "スケジュールを管理します",
        documentTitle: "スケジュール管理",
        breadcrumbs: ["ホーム", "スケジュール管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("スケジュール"),
        search: createSearchTemplate("スケジュール"),
    },

    /**
     * デフォルトスケジュール管理
     */
    defaults: {
        title: "📅 デフォルトスケジュール管理",
        description: "曜日ごとのデフォルト営業時間を管理します",
        documentTitle: "デフォルトスケジュール設定",
        breadcrumbs: ["ホーム", "デフォルトスケジュール管理"],
        actions: {
            save: "保存",
        },
        labels: {
            sectionTitle: "営業時間の設定",
            sectionDescription: "曜日ごとのデフォルト営業時間を設定します。",
            closedDay: "定休日",
            businessHours: "営業時間",
            breakTime: "休憩時間",
        },
        hints: {
            toggleHelp:
                "スイッチをオンにすると営業日、オフにすると定休日になります。",
            saveHelp: "変更は保存ボタンを押すまで反映されません。",
        },
        dayNames: ["日", "月", "火", "水", "木", "金", "土"],
    },

    /**
     * 例外日管理
     */
    exceptions: {
        title: "⚠️ 例外日管理",
        description: "例外日を管理します",
        documentTitle: "例外日管理",
        breadcrumbs: ["ホーム", "例外日管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("例外日"),
        search: createSearchTemplate("例外日"),
        ui: createIndexPageUITemplates("例外日", "理由で検索..."),
    },

    /**
     * 祝日・休業日管理
     */
    holidays: {
        title: "🎉 祝日・休業日管理",
        description: "祝日・休業日を管理します",
        documentTitle: "祝日・休業日管理",
        breadcrumbs: ["ホーム", "祝日・休業日管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("祝日・休業日"),
        search: createSearchTemplate("祝日・休業日"),
        ui: createIndexPageUITemplates("祝日・休業日", "祝日名で検索..."),
    },

    /**
     * 予約枠管理
     */
    appointmentSlots: {
        title: "📅 予約枠管理",
        description: "予約枠を管理します",
        documentTitle: "予約枠管理",
        breadcrumbs: ["ホーム", "スケジュール管理", "予約枠管理"],
        actions: {
            create: "予約枠を作成",
            edit: "予約枠を編集",
            delete: "予約枠を削除",
            view: "予約枠を表示",
        },
        ui: createIndexPageUITemplates("予約枠", "日付、時間、タイプで検索..."),
        filters: {
            slotType: {
                label: "予約タイプ",
                placeholder: "すべて",
            },
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
            assignedAdmin: {
                label: "担当者",
                placeholder: "すべて",
            },
        },
    },

    /**
     * 予約管理
     */
    appointments: {
        title: "📝 予約管理",
        description: "予約を管理します",
        documentTitle: "予約管理",
        breadcrumbs: ["ホーム", "スケジュール管理", "予約管理"],
        actions: {
            ...CommonUIConstants.actions,
            confirm: "予約を確定",
            complete: "予約を完了",
        },
        pages: createPageTemplates("予約"),
        form: createFormTemplates("予約"),
        ui: createIndexPageUITemplates("予約", "件名、企業名で検索..."),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
            company: {
                label: "企業",
                placeholder: "すべて",
            },
            project: {
                label: "プロジェクト",
                placeholder: "すべて",
            },
        },
    },

    /**
     * 見積もり管理
     */
    quotes: {
        title: "📄 見積もり管理",
        description: "見積もりを管理します",
        documentTitle: "見積もり管理",
        breadcrumbs: ["ホーム", "見積もり管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("見積もり"),
        search: createSearchTemplate("見積もり"),
    },

    /**
     * 請求書管理
     */
    invoices: {
        title: "📄 請求書管理",
        description: "請求書を管理します",
        documentTitle: "請求書管理",
        breadcrumbs: ["ホーム", "請求書管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("請求書"),
        search: createSearchTemplate("請求書"),
    },

    /**
     * 領収書管理
     */
    receipts: {
        title: "📄 領収書管理",
        description: "領収書を管理します",
        documentTitle: "領収書管理",
        breadcrumbs: ["ホーム", "領収書管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("領収書"),
        search: createSearchTemplate("領収書"),
    },

    /**
     * プロジェクトテンプレート管理
     */
    projectTemplates: {
        title: "📋 プロジェクトテンプレート管理",
        description: "プロジェクトのテンプレートを管理します",
        documentTitle: "プロジェクトテンプレート管理",
        breadcrumbs: ["ホーム", "プロジェクトテンプレート管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("プロジェクトテンプレート"),
        ui: createIndexPageUITemplates(
            "プロジェクトテンプレート",
            "テンプレート名、説明で検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
        },
    },

    /**
     * プロジェクトカテゴリ管理
     */
    projectCategories: {
        title: "📂 プロジェクトカテゴリ管理",
        description: "プロジェクトの分類を管理します",
        documentTitle: "プロジェクトカテゴリ管理",
        breadcrumbs: ["ホーム", "プロジェクトカテゴリ管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        ui: createIndexPageUITemplates(
            "プロジェクトカテゴリ",
            "カテゴリ名、スラッグ、説明で検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
        },
    },

    /**
     * プロジェクト管理
     */
    projects: {
        title: "📁 プロジェクト管理",
        description: "プロジェクトを管理します",
        documentTitle: "プロジェクト管理",
        breadcrumbs: ["ホーム", "プロジェクト管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("プロジェクト"),
        ui: createIndexPageUITemplates(
            "プロジェクト",
            "プロジェクト名で検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべて",
            },
            priority: {
                label: "優先度",
                placeholder: "すべて",
            },
            category: {
                label: "カテゴリ",
                placeholder: "すべて",
            },
            admin: {
                label: "担当者",
                placeholder: "すべて",
            },
        },
    },

    /**
     * コンテンツ管理
     */
    //固定ページ管理
    contents: {
        title: "📝 コンテンツ管理",
        description: "コンテンツを管理します",
        documentTitle: "コンテンツ管理",
        breadcrumbs: ["ホーム", "コンテンツ管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("コンテンツ"),
        search: createSearchTemplate("コンテンツ"),
    },

    /**
     * ホームページ管理
     */
    //固定ページ管理
    pages: {
        title: "📄 固定ページ管理",
        description: "ホームページの固定ページを管理します",
        documentTitle: "固定ページ管理",
        breadcrumbs: ["ホーム", "ページ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("固定ページ"),
        search: createSearchTemplate("ページ"),
        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべてのステータス",
                options: {
                    active: "アクティブ",
                    inactive: "非アクティブ",
                    featured: "おすすめ",
                },
            },
        },
        confirmMessages: createConfirmMessageTemplates("ページ"),
        notifications: createNotificationTemplates("ページ"),
        // テーブルヘッダー
        table: {
            headers: {
                page: "ページ情報",
                template: "テンプレート",
                status: "状態",
                sortOrder: "表示順",
                updatedAt: "更新日時",
                actions: "操作",
            },
        },

        // バルクアクション
        bulkActions: {
            activate: "アクティブ化",
            deactivate: "非アクティブ化",
            delete: "削除",
        },
        form: createFormTemplates("ページ"),
    },

    // ブログカテゴリ管理
    blogCategories: {
        title: "📂 ブログカテゴリ管理",
        description: "ホームページのブログカテゴリを管理します",
        documentTitle: "ブログカテゴリ管理",
        breadcrumbs: ["ホーム", "ブログカテゴリ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("ブログカテゴリ"),
        search: createSearchTemplate("ブログカテゴリ"),
    },

    // ブログ管理
    blogs: {
        title: "📝 ブログ管理",
        description: "ホームページのブログ記事を管理します",
        documentTitle: "ブログ管理",
        breadcrumbs: ["ホーム", "ブログ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("ブログ"),
    },

    // FAQ管理
    faqs: {
        title: "❓ FAQ管理",
        description: "ホームページのよくある質問を管理します",
        documentTitle: "FAQ管理",
        breadcrumbs: ["ホーム", "FAQ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("FAQ"),

        // 検索・フィルター
        search: {
            placeholder: "FAQ名で検索...",
        },

        filters: {
            status: {
                label: "ステータス",
                placeholder: "すべてのステータス",
                options: {
                    active: "アクティブ",
                    inactive: "非アクティブ",
                    featured: "おすすめ",
                },
            },
        },

        // 確認メッセージ
        confirmMessages: createConfirmMessageTemplates("FAQ"),

        // 通知メッセージ
        notifications: createNotificationTemplates("FAQ"),

        // フォーム
        form: createFormTemplates("FAQ"),
    },

    // お問い合わせ管理
    contacts: {
        title: "📬 お問い合わせ管理",
        description: "ホームページのお問い合わせを管理します",
        documentTitle: "お問い合わせ管理",
        breadcrumbs: ["ホーム", "お問い合わせ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("お問い合わせ"),
        search: createSearchTemplate("お問い合わせ"),
        ui: createIndexPageUITemplates(
            "お問い合わせ",
            "お問い合わせ名で検索...",
        ),
    },

    // お問い合わせカテゴリ管理
    contactCategories: {
        title: "🏷️ カテゴリ管理",
        description: "お問い合わせのカテゴリを管理します",
        documentTitle: "カテゴリ管理",
        breadcrumbs: ["ホーム", "お問い合わせ", "カテゴリ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("カテゴリ"),
        search: createSearchTemplate("カテゴリ"),
        ui: createIndexPageUITemplates("カテゴリ", "カテゴリ名で検索..."),
    },

    /**
     * サービス管理
     */
    serviceTypes: {
        title: "🛎️ サービス管理",
        description: "サービスタイプを管理します",
        documentTitle: "サービス管理",
        breadcrumbs: ["ホーム", "サービス管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("サービス"),
        search: createSearchTemplate("サービス"),
        filters: {
            category: {
                label: "カテゴリ",
                placeholder: "すべてのカテゴリ",
            },
            pricingModel: {
                label: "料金体系",
                placeholder: "すべての料金体系",
            },
            status: {
                label: "ステータス",
                placeholder: "すべてのステータス",
                options: {
                    active: "アクティブ",
                    inactive: "非アクティブ",
                    featured: "おすすめ",
                },
            },
        },
        confirmMessages: createConfirmMessageTemplates("サービスタイプ"),
        notifications: createNotificationTemplates("サービスタイプ"),
        // テーブルヘッダー
        table: {
            headers: {
                serviceType: "サービスタイプ",
                category: "カテゴリ",
                pricingModel: "料金体系",
                basePrice: "基本価格",
                status: "ステータス",
                updatedAt: "更新日",
                actions: "操作",
            },
        },

        // バルクアクション
        bulkActions: {
            activate: "アクティブ化",
            deactivate: "非アクティブ化",
            delete: "削除",
        },

        // 作成・編集フォーム
        form: {
            create: {
                title: "新しいサービスタイプを作成",
                description:
                    "契約管理で使用するサービスタイプの詳細情報を入力してください",
                documentTitle: "サービスタイプ作成",
            },
            edit: {
                title: "サービスタイプを編集",
                description: "サービスタイプの詳細情報を編集してください",
                documentTitle: "サービスタイプ編集",
            },
            sections: {
                basicInfo: "基本情報",
                pricing: "料金設定",
                features: "機能・特徴",
                targeting: "ターゲティング",
                delivery: "成果物・技術",
                visual: "ビジュアル設定",
                advanced: "詳細設定",
            },
            fields: {
                name: "サービスタイプ名",
                productName: "商品愛称",
                version: "バージョン",
                category: "カテゴリ",
                description: "説明",
                detailedDescription: "詳細説明",
                pricingModel: "料金体系",
                basePrice: "基本価格",
                priceUnit: "価格単位",
                estimatedDeliveryDays: "標準納期（日数）",
                features: "特徴・機能",
                targetAudience: "対象顧客",
                deliverables: "成果物",
                technologies: "使用技術",
                icon: "アイコン",
                color: "テーマカラー",
                sortOrder: "表示順序",
                isActive: "アクティブ状態",
                isFeatured: "おすすめサービス",
                requiresConsultation: "要相談フラグ",
                consultationNote: "相談時の注意事項",
            },
            placeholders: {
                name: "例: コーポレートサイト制作",
                productName: "例: Spra Corporate",
                version: "例: 1.0",
                description: "サービスの概要を入力してください",
                detailedDescription: "詳細な説明を入力してください",
                basePrice: "例: 800000",
                estimatedDeliveryDays: "例: 30",
                features:
                    "カンマ区切りで入力（例: レスポンシブデザイン, CMS導入）",
                targetAudience:
                    "カンマ区切りで入力（例: 中小企業, スタートアップ）",
                deliverables:
                    "カンマ区切りで入力（例: Webサイト一式, 管理画面）",
                technologies: "カンマ区切りで入力（例: Laravel, React）",
                consultationNote: "相談時の注意事項を入力してください",
            },
            buttons: {
                save: "保存",
                saveAndContinue: "保存して続行",
                cancel: "キャンセル",
                back: "戻る",
                backToDetail: "詳細に戻る",
            },
            validation: {
                nameRequired: "サービスタイプ名は必須です",
                categoryRequired: "カテゴリを選択してください",
                pricingModelRequired: "料金体系を選択してください",
            },
        },
    },

    /**
     * サイト設定管理
     */
    siteSettings: {
        title: "⚙️ サイト設定管理",
        description: "サイト全体の設定を管理します",
        documentTitle: "サイト設定管理",
        breadcrumbs: ["ホーム", "サイト設定"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("サイト設定"),
    },

    /**
     * システム設定管理
     */
    systemSettings: {
        title: "⚙️ システム設定管理",
        description: "システム全体の設定を管理します",
        documentTitle: "システム設定管理",
        breadcrumbs: ["ホーム", "システム設定"],
        actions: {
            ...CommonUIConstants.actions,
        },
    },

    /**
     * ログ管理
     */
    logs: {
        title: "📝 ログ管理",
        description: "システム全体のログを管理します",
        documentTitle: "ログ管理",
        breadcrumbs: ["ホーム", "ログ管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
    },
};
