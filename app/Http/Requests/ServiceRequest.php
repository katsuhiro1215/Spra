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
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'service_category_id' => ['required', 'string', 'exists:service_categories,id'],
            'description' => ['required', 'string', 'max:1000'],
            'details' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:active,inactive,suspended'],
            'is_displayed' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
            'media_ids' => ['nullable', 'array'],
            'media_ids.*' => ['string', 'exists:media,id'],
            'technology_ids' => ['nullable', 'array'],
            'technology_ids.*' => ['string', 'exists:technologies,id'],
        ];

        if (!($this->isMethod('PUT') || $this->isMethod('PATCH'))) {
            $rules['slug'] = ['required', 'string', 'max:255', 'unique:services,slug'];
        }

        return $rules;
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
            'is_displayed' => 'Web公開',
            'sort_order' => '表示順',
            'is_featured' => '注目サービス',
        ];
    }
}
