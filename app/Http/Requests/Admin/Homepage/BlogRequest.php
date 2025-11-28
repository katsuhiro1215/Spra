<?php

namespace App\Http\Requests\Admin\Homepage;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:blogs,slug,' . $this->route('blog')],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'status' => ['required', 'in:draft,published,scheduled'],
            'published_at' => ['nullable', 'date', 'required_if:status,scheduled'],
            'featured_image' => ['nullable', 'image', 'max:2048'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['integer', 'exists:blog_categories,id'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'gallery_media_ids' => ['nullable', 'array'],
            'gallery_media_ids.*' => ['integer', 'exists:media,id'],
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
            'title.required' => 'タイトルは必須です。',
            'slug.required' => 'スラッグは必須です。',
            'slug.max' => 'スラッグは255文字以内で入力してください。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'excerpt.max' => '抜粋は500文字以内で入力してください。',
            'content.required' => 'コンテンツは必須です。',
            'status.required' => 'ステータスは必須です。',
            'status.in' => 'ステータスの値が不正です。',
            'published_at.required_if' => '公開日時は、ステータスが「スケジュール」の場合は必須です。',
            'featured_image.image' => 'アイキャッチ画像は画像ファイルである必要があります。',
            'featured_image.max' => 'アイキャッチ画像は2MB以内である必要があります。',
            'categories.array' => 'カテゴリは配列である必要があります。',
            'categories.*.integer' => 'カテゴリは整数である必要があります。',
            'categories.*.exists' => '選択されたカテゴリは存在しません。',
            'meta_title.max' => 'メタタイトルは255文字以内で入力してください。',
            'meta_description.max' => 'メタディスクリプションは500文字以内で入力してください。',
            'gallery_media_ids.array' => 'ギャラリーメディアIDは配列である必要があります。',
            'gallery_media_ids.*.integer' => 'ギャラリーメディアIDは整数である必要があります。',
            'gallery_media_ids.*.exists' => '選択されたメディアは存在しません。',
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

        ];
    }
}
