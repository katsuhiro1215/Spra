<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:home,office,billing,shipping,other'],
            'label' => ['nullable', 'string', 'max:50'],
            'postal_code' => ['required', 'string', 'max:8'],
            'prefecture' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:50'],
            'district' => ['nullable', 'string', 'max:50'],
            'address_other' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:15'],
            'contact_person' => ['nullable', 'string', 'max:50'],
            'is_default' => ['boolean'],
            'is_active' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function attributes(): array
    {
        return [
            'type' => '住所タイプ',
            'label' => 'ラベル',
            'postal_code' => '郵便番号',
            'prefecture' => '都道府県',
            'city' => '市区町村',
            'district' => '町域',
            'address_other' => '番地・建物名',
            'phone' => '電話番号',
            'contact_person' => '担当者名',
            'is_default' => 'デフォルト',
            'is_active' => '有効',
            'notes' => '備考',
        ];
    }
}
