import { useState, useCallback } from "react";
import { ValidationMessages } from "@/Constants/ValidationMessages";

export const useFieldValidation = () => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // フィールドバリデーション関数
    const validateField = useCallback((name, value, rules = {}) => {
        const fieldErrors = [];

        // 必須チェック
        if (rules.required && (!value || value.toString().trim() === "")) {
            fieldErrors.push(ValidationMessages.required(rules.label || name));
        }

        // 最小文字数チェック
        if (rules.min && value && value.toString().length < rules.min) {
            fieldErrors.push(
                ValidationMessages.min(rules.label || name, rules.min)
            );
        }

        // 最大文字数チェック
        if (rules.max && value && value.toString().length > rules.max) {
            fieldErrors.push(
                ValidationMessages.max(rules.label || name, rules.max)
            );
        }

        // メールアドレスチェック
        if (rules.email && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                fieldErrors.push(ValidationMessages.email);
            }
        }

        // 数値チェック
        if (rules.numeric && value) {
            if (isNaN(value) || isNaN(parseFloat(value))) {
                fieldErrors.push(
                    ValidationMessages.numeric(rules.label || name)
                );
            }
        }

        // URLチェック
        if (rules.url && value) {
            try {
                new URL(value);
            } catch {
                fieldErrors.push(ValidationMessages.url);
            }
        }

        // カスタムバリデーション
        if (rules.custom && typeof rules.custom === "function") {
            const customError = rules.custom(value);
            if (customError) {
                fieldErrors.push(customError);
            }
        }

        return fieldErrors;
    }, []);

    // フィールドのblurハンドラー
    const handleFieldBlur = useCallback(
        (name, value, rules = {}) => {
            setTouched((prev) => ({ ...prev, [name]: true }));

            const fieldErrors = validateField(name, value, rules);

            setErrors((prev) => ({
                ...prev,
                [name]: fieldErrors.length > 0 ? fieldErrors[0] : null,
            }));
        },
        [validateField]
    );

    // エラーをクリア
    const clearError = useCallback((name) => {
        setErrors((prev) => ({ ...prev, [name]: null }));
    }, []);

    // 全フィールドをバリデーション
    const validateAll = useCallback(
        (data, validationRules) => {
            const allErrors = {};
            let hasErrors = false;

            Object.keys(validationRules).forEach((fieldName) => {
                const fieldErrors = validateField(
                    fieldName,
                    data[fieldName],
                    validationRules[fieldName]
                );

                if (fieldErrors.length > 0) {
                    allErrors[fieldName] = fieldErrors[0];
                    hasErrors = true;
                }
            });

            setErrors(allErrors);
            setTouched(
                Object.keys(validationRules).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {})
            );

            return !hasErrors;
        },
        [validateField]
    );

    return {
        errors,
        touched,
        handleFieldBlur,
        clearError,
        validateAll,
        setErrors,
    };
};
