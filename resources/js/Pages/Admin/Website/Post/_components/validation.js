import { getValidationMessage } from "@/Constants/Validation";

// ブログタイトルのバリデーション
export const validateBlogTitle = (form) => {
    if (!form.title) {
        form.errors.title = getValidationMessage("required", {
            fieldKey: "title",
        });
    } else if (form.title.length > 255) {
        form.errors.title = getValidationMessage("maxLength", {
            fieldKey: "title",
            max: 255,
        });
    } else {
        delete form.errors.title;
    }
};

// ブログスラッグのバリデーション
export const validateBlogSlug = (form) => {
    if (form.slug && form.slug.length > 255) {
        form.errors.slug = getValidationMessage("maxLength", {
            fieldKey: "slug",
            max: 255,
        });
    } else if (form.slug && !/^[a-z0-9\-]*$/.test(form.slug)) {
        form.errors.slug =
            "スラッグは英小文字、数字、ハイフンのみ使用可能です。";
    } else {
        delete form.errors.slug;
    }
};

// ブログ抜粋のバリデーション
export const validateBlogExcerpt = (form) => {
    if (form.excerpt && form.excerpt.length > 500) {
        form.errors.excerpt = getValidationMessage("maxLength", {
            fieldKey: "excerpt",
            max: 500,
        });
    } else {
        delete form.errors.excerpt;
    }
};

// ブログコンテンツのバリデーション
export const validateBlogContent = (form) => {
    if (!form.content) {
        form.errors.content = getValidationMessage("required", {
            fieldKey: "content",
        });
    } else {
        delete form.errors.content;
    }
};

// ブログステータスのバリデーション
export const validateBlogStatus = (form) => {
    if (!form.status) {
        form.errors.status = getValidationMessage("required", {
            fieldKey: "status",
        });
    } else if (!["draft", "published", "scheduled"].includes(form.status)) {
        form.errors.status = "無効なステータスです。";
    } else {
        delete form.errors.status;
    }
};

// ブログメタデータのバリデーション
export const validateBlogMeta = (form) => {
    if (form.meta_title && form.meta_title.length > 255) {
        form.errors.meta_title = getValidationMessage("maxLength", {
            fieldKey: "meta_title",
            max: 255,
        });
    } else {
        delete form.errors.meta_title;
    }

    if (form.meta_description && form.meta_description.length > 300) {
        form.errors.meta_description = getValidationMessage("maxLength", {
            fieldKey: "meta_description",
            max: 300,
        });
    } else {
        delete form.errors.meta_description;
    }
};

// ブログフォーム全体のバリデーション
export const validateBlogForm = (form) => {
    validateBlogTitle(form);
    validateBlogSlug(form);
    validateBlogExcerpt(form);
    validateBlogContent(form);
    validateBlogStatus(form);
    validateBlogMeta(form);
};

// ブログがバリデーションエラーを持つかチェック
export const hasBlogFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};

// ブログバリデーションエラー取得
export const getBlogFormErrors = (errors) => {
    return errors;
};
