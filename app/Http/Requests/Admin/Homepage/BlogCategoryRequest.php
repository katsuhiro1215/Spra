<?php

namespace App\Http\Requests\Admin\Homepage;

use Illuminate\Foundation\Http\FormRequest;

class BlogCategoryRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:255|unique:blog_categories',
            'slug' => 'nullable|string|max:255|unique:blog_categories',
            'description' => 'nullable|string|max:1000',
            'color' => 'required|string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ];
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
            'name.unique' => 'このカテゴリ名は既に使用されています。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'color.required' => 'カラーは必須です。',
            'color.regex' => 'カラーは有効な16進数カラーコードである必要があります。',
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
            'sort_order' => '並び順',
            'is_active' => 'ステータス',
        ];
    }
}
