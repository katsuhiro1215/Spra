import React from "react";
import { FormGroup, TextInput, TextArea, SelectInput, NumberInput } from "@/Components/Forms";

const PREFECTURES = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
];

const INDUSTRIES = [
    "製造業",
    "IT・ソフトウェア",
    "建設・不動産",
    "小売・卸売",
    "金融・保険",
    "運輸・物流",
    "医療・介護",
    "教育",
    "飲食・宿泊",
    "コンサルティング",
    "マーケティング・広告",
    "エネルギー",
    "農業・林業・漁業",
    "公務",
    "その他",
];

export default function CompanyForm({
    data,
    setData,
    errors,
    companyTypes,
    statuses,
}) {
    const handleChange = (field, value) => {
        setData(field, value);
    };

    const isIndividual = data.company_type === "individual";

    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    基本情報
                </h3>
                <div className="space-y-6">
                    <FormGroup label="会社名" error={errors.name} required>
                        <TextInput
                            value={data.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            placeholder="株式会社サンプル"
                            error={errors.name}
                        />
                    </FormGroup>

                    <FormGroup
                        label="会社種別"
                        error={errors.company_type}
                        required
                    >
                        <SelectInput
                            value={data.company_type}
                            onChange={(e) =>
                                handleChange("company_type", e.target.value)
                            }
                            options={companyTypes}
                            error={errors.company_type}
                        />
                    </FormGroup>

                    <FormGroup
                        label="正式名称"
                        error={errors.legal_name}
                        help={
                            isIndividual
                                ? "個人事業主の場合は本名を入力してください"
                                : "登記上の正式な名称"
                        }
                    >
                        <TextInput
                            value={data.legal_name}
                            onChange={(e) =>
                                handleChange("legal_name", e.target.value)
                            }
                            placeholder={
                                isIndividual ? "山田 太郎" : "株式会社サンプル"
                            }
                            error={errors.legal_name}
                        />
                    </FormGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label={isIndividual ? "個人番号" : "法人番号"}
                            error={errors.registration_number}
                            help={
                                isIndividual
                                    ? "マイナンバー等"
                                    : "13桁の法人番号"
                            }
                        >
                            <TextInput
                                value={data.registration_number}
                                onChange={(e) =>
                                    handleChange(
                                        "registration_number",
                                        e.target.value,
                                    )
                                }
                                placeholder={
                                    isIndividual ? "" : "1234567890123"
                                }
                                error={errors.registration_number}
                            />
                        </FormGroup>

                        <FormGroup
                            label="税番号"
                            error={errors.tax_number}
                            help="インボイス登録番号等"
                        >
                            <TextInput
                                value={data.tax_number}
                                onChange={(e) =>
                                    handleChange("tax_number", e.target.value)
                                }
                                placeholder="T1234567890123"
                                error={errors.tax_number}
                            />
                        </FormGroup>
                    </div>

                    <FormGroup
                        label="ステータス"
                        error={errors.status}
                        required
                    >
                        <SelectInput
                            value={data.status}
                            onChange={(e) =>
                                handleChange("status", e.target.value)
                            }
                            options={statuses}
                            error={errors.status}
                        />
                    </FormGroup>
                </div>
            </div>

            {/* 連絡先情報 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    連絡先情報
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup label="電話番号" error={errors.phone}>
                            <TextInput
                                type="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                                placeholder="03-1234-5678"
                                error={errors.phone}
                            />
                        </FormGroup>

                        <FormGroup label="FAX番号" error={errors.fax}>
                            <TextInput
                                type="tel"
                                value={data.fax}
                                onChange={(e) =>
                                    handleChange("fax", e.target.value)
                                }
                                placeholder="03-1234-5679"
                                error={errors.fax}
                            />
                        </FormGroup>
                    </div>

                    <FormGroup label="メールアドレス" error={errors.email}>
                        <TextInput
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value)
                            }
                            placeholder="info@example.com"
                            error={errors.email}
                        />
                    </FormGroup>

                    <FormGroup label="ウェブサイト" error={errors.website}>
                        <TextInput
                            type="url"
                            value={data.website}
                            onChange={(e) =>
                                handleChange("website", e.target.value)
                            }
                            placeholder="https://example.com"
                            error={errors.website}
                        />
                    </FormGroup>
                </div>
            </div>

            {/* 代表者情報 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    代表者情報
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label="代表者名"
                            error={errors.representative_name}
                        >
                            <TextInput
                                value={data.representative_name}
                                onChange={(e) =>
                                    handleChange(
                                        "representative_name",
                                        e.target.value,
                                    )
                                }
                                placeholder="山田 太郎"
                                error={errors.representative_name}
                            />
                        </FormGroup>

                        <FormGroup
                            label="役職"
                            error={errors.representative_title}
                        >
                            <TextInput
                                value={data.representative_title}
                                onChange={(e) =>
                                    handleChange(
                                        "representative_title",
                                        e.target.value,
                                    )
                                }
                                placeholder="代表取締役"
                                error={errors.representative_title}
                            />
                        </FormGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label="代表者メールアドレス"
                            error={errors.representative_email}
                        >
                            <TextInput
                                type="email"
                                value={data.representative_email}
                                onChange={(e) =>
                                    handleChange(
                                        "representative_email",
                                        e.target.value,
                                    )
                                }
                                placeholder="yamada@example.com"
                                error={errors.representative_email}
                            />
                        </FormGroup>

                        <FormGroup
                            label="代表者電話番号"
                            error={errors.representative_phone}
                        >
                            <TextInput
                                type="tel"
                                value={data.representative_phone}
                                onChange={(e) =>
                                    handleChange(
                                        "representative_phone",
                                        e.target.value,
                                    )
                                }
                                placeholder="090-1234-5678"
                                error={errors.representative_phone}
                            />
                        </FormGroup>
                    </div>
                </div>
            </div>

            {/* 事業情報 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    事業情報
                </h3>
                <div className="space-y-6">
                    <FormGroup
                        label="事業内容"
                        error={errors.business_description}
                    >
                        <TextArea
                            value={data.business_description}
                            onChange={(e) =>
                                handleChange(
                                    "business_description",
                                    e.target.value,
                                )
                            }
                            placeholder="事業内容を入力してください"
                            rows={4}
                            error={errors.business_description}
                        />
                    </FormGroup>

                    <FormGroup label="業界" error={errors.industry}>
                        <SelectInput
                            value={data.industry}
                            onChange={(e) =>
                                handleChange("industry", e.target.value)
                            }
                            options={[
                                { value: "", label: "選択してください" },
                                ...INDUSTRIES.map((ind) => ({
                                    value: ind,
                                    label: ind,
                                })),
                            ]}
                            error={errors.industry}
                        />
                    </FormGroup>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormGroup
                            label="従業員数"
                            error={errors.employee_count}
                        >
                            <NumberInput
                                value={data.employee_count}
                                onChange={(e) =>
                                    handleChange(
                                        "employee_count",
                                        e.target.value,
                                    )
                                }
                                placeholder="100"
                                min="1"
                                error={errors.employee_count}
                            />
                        </FormGroup>

                        <FormGroup
                            label="資本金"
                            error={errors.capital}
                            help="円単位で入力"
                        >
                            <NumberInput
                                value={data.capital}
                                onChange={(e) =>
                                    handleChange("capital", e.target.value)
                                }
                                placeholder="10000000"
                                min="0"
                                step="1000000"
                                error={errors.capital}
                            />
                        </FormGroup>

                        <FormGroup
                            label="設立日"
                            error={errors.established_date}
                        >
                            <TextInput
                                type="date"
                                value={data.established_date}
                                onChange={(e) =>
                                    handleChange(
                                        "established_date",
                                        e.target.value,
                                    )
                                }
                                error={errors.established_date}
                            />
                        </FormGroup>
                    </div>
                </div>
            </div>

            {/* 備考 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <FormGroup label="備考" error={errors.notes}>
                    <TextArea
                        value={data.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="その他のメモや備考"
                        rows={3}
                        error={errors.notes}
                    />
                </FormGroup>
            </div>
        </div>
    );
}

export { PREFECTURES };
