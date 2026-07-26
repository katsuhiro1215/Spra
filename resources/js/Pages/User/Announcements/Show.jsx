import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import {
    UserCard,
    UserCardHeader,
    UserCardTitle,
    UserCardBody,
} from "@/Components/User";
import { FlashMessage } from "@/Components/Notifications";
import { MegaphoneIcon } from "@heroicons/react/24/outline";

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

export default function Show({ announcement }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "お知らせ", href: route("user.announcement.index") },
        { label: announcement.title, href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title={announcement.title}
                    description={`公開日: ${formatDate(announcement.published_at)}`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={announcement.title} />

            <FlashMessage />

            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 py-8">
                <UserCard>
                    <UserCardHeader>
                        <div className="flex items-center gap-2">
                            <MegaphoneIcon className="h-6 w-6 text-indigo-500" />
                            <UserCardTitle>{announcement.title}</UserCardTitle>
                        </div>
                    </UserCardHeader>
                    <UserCardBody>
                        <p className="text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                            {announcement.body}
                        </p>
                    </UserCardBody>
                </UserCard>
            </div>
        </AuthenticatedLayout>
    );
}
