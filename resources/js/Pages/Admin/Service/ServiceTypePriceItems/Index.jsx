import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import PageHeader from "@/Components/Layout/PageHeader";
// ServiceTypePriceItems Components
import PriceItemsSummary from "./Components/PriceItemsSummary";
import ActionButtonsSection from "./Components/ActionButtonsSection";
import PriceItemsList from "./Components/PriceItemsList";

export default function Index({ serviceType, priceItems, totalPrice }) {
    const [deletingItem, setDeletingItem] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleDelete = (item) => {
        setDeletingItem(item);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        if (deletingItem) {
            router.delete(
                route("admin.service.priceItem.destroy", {
                    serviceType: serviceType.id,
                    priceItem: deletingItem.id,
                })
            );
            setShowDeleteAlert(false);
            setDeletingItem(null);
        }
    };

    const headerActions = [
        {
            label: "新しい価格項目を追加",
            variant: "primary",
            route: route("admin.service.priceItem.create", {
                serviceType: serviceType.id,
            }),
        },
        {
            label: "サービスタイプ詳細",
            variant: "secondary",
            route: route("admin.service.type.show", {
                serviceType: serviceType.id,
            }),
        },
        {
            label: "← サービスタイプ一覧に戻る",
            variant: "secondary",
            route: route("admin.service.type.index"),
        },
    ];

    return (
        <AdminLayout>
            <Head title="価格項目管理" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* ヘッダー */}
                <PageHeader
                    title={`価格項目管理 - ${serviceType.name}`}
                    description={serviceType.service_category?.name}
                    actions={headerActions}
                />

                <PriceItemsSummary
                    priceItems={priceItems}
                    totalPrice={totalPrice}
                />

                <ActionButtonsSection priceItems={priceItems} />

                <PriceItemsList
                    priceItems={priceItems}
                    serviceType={serviceType}
                    onDelete={handleDelete}
                />
            </div>

            {/* 削除確認モーダル */}
            <DeleteAlert
                show={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={confirmDelete}
                title="価格項目の削除"
                message={`「${deletingItem?.name}」を削除してもよろしいですか？この操作は取り消すことができません。`}
            />
        </AdminLayout>
    );
}
