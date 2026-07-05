import React from "react";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";
import { PREFECTURES } from "./CompanyForm";

export default function AddressFormSection({
    addressData,
    setAddressData,
    errors,
    addressTypes,
    index = 0,
}) {
    const handleChange = (field, value) => {
        setAddressData({
            ...addressData,
            [field]: value,
        });
    };

    const getFieldError = (field) => {
        return errors?.[`addresses.${index}.${field}`] || errors?.[field];
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                住所情報
            </h3>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup
                        label="住所タイプ"
                        error={getFieldError("type")}
                        required
                    >
                        <SelectInput
                            value={addressData.type}
                            onChange={(e) =>
                                handleChange("type", e.target.value)
                            }
                            options={addressTypes}
                            error={getFieldError("type")}
                        />
                    </FormGroup>

                    <FormGroup
                        label="ラベル"
                        error={getFieldError("label")}
                        help="例：本社、支社、営業所など"
                    >
                        <TextInput
                            value={addressData.label}
                            onChange={(e) =>
                                handleChange("label", e.target.value)
                            }
                            placeholder="本社"
                            error={getFieldError("label")}
                        />
                    </FormGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormGroup
                        label="郵便番号"
                        error={getFieldError("postal_code")}
                        required
                    >
                        <TextInput
                            value={addressData.postal_code}
                            onChange={(e) =>
                                handleChange("postal_code", e.target.value)
                            }
                            placeholder="123-4567"
                            error={getFieldError("postal_code")}
                        />
                    </FormGroup>

                    <FormGroup
                        label="都道府県"
                        error={getFieldError("prefecture")}
                        required
                        className="md:col-span-2"
                    >
                        <SelectInput
                            value={addressData.prefecture}
                            onChange={(e) =>
                                handleChange("prefecture", e.target.value)
                            }
                            options={[
                                { value: "", label: "選択してください" },
                                ...PREFECTURES.map((pref) => ({
                                    value: pref,
                                    label: pref,
                                })),
                            ]}
                            error={getFieldError("prefecture")}
                        />
                    </FormGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup
                        label="市区町村"
                        error={getFieldError("city")}
                        required
                    >
                        <TextInput
                            value={addressData.city}
                            onChange={(e) =>
                                handleChange("city", e.target.value)
                            }
                            placeholder="渋谷区"
                            error={getFieldError("city")}
                        />
                    </FormGroup>

                    <FormGroup
                        label="町名・番地"
                        error={getFieldError("district")}
                    >
                        <TextInput
                            value={addressData.district}
                            onChange={(e) =>
                                handleChange("district", e.target.value)
                            }
                            placeholder="神南1-2-3"
                            error={getFieldError("district")}
                        />
                    </FormGroup>
                </div>

                <FormGroup
                    label="建物名・部屋番号"
                    error={getFieldError("address_other")}
                >
                    <TextInput
                        value={addressData.address_other}
                        onChange={(e) =>
                            handleChange("address_other", e.target.value)
                        }
                        placeholder="サンプルビル4F"
                        error={getFieldError("address_other")}
                    />
                </FormGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup label="電話番号" error={getFieldError("phone")}>
                        <TextInput
                            type="tel"
                            value={addressData.phone}
                            onChange={(e) =>
                                handleChange("phone", e.target.value)
                            }
                            placeholder="03-1234-5678"
                            error={getFieldError("phone")}
                        />
                    </FormGroup>

                    <FormGroup
                        label="担当者名"
                        error={getFieldError("contact_person")}
                    >
                        <TextInput
                            value={addressData.contact_person}
                            onChange={(e) =>
                                handleChange("contact_person", e.target.value)
                            }
                            placeholder="山田 太郎"
                            error={getFieldError("contact_person")}
                        />
                    </FormGroup>
                </div>

                <FormGroup label="備考" error={getFieldError("notes")}>
                    <TextArea
                        value={addressData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="住所に関する補足情報"
                        rows={3}
                        error={getFieldError("notes")}
                    />
                </FormGroup>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id={`is_default_${index}`}
                        checked={addressData.is_default}
                        onChange={(e) =>
                            handleChange("is_default", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                    />
                    <label
                        htmlFor={`is_default_${index}`}
                        className="ml-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                        この住所をデフォルトに設定
                    </label>
                </div>
            </div>
        </div>
    );
}
