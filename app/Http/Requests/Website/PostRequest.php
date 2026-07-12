<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends FormRequest
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
            'post_category_id' => ['required', 'exists:post_categories,id'],
            'title' => ['required', 'string', 'max:200'],
            'slug' => [
                'required',
                'string',
                'max:200',
                'regex:/^[a-z0-9\-]+$/',
                'unique:posts,slug,' . $this->route('post')?->id,
            ],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'array'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:300'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
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
            'post_category_id.required' => 'カテゴリを選択してください。',
            'post_category_id.exists' => '選択されたカテゴリが存在しません。',
            'title.required' => 'タイトルは必須です。',
            'title.max' => 'タイトルは200文字以内で入力してください。',
            'slug.required' => 'スラッグは必須です。',
            'slug.regex' => 'スラッグは英小文字、数字、ハイフンのみ使用可能です。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'meta_title.max' => 'メタタイトルは255文字以内で入力してください。',
            'meta_description.max' => 'メタディスクリプションは300文字以内で入力してください。',
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
            'post_category_id' => 'カテゴリ',
            'title' => 'タイトル',
            'slug' => 'スラッグ',
            'thumbnail' => 'サムネイル',
            'excerpt' => '抜粋',
            'content' => 'コンテンツ',
            'meta_title' => 'メタタイトル',
            'meta_description' => 'メタディスクリプション',
            'is_published' => '公開状態',
            'published_at' => '公開日時',
        ];
    }
}
