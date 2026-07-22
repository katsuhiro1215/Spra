import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import TextInput from "@/Components/Forms/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { SuccessAlert } from "@/Components/Alerts";
import { useState } from "react";

export default function Edit({ user }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
        });

    const [alert, setAlert] = useState({
        isOpen: false,
        type: "success",
        message: "",
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("user.profile.update"), {
            onSuccess: () => {
                setAlert({
                    isOpen: true,
                    type: "success",
                    message: "プロフィールが正常に更新されました。",
                });
                setTimeout(() => {
                    setAlert({ ...alert, isOpen: false });
                }, 2000);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="プロフィール編集"
                    description="あなたの個人情報を管理します"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        { label: "プロフィール", href: "#" },
                    ]}
                />
            }
        >
            <Head title="プロフィール編集" />

            <div className="space-y-6">
                {/* アラート */}
                <SuccessAlert
                    isOpen={alert.isOpen}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, isOpen: false })}
                />

                {/* フォーム */}
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        {/* 名前 */}
                        <div>
                            <InputLabel htmlFor="name">名前</InputLabel>
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        {/* メールアドレス */}
                        <div>
                            <InputLabel htmlFor="email">
                                メールアドレス
                            </InputLabel>
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* 電話番号 */}
                        <div>
                            <InputLabel htmlFor="phone">電話番号</InputLabel>
                            <TextInput
                                id="phone"
                                type="tel"
                                value={data.phone || ""}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>

                        {/* ボタン */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                            <PrimaryButton disabled={processing}>
                                {processing ? "更新中..." : "更新"}
                            </PrimaryButton>
                            <Link
                                href={route("user.dashboard")}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                キャンセル
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
