<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationHistoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_date' => ['required', 'date'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'event_date' => '年月',
            'title' => 'タイトル',
            'description' => '説明',
            'sort_order' => '表示順',
            'is_published' => '公開状態',
        ];
    }
}
