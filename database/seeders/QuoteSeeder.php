<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Quote;
use App\Models\QuoteResponse;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class QuoteSeeder extends Seeder
{
    /**
     * 2022年5月〜現在にかけて、様々なステータスの見積を作成する。
     * 一部は「見積回答待ち」の状態にし、ダッシュボードの対応キューを確認できるようにする。
     */
    public function run(): void
    {
        $users = User::where('status', 'active')->with('companies')->inRandomOrder()->limit(20)->get();
        $services = Service::with('serviceItems')->get()->filter(fn (Service $s) => $s->serviceItems->isNotEmpty());
        $admin = Admin::first();

        if ($users->isEmpty() || $services->isEmpty() || !$admin) {
            $this->command?->warn('QuoteSeeder: 前提データ（User/Service/Admin）が不足しているためスキップします。');
            return;
        }

        $startDate = Carbon::parse('2022-05-01');
        $endDate = Carbon::now();
        $totalQuotes = 24;

        // 直近ほど多くなるように、日付を後半に偏らせて生成
        $dates = collect(range(1, $totalQuotes))
            ->map(function ($i) use ($startDate, $endDate, $totalQuotes) {
                $progress = ($i / $totalQuotes) ** 0.6; // 後半に偏らせる
                $days = (int) ($startDate->diffInDays($endDate) * $progress);
                return $startDate->copy()->addDays($days)->addHours(fake()->numberBetween(9, 18));
            })
            ->sort()
            ->values();

        // status distribution: 直近の数件は「negotiating（回答待ち）」にして
        // ダッシュボードの「未対応の見積回答」キューを確認できるようにする
        $statusPattern = [
            'draft', 'negotiating', 'approved', 'contracted', 'approved', 'rejected',
            'contracted', 'approved', 'negotiating', 'cancelled', 'approved', 'contracted',
        ];

        $quoteCounter = 1;
        $created = 0;

        foreach ($dates as $index => $date) {
            $user = $users[$index % $users->count()];
            $company = $user->companies->first();
            $service = $services->random();
            $items = $service->serviceItems->shuffle()->take(fake()->numberBetween(2, 4));

            if ($items->isEmpty()) {
                continue;
            }

            // 直近3件は必ず「回答待ち」にする（ダッシュボード確認用）
            $isRecentPending = $index >= $totalQuotes - 3;
            $status = $isRecentPending ? 'negotiating' : $statusPattern[$index % count($statusPattern)];

            $baseAmount = $items->sum(fn ($item) => (float) $item->standard_price);
            $discountAmount = fake()->boolean(20) ? round($baseAmount * 0.05, 2) : 0;
            $taxableAmount = $baseAmount - $discountAmount;
            $taxRate = 10;
            $taxAmount = round($taxableAmount * $taxRate / 100, 2);
            $totalAmount = $taxableAmount + $taxAmount;

            $yearMonth = $date->format('Ym');
            $quoteNumber = "Q{$yearMonth}-" . str_pad($quoteCounter++, 4, '0', STR_PAD_LEFT);

            $quote = Quote::create([
                'quote_number' => $quoteNumber,
                'user_id' => $user->id,
                'company_id' => $company?->id,
                'title' => "{$service->name}のご依頼",
                'requirements' => "{$service->name}について、{$items->pluck('name')->join('、')}を含む内容でご検討をお願いします。",
                'status' => $status,
                'created_by' => $admin->id,
            ]);
            $quote->forceFill(['created_at' => $date, 'updated_at' => $date])->save();

            $versionStatus = match ($status) {
                'draft' => 'draft',
                'negotiating' => 'sent',
                'approved', 'contracted' => 'approved',
                'rejected' => 'rejected',
                'cancelled' => 'sent',
                default => 'sent',
            };

            $version = $quote->versions()->create([
                'version' => 1,
                'title' => $quote->title,
                'requirements' => $quote->requirements,
                'base_amount' => $baseAmount,
                'discount_amount' => $discountAmount,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => $versionStatus,
                'sent_at' => $status !== 'draft' ? $date->copy()->addHour() : null,
                'responded_at' => in_array($status, ['approved', 'contracted', 'rejected'], true) ? $date->copy()->addDays(2) : null,
                'expires_at' => $date->copy()->addDays(30),
                'is_current' => true,
                'created_by' => $admin->id,
            ]);
            $version->forceFill(['created_at' => $date, 'updated_at' => $date])->save();

            $quote->update(['current_version_id' => $version->id]);

            foreach ($items->values() as $itemIndex => $item) {
                $version->items()->create([
                    'service_id' => $service->id,
                    'service_item_id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'item_type' => $item->item_type,
                    'billing_type' => 'one_time',
                    'quantity' => 1,
                    'unit_price' => $item->standard_price,
                    'amount' => $item->standard_price,
                    'estimated_days' => $item->estimated_days,
                    'sort_order' => $itemIndex + 1,
                ]);
            }

            // 見積回答（クライアントからの返信）を作成
            if (in_array($status, ['negotiating', 'approved', 'contracted', 'rejected'], true)) {
                $responseType = match ($status) {
                    'rejected' => 'decline',
                    'negotiating' => null, // まだ回答なし（保留中）
                    default => 'request',
                };

                QuoteResponse::create([
                    'quote_id' => $quote->id,
                    'token' => Str::random(40),
                    'email' => $user->email,
                    'user_id' => $user->id,
                    'company_id' => $company?->id,
                    'response_type' => $responseType,
                    'responded_at' => $responseType ? $date->copy()->addDays(2) : null,
                    'admin_notified_at' => $responseType ? $date->copy()->addDays(2) : null,
                ])->forceFill(['created_at' => $date, 'updated_at' => $date])->save();
            }

            $created++;
        }

        $this->command?->info("QuoteSeeder: {$created}件の見積を作成しました。");
    }
}
