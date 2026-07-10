import { getValidationMessage } from "@/Constants/Validation";

/**
 * テンプレート名のバリデーション
 */
export const validateName = (form) => {
    const { name } = form;

    if (!name || name.trim() === "") {
        form.errors.name = "テンプレート名は必須です。";
        return;
    }

    if (name.length > 255) {
        form.errors.name = "テンプレート名は255文字以下である必要があります。";
        return;
    }
};

/**
 * 説明のバリデーション（オプション）
 */
export const validateDescription = (form) => {
    const { description } = form;

    // 説明はオプションなので空でも OK
    if (description && description.length > 1000) {
        form.errors.description = "説明は1000文字以下である必要があります。";
        return;
    }
};

/**
 * アイコンのバリデーション
 */
export const validateIcon = (form) => {
    const { icon } = form;

    if (icon && icon.length > 50) {
        form.errors.icon = "アイコンは50文字以下である必要があります。";
        return;
    }
};

/**
 * 表示順のバリデーション
 */
export const validateSortOrder = (form) => {
    const { sort_order } = form;

    if (sort_order !== null && sort_order !== undefined && sort_order !== "") {
        const num = Number(sort_order);
        if (isNaN(num) || num < 0) {
            form.errors.sort_order =
                "表示順は0以上の数値である必要があります。";
            return;
        }
    }
};

/**
 * ステータスのバリデーション
 */
export const validateIsActive = (form) => {
    // is_active はボolean値なので、バリデーション不要
    // form では true/false として扱われる
};
