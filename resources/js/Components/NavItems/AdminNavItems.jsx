/**
 * Admin Navigation Items
 *
 * Navigation structure for admin sidebar
 */

export const getAdminNavigationItems = () => {
    return [
        // ダッシュボード
        {
            name: "ダッシュボード",
            href: "admin.dashboard",
            icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
            currentPath: "admin.dashboard",
            children: [],
        },
        // 各種データ管理
        {
            name: "各種データ",
            href: "admin.contact.index",
            icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235",
            currentPath: [
                "admin.user.*",
                "admin.company.*",
                "admin.contact.*",
                "admin.response.*",
                "admin.quote.*",
                "admin.contract.*",
                "admin.contract-group.*",
                "admin.quote-response.*",
                "admin.invoice.*",
                "admin.receipt.*",
                "admin.payment.*",
                "admin.project.*",
            ],
            children: [
                { name: "ユーザー一覧", href: "admin.user.index" },
                { name: "会社一覧", href: "admin.company.index" },
                { name: "お問い合わせ", href: "admin.contact.index" },
                {
                    name: "お問い合わせカテゴリー",
                    href: "admin.contact.category.index",
                },
                { name: "お問い合わせ返信", href: "admin.response.index" },
                { name: "API連携設定", href: "admin.contact.api-client.index" },
                { name: "契約管理", href: "admin.contract.index" },
                { name: "契約グループ", href: "admin.contract-group.index" },
                { name: "見積管理", href: "admin.quote.index" },
                { name: "見積返信", href: "admin.quote-response.index" },
                // 商談管理
                // 提案管理
                { name: "請求書", href: "admin.invoice.index" },
                { name: "領収書", href: "admin.receipt.index" },
                { name: "入金確認", href: "admin.payment.index" },
                // 未払一覧
                // 再請求一覧
                // 定期請求一覧
            ],
        },
        // サービス管理
        {
            name: "サービス管理",
            href: "admin.service.index",
            icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
            currentPath: "admin.service.*",
            children: [
                { name: "サービス一覧", href: "admin.service.index" },
                { name: "新規サービス", href: "admin.service.create" },
                { name: "サービス項目", href: "admin.service.item.index" },
                { name: "サービスプラン", href: "admin.service.plan.index" },
                {
                    name: "カテゴリ管理",
                    href: "admin.service.category.index",
                },
                {
                    name: "使用技術管理",
                    href: "admin.service.technology.index",
                },
                {
                    name: "実績・ポートフォリオ管理",
                    href: "admin.portfolio.index",
                },
                { name: "プロジェクト一覧", href: "admin.project.index" },
            ],
        },
        // スケジュール管理
        {
            name: "スケジュール管理",
            href: "admin.schedules.index",
            icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
            currentPath: "admin.schedules.*",
            children: [
                {
                    name: "カレンダー",
                    href: "admin.schedules.index",
                },
                {
                    name: "予約一覧",
                    href: "admin.appointments.index",
                },
                {
                    name: "予約枠",
                    href: "admin.appointment-slots.index",
                },
                {
                    name: "営業時間",
                    href: "admin.schedules.defaults.index",
                },
                {
                    name: "例外日",
                    href: "admin.schedules.exceptions.index",
                },
                { name: "祝日", href: "admin.schedules.holidays.index" },
                {
                    name: "リマインダー実行状況",
                    href: "admin.batch.reminders.index",
                },
            ],
        },
        // Webサイト管理
        {
            name: "Webサイト管理",
            href: "admin.website.dashboard",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: [
                "admin.website.*",
                "admin.faq.*",
                "admin.media.*",
            ],
            children: [
                {
                    name: "ダッシュボード",
                    href: "admin.website.dashboard",
                },
                { name: "固定ページ", href: "admin.website.page.index" },
                { name: "ページタイプ", href: "admin.website.page.type.index" },
                { name: "セクション", href: "admin.website.section.index" },
                { name: "投稿", href: "admin.website.post.index" },
                {
                    name: "投稿カテゴリ",
                    href: "admin.website.post.category.index",
                },
                { name: "メニュー", href: "admin.website.menu.index" },
                { name: "FAQ", href: "admin.website.faq.index" },
                {
                    name: "FAQカテゴリ",
                    href: "admin.website.faq.category.index",
                },
                {
                    name: "サイト設定",
                    href: "admin.website.siteSetting.index",
                },
                { name: "一般設定", href: "admin.website.siteSetting.general" },
                {
                    name: "ナビゲーション設定",
                    href: "admin.website.siteSetting.navigation",
                },
                {
                    name: "フッター設定",
                    href: "admin.website.siteSetting.footer",
                },
                { name: "SEO設定", href: "admin.website.siteSetting.seo" },
                { name: "OGP設定", href: "admin.website.siteSetting.ogp" },
            ],
        },

        // 分析管理
        {
            name: "分析管理",
            href: "admin.analytics.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: "admin.analytics.*",
            children: [
                {
                    name: "概要",
                    href: "admin.analytics.index",
                    query: { tab: "overview" },
                },
                {
                    name: "アクセス解析",
                    href: "admin.analytics.index",
                    query: { tab: "traffic" },
                },
                {
                    name: "流入元",
                    href: "admin.analytics.index",
                    query: { tab: "referrers" },
                },
                {
                    name: "検索キーワード",
                    href: "admin.analytics.index",
                    query: { tab: "keywords" },
                },
                {
                    name: "業務KPI",
                    href: "admin.analytics.index",
                    query: { tab: "business" },
                },
            ],
        },
        // メディア管理
        {
            name: "メディア管理",
            href: "admin.media.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: "admin.media.*",
            children: [
                { name: "メディア一覧", href: "admin.media.index" },
                { name: "新規アップロード", href: "admin.media.create" },
                // 画像
                // 動画
                // PDF
                // ファイル
            ],
        },
        // 管理者管理
        {
            name: "管理者管理",
            href: "admin.admin.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: "admin.admin.*",
            children: [
                { name: "管理者一覧", href: "admin.admin.index" },
                { name: "新規作成", href: "admin.admin.create" },
                {
                    name: "権限管理",
                    href: "admin.permissions.index",
                    ownerOnly: true,
                },
                { name: "ログ", href: "admin.admin.create" },
            ],
        },
        // システム管理
        {
            name: "システム管理",
            href: "admin.systemSetting.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: ["admin.systemSetting.*"],
            children: [
                // { name: "システム設定", href: "admin.system.settings" },
                { name: "組織設定", href: "admin.organization.edit" },
                {
                    name: "組織沿革",
                    href: "admin.organization.history.index",
                },
                // { name: "メール設定", href: "admin.system.mail-settings" },
                // { name: "通知設定", href: "admin.system.notification-settings" },
                { name: "ログ管理", href: "admin.logs.index" },
                // { name: "バックアップ", href: "admin.system.backup" },
                { name: "文書一覧", href: "admin.documents.index" },
                { name: "新規文書作成", href: "admin.documents.create" },
                { name: "同意記録", href: "admin.documentAcceptances.index" },
                {
                    name: "お問い合わせ返信テンプレート",
                    href: "admin.response.template.index",
                },
                {
                    name: "プロジェクトテンプレート",
                    href: "admin.project.template.index",
                },
            ],
        },
    ];
};
