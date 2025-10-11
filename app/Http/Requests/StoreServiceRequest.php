<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'description' => ['required', 'string', 'max:1000'],
            'details' => ['required', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'pricing' => ['nullable', 'array'],
            'pricing.*.name' => ['required_with:pricing', 'string', 'max:255'],
            'pricing.*.price' => ['required_with:pricing', 'numeric', 'min:0'],
            'pricing.*.description' => ['nullable', 'string', 'max:500'],
            'demo_links' => ['nullable', 'array'],
            'demo_links.*.name' => ['required_with:demo_links', 'string', 'max:255'],
            'demo_links.*.url' => ['required_with:demo_links', 'url', 'max:500'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string', 'max:500'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:255'],
            'status' => ['required', 'string', 'in:active,inactive,draft'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
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
            'features' => '特徴・機能',
            'pricing' => '価格設定',
            'demo_links' => 'デモリンク',
            'gallery' => 'ギャラリー',
            'technologies' => '使用技術',
            'status' => 'ステータス',
            'sort_order' => '表示順',
            'is_featured' => 'おすすめ',
            'is_active' => 'アクティブ',
        ];
    }
}
