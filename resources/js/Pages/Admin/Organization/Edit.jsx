import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
} from "@/Components/Forms";
// Icons
import { CheckIcon } from "@heroicons/react/24/outline";

export default function Edit({ organization, address }) {
    const { data, setData, put, processing, errors } = useForm({
        name: organization.name || "",
        site_name: organization.site_name || "",
        name_en: organization.name_en || "",
        logo_path: organization.logo_path || "",
        legal_name: organization.legal_name || "",
        representative_name: organization.representative_name || "",
        business_description: organization.business_description || "",
        employee_count: organization.employee_count || "",
        capital: organization.capital || "",
        established_date: organization.established_date
            ? organization.established_date.slice(0, 10)
            : "",
        business_hours: organization.business_hours || "",
        registration_number: organization.registration_number || "",
        tax_number: organization.tax_number || "",
        phone: organization.phone || "",
        fax: organization.fax || "",
        email: organization.email || "",
        website: organization.website || "",
        address: {
            postal_code: address?.postal_code || "",
            prefecture: address?.prefecture || "",
            city: address?.city || "",
            district: address?.district || "",
            address_other: address?.address_other || "",
        },
    });

    const handleChange = (field, value) => {
        setData(field, value);
    };

    const handleAddressChange = (field, value) => {
        setData("address", { ...data.address, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.organization.update"));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="組織設定"
                    description="サイトに表示する自社情報を管理します"
                />
            }
        >
            <Head title="組織設定" />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    {/* サイト表示情報 */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                            サイト表示情報
                        </h3>
                        <div className="space-y-4">
                            <FormGroup>
                                <InputLabel htmlFor="site_name">
                                    サイト表示名
                                </InputLabel>
                                <TextInput
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={(e) =>
                                        handleChange(
                                            "site_name",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    placeholder="Smart Sprouts"
                                />
                                <InputError
                                    message={errors.site_name}
                                />
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Header・Footerのロゴ横に表示されるサイト名
                                </p>
                            </FormGroup>

                            <FormGroup>
                                <InputLabel htmlFor="name_en">
                                    英語表記名
                                </InputLabel>
                                <TextInput
                                    id="name_en"
                                    value={data.name_en}
                                    onChange={(e) =>
                                        handleChange(
                                            "name_en",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    placeholder="Smart Sprouts Inc."
                                />
                                <InputError message={errors.name_en} />
                            </FormGroup>

                            <FormGroup>
                                <InputLabel htmlFor="logo_path">
                                    ロゴ画像パス
                                </InputLabel>
                                <TextInput
                                    id="logo_path"
                                    value={data.logo_path}
                                    onChange={(e) =>
                                        handleChange(
                                            "logo_path",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    placeholder="/upload/logo.svg"
                                />
                                <InputError message={errors.logo_path} />
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    public配下に配置した画像への直接パス
                                </p>
                            </FormGroup>
                        </div>
                    </div>

                    {/* 組織情報 */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                            組織情報
                        </h3>
                        <div className="space-y-4">
                            <FormGroup>
                                <InputLabel htmlFor="name" required>
                                    組織名
                                </InputLabel>
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    disabled={processing}
                                    placeholder="株式会社Smart Sprouts"
                                />
                                <InputError message={errors.name} />
                            </FormGroup>

                            <FormGroup>
                                <InputLabel htmlFor="legal_name">
                                    法人正式名称
                                </InputLabel>
                                <TextInput
                                    id="legal_name"
                                    value={data.legal_name}
                                    onChange={(e) =>
                                        handleChange(
                                            "legal_name",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                />
                                <InputError message={errors.legal_name} />
                            </FormGroup>

                            <FormGroup>
                                <InputLabel htmlFor="representative_name">
                                    代表者名
                                </InputLabel>
                                <TextInput
                                    id="representative_name"
                                    value={data.representative_name}
                                    onChange={(e) =>
                                        handleChange(
                                            "representative_name",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    placeholder="山田 太郎"
                                />
                                <InputError
                                    message={errors.representative_name}
                                />
                            </FormGroup>

                            <FormGroup>
                                <InputLabel htmlFor="business_description">
                                    事業内容
                                </InputLabel>
                                <TextArea
                                    id="business_description"
                                    value={data.business_description}
                                    onChange={(e) =>
                                        handleChange(
                                            "business_description",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    rows={4}
                                    placeholder={
                                        "Webサイト・アプリケーション開発\nシステム開発・保守運用"
                                    }
                                />
                                <InputError
                                    message={errors.business_description}
                                />
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    1行1項目で入力してください（会社概要ページに箇条書きで表示されます）
                                </p>
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup>
                                    <InputLabel htmlFor="employee_count">
                                        従業員数
                                    </InputLabel>
                                    <TextInput
                                        id="employee_count"
                                        type="number"
                                        value={data.employee_count}
                                        onChange={(e) =>
                                            handleChange(
                                                "employee_count",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        min="0"
                                        placeholder="30"
                                    />
                                    <InputError
                                        message={errors.employee_count}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <InputLabel htmlFor="capital">
                                        資本金
                                    </InputLabel>
                                    <TextInput
                                        id="capital"
                                        value={data.capital}
                                        onChange={(e) =>
                                            handleChange(
                                                "capital",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="1,000万円"
                                    />
                                    <InputError message={errors.capital} />
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup>
                                    <InputLabel htmlFor="established_date">
                                        設立日
                                    </InputLabel>
                                    <TextInput
                                        id="established_date"
                                        type="date"
                                        value={data.established_date}
                                        onChange={(e) =>
                                            handleChange(
                                                "established_date",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    />
                                    <InputError
                                        message={errors.established_date}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <InputLabel htmlFor="business_hours">
                                        営業時間
                                    </InputLabel>
                                    <TextInput
                                        id="business_hours"
                                        value={data.business_hours}
                                        onChange={(e) =>
                                            handleChange(
                                                "business_hours",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="平日 9:00-18:00（土日祝休業）"
                                    />
                                    <InputError
                                        message={errors.business_hours}
                                    />
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup>
                                    <InputLabel htmlFor="registration_number">
                                        法人番号
                                    </InputLabel>
                                    <TextInput
                                        id="registration_number"
                                        value={data.registration_number}
                                        onChange={(e) =>
                                            handleChange(
                                                "registration_number",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    />
                                    <InputError
                                        message={errors.registration_number}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <InputLabel htmlFor="tax_number">
                                        税務番号
                                    </InputLabel>
                                    <TextInput
                                        id="tax_number"
                                        value={data.tax_number}
                                        onChange={(e) =>
                                            handleChange(
                                                "tax_number",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    />
                                    <InputError
                                        message={errors.tax_number}
                                    />
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup>
                                    <InputLabel htmlFor="phone">
                                        電話番号
                                    </InputLabel>
                                    <TextInput
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            handleChange(
                                                "phone",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="03-1234-5678"
                                    />
                                    <InputError message={errors.phone} />
                                </FormGroup>

                                <FormGroup>
                                    <InputLabel htmlFor="fax">
                                        FAX番号
                                    </InputLabel>
                                    <TextInput
                                        id="fax"
                                        value={data.fax}
                                        onChange={(e) =>
                                            handleChange("fax", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors.fax} />
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup>
                                    <InputLabel htmlFor="email">
                                        メールアドレス
                                    </InputLabel>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            handleChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="info@smartsprouts.com"
                                    />
                                    <InputError message={errors.email} />
                                </FormGroup>

                                <FormGroup>
                                    <InputLabel htmlFor="website">
                                        WebサイトURL
                                    </InputLabel>
                                    <TextInput
                                        id="website"
                                        value={data.website}
                                        onChange={(e) =>
                                            handleChange(
                                                "website",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors.website} />
                                </FormGroup>
                            </div>
                        </div>
                    </div>

                    {/* 住所（デフォルト住所） */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                            住所
                        </h3>
                        <div className="space-y-4">
                            <FormGroup>
                                <InputLabel htmlFor="address_postal_code">
                                    郵便番号
                                </InputLabel>
                                <TextInput
                                    id="address_postal_code"
                                    value={data.address.postal_code}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            "postal_code",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    placeholder="1000001"
                                />
                                <InputError
                                    message={errors["address.postal_code"]}
                                />
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup>
                                    <InputLabel htmlFor="address_prefecture">
                                        都道府県
                                    </InputLabel>
                                    <TextInput
                                        id="address_prefecture"
                                        value={data.address.prefecture}
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "prefecture",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="東京都"
                                    />
                                    <InputError
                                        message={
                                            errors["address.prefecture"]
                                        }
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <InputLabel htmlFor="address_city">
                                        市区町村
                                    </InputLabel>
                                    <TextInput
                                        id="address_city"
                                        value={data.address.city}
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "city",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="千代田区"
                                    />
                                    <InputError
                                        message={errors["address.city"]}
                                    />
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup>
                                    <InputLabel htmlFor="address_district">
                                        町域
                                    </InputLabel>
                                    <TextInput
                                        id="address_district"
                                        value={data.address.district}
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "district",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="千代田"
                                    />
                                    <InputError
                                        message={errors["address.district"]}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <InputLabel htmlFor="address_other">
                                        番地・建物名
                                    </InputLabel>
                                    <TextInput
                                        id="address_other"
                                        value={data.address.address_other}
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "address_other",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="1-1-1"
                                    />
                                    <InputError
                                        message={
                                            errors["address.address_other"]
                                        }
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-end gap-3">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                            >
                                <CheckIcon className="h-4 w-4 mr-2" />
                                更新
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
