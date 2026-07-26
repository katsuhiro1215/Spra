import { Head, Link } from "@inertiajs/react";
import {
    DocumentTextIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    BanknotesIcon,
    QuestionMarkCircleIcon,
    MegaphoneIcon,
} from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import {
    UserCard,
    UserCardHeader,
    UserCardBody,
    UserCardTitle,
    AtlasMembershipCard,
} from "@/Components/User";
import Badge from "@/Components/Badge";

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

export default function Dashboard({
    pendingContracts = [],
    unpaidInvoices = [],
    recentAnnouncements = [],
    readAnnouncementIds = [],
}) {
    const stats = [
        {
            label: "署名待ち契約",
            value: pendingContracts.length,
            icon: ExclamationTriangleIcon,
            color: "bg-yellow-50 text-yellow-600",
        },
        {
            label: "未払い請求書",
            value: unpaidInvoices.length,
            icon: BanknotesIcon,
            color: "bg-red-50 text-red-600",
        },
        {
            label: "完了契約",
            value: 0,
            icon: CheckCircleIcon,
            color: "bg-green-50 text-green-600",
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="ダッシュボード"
                    description="契約情報と重要なタスク"
                    breadcrumbs={[
                        { label: "ホーム", href: route("user.dashboard") },
                    ]}
                />
            }
        >
            <Head title="ダッシュボード" />

            <div className="space-y-6">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`rounded-lg p-3 ${stat.color}`}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Atlas会員向け紹介カード（会員でない場合は非表示） */}
                <AtlasMembershipCard />

                {/* お知らせ */}
                {recentAnnouncements && recentAnnouncements.length > 0 && (
                    <UserCard className="border-indigo-200 bg-indigo-50">
                        <UserCardHeader>
                            <div className="flex items-center gap-2">
                                <MegaphoneIcon className="h-6 w-6 text-indigo-600" />
                                <UserCardTitle>お知らせ</UserCardTitle>
                            </div>
                        </UserCardHeader>
                        <UserCardBody>
                            <div className="space-y-3">
                                {recentAnnouncements.map((announcement) => {
                                    const isUnread =
                                        !readAnnouncementIds.includes(
                                            announcement.id,
                                        );

                                    return (
                                        <Link
                                            key={announcement.id}
                                            href={route(
                                                "user.announcement.show",
                                                announcement.id,
                                            )}
                                            className="block"
                                        >
                                            <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg hover:shadow-md transition">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {isUnread && (
                                                        <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                                    )}
                                                    <h4 className="font-medium text-gray-900 truncate">
                                                        {announcement.title}
                                                    </h4>
                                                </div>
                                                <span className="text-sm text-gray-500 flex-shrink-0">
                                                    {announcement.published_at
                                                        ? new Date(
                                                              announcement.published_at,
                                                          ).toLocaleDateString(
                                                              "ja-JP",
                                                          )
                                                        : "-"}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            <Link
                                href={route("user.announcement.index")}
                                className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                                すべてのお知らせを見る →
                            </Link>
                        </UserCardBody>
                    </UserCard>
                )}

                {/* 未払いの請求書 */}
                {unpaidInvoices && unpaidInvoices.length > 0 && (
                    <UserCard className="border-red-200 bg-red-50">
                        <UserCardHeader>
                            <div className="flex items-center gap-2">
                                <BanknotesIcon className="h-6 w-6 text-red-600" />
                                <UserCardTitle>未払いの請求書</UserCardTitle>
                            </div>
                        </UserCardHeader>
                        <UserCardBody>
                            <div className="space-y-3">
                                {unpaidInvoices.map((invoice) => (
                                    <Link
                                        key={invoice.id}
                                        href={route(
                                            "user.invoice.show",
                                            invoice.id,
                                        )}
                                        className="block"
                                    >
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">
                                                    {invoice.invoice_number}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    支払期限:{" "}
                                                    {invoice.due_date
                                                        ? new Date(
                                                              invoice.due_date,
                                                          ).toLocaleDateString(
                                                              "ja-JP",
                                                          )
                                                        : "-"}
                                                </p>
                                            </div>
                                            <span className="font-semibold text-gray-900 mr-3">
                                                {formatAmount(
                                                    invoice.total_amount,
                                                )}
                                            </span>
                                            <Badge className="bg-red-100 text-red-800">
                                                {invoice.status === "overdue"
                                                    ? "期限超過"
                                                    : "未払い"}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={route("user.invoice.index")}
                                className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                                すべての請求書を見る →
                            </Link>
                        </UserCardBody>
                    </UserCard>
                )}

                {/* 署名待ちの契約 */}
                {pendingContracts && pendingContracts.length > 0 && (
                    <UserCard className="border-yellow-200 bg-yellow-50">
                        <UserCardHeader>
                            <div className="flex items-center gap-2">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                                <UserCardTitle>署名待ちの契約</UserCardTitle>
                            </div>
                        </UserCardHeader>
                        <UserCardBody>
                            <div className="space-y-3">
                                {pendingContracts.map((contract) => (
                                    <Link
                                        key={contract.id}
                                        href={route(
                                            "user.contract.show",
                                            contract.id,
                                        )}
                                        className="block"
                                    >
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">
                                                    {contract.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    契約番号:{" "}
                                                    {contract.contract_number}
                                                </p>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                署名待ち
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={route("user.contract.index")}
                                className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                                すべての契約を見る →
                            </Link>
                        </UserCardBody>
                    </UserCard>
                )}

                {/* 契約がない場合 */}
                {!pendingContracts ||
                    (pendingContracts.length === 0 && (
                        <UserCard>
                            <UserCardBody>
                                <div className="text-center py-8">
                                    <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">
                                        対応が必要な契約はありません
                                    </p>
                                    <Link
                                        href={route("user.contract.index")}
                                        className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                    >
                                        すべての契約を見る
                                    </Link>
                                </div>
                            </UserCardBody>
                        </UserCard>
                    ))}
            </div>

            {/* よくある質問（FAQ）への導線 */}
            <Link
                href={route("user.faq.index")}
                title="よくある質問"
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
            >
                <QuestionMarkCircleIcon className="h-8 w-8" />
            </Link>
        </AuthenticatedLayout>
    );
}
