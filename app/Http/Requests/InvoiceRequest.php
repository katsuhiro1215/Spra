<?php

namespace App\Http\Requests;

use App\Models\Contract;
use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contract_id'           => 'nullable|ulid|exists:contracts,id',
            'invoice_type'          => 'nullable|string|in:deposit,interim,final,full,monthly,other',
            'issue_date'            => 'required|date',
            'user_id'               => 'nullable|uuid|exists:users,id',
            'company_id'            => 'nullable|ulid|exists:companies,id',
            'status'                => 'required|string|in:draft,sent,paid,overdue,cancelled',
            'due_date'              => 'nullable|date|after:issue_date',
            'billing_period_start'  => 'nullable|date|after_or_equal:issue_date',
            'billing_period_end'    => 'nullable|date|after_or_equal:billing_period_start',
            'subtotal'              => 'required|integer|min:0',
            'tax_rate'              => 'required|numeric|min:0|max:100',
            'tax_amount'            => 'required|integer|min:0',
            'total_amount'          => 'required|integer|min:0',
            'notes'                 => 'nullable|string',
        ];
    }

    /**
     * 契約に紐づく請求書の場合、契約金額の残金を超えて請求できないようにする
     * （月額/年額の継続契約は請求サイクルが繰り返されるため対象外）
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $contractId = $this->input('contract_id');

            if (!$contractId) {
                return;
            }

            $contract = Contract::with('currentVersion')->find($contractId);

            if (!$contract || $contract->isRecurring()) {
                return;
            }

            // update時（ルートパラメータ {id}）は自分自身の請求書を除いて残金を計算する
            $excludeInvoiceId = $this->route('id');
            $remaining = $contract->remainingAmount($excludeInvoiceId);
            $totalAmount = (float) $this->input('total_amount', 0);

            if ($totalAmount > $remaining) {
                $validator->errors()->add(
                    'total_amount',
                    'この契約の残金（' . number_format($remaining) . '円）を超えて請求することはできません。'
                );
            }

            if ($remaining <= 0) {
                $validator->errors()->add(
                    'contract_id',
                    'この契約は既に契約金額の全額を請求済みのため、新しい請求書を作成できません。'
                );
            }
        });
    }
}
