<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'site_name' => ['nullable', 'string', 'max:255'],
            'name_en' => ['nullable', 'string', 'max:255'],
            'logo_path' => ['nullable', 'string', 'max:500'],
            'legal_name' => ['nullable', 'string', 'max:255'],
            'representative_name' => ['nullable', 'string', 'max:255'],
            'business_description' => ['nullable', 'string', 'max:2000'],
            'employee_count' => ['nullable', 'integer', 'min:0'],
            'capital' => ['nullable', 'string', 'max:50'],
            'established_date' => ['nullable', 'date'],
            'business_hours' => ['nullable', 'string', 'max:255'],
            'registration_number' => ['nullable', 'string', 'max:50'],
            'tax_number' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:20'],
            'fax' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'array'],
            'address.postal_code' => ['nullable', 'string', 'max:8'],
            'address.prefecture' => ['nullable', 'string', 'max:20'],
            'address.city' => ['nullable', 'string', 'max:50'],
            'address.district' => ['nullable', 'string', 'max:50'],
            'address.address_other' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '組織名',
            'site_name' => 'サイト表示名',
            'name_en' => '英語表記名',
            'logo_path' => 'ロゴ画像パス',
            'legal_name' => '法人正式名称',
            'representative_name' => '代表者名',
            'business_description' => '事業内容',
            'employee_count' => '従業員数',
            'capital' => '資本金',
            'established_date' => '設立日',
            'business_hours' => '営業時間',
            'registration_number' => '法人番号',
            'tax_number' => '税務番号',
            'phone' => '電話番号',
            'fax' => 'FAX番号',
            'email' => 'メールアドレス',
            'website' => 'WebサイトURL',
            'address.postal_code' => '郵便番号',
            'address.prefecture' => '都道府県',
            'address.city' => '市区町村',
            'address.district' => '町域',
            'address.address_other' => '番地・建物名',
        ];
    }
}
