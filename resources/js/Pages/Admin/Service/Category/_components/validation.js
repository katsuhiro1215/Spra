import { getValidationMessage } from "@/Constants/Validation";

/**
 * カテゴリ名のバリデーション
 */
export const validateName = (form) => {
    const { name } = form;

    if (!name || name.trim() === "") {
        form.errors.name = getValidationMessage("REQUIRED", "カテゴリ名");
        return;
    }

    if (name.length > 255) {
        form.errors.name = getValidationMessage("MAX_LENGTH", "カテゴリ名", 255);
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

    if (slug && !/^[a-z0-9-]+$/.test(slug)) {
        form.errors.slug = "スラッグは英小文字、数字、ハイフンのみ使用できます";
        return;
    }
};

/**
 * 説明のバリデーション
 */
export const validateDescription = (form) => {
    const { description } = form;

    if (description && description.length > 1000) {
        form.errors.description = getValidationMessage("MAX_LENGTH", "説明", 1000);
        return;
    }
};

/**
 * カラーのバリデーション
 */
export const validateColor = (form) => {
    const { color } = form;

    if (!color || color.trim() === "") {
        form.errors.color = getValidationMessage("REQUIRED", "カラー");
        return;
    }

    // HEXカラーコードのバリデーション
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
        form.errors.color = "カラーは#に続く6桁の16進数で入力してください";
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
            form.errors.sort_order = "表示順は0以上の数値を入力してください";
            return;
        }
    }
};

/**
 * 有効フラグのバリデーション
 */
export const validateIsActive = (form) => {
    // Boolean値なので特にバリデーション不要
};
