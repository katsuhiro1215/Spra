import { getValidationMessage } from "@/Constants/Validation";

// カテゴリのバリデーション
export const validateFaqCategoryId = (form) => {
    if (!form.faq_category_id) {
        form.errors.faq_category_id = "カテゴリを選択してください。";
    } else {
        delete form.errors.faq_category_id;
    }
};

// 質問のバリデーション
export const validateQuestion = (form) => {
    if (!form.question) {
        form.errors.question = getValidationMessage("required", {
            fieldKey: "question",
        });
    } else if (form.question.length > 500) {
        form.errors.question = getValidationMessage("maxLength", {
            fieldKey: "question",
            max: 500,
        });
    } else {
        delete form.errors.question;
    }
};

// 回答のバリデーション
export const validateAnswer = (form) => {
    if (!form.answer) {
        form.errors.answer = getValidationMessage("required", {
            fieldKey: "answer",
        });
    } else if (form.answer.length > 2000) {
        form.errors.answer = getValidationMessage("maxLength", {
            fieldKey: "answer",
            max: 2000,
        });
    } else {
        delete form.errors.answer;
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
export const validateFaqForm = (form) => {
    validateFaqCategoryId(form);
    validateQuestion(form);
    validateAnswer(form);
    validateSortOrder(form);
};

// バリデーションエラーがあるかチェック
export const hasFaqFormErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
