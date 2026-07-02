import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import TextInput from "@/Components/Forms/TextInput";
import InputLabel from "@/Components/Forms/InputLabel";
import InputError from "@/Components/Forms/InputError";

export default function OnboardingProgress({ user }) {
    const [completedSteps, setCompletedSteps] = useState({
        profile: !!user.profile,
        address:
            user.companies?.length > 0 &&
            user.companies[0]?.addresses?.length > 0,
        company: !!user.companies?.length > 0,
    });

    const progressSteps = [
        {
            id: "profile",
            title: "プロフィール情報",
            description: "氏名、連絡先などの基本情報を登録します",
            icon: UserIcon,
            href: route("user.onboarding.profile"),
            completed: completedSteps.profile,
            order: 1,
        },
        {
            id: "company",
            title: "会社情報",
            description: "会社の詳細情報を登録します",
            icon: BuildingOfficeIcon,
            href: route("user.onboarding.company"),
            completed: completedSteps.company,
            order: 2,
        },
        {
            id: "address",
            title: "会社住所",
            description: "会社の住所情報を登録します",
            icon: MapPinIcon,
            href: route("user.onboarding.address"),
            completed: completedSteps.address,
            order: 3,
        },
    ];

    const allCompleted = Object.values(completedSteps).every((v) => v === true);
    const completedCount = Object.values(completedSteps).filter(
        (v) => v === true,
    ).length;
    const totalSteps = progressSteps.length;
    const progressPercentage = Math.round((completedCount / totalSteps) * 100);

    return (
        <AuthenticatedLayout header="登録情報の完成">
            <Head title="登録情報の完成 | Smart Sprouts" />

            <div className="max-w-3xl mx-auto space-y-8">
                {/* ウェルカムセクション */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        ようこそ！
                    </h2>
                    <p className="text-gray-600 mb-6">
                        契約書作成までの最後のステップです。以下の情報を登録して、サービスをご利用いただけます。
                    </p>

                    {/* 進捗バー */}
                    <div className="bg-gray-100 rounded-full h-4 mb-3">
                        <div
                            className="bg-green-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600">
                        進捗: {completedCount}/{totalSteps} 完了 (
                        {progressPercentage}%)
                    </p>
                </div>

                {/* 登録ステップリスト */}
                <div className="space-y-4">
                    {progressSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = step.completed;

                        return (
                            <Link
                                key={step.id}
                                href={step.href}
                                className="block"
                            >
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all p-6 cursor-pointer">
                                    <div className="flex items-start">
                                        {/* ステップ番号と完了状態 */}
                                        <div className="flex-shrink-0 mr-6">
                                            {isCompleted ? (
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600 font-semibold">
                                                    {step.order}
                                                </div>
                                            )}
                                        </div>

                                        {/* コンテンツ */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {step.title}
                                                </h3>
                                                {isCompleted && (
                                                    <span className="text-sm font-medium text-green-600">
                                                        完了
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* 矢印 */}
                                        <div className="flex-shrink-0 ml-4">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* 完了メッセージ */}
                {allCompleted && (
                    <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                        <div className="flex items-start">
                            <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold text-green-900">
                                    すべての情報が登録されました
                                </h3>
                                <p className="mt-1 text-sm text-green-700">
                                    ご登録いただいた情報は確認後、契約書をお送りいたします。ご不明な点がございましたら、
                                    <Link
                                        href={route("public.contact")}
                                        className="underline font-semibold"
                                    >
                                        お問い合わせ
                                    </Link>
                                    ください。
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 注意事項 */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <div className="flex items-start">
                        <ClockIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900">
                                ご確認ください
                            </h3>
                            <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>正確な情報をご登録ください</li>
                                <li>すべての項目は必須です</li>
                                <li>登録後、確認メールをお送りします</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
