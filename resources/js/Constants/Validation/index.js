import { CommonMessages } from "./CommonMessages";
import { ServiceTypeMessages } from "./ServiceTypeMessages";
import {
    ProfileMessages,
    AddressMessages,
    AdminFieldLabels,
} from "./AdminMessages";

export const ValidationMessages = {
    ...CommonMessages,
    serviceType: ServiceTypeMessages,
    profile: ProfileMessages,
    address: AddressMessages,
};

/**
 * バリデーションメッセージを取得する汎用関数
 * @param {string} validationType - バリデーションタイプ（required, maxLength等）
 * @param {Object} options - オプション（fieldKey, max, min等）
 * @returns {string} バリデーションメッセージ
 */
export const getValidationMessage = (validationType, options = {}) => {
    const { fieldKey, max, min, fieldLabel } = options;

    // フィールドラベルを取得（指定されていればそれを使用、なければfieldKeyから取得）
    const label = fieldLabel || AdminFieldLabels[fieldKey] || fieldKey;

    switch (validationType) {
        case "required":
            return `${label}は必須です`;
        case "maxLength":
            return `${label}は${max}文字以内で入力してください`;
        case "minLength":
            return `${label}は${min}文字以上で入力してください`;
        case "pattern":
            return `${label}の形式が正しくありません`;
        case "enum":
            return `有効な${label}を選択してください`;
        case "email":
            return "正しいメールアドレスを入力してください";
        case "url":
            return "正しいURLを入力してください";
        case "numeric":
            return `${label}は数値で入力してください`;
        case "positive":
            return `${label}は0以上の値を入力してください`;
        case "unique":
            return `この${label}は既に使用されています`;
        case "invalid":
            return `${label}が正しくありません`;
        default:
            return `${label}の入力が正しくありません`;
    }
};
