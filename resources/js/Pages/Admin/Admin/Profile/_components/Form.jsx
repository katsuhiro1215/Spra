import { useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, SelectInput, TextArea } from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import { GENDER_OPTIONS } from "@/Constants/SelectOptions";
import * as validation from "./validation";

export default function ProfileForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) {
    const [localErrors, setLocalErrors] = useState({});

    // 選択肢に空のオプションを追加
    const genderOptions = [
        { value: "", label: "選択してください" },
        ...GENDER_OPTIONS,
    ];

    // フィールドごとのバリデーション
    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "last_name":
                validation.validateLastName(tempData);
                break;
            case "first_name":
                validation.validateFirstName(tempData);
                break;
            case "last_name_kana":
                validation.validateLastNameKana(tempData);
                break;
            case "first_name_kana":
                validation.validateFirstNameKana(tempData);
                break;
            case "display_name":
                validation.validateDisplayName(tempData);
                break;
            case "birth_date":
                validation.validateBirthDate(tempData);
                break;
            case "gender":
                validation.validateGender(tempData);
                break;
            case "phone":
                validation.validatePhone(tempData);
                break;
            case "mobile":
                validation.validateMobile(tempData);
                break;
            case "emergency_contact_name":
                validation.validateEmergencyContactName(tempData);
                break;
            case "emergency_contact_phone":
                validation.validateEmergencyContactPhone(tempData);
                break;
            case "bio":
                validation.validateBio(tempData);
                break;
        }

        setLocalErrors((prev) => ({
            ...prev,
            [fieldName]: tempData.errors[fieldName],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>基本情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* 姓 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="姓"
                                    htmlFor="last_name"
                                    required
                                    error={
                                        errors.last_name ||
                                        localErrors.last_name
                                    }
                                >
                                    <TextInput
                                        id="last_name"
                                        name="last_name"
                                        value={data.last_name || ""}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        onBlur={() => handleBlur("last_name")}
                                        placeholder="山田"
                                    />
                                </FormGroup>
                            </div>

                            {/* 名 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="名"
                                    htmlFor="first_name"
                                    required
                                    error={
                                        errors.first_name ||
                                        localErrors.first_name
                                    }
                                >
                                    <TextInput
                                        id="first_name"
                                        name="first_name"
                                        value={data.first_name || ""}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => handleBlur("first_name")}
                                        placeholder="太郎"
                                    />
                                </FormGroup>
                            </div>

                            {/* 姓（カナ） */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="姓（カナ）"
                                    htmlFor="last_name_kana"
                                    error={
                                        errors.last_name_kana ||
                                        localErrors.last_name_kana
                                    }
                                >
                                    <TextInput
                                        id="last_name_kana"
                                        name="last_name_kana"
                                        value={data.last_name_kana || ""}
                                        onChange={(e) =>
                                            setData(
                                                "last_name_kana",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur("last_name_kana")
                                        }
                                        placeholder="ヤマダ"
                                    />
                                </FormGroup>
                            </div>

                            {/* 名（カナ） */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="名（カナ）"
                                    htmlFor="first_name_kana"
                                    error={
                                        errors.first_name_kana ||
                                        localErrors.first_name_kana
                                    }
                                >
                                    <TextInput
                                        id="first_name_kana"
                                        name="first_name_kana"
                                        value={data.first_name_kana || ""}
                                        onChange={(e) =>
                                            setData(
                                                "first_name_kana",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur("first_name_kana")
                                        }
                                        placeholder="タロウ"
                                    />
                                </FormGroup>
                            </div>

                            {/* 表示名 */}
                            <div className="sm:col-span-6">
                                <FormGroup
                                    label="表示名"
                                    htmlFor="display_name"
                                    error={
                                        errors.display_name ||
                                        localErrors.display_name
                                    }
                                >
                                    <TextInput
                                        id="display_name"
                                        name="display_name"
                                        value={data.display_name || ""}
                                        onChange={(e) =>
                                            setData(
                                                "display_name",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur("display_name")
                                        }
                                        placeholder="やまちゃん"
                                    />
                                </FormGroup>
                            </div>

                            {/* 生年月日 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="生年月日"
                                    htmlFor="birth_date"
                                    error={
                                        errors.birth_date ||
                                        localErrors.birth_date
                                    }
                                >
                                    <TextInput
                                        type="date"
                                        id="birth_date"
                                        name="birth_date"
                                        value={data.birth_date || ""}
                                        onChange={(e) =>
                                            setData(
                                                "birth_date",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => handleBlur("birth_date")}
                                    />
                                </FormGroup>
                            </div>

                            {/* 性別 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="性別"
                                    htmlFor="gender"
                                    error={
                                        errors.gender || localErrors.gender
                                    }
                                >
                                    <SelectInput
                                        id="gender"
                                        name="gender"
                                        value={data.gender || ""}
                                        onChange={(e) =>
                                            setData("gender", e.target.value)
                                        }
                                        onBlur={() => handleBlur("gender")}
                                        options={genderOptions}
                                    />
                                </FormGroup>
                            </div>

                            {/* 電話番号 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="電話番号"
                                    htmlFor="phone"
                                    error={errors.phone || localErrors.phone}
                                >
                                    <TextInput
                                        id="phone"
                                        name="phone"
                                        value={data.phone || ""}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        onBlur={() => handleBlur("phone")}
                                        placeholder="03-1234-5678"
                                    />
                                </FormGroup>
                            </div>

                            {/* 携帯電話 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="携帯電話"
                                    htmlFor="mobile"
                                    error={errors.mobile || localErrors.mobile}
                                >
                                    <TextInput
                                        id="mobile"
                                        name="mobile"
                                        value={data.mobile || ""}
                                        onChange={(e) =>
                                            setData("mobile", e.target.value)
                                        }
                                        onBlur={() => handleBlur("mobile")}
                                        placeholder="090-1234-5678"
                                    />
                                </FormGroup>
                            </div>

                            {/* 緊急連絡先氏名 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="緊急連絡先氏名"
                                    htmlFor="emergency_contact_name"
                                    error={
                                        errors.emergency_contact_name ||
                                        localErrors.emergency_contact_name
                                    }
                                >
                                    <TextInput
                                        id="emergency_contact_name"
                                        name="emergency_contact_name"
                                        value={
                                            data.emergency_contact_name || ""
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "emergency_contact_name",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur("emergency_contact_name")
                                        }
                                    />
                                </FormGroup>
                            </div>

                            {/* 緊急連絡先電話番号 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="緊急連絡先電話番号"
                                    htmlFor="emergency_contact_phone"
                                    error={
                                        errors.emergency_contact_phone ||
                                        localErrors.emergency_contact_phone
                                    }
                                >
                                    <TextInput
                                        id="emergency_contact_phone"
                                        name="emergency_contact_phone"
                                        value={
                                            data.emergency_contact_phone || ""
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "emergency_contact_phone",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur(
                                                "emergency_contact_phone",
                                            )
                                        }
                                    />
                                </FormGroup>
                            </div>

                            {/* 自己紹介 */}
                            <div className="sm:col-span-6">
                                <FormGroup
                                    label="自己紹介"
                                    htmlFor="bio"
                                    error={errors.bio || localErrors.bio}
                                >
                                    <TextArea
                                        id="bio"
                                        name="bio"
                                        rows={4}
                                        value={data.bio || ""}
                                        onChange={(e) =>
                                            setData("bio", e.target.value)
                                        }
                                        onBlur={() => handleBlur("bio")}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* アクションボタン */}
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton href={cancelRoute} size="md">
                        キャンセル
                    </SecondaryButton>
                    <StoreButton
                        type="submit"
                        disabled={processing}
                        loading={processing}
                        size="md"
                    >
                        {processing
                            ? isEdit
                                ? "更新中..."
                                : "作成中..."
                            : isEdit
                              ? "更新"
                              : "作成"}
                    </StoreButton>
                </div>
            </div>
        </form>
    );
}
