<?php

namespace App\Http\Requests\Admin\Homepage;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageRequest extends FormRequest
{
    /**
     * ユーザーリクエスト権限
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
            'title' => ['required|string|max:255'],
            'slug' => ['required|string|max:255', Rule::unique('pages', 'slug')->ignore($this->route('page'))],
            'template' => ['required|string|max:50'],
            'content' => ['nullable|array'],
            'meta' => ['nullable|array'],
            'settings' => ['nullable|array'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer|min:0'],
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
            'title.max' => 'タイトルは255文字以内で入力してください。',
            'slug.max' => 'スラッグは255文字以内で入力してください。',
            'is_published.boolean' => '公開状態の値が不正です。',
            'sort_order.min' => '表示順序は0以上の値で入力してください。',
        ];
    }

    /**
     * カスタム属性名
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [];
    }
}
