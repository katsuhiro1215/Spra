<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceCategoryRequest extends FormRequest
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
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'icon' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:active,inactive,suspended'],
            'is_displayed' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];

        if (!($this->isMethod('PUT') || $this->isMethod('PATCH'))) {
            $rules['slug'] = ['required', 'string', 'max:255', 'unique:service_categories,slug'];
        }

        return $rules;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'created_by' => auth('admins')->id(),
        ]);
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'カテゴリ名',
            'slug' => 'スラッグ',
            'description' => '説明',
            'color' => 'カラー',
            'icon' => 'アイコン',
            'status' => 'ステータス',
            'is_displayed' => 'Web公開',
            'sort_order' => '表示順',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'color.regex' => 'カラーは有効なHEXカラーコード（例：#3B82F6）で入力してください。',
        ];
    }
}
