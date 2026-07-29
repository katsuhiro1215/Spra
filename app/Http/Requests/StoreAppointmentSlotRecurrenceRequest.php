<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreAppointmentSlotRecurrenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::guard('admins')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'day_of_week' => ['required', 'integer', 'between:0,6'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'slot_type' => ['required', 'in:meeting,progress_review,consultation,other'],
            'max_capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'assigned_admin_id' => ['nullable', 'exists:admins,id'],
            'starts_on' => ['required', 'date'],
            'ends_on' => ['nullable', 'date', 'after_or_equal:starts_on'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'day_of_week' => '曜日',
            'start_time' => '開始時刻',
            'end_time' => '終了時刻',
            'slot_type' => '予約枠タイプ',
            'max_capacity' => '最大予約数',
            'assigned_admin_id' => '担当管理者',
            'starts_on' => '繰り返し開始日',
            'ends_on' => '繰り返し終了日',
            'notes' => 'メモ',
        ];
    }
}
