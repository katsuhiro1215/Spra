import ValidatedInput from "@/Components/Forms/ValidatedInput";
import ValidatedTextArea from "@/Components/Forms/ValidatedTextArea";
import { BusinessConstants } from "@/Constants/BusinessConstants";

/**
 * サービスタイプ基本情報入力セクション
 */
const BasicInfoSection = ({
    data,
    setData,
    errors,
    validationErrors,
    handleFieldBlur,
    serviceCategories,
    ServiceTypesConstants,
}) => {
    const { pricingModels } = BusinessConstants;

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    基本情報
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                サービスカテゴリ{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.service_category_id}
                                onChange={(e) =>
                                    setData(
                                        "service_category_id",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">選択してください</option>
                                {serviceCategories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.service_category_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.service_category_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                料金体系 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.pricing_model}
                                onChange={(e) =>
                                    setData("pricing_model", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.entries(pricingModels).map(
                                    ([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
                            {errors.pricing_model && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.pricing_model}
                                </p>
                            )}
                        </div>
                    </div>

                    <ValidatedInput
                        label={ServiceTypesConstants.form.fields.name}
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        onBlur={() => handleFieldBlur("name")}
                        placeholder={
                            ServiceTypesConstants.form.placeholders.name
                        }
                        error={validationErrors.name || errors.name}
                        required
                        maxLength={100}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            スラッグ
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                /service-types/
                            </span>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) =>
                                    setData("slug", e.target.value)
                                }
                                className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="corporate-website"
                            />
                        </div>
                        {errors.slug && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.slug}
                            </p>
                        )}
                    </div>

                    <ValidatedTextArea
                        label={ServiceTypesConstants.form.fields.description}
                        name="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        onBlur={() => handleFieldBlur("description")}
                        placeholder={
                            ServiceTypesConstants.form.placeholders.description
                        }
                        error={
                            validationErrors.description || errors.description
                        }
                        rows={3}
                        maxLength={500}
                    />

                    <ValidatedTextArea
                        label={
                            ServiceTypesConstants.form.fields
                                .detailedDescription
                        }
                        name="detailed_description"
                        value={data.detailed_description}
                        onChange={(e) =>
                            setData("detailed_description", e.target.value)
                        }
                        onBlur={() => handleFieldBlur("detailed_description")}
                        placeholder={
                            ServiceTypesConstants.form.placeholders
                                .detailedDescription
                        }
                        error={
                            validationErrors.detailed_description ||
                            errors.detailed_description
                        }
                        rows={6}
                        maxLength={2000}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoSection;
