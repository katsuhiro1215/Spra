import { getValidationMessage } from "@/Constants/Validation";

// 姓のバリデーション
export const validateLastName = (form) => {
    if (!form.last_name) {
        form.errors.last_name = getValidationMessage("required", {
            fieldKey: "last_name",
        });
    } else if (form.last_name.length > 50) {
        form.errors.last_name = getValidationMessage("maxLength", {
            fieldKey: "last_name",
            max: 50,
        });
    } else {
        delete form.errors.last_name;
    }
};

// 名のバリデーション
export const validateFirstName = (form) => {
    if (!form.first_name) {
        form.errors.first_name = getValidationMessage("required", {
            fieldKey: "first_name",
        });
    } else if (form.first_name.length > 50) {
        form.errors.first_name = getValidationMessage("maxLength", {
            fieldKey: "first_name",
            max: 50,
        });
    } else {
        delete form.errors.first_name;
    }
};

// 姓（カナ）のバリデーション
export const validateLastNameKana = (form) => {
    if (form.last_name_kana) {
        if (form.last_name_kana.length > 50) {
            form.errors.last_name_kana = getValidationMessage("maxLength", {
                fieldKey: "last_name_kana",
                max: 50,
            });
        } else if (!/^[ァ-ヶー\s]*$/.test(form.last_name_kana)) {
            form.errors.last_name_kana = getValidationMessage("pattern", {
                fieldKey: "last_name_kana",
            });
        } else {
            delete form.errors.last_name_kana;
        }
    } else {
        delete form.errors.last_name_kana;
    }
};

// 名（カナ）のバリデーション
export const validateFirstNameKana = (form) => {
    if (form.first_name_kana) {
        if (form.first_name_kana.length > 50) {
            form.errors.first_name_kana = getValidationMessage("maxLength", {
                fieldKey: "first_name_kana",
                max: 50,
            });
        } else if (!/^[ァ-ヶー\s]*$/.test(form.first_name_kana)) {
            form.errors.first_name_kana = getValidationMessage("pattern", {
                fieldKey: "first_name_kana",
            });
        } else {
            delete form.errors.first_name_kana;
        }
    } else {
        delete form.errors.first_name_kana;
    }
};

// 表示名のバリデーション
export const validateDisplayName = (form) => {
    if (form.display_name && form.display_name.length > 50) {
        form.errors.display_name = getValidationMessage("maxLength", {
            fieldKey: "display_name",
            max: 50,
        });
    } else {
        delete form.errors.display_name;
    }
};

// 生年月日のバリデーション
export const validateBirthDate = (form) => {
    if (form.birth_date) {
        const birthDate = new Date(form.birth_date);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
            form.errors.birth_date = getValidationMessage("invalid", {
                fieldKey: "birth_date",
            });
        } else if (birthDate > today) {
            form.errors.birth_date = "未来の日付は入力できません";
        } else {
            delete form.errors.birth_date;
        }
    } else {
        delete form.errors.birth_date;
    }
};

// 性別のバリデーション
export const validateGender = (form) => {
    const validGenders = ["male", "female", "other", "prefer_not_to_say", ""];
    if (form.gender && !validGenders.includes(form.gender)) {
        form.errors.gender = getValidationMessage("invalid", {
            fieldKey: "gender",
        });
    } else {
        delete form.errors.gender;
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

// 携帯電話のバリデーション
export const validateMobile = (form) => {
    if (form.mobile) {
        if (form.mobile.length > 20) {
            form.errors.mobile = getValidationMessage("maxLength", {
                fieldKey: "mobile",
                max: 20,
            });
        } else if (!/^[\d\-+() ]*$/.test(form.mobile)) {
            form.errors.mobile = getValidationMessage("pattern", {
                fieldKey: "mobile",
            });
        } else {
            delete form.errors.mobile;
        }
    } else {
        delete form.errors.mobile;
    }
};

// 緊急連絡先氏名のバリデーション
export const validateEmergencyContactName = (form) => {
    if (
        form.emergency_contact_name &&
        form.emergency_contact_name.length > 100
    ) {
        form.errors.emergency_contact_name = getValidationMessage("maxLength", {
            fieldKey: "emergency_contact_name",
            max: 100,
        });
    } else {
        delete form.errors.emergency_contact_name;
    }
};

// 緊急連絡先電話番号のバリデーション
export const validateEmergencyContactPhone = (form) => {
    if (form.emergency_contact_phone) {
        if (form.emergency_contact_phone.length > 20) {
            form.errors.emergency_contact_phone = getValidationMessage(
                "maxLength",
                {
                    fieldKey: "emergency_contact_phone",
                    max: 20,
                },
            );
        } else if (!/^[\d\-+() ]*$/.test(form.emergency_contact_phone)) {
            form.errors.emergency_contact_phone = getValidationMessage(
                "pattern",
                {
                    fieldKey: "emergency_contact_phone",
                },
            );
        } else {
            delete form.errors.emergency_contact_phone;
        }
    } else {
        delete form.errors.emergency_contact_phone;
    }
};

// 自己紹介のバリデーション
export const validateBio = (form) => {
    if (form.bio && form.bio.length > 1000) {
        form.errors.bio = getValidationMessage("maxLength", {
            fieldKey: "bio",
            max: 1000,
        });
    } else {
        delete form.errors.bio;
    }
};

// フォーム全体のバリデーション
export const validateAllFields = (form) => {
    validateLastName(form);
    validateFirstName(form);
    validateLastNameKana(form);
    validateFirstNameKana(form);
    validateDisplayName(form);
    validateBirthDate(form);
    validateGender(form);
    validatePhone(form);
    validateMobile(form);
    validateEmergencyContactName(form);
    validateEmergencyContactPhone(form);
    validateBio(form);
};
