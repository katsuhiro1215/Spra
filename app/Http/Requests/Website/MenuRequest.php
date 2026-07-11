<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $menuId = $this->route('menu');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-]+$/',
                Rule::unique('menus')->ignore($menuId),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'location' => ['required', 'string', 'in:header,footer,sidebar'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'メニュー名',
            'slug' => 'スラッグ',
            'description' => '説明',
            'location' => '配置場所',
        ];
    }
}
