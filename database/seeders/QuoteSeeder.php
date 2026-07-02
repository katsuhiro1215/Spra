<?php

namespace Database\Seeders;

use App\Models\Quote;
use App\Models\User;
use App\Models\Company;
use App\Models\Admin;
use Illuminate\Database\Seeder;

class QuoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('status', 'active')->limit(20)->get();
        $companies = Company::where('status', 'active')->limit(10)->get();
        $admin = Admin::first();

        if ($users->isEmpty() || $companies->isEmpty() || !$admin) {
            echo "No active users, companies, or admins found. Skipping quote seeding.\n";
            return;
        }

        $quoteData = [
            [
                'title' => 'ウェブサイト制作プロジェクト',
                'base_amount' => 500000,
                'tax_rate' => 10,
                'items' => [
                    ['description' => 'デザイン・企画', 'quantity' => 1, 'unit_price' => 200000],
                    ['description' => 'システム構築', 'quantity' => 1, 'unit_price' => 250000],
                    ['description' => 'テスト・デバッグ', 'quantity' => 1, 'unit_price' => 50000],
                ]
            ],
            [
                'title' => 'アプリ開発サービス',
                'base_amount' => 750000,
                'tax_rate' => 10,
                'items' => [
                    ['description' => 'UI/UX設計', 'quantity' => 1, 'unit_price' => 150000],
                    ['description' => 'フロントエンド開発', 'quantity' => 1, 'unit_price' => 300000],
                    ['description' => 'バックエンド開発', 'quantity' => 1, 'unit_price' => 250000],
                    ['description' => 'API統合', 'quantity' => 1, 'unit_price' => 50000],
                ]
            ],
            [
                'title' => 'マーケティングコンサルティング',
                'base_amount' => 300000,
                'tax_rate' => 10,
                'items' => [
                    ['description' => 'マーケット分析', 'quantity' => 1, 'unit_price' => 100000],
                    ['description' => '戦略立案', 'quantity' => 1, 'unit_price' => 150000],
                    ['description' => '実装支援', 'quantity' => 1, 'unit_price' => 50000],
                ]
            ],
            [
                'title' => 'ITシステム構築',
                'base_amount' => 1000000,
                'tax_rate' => 10,
                'items' => [
                    ['description' => 'システム設計', 'quantity' => 1, 'unit_price' => 300000],
                    ['description' => 'インフラ構築', 'quantity' => 1, 'unit_price' => 400000],
                    ['description' => 'セキュリティ対応', 'quantity' => 1, 'unit_price' => 200000],
                    ['description' => 'ドキュメント作成', 'quantity' => 1, 'unit_price' => 100000],
                ]
            ],
            [
                'title' => 'コンテンツ制作サービス',
                'base_amount' => 200000,
                'tax_rate' => 10,
                'items' => [
                    ['description' => 'ライティング（10記事）', 'quantity' => 1, 'unit_price' => 100000],
                    ['description' => 'デザイン・レイアウト', 'quantity' => 1, 'unit_price' => 80000],
                    ['description' => 'SEO最適化', 'quantity' => 1, 'unit_price' => 20000],
                ]
            ],
        ];

        $createdCount = 0;
        $quoteCounter = 1;

        foreach ($users->take(10) as $index => $user) {
            $company = $companies->random();
            $quoteInfo = $quoteData[$index % count($quoteData)];

            try {
                $baseAmount = $quoteInfo['base_amount'];
                $taxRate = $quoteInfo['tax_rate'];
                $taxAmount = round($baseAmount * $taxRate / 100, 2);
                $totalAmount = $baseAmount + $taxAmount;

                // Generate unique quote_number (Q202607-001, Q202607-002, etc.)
                $yearMonth = now()->format('Ym');
                $quoteNumber = "Q{$yearMonth}-" . str_pad($quoteCounter, 5, '0', STR_PAD_LEFT);
                $quoteCounter++;

                $quote = Quote::create([
                    'quote_number' => $quoteNumber,
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'title' => $quoteInfo['title'],
                    'base_amount' => $baseAmount,
                    'tax_rate' => $taxRate,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                    'status' => 'approved',
                    'sent_at' => now(),
                    'expires_at' => now()->addDays(30),
                    'created_by' => $admin->id,
                ]);

                // Add quote items
                foreach ($quoteInfo['items'] as $itemIndex => $item) {
                    $quote->items()->create([
                        'name' => $item['description'],
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'amount' => $item['quantity'] * $item['unit_price'],
                        'billing_type' => 'one_time',
                        'item_type' => 'custom',
                        'sort_order' => $itemIndex,
                    ]);
                }

                $createdCount++;
            } catch (\Exception $e) {
                echo "Error creating quote for user {$user->id}: " . $e->getMessage() . "\n";
            }
        }

        echo "=== QuoteSeeder Summary ===\n";
        echo "Total quotes created: {$createdCount}\n";
    }
}
