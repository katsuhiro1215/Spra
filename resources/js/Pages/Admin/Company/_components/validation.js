import { getValidationMessage } from "@/Constants/Validation";

// 会社名のバリデーション
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

// 会社種別のバリデーション
export const validateCompanyType = (form) => {
    if (!form.company_type) {
        form.errors.company_type = getValidationMessage("required", {
            fieldKey: "company_type",
        });
    } else if (!["individual", "corporate"].includes(form.company_type)) {
        form.errors.company_type = getValidationMessage("enum", {
            fieldKey: "company_type",
        });
    } else {
        delete form.errors.company_type;
    }
};

// 正式名称のバリデーション
export const validateLegalName = (form) => {
    if (form.legal_name && form.legal_name.length > 255) {
        form.errors.legal_name = getValidationMessage("maxLength", {
            fieldKey: "legal_name",
            max: 255,
        });
    } else {
        delete form.errors.legal_name;
    }
};

// 登録番号のバリデーション
export const validateRegistrationNumber = (form) => {
    if (form.registration_number && form.registration_number.length > 50) {
        form.errors.registration_number = getValidationMessage("maxLength", {
            fieldKey: "registration_number",
            max: 50,
        });
    } else {
        delete form.errors.registration_number;
    }
};

// 税番号のバリデーション
export const validateTaxNumber = (form) => {
    if (form.tax_number && form.tax_number.length > 50) {
        form.errors.tax_number = getValidationMessage("maxLength", {
            fieldKey: "tax_number",
            max: 50,
        });
    } else {
        delete form.errors.tax_number;
    }
};

// 電話番号のバリデーション
export const validatePhone = (form) => {
    if (form.phone) {
        if (form.phone.length > 20) {
            form.errors.phone = getValidationMessage("maxLength", {
                fieldKey: "phone",
                max: 20,
            });
        } else if (!/^[\d\-+() ]*$/.test(form.phone)) {
            form.errors.phone = getValidationMessage("pattern", {
                fieldKey: "phone",
            });
        } else {
            delete form.errors.phone;
        }
    } else {
        delete form.errors.phone;
    }
};

// FAX番号のバリデーション
export const validateFax = (form) => {
    if (form.fax) {
        if (form.fax.length > 20) {
            form.errors.fax = getValidationMessage("maxLength", {
                fieldKey: "fax",
                max: 20,
            });
        } else if (!/^[\d\-+() ]*$/.test(form.fax)) {
            form.errors.fax = getValidationMessage("pattern", {
                fieldKey: "fax",
            });
        } else {
            delete form.errors.fax;
        }
    } else {
        delete form.errors.fax;
    }
};

// メールアドレスのバリデーション
export const validateEmail = (form) => {
    if (form.email) {
        if (form.email.length > 255) {
            form.errors.email = getValidationMessage("maxLength", {
                fieldKey: "email",
                max: 255,
            });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            form.errors.email = getValidationMessage("email", {
                fieldKey: "email",
            });
        } else {
            delete form.errors.email;
        }
    } else {
        delete form.errors.email;
    }
};

// ウェブサイトのバリデーション
export const validateWebsite = (form) => {
    if (form.website && form.website.length > 255) {
        form.errors.website = getValidationMessage("maxLength", {
            fieldKey: "website",
            max: 255,
        });
    } else {
        delete form.errors.website;
    }
};

// 代表者名のバリデーション
export const validateRepresentativeName = (form) => {
    if (form.representative_name && form.representative_name.length > 100) {
        form.errors.representative_name = getValidationMessage("maxLength", {
            fieldKey: "representative_name",
            max: 100,
        });
    } else {
        delete form.errors.representative_name;
    }
};

// 代表者役職のバリデーション
export const validateRepresentativeTitle = (form) => {
    if (form.representative_title && form.representative_title.length > 100) {
        form.errors.representative_title = getValidationMessage("maxLength", {
            fieldKey: "representative_title",
            max: 100,
        });
    } else {
        delete form.errors.representative_title;
    }
};

// 代表者メールアドレスのバリデーション
export const validateRepresentativeEmail = (form) => {
    if (form.representative_email) {
        if (form.representative_email.length > 255) {
            form.errors.representative_email = getValidationMessage(
                "maxLength",
                {
                    fieldKey: "representative_email",
                    max: 255,
                },
            );
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.representative_email)
        ) {
            form.errors.representative_email = getValidationMessage("email", {
                fieldKey: "representative_email",
            });
        } else {
            delete form.errors.representative_email;
        }
    } else {
        delete form.errors.representative_email;
    }
};

// 代表者電話番号のバリデーション
export const validateRepresentativePhone = (form) => {
    if (form.representative_phone) {
        if (form.representative_phone.length > 20) {
            form.errors.representative_phone = getValidationMessage(
                "maxLength",
                {
                    fieldKey: "representative_phone",
                    max: 20,
                },
            );
        } else if (!/^[\d\-+() ]*$/.test(form.representative_phone)) {
            form.errors.representative_phone = getValidationMessage("pattern", {
                fieldKey: "representative_phone",
            });
        } else {
            delete form.errors.representative_phone;
        }
    } else {
        delete form.errors.representative_phone;
    }
};

// 事業内容のバリデーション
export const validateBusinessDescription = (form) => {
    if (form.business_description && form.business_description.length > 1000) {
        form.errors.business_description = getValidationMessage("maxLength", {
            fieldKey: "business_description",
            max: 1000,
        });
    } else {
        delete form.errors.business_description;
    }
};

// 業界のバリデーション
export const validateIndustry = (form) => {
    if (form.industry && form.industry.length > 100) {
        form.errors.industry = getValidationMessage("maxLength", {
            fieldKey: "industry",
            max: 100,
        });
    } else {
        delete form.errors.industry;
    }
};

// 従業員数のバリデーション
export const validateEmployeeCount = (form) => {
    if (form.employee_count) {
        const count = parseInt(form.employee_count, 10);
        if (isNaN(count)) {
            form.errors.employee_count = getValidationMessage("numeric", {
                fieldKey: "employee_count",
            });
        } else if (count < 0) {
            form.errors.employee_count = "従業員数は0以上で入力してください。";
        } else {
            delete form.errors.employee_count;
        }
    } else {
        delete form.errors.employee_count;
    }
};

// 資本金のバリデーション
export const validateCapital = (form) => {
    if (form.capital) {
        const capital = parseFloat(form.capital);
        if (isNaN(capital)) {
            form.errors.capital = getValidationMessage("numeric", {
                fieldKey: "capital",
            });
        } else if (capital < 0) {
            form.errors.capital = "資本金は0以上で入力してください。";
        } else {
            delete form.errors.capital;
        }
    } else {
        delete form.errors.capital;
    }
};

// 設立日のバリデーション
export const validateEstablishedDate = (form) => {
    if (form.established_date) {
        const date = new Date(form.established_date);
        if (isNaN(date.getTime())) {
            form.errors.established_date = getValidationMessage("date", {
                fieldKey: "established_date",
            });
        } else {
            delete form.errors.established_date;
        }
    } else {
        delete form.errors.established_date;
    }
};

// ステータスのバリデーション
export const validateStatus = (form) => {
    if (!form.status) {
        form.errors.status = getValidationMessage("required", {
            fieldKey: "status",
        });
    } else if (!["active", "inactive", "pending"].includes(form.status)) {
        form.errors.status = getValidationMessage("enum", {
            fieldKey: "status",
        });
    } else {
        delete form.errors.status;
    }
};

// 備考のバリデーション
export const validateNotes = (form) => {
    if (form.notes && form.notes.length > 1000) {
        form.errors.notes = getValidationMessage("maxLength", {
            fieldKey: "notes",
            max: 1000,
        });
    } else {
        delete form.errors.notes;
    }
};

// フォーム全体のバリデーション
export const validateAllFields = (form) => {
    validateName(form);
    validateCompanyType(form);
    validateLegalName(form);
    validateRegistrationNumber(form);
    validateTaxNumber(form);
    validatePhone(form);
    validateFax(form);
    validateEmail(form);
    validateWebsite(form);
    validateRepresentativeName(form);
    validateRepresentativeTitle(form);
    validateRepresentativeEmail(form);
    validateRepresentativePhone(form);
    validateBusinessDescription(form);
    validateIndustry(form);
    validateEmployeeCount(form);
    validateCapital(form);
    validateEstablishedDate(form);
    validateStatus(form);
    validateNotes(form);

    return Object.keys(form.errors).length === 0;
};
