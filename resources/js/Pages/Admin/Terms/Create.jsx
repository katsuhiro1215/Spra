import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.terms.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="規約を作成" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-900">
                            新規規約を作成
                        </h1>

                        <form onSubmit={submit} className="space-y-6">
                            {/* タイトル */}
                            <div>
                                <InputLabel htmlFor="title" value="規約名 *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="例: 利用規約、プライバシーポリシー"
                                    className="mt-1 block w-full"
                                    disabled={processing}
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    同じ名前の規約を作成すると、新しいバージョンになります。
                                </p>
                            </div>

                            {/* 内容 */}
                            <div>
                                <InputLabel
                                    htmlFor="content"
                                    value="規約内容 *"
                                />
                                <textarea
                                    id="content"
                                    name="content"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData("content", e.target.value)
                                    }
                                    placeholder="規約内容をMarkdown形式で入力してください..."
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                    rows="15"
                                    disabled={processing}
                                />
                                <InputError
                                    message={errors.content}
                                    className="mt-2"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Markdown形式で記述できます。見出しは ##
                                    を使用してください。
                                </p>
                            </div>

                            {/* ボタン */}
                            <div className="flex gap-4 justify-end pt-4 border-t">
                                <Link href={route("admin.terms.index")}>
                                    <SecondaryButton>
                                        キャンセル
                                    </SecondaryButton>
                                </Link>
                                <PrimaryButton
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    {processing ? "作成中..." : "作成"}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* ヒント */}
                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                💡 ヒント
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>
                                    • 規約は最初「ドラフト」状態で作成されます
                                </li>
                                <li>
                                    •
                                    一覧画面で「有効化」ボタンから有効にできます
                                </li>
                                <li>
                                    •
                                    同じ名前の規約を作成すると、新しいバージョンになります
                                </li>
                                <li>
                                    •
                                    既に有効な規約の編集は、新バージョンを作成してから行ってください
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
