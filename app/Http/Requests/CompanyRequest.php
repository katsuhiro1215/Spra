<?php

namespace App\Http\Requests;

use App\Models\Address;
use App\Models\Company;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyRequest extends FormRequest
{
  /**
   * 管理者のみ操作可能
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * バリデーションルール
   */
  public function rules(): array
  {
    $company = $this->route('company');
    $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

    return [
      'name'                   => 'required|string|max:255',
      'company_type'           => ['required', Rule::in(array_keys(Company::TYPES))],
      'legal_name'             => 'nullable|string|max:255',
      'registration_number'    => [
        'nullable',
        'string',
        'max:20',
        $isUpdate
          ? Rule::unique('companies', 'registration_number')->ignore($company?->id)
          : Rule::unique('companies', 'registration_number'),
      ],
      'tax_number'             => 'nullable|string|max:20',
      'phone'                  => 'nullable|string|max:20',
      'fax'                    => 'nullable|string|max:20',
      'email'                  => 'nullable|email|max:255',
      'website'                => 'nullable|url|max:255',
      'representative_name'    => 'nullable|string|max:255',
      'representative_title'   => 'nullable|string|max:100',
      'representative_email'   => 'nullable|email|max:255',
      'representative_phone'   => 'nullable|string|max:20',
      'business_description'   => 'nullable|string|max:1000',
      'industry'               => 'nullable|string|max:100',
      'employee_count'         => 'nullable|integer|min:1',
      'capital'                => 'nullable|numeric|min:0',
      'established_date'       => 'nullable|date',
      'status'                 => ['required', Rule::in(array_keys(Company::STATUSES))],
      'notes'                  => 'nullable|string|max:1000',

      // 住所情報
      'addresses'              => 'nullable|array',
      'addresses.*.id'         => 'nullable|string|exists:addresses,id',
      'addresses.*.type'       => ['required', Rule::in(array_keys(Address::TYPES))],
      'addresses.*.label'      => 'nullable|string|max:100',
      'addresses.*.postal_code' => 'required|string|max:8',
      'addresses.*.prefecture' => 'required|string|max:10',
      'addresses.*.city'       => 'required|string|max:100',
      'addresses.*.district'   => 'nullable|string|max:100',
      'addresses.*.address_other' => 'nullable|string|max:255',
      'addresses.*.phone'      => 'nullable|string|max:20',
      'addresses.*.contact_person' => 'nullable|string|max:100',
      'addresses.*.is_default' => 'boolean',
      'addresses.*.is_active'  => 'boolean',
    ];
  }

  /**
   * カスタムエラーメッセージ
   */
  public function messages(): array
  {
    return [
      'name.required'               => '会社名は必須です。',
      'company_type.required'       => '会社種別は必須です。',
      'company_type.in'             => '会社種別が不正です。',
      'status.required'             => 'ステータスは必須です。',
      'status.in'                   => 'ステータスが不正です。',
      'registration_number.unique'  => '法人番号はすでに登録されています。',
      'email.email'                 => '有効なメールアドレスを入力してください。',
      'website.url'                 => '有効なURLを入力してください。',
    ];
  }

  /**
   * カスタム属性名
   */
  public function attributes(): array
  {
    return [
      'name'                 => '会社名',
      'company_type'         => '会社種別',
      'legal_name'           => '法定名称',
      'registration_number'  => '法人番号',
      'tax_number'           => '税務番号',
      'phone'                => '電話番号',
      'fax'                  => 'FAX番号',
      'email'                => 'メールアドレス',
      'website'              => 'Webサイト',
      'representative_name'  => '代表者名',
      'representative_title' => '役職',
      'representative_email' => '代表者メール',
      'representative_phone' => '代表者電話番号',
      'business_description' => '事業内容',
      'industry'             => '業種',
      'employee_count'       => '従業員数',
      'capital'              => '資本金',
      'established_date'     => '設立日',
      'status'               => 'ステータス',
      'notes'                => '備考',
    ];
  }
}
