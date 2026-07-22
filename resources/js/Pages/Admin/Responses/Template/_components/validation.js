// Validation rules for ResponseTemplate fields
export const responseTemplateValidationRules = {
    name: {
        minLength: 2,
        maxLength: 255,
    },
    category: {
        minLength: 1,
        maxLength: 100,
    },
    subject: {
        minLength: 5,
        maxLength: 255,
    },
    body: {
        minLength: 10,
        maxLength: 10000,
    },
    sort_order: {
        min: 0,
        max: 999,
    },
};

// Get field error message
export const getFieldError = (errors, field) => {
    return errors?.[field] || "";
};

// Check if field is valid
export const isFieldValid = (errors, field) => {
    return !getFieldError(errors, field);
};
