import { getValidationMessage } from "@/Constants/Validation";

/**
 * 予約枠IDのバリデーション
 */
export const validateAppointmentSlotId = (form) => {
    const { appointment_slot_id } = form;

    if (!appointment_slot_id || appointment_slot_id === "") {
        form.errors.appointment_slot_id =
            getValidationMessage("REQUIRED", "予約枠");
        return;
    }
};

/**
 * 企業IDのバリデーション
 */
export const validateCompanyId = (form) => {
    const { company_id } = form;

    if (!company_id || company_id === "") {
        form.errors.company_id =
            getValidationMessage("REQUIRED", "企業");
        return;
    }
};

/**
 * プロジェクトIDのバリデーション
 */
export const validateProjectId = (form) => {
    const { project_id } = form;

    if (!project_id || project_id === "") {
        form.errors.project_id =
            getValidationMessage("REQUIRED", "プロジェクト");
        return;
    }
};

/**
 * 件名のバリデーション
 */
export const validateTitle = (form) => {
    const { title } = form;

    if (!title || title.trim() === "") {
        form.errors.title = getValidationMessage("REQUIRED", "件名");
        return;
    }

    if (title.length > 255) {
        form.errors.title = getValidationMessage("MAX_LENGTH", "件名", 255);
        return;
    }
};

/**
 * 詳細説明のバリデーション
 */
export const validateDescription = (form) => {
    const { description } = form;

    if (!description || description.trim() === "") {
        form.errors.description = getValidationMessage("REQUIRED", "詳細説明");
        return;
    }

    if (description.length > 1000) {
        form.errors.description = getValidationMessage("MAX_LENGTH", "詳細説明", 1000);
        return;
    }
};

/**
 * クライアント向けメモのバリデーション
 */
export const validateClientNotes = (form) => {
    const { client_notes } = form;

    if (client_notes && client_notes.length > 5000) {
        form.errors.client_notes = getValidationMessage("MAX_LENGTH", "クライアント向けメモ", 5000);
        return;
    }
};
