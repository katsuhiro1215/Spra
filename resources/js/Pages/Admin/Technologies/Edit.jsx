import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import TechnologyForm from "./_components/Form";

export default function Edit({ technology }) {
    const { data, setData, put, processing, errors } = useForm({
        name: technology.name || "",
        slug: technology.slug || "",
        icon: technology.icon || "",
        color: technology.color || "#3B82F6",
        sort_order: technology.sort_order || 0,
        is_active: technology.is_active ?? true,
    });

    const submit = () => {
        put(route("admin.service.technology.update", technology.id));
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "default",
            route: route("admin.service.technology.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`使用技術の編集: ${technology.name}`}
                    actions={headerActions}
                />
            }
        >
            <Head title={`使用技術の編集 - ${technology.name}`} />

            <FlashMessage />

            <div className="max-w-4xl">
                <TechnologyForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.service.technology.index")}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
