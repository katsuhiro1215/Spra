<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('admins')->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'media_id' => ['nullable', 'string', 'exists:media,id'],
            'url' => ['nullable', 'url', 'max:255'],
            'completed_at' => ['nullable', 'date'],
            'is_displayed' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'service_ids' => ['nullable', 'array'],
            'service_ids.*' => ['string', 'exists:services,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'タイトル',
            'description' => '説明',
            'media_id' => 'カバー画像',
            'url' => '公開URL',
            'completed_at' => '制作完了日',
            'is_displayed' => 'Web公開',
            'sort_order' => '表示順',
            'service_ids' => '関連サービス',
        ];
    }
}
