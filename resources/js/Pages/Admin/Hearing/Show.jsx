import { Head, usePage, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import Button from "@/Components/Buttons/Button";
import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Show() {
    const { contact, hearing } = usePage().props;

    const answersByCategory = (hearing.answers || []).reduce((acc, answer) => {
        const category = answer.template_item?.category || "その他";
        if (!acc[category]) acc[category] = [];
        acc[category].push(answer);
        return acc;
    }, {});

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDelete = () => {
        if (confirm(`「${hearing.title}」を削除してもよろしいですか？`)) {
            router.delete(
                route("admin.contact.hearing.destroy", {
                    contact: contact.id,
                    hearing: hearing.id,
                }),
            );
        }
    };

    const headerActions = [
        {
            label: "お問い合わせに戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.contact.show", contact.id),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.contact.hearing.edit", {
                contact: contact.id,
                hearing: hearing.id,
            }),
        },
    ];

    const breadcrumbs = [
        { label: "お問い合わせ", href: route("admin.contact.index") },
        { label: contact.name, href: route("admin.contact.show", contact.id) },
        { label: hearing.title },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={hearing.title}
                    description={`作成日: ${formatDate(hearing.created_at)}${
                        hearing.creator ? ` / 記録者: ${hearing.creator.profile?.full_name || hearing.creator.email}` : ""
                    }`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={hearing.title} />

            <FlashMessage />

            <div className="space-y-6">
                {hearing.notes && (
                    <Card>
                        <CardBody>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                                補足メモ
                            </h3>
                            <p className="text-sm text-gray-900 dark:text-slate-100 whitespace-pre-wrap">
                                {hearing.notes}
                            </p>
                        </CardBody>
                    </Card>
                )}

                {Object.keys(answersByCategory).length > 0 ? (
                    Object.entries(answersByCategory).map(([category, answers]) => (
                        <Card key={category}>
                            <CardBody>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                                    {category}
                                </h3>
                                <dl className="space-y-4">
                                    {answers.map((answer) => (
                                        <div key={answer.id}>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                                {answer.template_item?.question}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 whitespace-pre-wrap">
                                                {answer.answer_options?.length > 0
                                                    ? answer.answer_options.join("、")
                                                    : answer.answer_text || "-"}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardBody>
                            <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                                回答が記録されていません
                            </p>
                        </CardBody>
                    </Card>
                )}

                <div className="flex justify-end">
                    <Button variant="danger" icon={TrashIcon} onClick={handleDelete}>
                        このヒアリングを削除
                    </Button>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
