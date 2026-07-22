import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
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
                            <FormGroup
                                label="サイト表示名"
                                htmlFor="site_name"
                                help="サイト表示名を入力してください"
                                error={errors.site_name}
                            >
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
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Header・Footerのロゴ横に表示されるサイト名
                                </p>
                            </FormGroup>

                            <FormGroup
                                label="英語表記名"
                                htmlFor="name_en"
                                help="英語表記名を入力してください"
                                error={errors.name_en}
                            >
                                <TextInput
                                    id="name_en"
                                    value={data.name_en}
                                    onChange={(e) =>
                                        handleChange("name_en", e.target.value)
                                    }
                                    disabled={processing}
                                    placeholder="Smart Sprouts Inc."
                                />
                            </FormGroup>

                            <FormGroup
                                label="ロゴ画像パス"
                                htmlFor="logo_path"
                                help="ロゴ画像のパスを入力してください"
                                error={errors.logo_path}
                            >
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
                            <FormGroup
                                label="組織名"
                                htmlFor="name"
                                required
                                help="組織名を入力してください"
                                error={errors.name}
                            >
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    disabled={processing}
                                    placeholder="株式会社Smart Sprouts"
                                />
                            </FormGroup>

                            <FormGroup
                                label="法人正式名称"
                                htmlFor="legal_name"
                                help="法人正式名称を入力してください"
                                error={errors.legal_name}
                            >
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
                            </FormGroup>

                            <FormGroup
                                label="代表者名"
                                htmlFor="representative_name"
                                required
                                help="代表者名を入力してください"
                                error={errors.representative_name}
                            >
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
                            </FormGroup>

                            <FormGroup
                                label="事業内容"
                                htmlFor="business_description"
                                help="事業内容を入力してください"
                                error={errors.business_description}
                            >
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
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    1行1項目で入力してください（会社概要ページに箇条書きで表示されます）
                                </p>
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="従業員数"
                                    htmlFor="employee_count"
                                    help="従業員数を入力してください"
                                    error={errors.employee_count}
                                >
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
                                </FormGroup>

                                <FormGroup
                                    label="資本金"
                                    htmlFor="capital"
                                    help="資本金を入力してください"
                                    error={errors.capital}
                                >
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
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="設立日"
                                    htmlFor="established_date"
                                    help="設立日を入力してください"
                                    error={errors.established_date}
                                >
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
                                </FormGroup>

                                <FormGroup
                                    label="営業時間"
                                    htmlFor="business_hours"
                                    help="営業時間を入力してください"
                                    error={errors.business_hours}
                                >
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
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="法人番号"
                                    htmlFor="registration_number"
                                    help="法人番号を入力してください"
                                    error={errors.registration_number}
                                >
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
                                </FormGroup>

                                <FormGroup
                                    label="税務番号"
                                    htmlFor="tax_number"
                                    help="税務番号を入力してください"
                                    error={errors.tax_number}
                                >
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
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="電話番号"
                                    htmlFor="phone"
                                    help="電話番号を入力してください"
                                    error={errors.phone}
                                >
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
                                </FormGroup>

                                <FormGroup
                                    label="FAX番号"
                                    htmlFor="fax"
                                    help="FAX番号を入力してください"
                                    error={errors.fax}
                                >
                                    <TextInput
                                        id="fax"
                                        value={data.fax}
                                        onChange={(e) =>
                                            handleChange("fax", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="メールアドレス"
                                    htmlFor="email"
                                    help="メールアドレスを入力してください"
                                    error={errors.email}
                                >
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
                                </FormGroup>

                                <FormGroup
                                    label="WebサイトURL"
                                    htmlFor="website"
                                    help="WebサイトのURLを入力してください"
                                    error={errors.website}
                                >
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
                            <FormGroup
                                label="郵便番号"
                                htmlFor="address_postal_code"
                                help="郵便番号を入力してください"
                                error={errors["address.postal_code"]}
                            >
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
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="都道府県"
                                    htmlFor="address_prefecture"
                                    help="都道府県を入力してください"
                                    error={errors["address.prefecture"]}
                                >
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
                                </FormGroup>

                                <FormGroup
                                    label="市区町村"
                                    htmlFor="address_city"
                                    help="市区町村を入力してください"
                                    error={errors["address.city"]}
                                >
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
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="町域"
                                    htmlFor="address_district"
                                    help="町域を入力してください"
                                    error={errors["address.district"]}
                                >
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
                                </FormGroup>

                                <FormGroup
                                    label="番地・建物名"
                                    htmlFor="address_other"
                                    help="番地・建物名を入力してください"
                                    error={errors["address.address_other"]}
                                >
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
                    <div className="flex items-center justify-end gap-3">
                        <PrimaryButton type="submit" disabled={processing}>
                            <CheckIcon className="h-4 w-4 mr-2" />
                            更新
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
