import { useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    SelectInput,
    TextArea,
    Checkbox,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import { Core as YubinBango } from "yubinbango-core2";
import {
    ADDRESS_TYPE_OPTIONS,
    PREFECTURE_OPTIONS,
} from "@/Constants/SelectOptions";
import * as validation from "./validation";

export default function AddressForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) {
    // クライアント側のバリデーションエラー
    const [localErrors, setLocalErrors] = useState({});

    // 選択肢に空のオプションを追加
    const typeOptions = [
        { value: "", label: "選択してください" },
        ...ADDRESS_TYPE_OPTIONS,
    ];

    const prefectureOptions = [
        { value: "", label: "選択してください" },
        ...PREFECTURE_OPTIONS,
    ];

    // バリデーション実行（Vue版の @blur と同じ）
    const handleBlur = (fieldName) => {
        // 一時的なデータオブジェクト（validation関数用）
        const tempData = { ...data, errors: {} };

        // バリデーション関数を呼び出し
        switch (fieldName) {
            case "type":
                validation.validateType(tempData);
                break;
            case "label":
                validation.validateLabel(tempData);
                break;
            case "postal_code":
                validation.validatePostalCode(tempData);
                break;
            case "prefecture":
                validation.validatePrefecture(tempData);
                break;
            case "city":
                validation.validateCity(tempData);
                break;
            case "district":
                validation.validateDistrict(tempData);
                break;
            case "address_other":
                validation.validateAddressOther(tempData);
                break;
            case "phone":
                validation.validatePhone(tempData);
                break;
            case "contact_person":
                validation.validateContactPerson(tempData);
                break;
            case "notes":
                validation.validateNotes(tempData);
                break;
            case "latitude":
                validation.validateLatitude(tempData);
                break;
            case "longitude":
                validation.validateLongitude(tempData);
                break;
        }

        // エラーを更新
        setLocalErrors((prev) => ({
            ...prev,
            [fieldName]: tempData.errors[fieldName],
        }));
    };

    // 郵便番号自動入力
    const fetchAddress = () => {
        const postalCode = data.postal_code.replace(/[^0-9]/g, "");

        if (postalCode.length === 7) {
            new YubinBango(postalCode, (address) => {
                if (address.region) {
                    setData({
                        ...data,
                        postal_code: postalCode,
                        prefecture: address.region,
                        city: address.locality,
                        district: address.street,
                    });
                }
            });
        }
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
                        <CardTitle>住所情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* 住所タイプ */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="住所タイプ"
                                    htmlFor="type"
                                    required
                                    error={errors.type || localErrors.type}
                                >
                                    <SelectInput
                                        id="type"
                                        name="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        onBlur={() => handleBlur("type")}
                                        options={typeOptions}
                                    />
                                </FormGroup>
                            </div>

                            {/* ラベル */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="ラベル"
                                    htmlFor="label"
                                    error={errors.label || localErrors.label}
                                >
                                    <TextInput
                                        id="label"
                                        name="label"
                                        value={data.label}
                                        onChange={(e) =>
                                            setData("label", e.target.value)
                                        }
                                        onBlur={() => handleBlur("label")}
                                        placeholder="本社オフィス"
                                    />
                                </FormGroup>
                            </div>

                            {/* 郵便番号 */}
                            <div className="sm:col-span-2">
                                <FormGroup
                                    label="郵便番号"
                                    htmlFor="postal_code"
                                    required
                                    error={
                                        errors.postal_code ||
                                        localErrors.postal_code
                                    }
                                >
                                    <div className="flex gap-2">
                                        <TextInput
                                            id="postal_code"
                                            name="postal_code"
                                            value={data.postal_code}
                                            onChange={(e) =>
                                                setData(
                                                    "postal_code",
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            onBlur={() =>
                                                handleBlur("postal_code")
                                            }
                                            placeholder="1234567"
                                            maxLength="7"
                                        />
                                        <SecondaryButton
                                            type="button"
                                            onClick={fetchAddress}
                                            size="sm"
                                        >
                                            自動取得
                                        </SecondaryButton>
                                    </div>
                                </FormGroup>
                            </div>

                            {/* 都道府県 */}
                            <div className="sm:col-span-2">
                                <FormGroup
                                    label="都道府県"
                                    htmlFor="prefecture"
                                    required
                                    error={
                                        errors.prefecture ||
                                        localErrors.prefecture
                                    }
                                >
                                    <SelectInput
                                        id="prefecture"
                                        name="prefecture"
                                        value={data.prefecture}
                                        onChange={(e) =>
                                            setData(
                                                "prefecture",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => handleBlur("prefecture")}
                                        options={prefectureOptions}
                                    />
                                </FormGroup>
                            </div>

                            {/* 市区町村 */}
                            <div className="sm:col-span-2">
                                <FormGroup
                                    label="市区町村"
                                    htmlFor="city"
                                    required
                                    error={errors.city || localErrors.city}
                                >
                                    <TextInput
                                        id="city"
                                        name="city"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                        onBlur={() => handleBlur("city")}
                                        placeholder="千代田区"
                                    />
                                </FormGroup>
                            </div>

                            {/* 町域 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="町域"
                                    htmlFor="district"
                                    error={
                                        errors.district ||
                                        localErrors.district
                                    }
                                >
                                    <TextInput
                                        id="district"
                                        name="district"
                                        value={data.district}
                                        onChange={(e) =>
                                            setData("district", e.target.value)
                                        }
                                        onBlur={() => handleBlur("district")}
                                        placeholder="千代田"
                                    />
                                </FormGroup>
                            </div>

                            {/* 番地・建物名 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="番地・建物名"
                                    htmlFor="address_other"
                                    error={
                                        errors.address_other ||
                                        localErrors.address_other
                                    }
                                >
                                    <TextInput
                                        id="address_other"
                                        name="address_other"
                                        value={data.address_other}
                                        onChange={(e) =>
                                            setData(
                                                "address_other",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur("address_other")
                                        }
                                        placeholder="1-1-1 〇〇ビル3F"
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
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        onBlur={() => handleBlur("phone")}
                                        placeholder="03-1234-5678"
                                    />
                                </FormGroup>
                            </div>

                            {/* 担当者名 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="担当者名"
                                    htmlFor="contact_person"
                                    error={
                                        errors.contact_person ||
                                        localErrors.contact_person
                                    }
                                >
                                    <TextInput
                                        id="contact_person"
                                        name="contact_person"
                                        value={data.contact_person}
                                        onChange={(e) =>
                                            setData(
                                                "contact_person",
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur("contact_person")
                                        }
                                        placeholder="山田 太郎"
                                    />
                                </FormGroup>
                            </div>

                            {/* 備考 */}
                            <div className="sm:col-span-6">
                                <FormGroup
                                    label="備考"
                                    htmlFor="notes"
                                    error={errors.notes || localErrors.notes}
                                >
                                    <TextArea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        onBlur={() => handleBlur("notes")}
                                        placeholder="備考を入力してください..."
                                    />
                                </FormGroup>
                            </div>

                            {/* 緯度 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="緯度"
                                    htmlFor="latitude"
                                    error={
                                        errors.latitude ||
                                        localErrors.latitude
                                    }
                                >
                                    <TextInput
                                        id="latitude"
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        value={data.latitude || ""}
                                        onChange={(e) =>
                                            setData("latitude", e.target.value)
                                        }
                                        onBlur={() => handleBlur("latitude")}
                                        placeholder="35.6812"
                                    />
                                </FormGroup>
                            </div>

                            {/* 経度 */}
                            <div className="sm:col-span-3">
                                <FormGroup
                                    label="経度"
                                    htmlFor="longitude"
                                    error={
                                        errors.longitude ||
                                        localErrors.longitude
                                    }
                                >
                                    <TextInput
                                        id="longitude"
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        value={data.longitude || ""}
                                        onChange={(e) =>
                                            setData("longitude", e.target.value)
                                        }
                                        onBlur={() => handleBlur("longitude")}
                                        placeholder="139.7671"
                                    />
                                </FormGroup>
                            </div>

                            {/* チェックボックス */}
                            <div className="sm:col-span-6 space-y-4">
                                <Checkbox
                                    id="is_default"
                                    name="is_default"
                                    checked={data.is_default}
                                    onChange={(e) =>
                                        setData("is_default", e.target.checked)
                                    }
                                    label="デフォルト住所に設定"
                                />
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                    label="有効にする"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

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
                                : "登録中..."
                            : isEdit
                              ? "住所更新"
                              : "住所登録"}
                    </StoreButton>
                </div>
            </div>
        </form>
    );
}
