import { getValidationMessage } from "@/Constants/Validation";

// メニュー名のバリデーション
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

// 配置場所のバリデーション
export const validateLocation = (form) => {
    if (!form.location) {
        form.errors.location = getValidationMessage("required", {
            fieldKey: "location",
        });
    } else if (!["header", "footer", "sidebar"].includes(form.location)) {
        form.errors.location = "有効な配置場所を選択してください。";
    } else {
        delete form.errors.location;
    }
};

// フォーム全体のバリデーション
export const validateMenuForm = (form) => {
    validateName(form);
    validateSlug(form);
    validateDescription(form);
    validateLocation(form);
};

// バリデーションエラーがあるかチェック
export const hasMenuFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
