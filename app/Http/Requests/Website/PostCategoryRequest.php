<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostCategoryRequest extends FormRequest
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
        $categoryId = $this->route('category') ?? $this->route('postCategory');

        return [
            'parent_id' => ['nullable', 'exists:post_categories,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('post_categories')->ignore($categoryId),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-]+$/',
                Rule::unique('post_categories')->ignore($categoryId),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
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
            'parent_id.exists' => '選択された親カテゴリが存在しません。',
            'name.required' => 'カテゴリ名は必須です。',
            'name.unique' => 'このカテゴリ名は既に使用されています。',
            'slug.required' => 'スラッグは必須です。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'slug.regex' => 'スラッグは英小文字、数字、ハイフンのみ使用可能です。',
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
            'parent_id' => '親カテゴリ',
            'name' => 'カテゴリ名',
            'slug' => 'スラッグ',
            'description' => '説明',
            'is_active' => 'ステータス',
            'sort_order' => '並び順',
        ];
    }
}
