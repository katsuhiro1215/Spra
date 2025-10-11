import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Create({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        faq_category_id: "",
        question: "",
        answer: "",
        sort_order: 0,
        is_featured: false,
        is_published: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.homepage.faqs.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("admin.homepage.faqs.index")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        FAQ作成
                    </h2>
                </div>
            }
        >
            <Head title="FAQ作成" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* カテゴリ選択 */}
                            <div>
                                <label
                                    htmlFor="faq_category_id"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    カテゴリ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="faq_category_id"
                                    value={data.faq_category_id}
                                    onChange={(e) =>
                                        setData(
                                            "faq_category_id",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.faq_category_id
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    required
                                >
                                    <option value="">
                                        カテゴリを選択してください
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.faq_category_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.faq_category_id}
                                    </p>
                                )}
                            </div>

                            {/* 質問 */}
                            <div>
                                <label
                                    htmlFor="question"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    質問 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="question"
                                    value={data.question}
                                    onChange={(e) =>
                                        setData("question", e.target.value)
                                    }
                                    className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.question
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="よくある質問を入力してください"
                                    maxLength={500}
                                    required
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.question && (
                                        <p className="text-sm text-red-600">
                                            {errors.question}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 ml-auto">
                                        {data.question.length}/500文字
                                    </p>
                                </div>
                            </div>

                            {/* 回答 */}
                            <div>
                                <label
                                    htmlFor="answer"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    回答 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="answer"
                                    value={data.answer}
                                    onChange={(e) =>
                                        setData("answer", e.target.value)
                                    }
                                    rows={8}
                                    className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.answer
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="回答内容を詳しく入力してください"
                                    maxLength={2000}
                                    required
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.answer && (
                                        <p className="text-sm text-red-600">
                                            {errors.answer}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 ml-auto">
                                        {data.answer.length}/2000文字
                                    </p>
                                </div>
                            </div>

                            {/* 設定項目 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* 表示順序 */}
                                <div>
                                    <label
                                        htmlFor="sort_order"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        表示順序
                                    </label>
                                    <input
                                        type="number"
                                        id="sort_order"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.sort_order
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        min="0"
                                    />
                                    {errors.sort_order && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.sort_order}
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        小さい数字ほど上位に表示されます
                                    </p>
                                </div>

                                {/* よくある質問 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        よくある質問
                                    </label>
                                    <div className="flex items-center h-10">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) =>
                                                setData(
                                                    "is_featured",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor="is_featured"
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            よくある質問として表示
                                        </label>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        チェックすると優先的に表示されます
                                    </p>
                                </div>

                                {/* 公開状態 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        公開状態
                                    </label>
                                    <div className="flex items-center h-10">
                                        <input
                                            type="checkbox"
                                            id="is_published"
                                            checked={data.is_published}
                                            onChange={(e) =>
                                                setData(
                                                    "is_published",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor="is_published"
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            このFAQを公開する
                                        </label>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        チェックを外すと下書きとして保存されます
                                    </p>
                                </div>
                            </div>

                            {/* 送信ボタン */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <Link
                                    href={route("admin.homepage.faqs.index")}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                >
                                    キャンセル
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50"
                                >
                                    {processing ? "作成中..." : "FAQを作成"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
