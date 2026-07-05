<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentNotificationRequest extends FormRequest
{
  public function authorize(): bool
  {
    return auth('users')->check();
  }

  public function rules(): array
  {
    return [
      'payment_method' => ['required', 'in:bank_transfer,credit_card,cash,other'],
      'amount'         => ['required', 'numeric', 'min:0'],
      'payment_date'   => ['required', 'date'],
      'transaction_id' => ['nullable', 'string', 'max:255'],
      'notes'          => ['nullable', 'string', 'max:500'],
    ];
  }

  public function messages(): array
  {
    return [
      'payment_method.required' => '支払方法は必須です',
      'payment_method.in'       => '支払方法が無効です',
      'amount.required'         => '金額は必須です',
      'amount.numeric'          => '金額は数値である必要があります',
      'amount.min'              => '金額は0以上である必要があります',
      'payment_date.required'   => '支払い日は必須です',
      'payment_date.date'       => '支払い日は有効な日付である必要があります',
    ];
  }
}
