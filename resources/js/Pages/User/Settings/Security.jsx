import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";

export default function Security({ twoFactorEnabled }) {
    const { flash } = usePage().props;
    const [toggling, setToggling] = useState(false);

    const toggle = () => {
        router.put(
            route("user.settings.security.update"),
            { two_factor_enabled: !twoFactorEnabled },
            {
                preserveScroll: true,
                onStart: () => setToggling(true),
                onFinish: () => setToggling(false),
            },
        );
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "設定", href: route("user.settings.index") },
        { label: "セキュリティ", href: "#" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="セキュリティ"
                    description="ログイン時の二段階認証を設定します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="セキュリティ設定" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardBody>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                        二段階認証（メール認証）
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        有効にすると、ログイン時にパスワードに加えて、メールに送信される6桁の認証コードの入力が必要になります。
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggle}
                                    disabled={toggling}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                        twoFactorEnabled
                                            ? "bg-green-600"
                                            : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            twoFactorEnabled
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                            <p className="mt-4 text-sm font-medium">
                                現在の状態:{" "}
                                <span
                                    className={
                                        twoFactorEnabled
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-gray-500 dark:text-gray-400"
                                    }
                                >
                                    {twoFactorEnabled ? "有効" : "無効"}
                                </span>
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
