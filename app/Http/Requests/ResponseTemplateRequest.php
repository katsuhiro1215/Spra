<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * 返答テンプレート用リクエスト
 */
class ResponseTemplateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth('admins')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
            'placeholders' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
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
            'name' => 'テンプレート名',
            'category' => 'カテゴリ',
            'subject' => '件名',
            'body' => '本文',
            'placeholders' => 'プレースホルダー',
            'status' => 'ステータス',
            'sort_order' => '並び順',
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
            'name.required' => 'テンプレート名は必須です。',
            'subject.required' => '件名は必須です。',
            'body.required' => '本文は必須です。',
            'status.required' => 'ステータスは必須です。',
            'status.in' => 'ステータスの値が無効です。',
        ];
    }
}
