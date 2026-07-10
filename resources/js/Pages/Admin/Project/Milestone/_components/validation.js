/**
 * マイルストーン名のバリデーション
 */
export const validateMilestoneName = (form) => {
    const { milestone_name } = form;

    if (!milestone_name || milestone_name.trim() === "") {
        form.errors.milestone_name = "マイルストーン名は必須です。";
        return;
    }

    if (milestone_name.length > 255) {
        form.errors.milestone_name =
            "マイルストーン名は255文字以下である必要があります。";
        return;
    }
};

/**
 * 説明のバリデーション（オプション）
 */
export const validateDescription = (form) => {
    const { description } = form;

    if (description && description.length > 1000) {
        form.errors.description = "説明は1000文字以下である必要があります。";
        return;
    }
};

/**
 * 順序のバリデーション
 */
export const validateOrder = (form) => {
    const { order } = form;

    if (order === null || order === undefined || order === "") {
        form.errors.order = "順序は必須です。";
        return;
    }

    const num = Number(order);
    if (isNaN(num) || num < 0) {
        form.errors.order = "順序は0以上の数値である必要があります。";
        return;
    }
};
