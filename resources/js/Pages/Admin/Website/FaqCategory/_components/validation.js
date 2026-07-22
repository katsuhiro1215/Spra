import { getValidationMessage } from "@/Constants/Validation";

// カテゴリ名のバリデーション
export const validateName = (form) => {
    if (!form.name) {
        form.errors.name = getValidationMessage("required", {
            fieldKey: "name",
        });
    } else if (form.name.length > 255) {
        form.errors.name = getValidationMessage("maxLength", {
            fieldKey: "name",
            max: 255,
        });
    } else {
        delete form.errors.name;
    }
};

// スラッグのバリデーション
export const validateSlug = (form) => {
    if (form.slug && !/^[a-z0-9\-]+$/.test(form.slug)) {
        form.errors.slug =
            "スラッグは英小文字、数字、ハイフンのみ使用可能です。";
    } else if (form.slug && form.slug.length > 255) {
        form.errors.slug = getValidationMessage("maxLength", {
            fieldKey: "slug",
            max: 255,
        });
    } else {
        delete form.errors.slug;
    }
};

// 説明のバリデーション
export const validateDescription = (form) => {
    if (form.description && form.description.length > 1000) {
        form.errors.description = getValidationMessage("maxLength", {
            fieldKey: "description",
            max: 1000,
        });
    } else {
        delete form.errors.description;
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
export const validateFaqCategoryForm = (form) => {
    validateName(form);
    validateSlug(form);
    validateDescription(form);
    validateSortOrder(form);
};

// バリデーションエラーがあるかチェック
export const hasFaqCategoryFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
