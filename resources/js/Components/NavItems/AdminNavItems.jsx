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
        // お問い合わせ管理
        {
            name: "お問い合わせ管理",
            href: "admin.contact.index",
            icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235",
            currentPath: [
                "admin.contact.*",
                "admin.response.*",
                "admin.response.template.*",
            ],
            children: [
                { name: "お問い合わせ一覧", href: "admin.contact.index" },
                { name: "カテゴリ管理", href: "admin.contact.category.index" },
                { name: "返信一覧", href: "admin.response.index" },
                {
                    name: "テンプレート一覧",
                    href: "admin.response.template.index",
                },
            ],
        },
        // 営業管理（ビジネスフローの開始）
        {
            name: "営業管理",
            href: "admin.contract.index",
            icon: " M3.75 3v11.25c0 .621.504 1.125 1.125 1.125H9l3 3v-3h5.25c.621 0 1.125-.504 1.125-1.125V3a1.125 1.125 0 00-1.125-1.125H4.875A1.125 1.125 0 003.75 3z",
            currentPath: [
                "admin.quote.*",
                "admin.contract.*",
                "admin.quote-response.*",
            ],
            children: [
                { name: "契約管理", href: "admin.contract.index" },
                { name: "見積管理", href: "admin.quote.index" },
                { name: "見積返信", href: "admin.quote-response.index" },
                // 商談管理
                // 提案管理
            ],
        },
        // 顧客管理
        {
            name: "顧客管理",
            href: "admin.user.index",
            icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
            currentPath: ["admin.user.*", "admin.company.*"],
            children: [
                { name: "ユーザー一覧", href: "admin.user.index" },
                { name: "新規ユーザー", href: "admin.user.create" },
                { name: "会社一覧", href: "admin.company.index" },
                { name: "新規会社", href: "admin.company.create" },
            ],
        },
        // プロジェクト管理（契約後の実行フェーズ）
        {
            name: "プロジェクト管理",
            href: "admin.project.index",
            icon: "M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122",
            currentPath: "admin.project.*",
            children: [
                { name: "プロジェクト一覧", href: "admin.project.index" },
                { name: "新規プロジェクト", href: "admin.project.create" },
                {
                    name: "プロジェクトテンプレート",
                    href: "admin.project.template.index",
                },
            ],
        },
        // 請求管理（ビジネスフローの中盤）
        {
            name: "請求管理",
            href: "admin.invoice.index",
            icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
            currentPath: [
                "admin.invoice.*",
                "admin.receipt.*",
                "admin.payment.*",
            ],
            children: [
                { name: "請求書", href: "admin.invoice.index" },
                { name: "請求書作成", href: "admin.invoice.create" },
                { name: "領収書", href: "admin.receipt.index" },
                { name: "領収書作成", href: "admin.receipt.create" },
                { name: "入金確認", href: "admin.payment.index" },
                // 未払一覧
                // 再請求一覧
                // 定期請求一覧
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
                { name: "オプション", href: "admin.service.index" },
                { name: "価格設定", href: "admin.service.index" },
            ],
        },
        // Webサイト管理
        {
            name: "Webサイト管理",
            href: "admin.website.dashboard",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: ["admin.website.*", "admin.faq.*", "admin.media.*"],
            children: [
                { name: "ページ", href: "admin.website.page.index" },
                { name: "ページタイプ", href: "admin.website.page.type.index" },
                { name: "投稿", href: "admin.website.post.index" },
                {
                    name: "カテゴリ",
                    href: "admin.website.post.category.index",
                },
                { name: "FAQ", href: "admin.website.faq.index" },
                { name: "FAQカテゴリ", href: "admin.website.faq.category.index" },
                { name: "ナビゲーション", href: "admin.website.siteSetting.navigation" },
                { name: "フッター", href: "admin.website.siteSetting.footer" },
                { name: "SEO", href: "admin.website.siteSetting.seo" },
                { name: "OGP", href: "admin.website.siteSetting.ogp" },
                {
                    name: "サイト設定",
                    href: "admin.website.siteSetting.index",
                },
            ],
        },
        // 分析管理
        {
            name: "分析管理",
            href: "admin.media.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: "admin.media.*",
            children: [
                { name: "ダッシュボード", href: "admin.media.index" },
                { name: "アクセス解析", href: "admin.media.index" },
                { name: "流入元", href: "admin.media.index" },
                { name: "人気ページ", href: "admin.media.index" },
                { name: "検索キーワード", href: "admin.media.index" },
                { name: "問い合わせ分析", href: "admin.media.index" },
                { name: "契約分析", href: "admin.media.index" },
                { name: "保守分析", href: "admin.media.index" },
                { name: "KPI", href: "admin.media.index" },
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
                { name: "権限", href: "admin.admin.create" },
                { name: "ロール", href: "admin.admin.create" },
                { name: "ログ", href: "admin.admin.create" },
            ],
        },
        // システム管理
        {
            name: "システム管理",
            href: "admin.systemSetting.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: "admin.systemSetting.*",
            children: [
                // { name: "システム設定", href: "admin.system.settings" },
                // { name: "メール設定", href: "admin.system.mail-settings" },
                // { name: "通知設定", href: "admin.system.notification-settings" },
                // { name: "ログ管理", href: "admin.system.logs" },
                // { name: "バックアップ", href: "admin.system.backup" },
            ],
        },
    ];
};
