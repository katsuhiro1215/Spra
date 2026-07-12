import { getValidationMessage } from "@/Constants/Validation";

// ページIDのバリデーション
export const validatePageId = (form) => {
    if (!form.page_id) {
        form.errors.page_id = getValidationMessage("required", {
            fieldKey: "page",
        });
    } else {
        delete form.errors.page_id;
    }
};

// セクション名のバリデーション
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

// 役割のバリデーション
export const validateRole = (form) => {
    if (form.role && form.role.length > 100) {
        form.errors.role = getValidationMessage("maxLength", {
            fieldKey: "role",
            max: 100,
        });
    } else {
        delete form.errors.role;
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
export const validateSectionForm = (form) => {
    validatePageId(form);
    validateName(form);
    validateRole(form);
    validateSortOrder(form);
};

// バリデーションエラーがあるかチェック
export const hasSectionFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
