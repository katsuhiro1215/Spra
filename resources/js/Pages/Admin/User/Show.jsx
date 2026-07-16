import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { Badge } from "@/Components/Badges";
import Avatar from "@/Components/Avatar";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import {
    ArrowLeftIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UserCircleIcon,
    MapPinIcon,
    CameraIcon,
    DocumentTextIcon,
    CalendarIcon,
    CurrencyYenIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { getStatusBadge } from "@/Constants/Badges";

export default function Show({ user, mediaList = [] }) {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);

    const handleDeleteAddress = (addressId) => {
        if (confirm(PageConfig.admins.addresses.deleteConfirmation)) {
            router.delete(
                route("admin.user.address.destroy", {
                    user: user.id,
                    address: addressId,
                }),
            );
        }
    };

    const handleMediaSelect = (mediaId) => {
        console.log("handleMediaSelect called with mediaId:", mediaId);

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

    const getAddressTypeLabel = (type) => {
        const labels = {
            home: "自宅",
            office: "オフィス",
            billing: "請求先",
            shipping: "配送先",
            other: "その他",
        };
        return labels[type] || type;
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "見積もりを作成",
            icon: DocumentTextIcon,
            variant: "primary",
            route: route("admin.quote.create", { user_id: user.id }),
        },
        {
            label: PageConfig.users.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.user.index"),
        },
        {
            label: PageConfig.users.actions.edit,
            icon: PencilIcon,
            variant: "warning",
            route: route("admin.user.edit", user.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "ユーザー一覧", href: route("admin.user.index") },
        { label: "詳細", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="ユーザー詳細"
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
                    {/* アバター */}
                    <div className="flex flex-col justify-center items-center space-y-6">
                        <div className="relative group">
                            {user.profile?.media ? (
                                <div className="relative">
                                    <img
                                        src={user.profile.media.url}
                                        alt={
                                            user.profile.full_name || user.email
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
                                    {new Date(user.created_at).toLocaleString(
                                        "ja-JP",
                                    )}
                                </Dd>
                            </div>
                        </Dl>
                    </div>
                </Card>

                {/* 右カラム: プロフィールと住所 */}
                <div className="sm:col-span-2 lg:col-span-3 space-y-6">
                    {/* プロフィールセクション */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <UserCircleIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    プロフィール情報
                                </span>
                            </div>
                            {user.profile ? (
                                <Link
                                    href={route(
                                        "admin.user.profile.edit",
                                        user.id,
                                    )}
                                    className="p-1.5 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                    title="編集"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </Link>
                            ) : (
                                <Link
                                    href={route(
                                        "admin.user.profile.create",
                                        user.id,
                                    )}
                                    className="p-1.5 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                                    title="作成"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                </Link>
                            )}
                        </CardHeader>
                        <CardBody>
                            {user.profile ? (
                                <Dl variant="striped">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                        <Dt className="font-medium">名前</Dt>
                                        <Dd className="sm:col-span-2">
                                            {user.profile.full_name}
                                        </Dd>
                                    </div>
                                    {user.profile.full_name_kana && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                名前（カナ）
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {user.profile.full_name_kana}
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.display_name && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                表示名
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {user.profile.display_name}
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.birth_date && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                生年月日
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {user.profile.birth_date}
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.gender && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                性別
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {user.profile.gender}
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.phone && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                電話番号
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {user.profile.phone}
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.mobile && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                携帯電話
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {user.profile.mobile}
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.emergency_contact_name && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                緊急連絡先氏名
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {
                                                    user.profile
                                                        .emergency_contact_name
                                                }
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.emergency_contact_phone && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                            <Dt className="font-medium">
                                                緊急連絡先電話番号
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {
                                                    user.profile
                                                        .emergency_contact_phone
                                                }
                                            </Dd>
                                        </div>
                                    )}
                                    {user.profile.bio && (
                                        <div className="flex flex-col gap-2 py-3">
                                            <Dt className="font-medium">
                                                自己紹介
                                            </Dt>
                                            <Dd className="whitespace-pre-wrap">
                                                {user.profile.bio}
                                            </Dd>
                                        </div>
                                    )}
                                </Dl>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">
                                    プロフィール情報が登録されていません
                                </p>
                            )}
                        </CardBody>
                    </Card>

                    {/* 住所セクション */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    住所情報
                                </span>
                            </div>
                            <Link
                                href={route(
                                    "admin.user.address.create",
                                    user.id,
                                )}
                                className="p-1.5 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                                title="追加"
                            >
                                <PlusIcon className="h-5 w-5" />
                            </Link>
                        </CardHeader>
                        <CardBody>
                            {user.addresses && user.addresses.length > 0 ? (
                                <div className="space-y-4">
                                    {user.addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className="border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {getAddressTypeLabel(
                                                            address.type,
                                                        )}
                                                    </span>
                                                    {address.label && (
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {address.label}
                                                        </span>
                                                    )}
                                                    {address.is_default && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                            デフォルト
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route(
                                                            "admin.user.address.edit",
                                                            {
                                                                user: user.id,
                                                                address:
                                                                    address.id,
                                                            },
                                                        )}
                                                        className="p-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                                        title="編集"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteAddress(
                                                                address.id,
                                                            )
                                                        }
                                                        className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                        title="削除"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <Dl variant="default">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                                    <Dt className="font-medium">
                                                        郵便番号
                                                    </Dt>
                                                    <Dd className="sm:col-span-2">
                                                        {address.formatted_postal_code ||
                                                            address.postal_code}
                                                    </Dd>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                                    <Dt className="font-medium">
                                                        住所
                                                    </Dt>
                                                    <Dd className="sm:col-span-2">
                                                        {address.full_address}
                                                    </Dd>
                                                </div>
                                                {address.phone && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                                        <Dt className="font-medium">
                                                            電話番号
                                                        </Dt>
                                                        <Dd className="sm:col-span-2">
                                                            {address.phone}
                                                        </Dd>
                                                    </div>
                                                )}
                                                {address.contact_person && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                                        <Dt className="font-medium">
                                                            担当者
                                                        </Dt>
                                                        <Dd className="sm:col-span-2">
                                                            {
                                                                address.contact_person
                                                            }
                                                        </Dd>
                                                    </div>
                                                )}
                                                {address.notes && (
                                                    <div className="flex flex-col gap-2 py-2">
                                                        <Dt className="font-medium">
                                                            備考
                                                        </Dt>
                                                        <Dd className="whitespace-pre-wrap">
                                                            {address.notes}
                                                        </Dd>
                                                    </div>
                                                )}
                                            </Dl>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                                    住所情報が登録されていません
                                </p>
                            )}
                        </CardBody>
                    </Card>
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
            />{" "}
        </AdminAuthenticatedLayout>
    );
}
