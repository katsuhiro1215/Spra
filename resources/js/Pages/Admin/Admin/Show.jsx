import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { Badge } from "@/Components/Badges";
import Avatar from "@/Components/Avatar";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import TabNavigation from "@/Components/TabNavigation";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { getRoleBadge, getStatusBadge } from "@/Constants/Badges";
import AdminBasicInfo from "./_components/AdminBasicInfo";
import AdminLoginHistory from "./_components/AdminLoginHistory";
import AdminSettings from "./_components/AdminSettings";

export default function Show({
    admin,
    mediaList = [],
    permissionOverride = null,
    loginLogs = [],
}) {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);
    const [activeTab, setActiveTab] = useState("basic");

    const tabs = [
        {
            key: "basic",
            label: "基本情報",
        },
        {
            key: "login-history",
            label: "ログイン履歴",
            count: loginLogs.length,
        },
        {
            key: "settings",
            label: "設定",
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "basic":
                return <AdminBasicInfo admin={admin} />;
            case "login-history":
                return <AdminLoginHistory loginLogs={loginLogs} />;
            case "settings":
                return (
                    <AdminSettings
                        admin={admin}
                        permissionOverride={permissionOverride}
                    />
                );
            default:
                return null;
        }
    };

    const handleMediaSelect = (mediaId) => {
        // プロフィールにメディアを設定
        router.post(
            route("admin.admin.profile.attachMedia", admin.id),
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
        if (confirm(PageConfig.adminProfiles.detachMediaConfirmation)) {
            router.delete(route("admin.admin.profile.detachMedia", admin.id), {
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
            label: PageConfig.admins.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.admin.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.admins.breadcrumbs,
        PageConfig.admins.pages.show.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.admins.title}
                    description={PageConfig.admins.pages.show.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.admins.pages.show.title} - ${admin.email}`}
            />
            <FlashMessage />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* 左カラム: 基本情報 */}
                <Card className="sm:col-span-1">
                    <CardBody>
                        {/* アバター */}
                        <div className="flex flex-col justify-center items-center space-y-6">
                            <div className="relative group">
                                {admin.profile?.media ? (
                                    <div className="relative">
                                        <img
                                            src={admin.profile.media.url}
                                            alt={
                                                admin.profile.full_name ||
                                                admin.email
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
                                                admin.profile?.full_name ||
                                                admin.email
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
                            {admin.profile?.media && (
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
                                    {admin.profile?.full_name || "名前未設定"}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {admin.email}
                                </p>
                            </div>
                            {/* ステータスバッジ */}
                            <div className="flex justify-center space-x-2">
                                <Badge
                                    variant={getRoleBadge(admin.role).variant}
                                    size="sm"
                                >
                                    {getRoleBadge(admin.role).text}
                                </Badge>
                                <Badge
                                    variant={
                                        getStatusBadge(admin.status).variant
                                    }
                                    size="sm"
                                >
                                    {getStatusBadge(admin.status).text}
                                </Badge>
                            </div>
                            {/* 基本情報 */}
                            <Dl variant="default">
                                <div className="flex items-center gap-2">
                                    <Dt>メールアドレス:</Dt>
                                    <Dd>{admin.email}</Dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dt>権限:</Dt>
                                    <Dd>{getRoleBadge(admin.role).text}</Dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dt>ステータス:</Dt>
                                    <Dd>{getStatusBadge(admin.status).text}</Dd>
                                </div>
                                {admin.last_login_at && (
                                    <div className="flex items-center gap-2">
                                        <Dt>最終ログイン:</Dt>
                                        <Dd>
                                            {new Date(
                                                admin.last_login_at,
                                            ).toLocaleString("ja-JP")}
                                        </Dd>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Dt>作成日時:</Dt>
                                    <Dd>
                                        {new Date(
                                            admin.created_at,
                                        ).toLocaleString("ja-JP")}
                                    </Dd>
                                </div>
                            </Dl>
                        </div>
                    </CardBody>
                </Card>
                {/* 右カラム: プロフィールと住所 */}
                <div className="sm:col-span-2 lg:col-span-3 space-y-6">
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
