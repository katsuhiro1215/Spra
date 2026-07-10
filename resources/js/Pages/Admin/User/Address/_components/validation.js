import { getValidationMessage } from "@/Constants/Validation";

// 住所タイプのバリデーション
export const validateType = (form) => {
    if (!form.type) {
        form.errors.type = getValidationMessage("required", {
            fieldKey: "type",
        });
    } else if (
        !["home", "office", "branch", "billing", "shipping", "other"].includes(
            form.type,
        )
    ) {
        form.errors.type = getValidationMessage("enum", {
            fieldKey: "type",
        });
    } else {
        delete form.errors.type;
    }
};

// ラベルのバリデーション
export const validateLabel = (form) => {
    if (form.label && form.label.length > 50) {
        form.errors.label = getValidationMessage("maxLength", {
            fieldKey: "label",
            max: 50,
        });
    } else {
        delete form.errors.label;
    }
};

// 郵便番号のバリデーション
export const validatePostalCode = (form) => {
    if (!form.postal_code) {
        form.errors.postal_code = getValidationMessage("required", {
            fieldKey: "postal_code",
        });
    } else if (form.postal_code.length > 20) {
        form.errors.postal_code = getValidationMessage("maxLength", {
            fieldKey: "postal_code",
            max: 20,
        });
    } else if (!/^\d{7}$/.test(form.postal_code.replace(/-/g, ""))) {
        form.errors.postal_code = getValidationMessage("pattern", {
            fieldKey: "postal_code",
        });
    } else {
        delete form.errors.postal_code;
    }
};

// 都道府県名のバリデーション
export const validatePrefecture = (form) => {
    if (!form.prefecture) {
        form.errors.prefecture = getValidationMessage("required", {
            fieldKey: "prefecture",
        });
    } else if (form.prefecture.length > 20) {
        form.errors.prefecture = getValidationMessage("maxLength", {
            fieldKey: "prefecture",
            max: 20,
        });
    } else {
        delete form.errors.prefecture;
    }
};

// 市区町村名のバリデーション
export const validateCity = (form) => {
    if (!form.city) {
        form.errors.city = getValidationMessage("required", {
            fieldKey: "city",
        });
    } else if (form.city.length > 50) {
        form.errors.city = getValidationMessage("maxLength", {
            fieldKey: "city",
            max: 50,
        });
    } else {
        delete form.errors.city;
    }
};

// 町域のバリデーション
export const validateDistrict = (form) => {
    if (form.district && form.district.length > 100) {
        form.errors.district = getValidationMessage("maxLength", {
            fieldKey: "district",
            max: 100,
        });
    } else {
        delete form.errors.district;
    }
};

// 番地・建物名のバリデーション
export const validateAddressOther = (form) => {
    if (form.address_other && form.address_other.length > 255) {
        form.errors.address_other = getValidationMessage("maxLength", {
            fieldKey: "address_other",
            max: 255,
        });
    } else {
        delete form.errors.address_other;
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

// 担当者名のバリデーション
export const validateContactPerson = (form) => {
    if (form.contact_person && form.contact_person.length > 100) {
        form.errors.contact_person = getValidationMessage("maxLength", {
            fieldKey: "contact_person",
            max: 100,
        });
    } else {
        delete form.errors.contact_person;
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

// 緯度のバリデーション
export const validateLatitude = (form) => {
    if (form.latitude) {
        const lat = parseFloat(form.latitude);
        if (isNaN(lat)) {
            form.errors.latitude = getValidationMessage("numeric", {
                fieldKey: "latitude",
            });
        } else if (lat < -90 || lat > 90) {
            form.errors.latitude = "緯度は-90から90の範囲で入力してください。";
        } else {
            delete form.errors.latitude;
        }
    } else {
        delete form.errors.latitude;
    }
};

// 経度のバリデーション
export const validateLongitude = (form) => {
    if (form.longitude) {
        const lng = parseFloat(form.longitude);
        if (isNaN(lng)) {
            form.errors.longitude = getValidationMessage("numeric", {
                fieldKey: "longitude",
            });
        } else if (lng < -180 || lng > 180) {
            form.errors.longitude =
                "経度は-180から180の範囲で入力してください。";
        } else {
            delete form.errors.longitude;
        }
    } else {
        delete form.errors.longitude;
    }
};

// フォーム全体のバリデーション
export const validateAllFields = (form) => {
    validateType(form);
    validateLabel(form);
    validatePostalCode(form);
    validatePrefecture(form);
    validateCity(form);
    validateDistrict(form);
    validateAddressOther(form);
    validatePhone(form);
    validateContactPerson(form);
    validateNotes(form);
    validateLatitude(form);
    validateLongitude(form);
};
