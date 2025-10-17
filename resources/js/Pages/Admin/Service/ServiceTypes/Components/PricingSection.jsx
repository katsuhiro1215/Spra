import { CurrencyYenIcon } from "@heroicons/react/24/outline";
import ValidatedInput from "@/Components/Forms/ValidatedInput";
import { BusinessConstants } from "@/Constants/BusinessConstants";

/**
 * 価格・納期設定セクション
 */
const PricingSection = ({
    data,
    setData,
    errors,
    validationErrors,
    handleFieldBlur,
    ServiceTypesConstants,
}) => {
    const { priceUnits } = BusinessConstants;

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CurrencyYenIcon className="w-5 h-5 mr-2" />
                    価格・納期設定
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ValidatedInput
                        label={ServiceTypesConstants.form.fields.basePrice}
                        name="base_price"
                        type="number"
                        value={data.base_price}
                        onChange={(e) => setData("base_price", e.target.value)}
                        onBlur={() => handleFieldBlur("base_price")}
                        placeholder={
                            ServiceTypesConstants.form.placeholders.basePrice
                        }
                        error={validationErrors.base_price || errors.base_price}
                        min="0"
                        step="1000"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            価格単位
                        </label>
                        <select
                            value={data.price_unit}
                            onChange={(e) =>
                                setData("price_unit", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">単位を選択</option>
                            {priceUnits.map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                        {errors.price_unit && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.price_unit}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            標準納期（日数）
                        </label>
                        <input
                            type="number"
                            value={data.estimated_delivery_days}
                            onChange={(e) =>
                                setData(
                                    "estimated_delivery_days",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="30"
                            min="1"
                        />
                        {errors.estimated_delivery_days && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.estimated_delivery_days}
                            </p>
                        )}
                    </div>
                </div>

                {/* 要相談設定 */}
                <div className="mt-4 space-y-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.requires_consultation}
                            onChange={(e) =>
                                setData(
                                    "requires_consultation",
                                    e.target.checked
                                )
                            }
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            要相談フラグ
                        </span>
                    </label>

                    {data.requires_consultation && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                相談時の注意事項
                            </label>
                            <textarea
                                value={data.consultation_note}
                                onChange={(e) =>
                                    setData("consultation_note", e.target.value)
                                }
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="価格は要件によって変動します..."
                            />
                            {errors.consultation_note && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.consultation_note}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricingSection;
