import { Head, Link } from "@inertiajs/react";
import {
    DocumentTextIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { Card, CardHeader, CardBody, CardTitle } from "@/Components/Card";
import Badge from "@/Components/Badge";

export default function Dashboard({ pendingContracts = [] }) {
    const stats = [
        {
            label: "署名待ち契約",
            value: pendingContracts.length,
            icon: ExclamationTriangleIcon,
            color: "bg-yellow-50 text-yellow-600",
        },
        {
            label: "完了契約",
            value: 0,
            icon: CheckCircleIcon,
            color: "bg-green-50 text-green-600",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="ダッシュボード" />

            <div className="space-y-6">
                {/* ページヘッダー */}
                <UserPageHeader
                    title="ダッシュボード"
                    description="契約情報と重要なタスク"
                    breadcrumbs={[
                        { label: "ホーム", href: route("user.dashboard") },
                    ]}
                />

                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* 署名待ちの契約 */}
                {pendingContracts && pendingContracts.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                                <CardTitle>署名待ちの契約</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody>
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
                        </CardBody>
                    </Card>
                )}

                {/* 契約がない場合 */}
                {!pendingContracts ||
                    (pendingContracts.length === 0 && (
                        <Card>
                            <CardBody>
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
                            </CardBody>
                        </Card>
                    ))}
            </div>
        </AuthenticatedLayout>
    );
}
