import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";

export default function Index() {
    const settings = [
        {
            title: "プロフィール（メール・パスワード）",
            description: "ログイン用のメールアドレスやパスワードを変更",
            href: route("user.profile.edit"),
            icon: "🔑",
        },
        {
            title: "個人情報",
            description: "氏名・連絡先などのプロフィール情報を編集",
            href: route("user.settings.profile.edit"),
            icon: "👤",
        },
        {
            title: "会社情報",
            description: "会社の詳細情報を編集",
            href: route("user.settings.company.edit"),
            icon: "🏢",
        },
        {
            title: "会社住所",
            description: "会社の住所情報を編集",
            href: route("user.settings.company-address.edit"),
            icon: "📍",
        },
        {
            title: "ご自身の住所",
            description: "ご自身の住所情報を編集",
            href: route("user.settings.address.edit"),
            icon: "🏠",
        },
        {
            title: "セキュリティ",
            description: "二段階認証（メール認証）の設定",
            href: route("user.settings.security.edit"),
            icon: "🔒",
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="設定"
                    description="アカウント設定を管理します"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        { label: "設定", href: "#" },
                    ]}
                />
            }
        >
            <Head title="設定" />

            <div className="space-y-6">
                {/* 設定一覧 */}
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {settings.map((setting) => (
                            <Link
                                key={setting.title}
                                href={setting.href}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-indigo-500"
                            >
                                <div className="flex items-start">
                                    <span className="text-3xl mr-4">
                                        {setting.icon}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {setting.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {setting.description}
                                        </p>
                                    </div>
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
