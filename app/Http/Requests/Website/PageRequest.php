<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageRequest extends FormRequest
{
    /**
     * 固定ルートと衝突するため、Pageのslugとして使用できない予約語。
     * routes/web.php で個別ルート定義されているトップレベルパスと一致すると、
     * /{slug} の汎用ルートより先に静的ルートが優先されて到達不能になるため禁止する。
     */
    private const RESERVED_SLUGS = [
        'about', 'blog', 'careers', 'company', 'contact', 'documents',
        'estimate-simulator', 'faq', 'flow', 'lp', 'lp-creative', 'lp-minimal',
        'login', 'logout', 'news', 'plans', 'privacy-policy', 'quote-simulator',
        'register', 'service', 'services', 'sitemap', 'terms', 'admin', 'api',
        'dashboard', 'profile', 'settings',
    ];

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
            'page_type_id' => ['required', 'string', Rule::exists('page_types', 'id')],
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pages', 'slug')->ignore($this->route('page')),
                Rule::notIn(self::RESERVED_SLUGS),
            ],
            'template' => ['nullable', 'string', 'max:50'],
            'content' => ['nullable', 'array'],
            'content.blocks' => ['nullable', 'array'],
            'meta_title' => ['nullable', 'string', 'max:200'],
            'meta_description' => ['nullable', 'string'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
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
            'page_type_id.required' => 'ページタイプを選択してください。',
            'page_type_id.exists' => '選択されたページタイプが存在しません。',
            'title.required' => 'タイトルは必須です。',
            'title.max' => 'タイトルは255文字以内で入力してください。',
            'slug.required' => 'スラッグは必須です。',
            'slug.max' => 'スラッグは255文字以内で入力してください。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'slug.not_in' => 'このスラッグは既存のページで予約されているため使用できません。',
            'is_published.boolean' => '公開状態の値が不正です。',
            'sort_order.integer' => '表示順序は整数で入力してください。',
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
