<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FaqCategoryRequest extends FormRequest
{
    /**
     * ユーザーリクエスト権限
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category') ?? $this->route('faqCategory');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-]+$/',
                Rule::unique('faq_categories')->ignore($categoryId),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'color' => ['nullable', 'string', 'max:20'],
            'icon' => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * バリデーション前のデータ準備
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'sort_order' => $this->filled('sort_order') ? (int) $this->sort_order : 0,
        ]);
    }

    /**
     * カスタムエラーメッセージ
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'カテゴリ名は必須です。',
            'slug.regex' => 'スラッグは英小文字、数字、ハイフンのみ使用可能です。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'sort_order.integer' => '並び順は整数である必要があります。',
            'sort_order.min' => '並び順は0以上である必要があります。',
        ];
    }

    /**
     * カスタム属性名
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'カテゴリ名',
            'slug' => 'スラッグ',
            'description' => '説明',
            'color' => 'カラー',
            'icon' => 'アイコン',
            'is_active' => 'ステータス',
            'sort_order' => '並び順',
        ];
    }
}
