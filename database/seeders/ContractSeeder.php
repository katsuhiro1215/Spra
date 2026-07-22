<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractSignature;
use App\Models\Quote;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    private const SIGNATURE_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    /**
     * 承認済みの見積から契約を作成する。
     * 直近数件は「署名待ち」の状態にし、ダッシュボードの対応キューを確認できるようにする。
     */
    public function run(): void
    {
        $quotes = Quote::whereIn('status', ['approved', 'contracted'])
            ->with('currentVersion.items')
            ->orderBy('created_at')
            ->get();
        $admin = Admin::first();

        if ($quotes->isEmpty() || !$admin) {
            $this->command?->warn('ContractSeeder: 前提データ（承認済みQuote/Admin）が不足しているためスキップします。');
            return;
        }

        // 契約の状態パターン（案件が進むにつれて進捗するイメージ）
        $states = [
            ['status' => 'active', 'signature_status' => 'fully_signed', 'signature_required_from' => 'admin'],
            ['status' => 'completed', 'signature_status' => 'fully_signed', 'signature_required_from' => 'admin'],
            ['status' => 'active', 'signature_status' => 'fully_signed', 'signature_required_from' => 'admin'],
            ['status' => 'cancelled', 'signature_status' => 'rejected', 'signature_required_from' => 'user'],
            ['status' => 'active', 'signature_status' => 'fully_signed', 'signature_required_from' => 'admin'],
        ];

        $total = $quotes->count();
        $counter = 1;
        $created = 0;

        foreach ($quotes as $index => $quote) {
            $quoteVersion = $quote->currentVersion;
            if (!$quoteVersion) {
                continue;
            }

            $date = $quote->created_at->copy()->addDays(rand(3, 10));

            // 直近3件は「署名待ち」にする（ダッシュボード確認用）
            $isRecentPending = $index >= $total - 3;

            if ($isRecentPending) {
                // 交互に「送付直後（未署名）」「ユーザー署名済み（管理者確認待ち）」にする
                $state = $index % 2 === 0
                    ? ['status' => 'pending_signature', 'signature_status' => 'pending', 'signature_required_from' => 'admin']
                    : ['status' => 'pending_signature', 'signature_status' => 'user_signed', 'signature_required_from' => 'admin'];
            } else {
                $state = $states[$index % count($states)];
            }

            $contractNumber = 'CTR-' . $date->format('Ym') . '-' . str_pad($counter++, 4, '0', STR_PAD_LEFT);

            $contract = Contract::create([
                'contract_number' => $contractNumber,
                'quote_id' => $quote->id,
                'user_id' => $quote->user_id,
                'company_id' => $quote->company_id,
                'title' => "{$quote->title} - 契約",
                'description' => $quote->requirements,
                'type' => 'one_time',
                'start_date' => $date->toDateString(),
                'end_date' => $date->copy()->addMonths(12)->toDateString(),
                'status' => $state['status'],
                'signature_status' => $state['signature_status'],
                'signature_required_from' => $state['signature_required_from'],
                'user_signed_at' => in_array($state['signature_status'], ['user_signed', 'fully_signed'], true) ? $date->copy()->addDay() : null,
                'admin_signed_at' => $state['signature_status'] === 'fully_signed' ? $date->copy()->addDays(2) : null,
                'signed_at' => $state['signature_status'] === 'fully_signed' ? $date->copy()->addDays(2) : null,
                'terminated_at' => $state['status'] === 'cancelled' ? $date->copy()->addDays(5) : null,
                'termination_reason' => $state['status'] === 'cancelled' ? 'クライアントの都合によるキャンセル' : null,
                'created_by' => $admin->id,
            ]);
            $contract->forceFill(['created_at' => $date, 'updated_at' => $date])->save();

            $versionStatus = match ($state['status']) {
                'active', 'completed' => 'active',
                'cancelled' => 'cancelled',
                default => 'sent',
            };

            $version = $contract->versions()->create([
                'version' => 1,
                'terms_and_conditions' => "本契約は「{$quote->title}」に基づくサービス提供契約です。詳細な条項は別途契約書PDFをご確認ください。",
                'base_amount' => $quoteVersion->base_amount,
                'discount_amount' => $quoteVersion->discount_amount,
                'tax_rate' => $quoteVersion->tax_rate,
                'tax_amount' => $quoteVersion->tax_amount,
                'total_amount' => $quoteVersion->total_amount,
                'status' => $versionStatus,
                'approved_at' => $state['signature_status'] === 'fully_signed' ? $date->copy()->addDays(2) : null,
                'sent_at' => $date->copy()->addHour(),
                'signed_at' => $state['signature_status'] === 'fully_signed' ? $date->copy()->addDays(2) : null,
                'is_current' => true,
                'created_by' => $admin->id,
            ]);
            $version->forceFill(['created_at' => $date, 'updated_at' => $date])->save();

            $contract->update(['current_version_id' => $version->id]);

            foreach ($quoteVersion->items as $itemIndex => $quoteItem) {
                $version->items()->create([
                    'service_id' => $quoteItem->service_id,
                    'service_item_id' => $quoteItem->service_item_id,
                    'name' => $quoteItem->name,
                    'description' => $quoteItem->description,
                    'item_type' => $quoteItem->item_type,
                    'billing_type' => $quoteItem->billing_type,
                    'quantity' => $quoteItem->quantity,
                    'unit_price' => $quoteItem->unit_price,
                    'amount' => $quoteItem->amount,
                    'estimated_days' => $quoteItem->estimated_days,
                    'sort_order' => $itemIndex + 1,
                ]);
            }

            // 署名記録
            if ($contract->user_signed_at) {
                ContractSignature::create([
                    'contract_id' => $contract->id,
                    'signed_by_user' => $contract->user_id,
                    'signature_type' => 'user',
                    'signature_image' => self::SIGNATURE_IMAGE,
                    'method' => 'canvas',
                    'signed_at' => $contract->user_signed_at,
                    'status' => 'signed',
                ])->forceFill(['created_at' => $contract->user_signed_at])->save();
            }

            if ($contract->admin_signed_at) {
                ContractSignature::create([
                    'contract_id' => $contract->id,
                    'signed_by_admin' => $admin->id,
                    'signature_type' => 'admin',
                    'signature_image' => self::SIGNATURE_IMAGE,
                    'method' => 'canvas',
                    'signed_at' => $contract->admin_signed_at,
                    'status' => 'signed',
                ])->forceFill(['created_at' => $contract->admin_signed_at])->save();
            }

            $created++;
        }

        $this->command?->info("ContractSeeder: {$created}件の契約を作成しました。");
    }
}
