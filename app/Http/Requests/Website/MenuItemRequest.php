<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'exists:menu_items,id'],
            'label' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:500'],
            'page_id' => ['nullable', 'exists:pages,id'],
            'target' => ['nullable', 'string', 'in:_self,_blank'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'parent_id' => '親メニューアイテム',
            'label' => 'ラベル',
            'url' => 'URL',
            'page_id' => 'ページ',
            'target' => 'ターゲット',
            'is_active' => 'ステータス',
            'sort_order' => '表示順',
        ];
    }
}
