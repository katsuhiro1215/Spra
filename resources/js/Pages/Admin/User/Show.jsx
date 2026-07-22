import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { CreateButton, EditButton } from "@/Components/Buttons";
import { Dl, Dt, Dd } from "@/Components/Description";
import { Badge } from "@/Components/Badges";
import Avatar from "@/Components/Avatar";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import TabNavigation from "@/Components/TabNavigation";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { getStatusBadge } from "@/Constants/Badges";
import UserBasicInfo from "./_components/UserBasicInfo";
import UserAddresses from "./_components/UserAddresses";
import UserCompanies from "./_components/UserCompanies";
import UserContracts from "./_components/UserContracts";

export default function Show({ user, contracts = [], mediaList = [] }) {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);
    const [activeTab, setActiveTab] = useState("basic");

    const companies = user.companies || [];

    const tabs = [
        {
            key: "basic",
            label: "基本情報",
        },
        {
            key: "addresses",
            label: "住所情報",
            count: (user.addresses || []).length,
        },
        {
            key: "companies",
            label: "所属会社",
            count: companies.length,
        },
        {
            key: "contracts",
            label: "契約情報",
            count: contracts.length,
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "basic":
                return <UserBasicInfo user={user} />;
            case "addresses":
                return <UserAddresses user={user} />;
            case "companies":
                return <UserCompanies companies={companies} />;
            case "contracts":
                return <UserContracts contracts={contracts} />;
            default:
                return null;
        }
    };

    const handleMediaSelect = (mediaId) => {
        // プロフィールにメディアを設定
        router.post(
            route("admin.user.profile.attachMedia", user.id),
            { media_id: mediaId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setShowMediaModal(false);
                },
            },
        );
    };

    const handleMediaUploaded = (newMedia) => {
        setMediaListState((prev) => [newMedia, ...prev]);
    };

    const handleDetachMedia = () => {
        if (confirm(PageConfig.admins.profile.detachMediaConfirmation)) {
            router.delete(route("admin.user.profile.detachMedia", user.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.users.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.user.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.users.breadcrumbs,
        PageConfig.users.pages.show.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`ユーザー詳細 - ${user.email}`}
                    description="ユーザーの詳細情報"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`ユーザー詳細 - ${user.email}`} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* 左カラム: 基本情報 */}
                <Card className="sm:col-span-1">
                    <CardBody>
                        {/* アバター */}
                        <div className="flex flex-col justify-center items-center space-y-6">
                            <div className="relative group">
                                {user.profile?.media ? (
                                    <div className="relative">
                                        <img
                                            src={user.profile.media.url}
                                            alt={
                                                user.profile.full_name ||
                                                user.email
                                            }
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    setShowMediaModal(true)
                                                }
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full"
                                            >
                                                <CameraIcon className="h-5 w-5 text-slate-700" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowMediaModal(true)}
                                        className="relative"
                                    >
                                        <Avatar
                                            name={
                                                user.profile?.full_name ||
                                                user.email
                                            }
                                            size="2xl"
                                            rounded="full"
                                            variant="primary"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full">
                                                <CameraIcon className="h-5 w-5 text-slate-700" />
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
                            {user.profile?.media && (
                                <button
                                    onClick={handleDetachMedia}
                                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    画像を削除
                                </button>
                            )}
                            {/* 名前 */}
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {user.profile?.full_name || "名前未設定"}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {user.email}
                                </p>
                            </div>
                            {/* ステータスバッジ */}
                            <div className="flex justify-center space-x-2">
                                <Badge
                                    variant={getStatusBadge(user.status).variant}
                                    size="sm"
                                >
                                    {getStatusBadge(user.status).text}
                                </Badge>
                            </div>
                            {/* 基本情報 */}
                            <Dl variant="default">
                                <div className="flex items-center gap-2">
                                    <Dt>メールアドレス:</Dt>
                                    <Dd>{user.email}</Dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dt>ステータス:</Dt>
                                    <Dd>{getStatusBadge(user.status).text}</Dd>
                                </div>
                                {companies.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Dt>所属会社:</Dt>
                                        <Dd>
                                            {companies.find(
                                                (c) => c.pivot?.is_primary,
                                            )?.name ?? companies[0].name}
                                            {companies.length > 1 &&
                                                ` 他${companies.length - 1}件`}
                                        </Dd>
                                    </div>
                                )}
                                {user.last_login_at && (
                                    <div className="flex items-center gap-2">
                                        <Dt>最終ログイン:</Dt>
                                        <Dd>
                                            {new Date(
                                                user.last_login_at,
                                            ).toLocaleString("ja-JP")}
                                        </Dd>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Dt>作成日時:</Dt>
                                    <Dd>
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleString("ja-JP")}
                                    </Dd>
                                </div>
                            </Dl>
                        </div>
                    </CardBody>
                </Card>

                {/* 右カラム: タブ切り替えコンテンツ */}
                <div className="sm:col-span-2 lg:col-span-3 space-y-6">
                    {/* 操作ボタン */}
                    <div className="flex items-center justify-end space-x-3">
                        <CreateButton
                            href={route("admin.quote.create", {
                                user_id: user.id,
                            })}
                        >
                            見積{PageConfig.quotes.actions.create}
                        </CreateButton>
                        <EditButton href={route("admin.user.edit", user.id)}>
                            {PageConfig.users.actions.edit}
                        </EditButton>
                    </div>

                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    {/* タブコンテンツ */}
                    <div className="flex flex-col">{renderTabContent()}</div>
                </div>
            </div>
            {/* メディア選択モーダル */}
            <MediaSelectModal
                show={showMediaModal}
                mediaList={mediaListState}
                multiple={false}
                uploadRoute={route("admin.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={handleMediaSelect}
                onMediaUploaded={handleMediaUploaded}
            />
        </AdminAuthenticatedLayout>
    );
}
