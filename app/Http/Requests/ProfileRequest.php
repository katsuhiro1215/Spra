<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'last_name' => ['nullable', 'string', 'max:50'],
            'first_name' => ['nullable', 'string', 'max:50'],
            'last_name_kana' => ['nullable', 'string', 'max:50'],
            'first_name_kana' => ['nullable', 'string', 'max:50'],
            'display_name' => ['nullable', 'string', 'max:50'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:male,female,other,prefer_not_to_say'],
            'phone' => ['nullable', 'string', 'max:20'],
            'mobile' => ['nullable', 'string', 'max:20'],
            'emergency_contact_name' => ['nullable', 'string', 'max:50'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'last_name' => '姓',
            'first_name' => '名',
            'last_name_kana' => '姓（カナ）',
            'first_name_kana' => '名（カナ）',
            'display_name' => '表示名',
            'birth_date' => '生年月日',
            'gender' => '性別',
            'phone' => '電話番号',
            'mobile' => '携帯電話',
            'emergency_contact_name' => '緊急連絡先氏名',
            'emergency_contact_phone' => '緊急連絡先電話番号',
            'bio' => '自己紹介',
        ];
    }
}
