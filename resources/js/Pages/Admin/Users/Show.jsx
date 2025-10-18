import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    CalendarIcon,
    StarIcon,
    EyeIcon,
    EyeSlashIcon,
    PencilIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

const Show = ({ user, profile, addresses }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "未設定";
        return new Date(dateString).toLocaleDateString("ja-JP");
    };

    const getDisplayName = () => {
        if (profile?.display_name) return profile.display_name;
        if (profile?.first_name || profile?.last_name) {
            return `${profile.last_name || ""} ${
                profile.first_name || ""
            }`.trim();
        }
        return user.name;
    };

    const getKanaName = () => {
        if (profile?.first_name_kana || profile?.last_name_kana) {
            return `${profile.last_name_kana || ""} ${
                profile.first_name_kana || ""
            }`.trim();
        }
        return null;
    };

    return (
        <AdminLayout>
            <Head title={`${getDisplayName()} - ユーザー詳細`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {getDisplayName()}
                            </h1>
                            {profile?.is_verified && (
                                <StarIcon className="h-5 w-5 text-yellow-500" />
                            )}
                            {profile?.is_public ? (
                                <EyeIcon
                                    className="h-5 w-5 text-green-600"
                                    title="公開プロフィール"
                                />
                            ) : (
                                <EyeSlashIcon
                                    className="h-5 w-5 text-gray-400"
                                    title="非公開プロフィール"
                                />
                            )}
                        </div>
                        {getKanaName() && (
                            <p className="text-sm text-gray-600">
                                {getKanaName()}
                            </p>
                        )}
                        <p className="text-sm text-gray-500">
                            ユーザーID: {user.id}
                        </p>
                    </div>
                </div>

                {/* アクションボタン */}
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={route("admin.users.edit", user.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PencilIcon className="h-4 w-4" />
                        ユーザー編集
                    </Link>

                    {profile ? (
                        <Link
                            href={route("admin.users.profile.show", user.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <UserIcon className="h-4 w-4" />
                            詳細プロフィール
                        </Link>
                    ) : (
                        <Link
                            href={route("admin.users.profile.create", user.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <PlusIcon className="h-4 w-4" />
                            プロフィール作成
                        </Link>
                    )}
                </div>

                {/* 基本情報カード */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0">
                            {profile?.avatar ? (
                                <img
                                    src={`/storage/${profile.avatar}`}
                                    alt="アバター"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="h-10 w-10 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {getDisplayName()}
                            </h2>
                            {getKanaName() && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {getKanaName()}
                                </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <EnvelopeIcon className="h-4 w-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    登録日: {formatDate(user.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 基本情報グリッド */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                ユーザー名
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user.name}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                メールアドレス
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user.email}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                メール認証
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user.email_verified_at ? (
                                    <span className="text-green-600">
                                        認証済み
                                    </span>
                                ) : (
                                    <span className="text-red-600">未認証</span>
                                )}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                アカウント種別
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user.user_type_display ||
                                    user.user_type ||
                                    "個人"}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                登録日時
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {formatDate(user.created_at)}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                最終更新
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {formatDate(user.updated_at)}
                            </dd>
                        </div>
                    </div>
                </div>

                {/* プロフィール概要 */}
                {profile ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                プロフィール概要
                            </h2>
                            <Link
                                href={route(
                                    "admin.users.profile.show",
                                    user.id
                                )}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                詳細を見る →
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {profile.bio && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        自己紹介
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 line-clamp-3">
                                        {profile.bio}
                                    </dd>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {profile.occupation && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            職業
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {profile.occupation}
                                        </dd>
                                    </div>
                                )}

                                {profile.phone_number && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            電話番号
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {profile.phone_number}
                                        </dd>
                                    </div>
                                )}

                                {profile.mobile_number && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            携帯番号
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {profile.mobile_number}
                                        </dd>
                                    </div>
                                )}

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        プロフィール完成度
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {Math.round(
                                            profile.completion_percentage * 100
                                        )}
                                        %
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        公開設定
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.is_public ? "公開" : "非公開"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        認証状態
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.is_verified
                                            ? "認証済み"
                                            : "未認証"}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            プロフィールが未作成です
                        </h3>
                        <p className="text-gray-600 mb-4">
                            詳細なプロフィール情報を作成してください。
                        </p>
                        <Link
                            href={route("admin.users.profile.create", user.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <PlusIcon className="h-4 w-4" />
                            プロフィールを作成
                        </Link>
                    </div>
                )}

                {/* 住所情報 */}
                {addresses && addresses.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                住所情報
                            </h2>
                            <span className="text-sm text-gray-500">
                                {addresses.length}件の住所
                            </span>
                        </div>

                        <div className="space-y-4">
                            {addresses.slice(0, 3).map((address, index) => (
                                <div
                                    key={address.id}
                                    className="border border-gray-200 rounded-md p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {address.type === "home" &&
                                                "自宅住所"}
                                            {address.type === "work" &&
                                                "勤務先住所"}
                                            {address.type === "other" &&
                                                "その他住所"}
                                            {![
                                                "home",
                                                "work",
                                                "other",
                                            ].includes(address.type) &&
                                                address.type}
                                        </h3>
                                        {address.is_default && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                メイン
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {[
                                            address.postal_code &&
                                                `〒${address.postal_code}`,
                                            address.prefecture,
                                            address.city,
                                            address.district,
                                            address.address_other,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </p>
                                    {address.note && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {address.note}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {addresses.length > 3 && (
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">
                                        他 {addresses.length - 3}{" "}
                                        件の住所があります
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* アクティビティ情報 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        アクティビティ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                アカウント作成
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {formatDate(user.created_at)}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                最終更新
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {formatDate(user.updated_at)}
                            </dd>
                        </div>

                        {user.email_verified_at && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    メール認証日時
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {formatDate(user.email_verified_at)}
                                </dd>
                            </div>
                        )}

                        {profile && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    プロフィール作成
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {formatDate(profile.created_at)}
                                </dd>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Show;
