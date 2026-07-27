import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Badge } from "@/Components/Badges";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import {
    ArrowLeftIcon,
    CheckIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import AnnouncementForm from "./_components/AnnouncementForm";

export default function Edit({ announcement, audiences }) {
    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title,
        audience: announcement.audience,
        body: announcement.body,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.announcement.update", announcement.id));
    };

    const handlePublish = () => {
        if (
            confirm(
                "このお知らせを配信しますか？対象ユーザーへメールとダッシュボード通知が送信されます。この操作は取り消せません。",
            )
        ) {
            router.post(
                route("admin.announcement.publish", announcement.id),
            );
        }
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.announcement.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="お知らせ編集"
                    description="内容を編集します"
                    actions={headerActions}
                />
            }
        >
            <Head title="お知らせ編集" />
            <FlashMessage />

            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Badge
                                variant={
                                    announcement.is_published
                                        ? "success"
                                        : "secondary"
                                }
                            >
                                {announcement.is_published
                                    ? "配信済み"
                                    : "下書き"}
                            </Badge>
                            {announcement.sent_at && (
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {new Date(
                                        announcement.sent_at,
                                    ).toLocaleString("ja-JP")}
                                    に{announcement.recipient_count}
                                    件のユーザーへ配信済み
                                </span>
                            )}
                        </div>

                        {!announcement.is_published && (
                            <PrimaryButton onClick={handlePublish}>
                                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                                配信する
                            </PrimaryButton>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <AnnouncementForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            audiences={audiences}
                        />

                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                            <div className="flex items-center justify-end gap-3">
                                <SecondaryButton
                                    type="button"
                                    href={route("admin.announcement.index")}
                                    disabled={processing}
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    更新
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
