import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    UserIcon,
    PencilIcon,
    TrashIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    GlobeAltIcon,
    StarIcon,
    EyeIcon,
    EyeSlashIcon,
    CakeIcon,
    IdentificationIcon,
    BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const ProfileDetail = ({ user, profile }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "未設定";
        return new Date(dateString).toLocaleDateString("ja-JP");
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    const formatSkills = (skills) => {
        if (!skills) return [];
        return skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill);
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

    const completionPercentage = profile
        ? Math.round(profile.completion_percentage * 100)
        : 0;

    const socialLinks = profile?.social_links || {};
    const availableLinks = Object.entries(socialLinks).filter(
        ([key, value]) => value
    );

    return (
        <AdminLayout>
            <Head title={`${getDisplayName()} - プロフィール詳細`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            {profile?.avatar ? (
                                <img
                                    src={`/storage/${profile.avatar}`}
                                    alt="アバター"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div>
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
                            <p className="text-sm text-gray-500 mt-1">
                                アカウント: {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {profile ? (
                            <>
                                <Link
                                    href={route("admin.users.profile.edit", {
                                        user: user.id,
                                    })}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    編集
                                </Link>
                                <button
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "このプロフィールを削除してもよろしいですか？"
                                            )
                                        ) {
                                            router.delete(
                                                route(
                                                    "admin.users.profile.destroy",
                                                    { user: user.id }
                                                )
                                            );
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    削除
                                </button>
                            </>
                        ) : (
                            <Link
                                href={route("admin.users.profile.create", {
                                    user: user.id,
                                })}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <UserIcon className="h-4 w-4" />
                                プロフィール作成
                            </Link>
                        )}
                    </div>
                </div>

                {!profile ? (
                    // プロフィール未作成の場合
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-medium text-gray-900 mb-2">
                            プロフィールが作成されていません
                        </h2>
                        <p className="text-gray-600 mb-6">
                            このユーザーの詳細プロフィール情報を作成してください。
                        </p>
                        <Link
                            href={route("admin.users.profile.create", {
                                user: user.id,
                            })}
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <UserIcon className="h-4 w-4" />
                            プロフィールを作成
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* プロフィール完成度 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-medium text-gray-900">
                                    プロフィール完成度
                                </h2>
                                <span className="text-2xl font-bold text-blue-600">
                                    {completionPercentage}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${completionPercentage}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* 基本情報 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-medium text-gray-900">
                                    基本情報
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        表示名
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.display_name || "未設定"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        氏名
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.last_name || profile.first_name
                                            ? `${profile.last_name || ""} ${
                                                  profile.first_name || ""
                                              }`.trim()
                                            : "未設定"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        氏名（カナ）
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {getKanaName() || "未設定"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        生年月日・年齢
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <CakeIcon className="h-4 w-4 text-gray-400" />
                                        {profile.birth_date ? (
                                            <>
                                                {formatDate(profile.birth_date)}
                                                {calculateAge(
                                                    profile.birth_date
                                                ) && (
                                                    <span className="text-gray-600">
                                                        （
                                                        {calculateAge(
                                                            profile.birth_date
                                                        )}
                                                        歳）
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            "未設定"
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        性別
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.gender || "未設定"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        職業
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                                        {profile.occupation || "未設定"}
                                    </dd>
                                </div>

                                {profile.job_title && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            役職
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {profile.job_title}
                                        </dd>
                                    </div>
                                )}

                                {profile.education && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            最終学歴
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {profile.education}
                                        </dd>
                                    </div>
                                )}
                            </div>

                            {profile.bio && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500 mb-2">
                                        自己紹介
                                    </dt>
                                    <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                                        {profile.bio}
                                    </dd>
                                </div>
                            )}
                        </div>

                        {/* 連絡先情報 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-medium text-gray-900">
                                    連絡先情報
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        メールアドレス
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                        {user.email}
                                    </dd>
                                </div>

                                {profile.phone_number && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            電話番号
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                                            {profile.phone_number}
                                        </dd>
                                    </div>
                                )}

                                {profile.mobile_number && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            携帯番号
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                                            {profile.mobile_number}
                                        </dd>
                                    </div>
                                )}

                                {profile.website && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            ウェブサイト
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <GlobeAltIcon className="h-4 w-4" />
                                                {profile.website}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </div>

                            {/* 緊急連絡先 */}
                            {(profile.emergency_contact_name ||
                                profile.emergency_contact_phone) && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        緊急連絡先
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {profile.emergency_contact_name && (
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500">
                                                    氏名
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {
                                                        profile.emergency_contact_name
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                        {profile.emergency_contact_phone && (
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500">
                                                    電話番号
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {
                                                        profile.emergency_contact_phone
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                        {profile.emergency_contact_relationship && (
                                            <div>
                                                <dt className="text-xs font-medium text-gray-500">
                                                    続柄
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {
                                                        profile.emergency_contact_relationship
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 住所情報 */}
                        {(profile.postal_code ||
                            profile.prefecture ||
                            profile.city) && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-lg font-medium text-gray-900">
                                        住所情報
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            住所
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {[
                                                profile.postal_code &&
                                                    `〒${profile.postal_code}`,
                                                profile.prefecture,
                                                profile.city,
                                                profile.district,
                                                profile.address_other,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* スキル・その他 */}
                        {(profile.skills || availableLinks.length > 0) && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">
                                    スキル・その他
                                </h2>

                                {profile.skills && (
                                    <div className="mb-6">
                                        <dt className="text-sm font-medium text-gray-500 mb-3">
                                            スキル
                                        </dt>
                                        <dd className="flex flex-wrap gap-2">
                                            {formatSkills(profile.skills).map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </dd>
                                    </div>
                                )}

                                {availableLinks.length > 0 && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 mb-3">
                                            ソーシャルリンク
                                        </dt>
                                        <dd className="space-y-2">
                                            {availableLinks.map(
                                                ([platform, url]) => (
                                                    <div
                                                        key={platform}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-xs font-medium text-gray-500 w-20 capitalize">
                                                            {platform}:
                                                        </span>
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            {url}
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                        </dd>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* システム情報 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">
                                システム情報
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        優先言語
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.preferred_language}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        タイムゾーン
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.timezone}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        プロフィール公開
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        {profile.is_public ? (
                                            <>
                                                <EyeIcon className="h-4 w-4 text-green-600" />
                                                公開
                                            </>
                                        ) : (
                                            <>
                                                <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                                非公開
                                            </>
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        認証ステータス
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        {profile.is_verified ? (
                                            <>
                                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                                認証済み
                                            </>
                                        ) : (
                                            <>
                                                <span className="h-4 w-4 bg-gray-300 rounded-full" />
                                                未認証
                                            </>
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        作成日時
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(profile.created_at)}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        更新日時
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(profile.updated_at)}
                                    </dd>
                                </div>
                            </div>
                        </div>

                        {/* 管理者メモ */}
                        {profile.notes && (
                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    管理者メモ
                                </h2>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {profile.notes}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProfileDetail;
