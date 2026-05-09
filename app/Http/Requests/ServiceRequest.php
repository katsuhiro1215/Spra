<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
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
            'slug' => ['nullable', 'string', 'max:255', 'unique:services,slug'],
            'service_category_id' => ['required', 'string', 'exists:service_categories,id'],
            'description' => ['required', 'string', 'max:1000'],
            'details' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:active,inactive,suspended'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'サービス名',
            'slug' => 'スラッグ',
            'service_category_id' => 'サービスカテゴリ',
            'description' => '説明',
            'details' => '詳細説明',
            'icon' => 'アイコン',
            'status' => 'ステータス',
            'sort_order' => '表示順',
            'is_featured' => '注目サービス',
        ];
    }
}
