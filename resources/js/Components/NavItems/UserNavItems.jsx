/**
 * User Navigation Items
 *
 * Navigation structure for user sidebar
 */

import {
    HomeIcon,
    DocumentTextIcon,
    StarIcon,
    FolderIcon,
    CalendarDaysIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    MegaphoneIcon,
} from "@heroicons/react/24/solid";

export const getUserNavigationItems = () => {
    return [
        // ダッシュボード
        {
            name: "ダッシュボード",
            href: "user.dashboard",
            icon: HomeIcon,
            currentPath: "user.dashboard",
            children: [],
        },
        // 契約管理（契約・見積・請求・領収）
        {
            name: "契約管理",
            icon: DocumentTextIcon,
            currentPath: [
                "user.contract.*",
                "user.quote.*",
                "user.invoice.*",
                "user.receipt.*",
            ],
            children: [
                { name: "契約管理", href: "user.contract.index" },
                { name: "見積管理", href: "user.quote.index" },
                { name: "請求管理", href: "user.invoice.index" },
                { name: "領収管理", href: "user.receipt.index" },
            ],
        },
        // ポイント（ポイント・ポイント交換）
        {
            name: "ポイント",
            icon: StarIcon,
            currentPath: ["user.points.*", "user.point-redemptions.*"],
            children: [
                { name: "ポイント", href: "user.points.index" },
                {
                    name: "ポイント交換",
                    href: "user.point-redemptions.index",
                },
            ],
        },
        // プロジェクト（プロジェクト・進行状況）
        {
            name: "プロジェクト",
            icon: FolderIcon,
            currentPath: ["user.projects.*", "user.progress.*"],
            children: [
                { name: "プロジェクト", href: "user.projects.index" },
                {
                    name: "進行状況（ガントチャート）",
                    href: "user.progress.index",
                },
            ],
        },
        // カレンダー
        {
            name: "カレンダー",
            href: "user.calendar.index",
            icon: CalendarDaysIcon,
            currentPath: "user.calendar.*",
            children: [],
        },
        // 予約
        {
            name: "予約",
            href: "user.appointments.index",
            icon: ClockIcon,
            currentPath: "user.appointments.*",
            children: [],
        },
        // お知らせ
        {
            name: "お知らせ",
            href: "user.announcement.index",
            icon: MegaphoneIcon,
            currentPath: "user.announcement.*",
            children: [],
        },
        // お問い合わせ
        {
            name: "お問い合わせ",
            href: "user.contact.index",
            icon: ChatBubbleLeftRightIcon,
            currentPath: "user.contact.*",
            children: [],
        },
    ];
};
