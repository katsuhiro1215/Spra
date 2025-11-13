import { Head, Link, useForm } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Card from "@/Components/Card";
import BasicButton from "@/Components/Buttons/BasicButton";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import FlashMessage from "@/Components/Notifications/FlashMessage";
// Components - Forms
import InputLabel from "@/Components/Forms/InputLabel";
import ValidatedInput from "@/Components/Forms/ValidatedInput";
import ValidatedTextArea from "@/Components/Forms/ValidatedTextArea";
// Icons
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

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

    const headerActions = [
        {
            label: PageConfig.faqs.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.homepage.faqs.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout>
            <Head title={PageConfig.faqs.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <PageHeader
                title={PageConfig.faqs.pages.create.title}
                description={PageConfig.faqs.form.create.description}
                actions={headerActions}
            />
            {/* メイン */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* フォーム */}
                <form onSubmit={handleSubmit}>
                    {/* 設定項目 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* カテゴリ選択 */}
                            <Card>
                                <Card.Body>
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
                                </Card.Body>
                            </Card>
                            {/* 質問 & 回答 */}
                            <Card>
                                <Card.Title>質問と回答</Card.Title>
                                <Card.Body className="space-y-4">
                                    <ValidatedInput
                                        label="質問"
                                        name="question"
                                        type="text"
                                        value={data.question}
                                        onChange={(e) =>
                                            setData("question", e.target.value)
                                        }
                                        placeholder="よくある質問を入力してください"
                                        required
                                        error={errors.question}
                                        className="w-full"
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <p className="text-sm text-gray-500 ml-auto">
                                            {data.question.length}/500文字
                                        </p>
                                    </div>
                                    <ValidatedTextArea
                                        label="回答"
                                        name="answer"
                                        value={data.answer}
                                        onChange={(e) =>
                                            setData("answer", e.target.value)
                                        }
                                        placeholder="回答内容を詳しく入力してください"
                                        required
                                        error={errors.answer}
                                        rows={8}
                                        className="w-full"
                                        maxLength={2000}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <p className="text-sm text-gray-500 ml-auto">
                                            {data.answer.length}/2000文字
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                            {/* 表示順序 */}
                            <Card>
                                <Card.Body>
                                    <ValidatedInput
                                        label="表示順序"
                                        name="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        placeholder="表示順序を入力してください"
                                        error={errors.sort_order}
                                        className="w-full"
                                        min="0"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        小さい数字ほど上位に表示されます
                                    </p>
                                </Card.Body>
                            </Card>
                            {/* よくある質問 */}
                            <Card>
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
                            </Card>
                        </div>
                        <div className="space-y-6">
                            {/* 公開状態 */}
                            <Card>
                                <Card.Title>公開設定</Card.Title>
                                <Card.Body className="space-y-4">
                                    <InputLabel
                                        htmlFor="is_published"
                                        value="公開状態"
                                    />
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
                                </Card.Body>
                            </Card>
                            {/* 送信ボタン */}
                            <Card>
                                <Card.Title>アクション</Card.Title>
                                <Card.Body className="space-y-4">
                                    <BasicButton
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        {processing ? "作成中..." : "FAQを作成"}
                                    </BasicButton>
                                    <BasicButton
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {PageConfig.faqs.actions.reset}
                                    </BasicButton>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </form>
            </main>
        </AdminAuthenticatedLayout>
    );
}
