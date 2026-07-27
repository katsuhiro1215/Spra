<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * お問い合わせ更新リクエスト（Admin用）
 */
class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'in:new,in_progress,replied,resolved,closed'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
            'assigned_to' => ['nullable', 'exists:admins,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'status' => 'ステータス',
            'admin_notes' => '管理者メモ',
            'assigned_to' => '担当者',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'ステータスは必須です。',
            'status.in' => 'ステータスの値が無効です。',
            'assigned_to.exists' => '選択された担当者は存在しません。',
        ];
    }
}
