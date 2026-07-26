import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { MegaphoneIcon } from "@heroicons/react/24/outline";

export default function Index({ announcements, readAnnouncementIds = [] }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "お知らせ", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="お知らせ"
                    description="運営からの重要なお知らせを確認できます"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="お知らせ" />

            <FlashMessage />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8">
                {announcements.data.length === 0 ? (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">
                                    お知らせはまだありません
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {announcements.data.map((announcement) => {
                            const isUnread = !readAnnouncementIds.includes(
                                announcement.id,
                            );

                            return (
                                <Link
                                    key={announcement.id}
                                    href={route(
                                        "user.announcement.show",
                                        announcement.id,
                                    )}
                                >
                                    <Card
                                        className={`hover:shadow-lg transition-shadow cursor-pointer ${
                                            isUnread
                                                ? "border-l-4 border-l-indigo-500"
                                                : ""
                                        }`}
                                    >
                                        <CardBody>
                                            <div className="flex items-start gap-4">
                                                <MegaphoneIcon className="h-8 w-8 text-indigo-500 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                            {
                                                                announcement.title
                                                            }
                                                        </p>
                                                        {isUnread && (
                                                            <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {announcement.published_at
                                                            ? new Date(
                                                                  announcement.published_at,
                                                              ).toLocaleDateString(
                                                                  "ja-JP",
                                                              )
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {announcements.links && (
                    <div className="mt-6">
                        <UserPagination links={announcements.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
