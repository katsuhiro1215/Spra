import { getValidationMessage } from "@/Constants/Validation";

// キーのバリデーション
export const validateKey = (form) => {
    if (!form.key) {
        form.errors.key = getValidationMessage("required", { fieldKey: "key" });
    } else if (form.key.length > 50) {
        form.errors.key = getValidationMessage("maxLength", {
            fieldKey: "key",
            max: 50,
        });
    } else if (!/^[a-z0-9_]+$/.test(form.key)) {
        form.errors.key =
            "キーは英小文字、数字、アンダースコアのみ使用可能です。";
    } else {
        delete form.errors.key;
    }
};

// 名前のバリデーション
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
    if (!form.slug) {
        form.errors.slug = getValidationMessage("required", {
            fieldKey: "slug",
        });
    } else if (form.slug.length > 255) {
        form.errors.slug = getValidationMessage("maxLength", {
            fieldKey: "slug",
            max: 255,
        });
    } else if (!/^[a-z0-9\-]+$/.test(form.slug)) {
        form.errors.slug =
            "スラッグは英小文字、数字、ハイフンのみ使用可能です。";
    } else {
        delete form.errors.slug;
    }
};

// 説明のバリデーション
export const validateDescription = (form) => {
    if (form.description && form.description.length > 500) {
        form.errors.description = getValidationMessage("maxLength", {
            fieldKey: "description",
            max: 500,
        });
    } else {
        delete form.errors.description;
    }
};

// フォーム全体のバリデーション
export const validatePageTypeForm = (form) => {
    validateKey(form);
    validateName(form);
    validateSlug(form);
    validateDescription(form);
};

// バリデーションエラーがあるかチェック
export const hasPageTypeFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
