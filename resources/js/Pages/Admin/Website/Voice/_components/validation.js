import { getValidationMessage } from "@/Constants/Validation";

// 表示名のバリデーション
export const validateAuthorName = (form) => {
    if (!form.author_name) {
        form.errors.author_name = getValidationMessage("required", {
            fieldKey: "author_name",
        });
    } else if (form.author_name.length > 100) {
        form.errors.author_name = getValidationMessage("maxLength", {
            fieldKey: "author_name",
            max: 100,
        });
    } else {
        delete form.errors.author_name;
    }
};

// 本文のバリデーション
export const validateContent = (form) => {
    if (!form.content) {
        form.errors.content = getValidationMessage("required", {
            fieldKey: "content",
        });
    } else if (form.content.length > 2000) {
        form.errors.content = getValidationMessage("maxLength", {
            fieldKey: "content",
            max: 2000,
        });
    } else {
        delete form.errors.content;
    }
};

// 評価のバリデーション
export const validateRating = (form) => {
    if (
        form.rating &&
        (isNaN(form.rating) || form.rating < 1 || form.rating > 5)
    ) {
        form.errors.rating = "評価は1〜5の範囲で入力してください。";
    } else {
        delete form.errors.rating;
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
export const validateVoiceForm = (form) => {
    validateAuthorName(form);
    validateContent(form);
    validateRating(form);
    validateSortOrder(form);
};

// バリデーションエラーがあるかチェック
export const hasVoiceFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
