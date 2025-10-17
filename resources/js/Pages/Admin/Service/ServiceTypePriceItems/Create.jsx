import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import PageHeader from "@/Components/Layout/PageHeader";
// ServiceTypePriceItems Components
import PriceItemBasicInfoSection from "./Components/PriceItemBasicInfoSection";
import PriceItemPricingSection from "./Components/PriceItemPricingSection";
import PriceItemOptionsSection from "./Components/PriceItemOptionsSection";
import PriceItemFormActions from "./Components/PriceItemFormActions";

export default function Create({ serviceType, categories, units }) {
    const { data, setData, post, processing, errors } = useForm({
        category: "",
        name: "",
        description: "",
        price: "",
        unit: "式",
        quantity: 1,
        is_optional: false,
        is_variable: false,
        sort_order: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.service.priceItem.store", serviceType.id));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(price);
    };

    const headerActions = [
        {
            label: "← 価格項目一覧に戻る",
            variant: "secondary",
            route: route("admin.service.priceItem.index", {
                serviceType: serviceType.id,
            }),
        },
    ];

    return (
        <AdminLayout>
            <Head title="価格項目作成" />

            <FlashMessage />

            <div className="space-y-6">
                <PageHeader
                    title="価格項目作成"
                    description={`${serviceType.name} - ${serviceType.service_category?.name}`}
                    actions={headerActions}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <PriceItemBasicInfoSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                units={units}
                            />

                            <PriceItemPricingSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                units={units}
                                formatPrice={formatPrice}
                            />
                        </div>

                        <div className="space-y-6">
                            <PriceItemOptionsSection
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <PriceItemFormActions
                                processing={processing}
                                serviceType={serviceType}
                                isEdit={false}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
