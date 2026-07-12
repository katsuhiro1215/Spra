import { getValidationMessage } from "@/Constants/Validation";

// ラベルのバリデーション
export const validateLabel = (form) => {
    if (!form.label) {
        form.errors.label = getValidationMessage("required", {
            fieldKey: "label",
        });
    } else if (form.label.length > 255) {
        form.errors.label = getValidationMessage("maxLength", {
            fieldKey: "label",
            max: 255,
        });
    } else {
        delete form.errors.label;
    }
};

// URLのバリデーション
export const validateUrl = (form) => {
    if (form.url && form.url.length > 500) {
        form.errors.url = getValidationMessage("maxLength", {
            fieldKey: "url",
            max: 500,
        });
    } else {
        delete form.errors.url;
    }
};

// 表示順のバリデーション
export const validateSortOrder = (form) => {
    if (form.sort_order && (isNaN(form.sort_order) || form.sort_order < 0)) {
        form.errors.sort_order = "表示順は0以上の数値を入力してください。";
    } else {
        delete form.errors.sort_order;
    }
};

// フォーム全体のバリデーション
export const validateMenuItemForm = (form) => {
    validateLabel(form);
    validateUrl(form);
    validateSortOrder(form);
};

// バリデーションエラーがあるかチェック
export const hasMenuItemFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
