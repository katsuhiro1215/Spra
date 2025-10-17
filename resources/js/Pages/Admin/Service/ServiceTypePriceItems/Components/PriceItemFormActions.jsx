import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { Link } from "@inertiajs/react";

/**
 * 価格項目のフォームアクションセクション
 */
const PriceItemFormActions = ({
    processing,
    serviceType,
    isEdit = false,
    onCancel = null,
}) => {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex justify-end space-x-3">
                    <Link
                        href={route("admin.service.priceItem.index", {
                            serviceType: serviceType.id,
                        })}
                    >
                        <SecondaryButton>キャンセル</SecondaryButton>
                    </Link>

                    <PrimaryButton type="submit" disabled={processing}>
                        {processing
                            ? isEdit
                                ? "更新中..."
                                : "作成中..."
                            : isEdit
                            ? "更新"
                            : "作成"}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default PriceItemFormActions;
