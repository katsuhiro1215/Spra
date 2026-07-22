import { useState } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import TextInput from "@/Components/Forms/TextInput";
import InputLabel from "@/Components/Forms/InputLabel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import { CameraIcon } from "@heroicons/react/24/outline";

export default function ProfileForm({
    profile,
    submitRoute = route("user.onboarding.profile.store"),
    cancelRoute = route("user.dashboard"),
    submitLabel = "次に進む",
}) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        first_name_kana: profile?.first_name_kana || "",
        last_name_kana: profile?.last_name_kana || "",
        phone: profile?.phone || "",
        mobile: profile?.mobile || "",
        birth_date: profile?.birth_date || "",
        gender: profile?.gender || "",
    });

    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(
        profile?.media ? [profile.media] : [],
    );

    const avatarLabel =
        [data.last_name, data.first_name].filter(Boolean).join("") || "?";

    const handleSubmit = (e) => {
        e.preventDefault();
        post(submitRoute);
    };

    const handleMediaSelect = (mediaId) => {
        router.post(
            route("user.settings.profile.attach-media"),
            { media_id: mediaId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setShowMediaModal(false),
            },
        );
    };

    const handleMediaUploaded = (newMedia) => {
        setMediaListState((prev) => [newMedia, ...prev]);
    };

    const handleDetachMedia = () => {
        if (confirm("プロフィール画像を削除しますか？")) {
            router.delete(route("user.settings.profile.detach-media"), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="プロフィール情報 | Smart Sprouts" />

            <div className="max-w-2xl mx-auto space-y-6">
                <UserPageHeader
                    title="プロフィール情報"
                    description="あなたの個人情報を入力してください"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        { label: "プロフィール情報", href: "#" },
                    ]}
                />
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {/* プロフィール画像 */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            {profile?.media ? (
                                <img
                                    src={profile.media.url}
                                    alt={avatarLabel}
                                    className="w-28 h-28 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <span className="text-white text-3xl font-medium">
                                        {avatarLabel.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(true)}
                                className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-50 transition-colors"
                                title="画像を変更"
                            >
                                <CameraIcon className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                        {profile?.media && (
                            <button
                                type="button"
                                onClick={handleDetachMedia}
                                className="mt-3 text-xs text-red-600 hover:text-red-800"
                            >
                                画像を削除
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 名前 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="last_name">
                                    姓 <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="last_name"
                                    type="text"
                                    name="last_name"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    placeholder="山田"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.last_name && (
                                    <InputError message={errors.last_name} />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="first_name">
                                    名 <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="first_name"
                                    type="text"
                                    name="first_name"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    placeholder="太郎"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.first_name && (
                                    <InputError message={errors.first_name} />
                                )}
                            </div>
                        </div>

                        {/* 名前（カナ） */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="last_name_kana">
                                    姓（カナ）{" "}
                                    <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="last_name_kana"
                                    type="text"
                                    name="last_name_kana"
                                    value={data.last_name_kana}
                                    onChange={(e) =>
                                        setData(
                                            "last_name_kana",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ヤマダ"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.last_name_kana && (
                                    <InputError
                                        message={errors.last_name_kana}
                                    />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="first_name_kana">
                                    名（カナ）{" "}
                                    <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="first_name_kana"
                                    type="text"
                                    name="first_name_kana"
                                    value={data.first_name_kana}
                                    onChange={(e) =>
                                        setData(
                                            "first_name_kana",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="タロウ"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.first_name_kana && (
                                    <InputError
                                        message={errors.first_name_kana}
                                    />
                                )}
                            </div>
                        </div>

                        {/* 電話番号 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="phone">
                                    固定電話
                                </InputLabel>
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    placeholder="03-XXXX-XXXX"
                                    className="mt-1 w-full"
                                />
                                {errors.phone && (
                                    <InputError message={errors.phone} />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="mobile">
                                    携帯電話{" "}
                                    <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="mobile"
                                    type="tel"
                                    name="mobile"
                                    value={data.mobile}
                                    onChange={(e) =>
                                        setData("mobile", e.target.value)
                                    }
                                    placeholder="090-XXXX-XXXX"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.mobile && (
                                    <InputError message={errors.mobile} />
                                )}
                            </div>
                        </div>

                        {/* 生年月日と性別 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="birth_date">
                                    生年月日
                                </InputLabel>
                                <TextInput
                                    id="birth_date"
                                    type="date"
                                    name="birth_date"
                                    value={data.birth_date}
                                    onChange={(e) =>
                                        setData("birth_date", e.target.value)
                                    }
                                    className="mt-1 w-full"
                                />
                                {errors.birth_date && (
                                    <InputError message={errors.birth_date} />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="gender">性別</InputLabel>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">選択してください</option>
                                    <option value="male">男性</option>
                                    <option value="female">女性</option>
                                    <option value="other">その他</option>
                                </select>
                                {errors.gender && (
                                    <InputError message={errors.gender} />
                                )}
                            </div>
                        </div>

                        {/* ボタン */}
                        <div className="flex gap-4 pt-6">
                            <Link href={cancelRoute}>
                                <SecondaryButton type="button">
                                    戻る
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="flex-1 justify-center"
                            >
                                {processing ? "保存中..." : submitLabel}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

            <MediaSelectModal
                show={showMediaModal}
                mediaList={mediaListState}
                multiple={false}
                uploadRoute={route("user.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={handleMediaSelect}
                onMediaUploaded={handleMediaUploaded}
            />
        </AuthenticatedLayout>
    );
}
