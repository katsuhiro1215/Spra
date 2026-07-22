import { getValidationMessage } from "@/Constants/Validation";

/**
 * サービス名のバリデーション
 */
export const validateName = (form) => {
    const { name } = form;

    if (!name || name.trim() === "") {
        form.errors.name = getValidationMessage("REQUIRED", "サービス名");
        return;
    }

    if (name.length > 255) {
        form.errors.name = getValidationMessage("MAX_LENGTH", "サービス名", 255);
        return;
    }
};

/**
 * スラッグのバリデーション
 */
export const validateSlug = (form) => {
    const { slug } = form;

    if (slug && slug.length > 255) {
        form.errors.slug = getValidationMessage("MAX_LENGTH", "スラッグ", 255);
        return;
    }

    // スラッグの形式チェック（英数字とハイフンのみ）
    if (slug && !/^[a-z0-9-]+$/.test(slug)) {
        form.errors.slug = getValidationMessage("INVALID_FORMAT", "スラッグ");
        return;
    }
};

/**
 * サービスカテゴリIDのバリデーション
 */
export const validateServiceCategoryId = (form) => {
    const { service_category_id } = form;

    if (!service_category_id || service_category_id === "") {
        form.errors.service_category_id =
            getValidationMessage("REQUIRED", "サービスカテゴリ");
        return;
    }
};

/**
 * 説明のバリデーション
 */
export const validateDescription = (form) => {
    const { description } = form;

    if (!description || description.trim() === "") {
        form.errors.description = getValidationMessage("REQUIRED", "説明");
        return;
    }

    if (description.length > 1000) {
        form.errors.description = getValidationMessage("MAX_LENGTH", "説明", 1000);
        return;
    }
};

/**
 * 詳細説明のバリデーション
 */
export const validateDetails = (form) => {
    const { details } = form;

    if (details && details.length > 5000) {
        form.errors.details = getValidationMessage("MAX_LENGTH", "詳細説明", 5000);
        return;
    }
};

/**
 * アイコンのバリデーション
 */
export const validateIcon = (form) => {
    const { icon } = form;

    if (icon && icon.length > 50) {
        form.errors.icon = getValidationMessage("MAX_LENGTH", "アイコン", 50);
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
            form.errors.sort_order = getValidationMessage("INVALID_NUMBER", "表示順");
            return;
        }
    }
};

/**
 * ステータスのバリデーション
 */
export const validateStatus = (form) => {
    const { status } = form;

    if (!status || status === "") {
        form.errors.status = getValidationMessage("REQUIRED", "ステータス");
        return;
    }

    const validStatuses = ["active", "inactive", "suspended"];
    if (!validStatuses.includes(status)) {
        form.errors.status = "無効なステータスです";
        return;
    }
};

/**
 * 注目サービスのバリデーション
 */
export const validateIsFeatured = (form) => {
    // Boolean値なので特にバリデーション不要
    // 必要に応じて追加
};
