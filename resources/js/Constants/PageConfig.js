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
        detachMediaConfirmation: "プロフィール画像を削除してもよろしいですか？",
    },

    /**
     * 管理者住所管理
     */
    adminAddresses: {
        title: "📍 管理者住所管理",
        description: "管理者の住所を管理します",
        documentTitle: "管理者住所管理",
        breadcrumbs: ["ホーム", "管理者住所管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("管理者住所"),
        search: createSearchTemplate("管理者住所"),
        deleteConfirmation: "この住所を削除してもよろしいですか？",
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
     * メディア設定
     */
    mediaSettings: {
        title: "⚙️ メディア設定",
        description: "アップロード制限・自動圧縮・バリアント自動生成のルールを設定します",
        documentTitle: "メディア設定",
        breadcrumbs: ["ホーム", "メディア管理", "メディア設定"],
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

    // ポートフォリオ管理
    portfolios: {
        title: "🖼️ ポートフォリオ管理",
        description: "過去の制作物を管理します",
        documentTitle: "ポートフォリオ管理",
        breadcrumbs: ["ホーム", "ポートフォリオ管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("ポートフォリオ"),
        form: createFormTemplates("ポートフォリオ"),
        ui: createIndexPageUITemplates(
            "ポートフォリオ",
            "タイトルまたは説明で検索...",
        ),
        filters: {
            status: {
                label: "ステータス",
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
            ...CommonUIConstants.actions,
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
            ...CommonUIConstants.actions,
            create: "予約枠を作成",
            edit: "予約枠を編集",
            delete: "予約枠を削除",
            view: "予約枠を表示",
        },
        pages: createPageTemplates("予約枠"),
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
        ui: createIndexPageUITemplates(
            "見積もり",
            "見積番号、タイトル、クライアント名で検索...",
        ),
    },

    /**
     * 見積返信管理
     */
    quoteResponses: {
        title: "💬 見積返信管理",
        description: "クライアントからの見積返信内容を管理します",
        documentTitle: "見積返信管理",
        breadcrumbs: ["ホーム", "見積もり管理", "見積返信管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("見積もり返信"),
        search: createSearchTemplate("見積もり返信"),
        ui: createIndexPageUITemplates(
            "見積もり返信",
            "見積番号、タイトル、クライアント名で検索...",
        ),
    },

    /**
     * キャンペーン管理
     */
    campaigns: {
        title: "🎁 キャンペーン管理",
        description: "期間限定キャンペーンを管理します",
        documentTitle: "キャンペーン管理",
        breadcrumbs: ["ホーム", "キャンペーン管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("キャンペーン"),
        search: createSearchTemplate("キャンペーン"),
        ui: createIndexPageUITemplates(
            "キャンペーン",
            "キャンペーン名、コードで検索...",
        ),
    },

    /**
     * ポイント特典管理
     */
    pointRewards: {
        title: "🏅 ポイント特典管理",
        description: "ボーナスポイントの付与ルールを管理します",
        documentTitle: "ポイント特典管理",
        breadcrumbs: ["ホーム", "ポイント特典管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("ポイント特典"),
        search: createSearchTemplate("ポイント特典"),
        ui: createIndexPageUITemplates(
            "ポイント特典",
            "コード、特典名で検索...",
        ),
    },

    /**
     * 紹介管理
     */
    referrals: {
        title: "🤝 紹介管理",
        description: "既存顧客からの紹介を管理します",
        documentTitle: "紹介管理",
        breadcrumbs: ["ホーム", "紹介管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("紹介"),
        search: createSearchTemplate("紹介"),
        ui: createIndexPageUITemplates("紹介", "紹介コード、会社名で検索..."),
    },

    /**
     * 会員ランク管理
     */
    membershipRanks: {
        title: "🏆 会員ランク管理",
        description: "年間利用額に基づく会員ランクを管理します",
        documentTitle: "会員ランク管理",
        breadcrumbs: ["ホーム", "会員ランク管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("会員ランク"),
        search: createSearchTemplate("会員ランク"),
        ui: createIndexPageUITemplates(
            "会員ランク",
            "ランク名、キーで検索...",
        ),
    },

    /**
     * ポイント交換カタログ管理
     */
    pointCatalogItems: {
        title: "🎁 ポイント交換カタログ管理",
        description: "ポイントと交換できる商品・サービスを管理します",
        documentTitle: "ポイント交換カタログ管理",
        breadcrumbs: ["ホーム", "ポイント交換カタログ管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("カタログ商品"),
        search: createSearchTemplate("カタログ商品"),
        ui: createIndexPageUITemplates(
            "カタログ商品",
            "商品名で検索...",
        ),
    },

    /**
     * ポイント交換申請管理
     */
    pointRedemptions: {
        title: "🔄 ポイント交換申請管理",
        description: "クライアントからのポイント交換申請を確認・承認します",
        documentTitle: "ポイント交換申請管理",
        breadcrumbs: ["ホーム", "ポイント交換申請管理"],
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
        ui: createIndexPageUITemplates(
            "請求書",
            "請求書番号、クライアント名で検索...",
        ),
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
        ui: createIndexPageUITemplates(
            "領収書",
            "領収書番号、クライアント名で検索...",
        ),
    },

    /**
     * 契約管理
     */
    contracts: {
        title: "📄 契約管理",
        description: "契約情報を管理します",
        documentTitle: "契約管理",
        breadcrumbs: ["ホーム", "契約管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("契約"),
        search: createSearchTemplate("契約"),
        ui: createIndexPageUITemplates(
            "契約",
            "契約番号、タイトル、クライアント名で検索...",
        ),
    },

    /**
     * 契約グループ管理
     */
    contractGroups: {
        title: "🗂️ 契約グループ管理",
        description: "契約グループを管理します",
        documentTitle: "契約グループ管理",
        breadcrumbs: ["ホーム", "契約管理", "契約グループ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("契約グループ"),
        search: createSearchTemplate("契約グループ"),
        ui: createIndexPageUITemplates("契約グループ", "グループ名で検索..."),
    },

    /**
     * 契約書テンプレート管理
     */
    contractTemplates: {
        title: "📄 契約書テンプレート管理",
        description: "契約条項・特別条項のテンプレートを管理します",
        documentTitle: "契約書テンプレート管理",
        breadcrumbs: ["ホーム", "契約書テンプレート管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("契約書テンプレート"),
        ui: createIndexPageUITemplates(
            "契約書テンプレート",
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
     * Webサイト管理
     */
    websiteDashboard: {
        title: "🏠 Webサイト管理",
        description: "Webサイトの管理を行います",
        documentTitle: "Webサイト管理",
        breadcrumbs: ["ホーム", "Webサイト管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("Webサイト管理"),
    },

    //固定ページ管理
    pageTypes: {
        title: "📄 ページタイプ管理",
        description: "ホームページのページタイプを管理します",
        documentTitle: "ページタイプ管理",
        breadcrumbs: ["ホーム", "ページタイプ管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("ページタイプ"),
        search: createSearchTemplate("ページタイプ"),
        ui: createIndexPageUITemplates(
            "ページタイプ",
            "ページタイプ名またはスラッグで検索...",
        ),
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
        confirmMessages: createConfirmMessageTemplates("ページタイプ"),
        notifications: createNotificationTemplates("ページタイプ"),
        form: createFormTemplates("ページタイプ"),
    },

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

    //セクション管理
    sections: {
        title: "📄 セクション管理",
        description: "ホームページのセクションを管理します",
        documentTitle: "セクション管理",
        breadcrumbs: ["ホーム", "セクション管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("セクション"),
        search: createSearchTemplate("セクション"),
        ui: createIndexPageUITemplates(
            "セクション",
            "セクション名またはスラッグで検索...",
        ),
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
        confirmMessages: createConfirmMessageTemplates("セクション"),
        notifications: createNotificationTemplates("セクション"),
        form: createFormTemplates("セクション"),
    },

    // 投稿カテゴリ管理
    postCategories: {
        title: "📂 投稿カテゴリ管理",
        description: "ホームページの投稿カテゴリを管理します",
        documentTitle: "投稿カテゴリ管理",
        breadcrumbs: ["ホーム", "投稿カテゴリ"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("投稿カテゴリ"),
        search: createSearchTemplate("投稿カテゴリ"),
    },

    // 投稿管理
    posts: {
        title: "📝 投稿管理",
        description: "ホームページの投稿を管理します",
        documentTitle: "投稿管理",
        breadcrumbs: ["ホーム", "投稿"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("投稿"),
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

    // 返信管理（Contact横断の一覧）
    responses: {
        title: "💬 返信管理",
        description: "全お問い合わせからの返信を一元管理します",
        documentTitle: "返信管理",
        breadcrumbs: ["ホーム", "お問い合わせ", "返信管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("返信"),
        search: createSearchTemplate("返信"),
        ui: createIndexPageUITemplates(
            "返信",
            "お問い合わせ者名またはメールアドレスで検索...",
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

    // 返信テンプレート管理
    responseTemplates: {
        title: "📄 返信テンプレート管理",
        description: "お問い合わせの返信テンプレートを管理します",
        documentTitle: "返信テンプレート管理",
        breadcrumbs: ["ホーム", "お問い合わせ", "返信テンプレート"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("返信テンプレート"),
        search: createSearchTemplate("返信テンプレート"),
        ui: createIndexPageUITemplates(
            "返信テンプレート",
            "返信テンプレート名で検索...",
        ),
    },

    /**
     * お問い合わせAPI連携クライアント管理
     */
    contactApiClients: {
        title: "🔌 API連携設定",
        description:
            "外部サイト(WordPress等)からのお問い合わせAPI連携クライアントを管理します",
        documentTitle: "API連携設定",
        breadcrumbs: ["ホーム", "お問い合わせ", "API連携設定"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("APIクライアント"),
        search: createSearchTemplate("APIクライアント"),
        ui: createIndexPageUITemplates("APIクライアント", "連携先名で検索..."),
    },

    /**
     * 外部サービス連携（SaaS等へのリンク・APIデータ取得）
     */
    externalServices: {
        title: "🔗 外部サービス連携",
        description:
            "外部で運用しているSaaS等のサービスへのリンクと、API経由で取得したデータを一元管理します",
        documentTitle: "外部サービス連携",
        breadcrumbs: ["ホーム", "外部サービス連携"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("外部サービス"),
        search: createSearchTemplate("外部サービス"),
        ui: createIndexPageUITemplates(
            "外部サービス",
            "サービス名・分類で検索...",
        ),
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
     * 権限管理
     */
    permissions: {
        title: "🔐 権限管理",
        description: "ロールごとのデフォルト権限を管理します",
        documentTitle: "権限管理",
        breadcrumbs: ["ホーム", "権限管理"],
    },

    /**
     * 勤怠管理
     */
    attendance: {
        title: "🕒 勤怠管理",
        description: "管理者の出退勤・シフト予定を管理します",
        documentTitle: "勤怠管理",
        breadcrumbs: ["ホーム", "勤怠管理"],
        actions: {
            ...CommonUIConstants.actions,
        },
        pages: createPageTemplates("勤怠"),
    },

    /**
     * 給与計算
     */
    payroll: {
        title: "💰 給与計算",
        description: "勤怠実績から月次の支給額を概算します（税・社会保険料は未対応）",
        documentTitle: "給与計算",
        breadcrumbs: ["ホーム", "給与計算"],
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
     * 営業時間管理の変更履歴
     */
    scheduleHistory: {
        title: "🕘 変更履歴",
        description: "営業時間・例外日・祝日の変更履歴を確認します",
        documentTitle: "営業時間の変更履歴",
        breadcrumbs: ["ホーム", "スケジュール管理", "変更履歴"],
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

    /**
     * 全体検索
     */
    search: {
        title: "🔍 検索結果",
        description: "会社・顧客・プロジェクトなど全体を横断して検索します",
        documentTitle: "検索結果",
        breadcrumbs: ["ホーム", "検索結果"],
    },

    /**
     * バッチ実行管理（リマインダー実行状況）
     */
    batchReminders: {
        title: "🔔 リマインダー実行状況",
        description:
            "予約リマインダーの送信状況をクライアント・日付ごとに確認します",
        documentTitle: "リマインダー実行状況",
        breadcrumbs: ["ホーム", "バッチ実行管理", "リマインダー実行状況"],
    },
};
