<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating users...');

        // =============================================
        // 1. 固定テストアカウント（認証確認用）
        // =============================================

        // アクティブ・認証済み（基本テスト）
        $activeUser = User::updateOrCreate(
            ['email' => 'user01@example.com'],
            ['password' => Hash::make('password'), 'status' => 'active', 'email_verified_at' => now()]
        );

        // アクティブ・未認証
        User::updateOrCreate(
            ['email' => 'user02@example.com'],
            ['password' => Hash::make('password'), 'status' => 'active', 'email_verified_at' => null]
        );

        // 非アクティブ
        User::updateOrCreate(
            ['email' => 'user03@example.com'],
            ['password' => Hash::make('password'), 'status' => 'inactive', 'email_verified_at' => now()]
        );

        // 停止中
        User::updateOrCreate(
            ['email' => 'user04@example.com'],
            ['password' => Hash::make('password'), 'status' => 'suspended', 'email_verified_at' => now()]
        );

        // 仮登録（pending）
        User::updateOrCreate(
            ['email' => 'user05@example.com'],
            ['password' => Hash::make('password'), 'status' => 'pending', 'email_verified_at' => null]
        );

        $this->command->info('Fixed test accounts: 5');

        // =============================================
        // 2. ファクトリーでランダムなユーザーを95件作成
        // （固定5件と合わせて100件になる）
        // =============================================

        // アクティブ・認証済み（55件）
        $activeUsers = User::factory()->count(55)->create();

        // アクティブ・未認証（15件）
        $unverifiedUsers = User::factory()->unverified()->count(15)->create();

        // 非アクティブ（15件）
        $inactiveUsers = User::factory()->inactive()->count(15)->create();

        // 停止中・仮登録（各5件）
        $suspendedUsers = User::factory()->suspended()->count(5)->create();
        $pendingUsers   = User::factory()->pending()->count(5)->create();

        $this->command->info('Factory users: 95');
        $this->command->info('Total users: ' . User::count());

        // =============================================
        // 3. 会社との紐付け（company_user 中間テーブル）
        //    アクティブ・認証済みユーザーの約70%に割り当て
        // =============================================

        $companies = Company::all();

        if ($companies->isEmpty()) {
            $this->command->warn('No companies found. Skipping company assignments.');
        } else {
            $this->command->info('Assigning users to companies...');

            // 固定テストユーザー（user01）は1社に所属（primary）
            $primaryCompany = $companies->random();
            DB::table('company_user')->insert([
                'id'         => (string) Str::ulid(),
                'user_id'    => $activeUser->id,
                'company_id' => $primaryCompany->id,
                'role'       => 'owner',
                'is_primary' => true,
                'joined_at'  => now()->subYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // ファクトリーのアクティブユーザーから70%をランダムに選んで会社に紐付け
            $usersToAssign = $activeUsers->random((int) ($activeUsers->count() * 0.7));

            foreach ($usersToAssign as $user) {
                // 1〜2社に所属させる
                $numCompanies = fake()->randomElement([1, 1, 1, 2]);
                $assignedCompanies = $companies->random($numCompanies);

                $isPrimary = true;
                foreach ($assignedCompanies as $company) {
                    $alreadyExists = DB::table('company_user')
                        ->where('user_id', $user->id)
                        ->where('company_id', $company->id)
                        ->exists();

                    if (!$alreadyExists) {
                        DB::table('company_user')->insert([
                            'id'         => (string) Str::ulid(),
                            'user_id'    => $user->id,
                            'company_id' => $company->id,
                            'role'       => fake()->randomElement(['member', 'member', 'employee', 'owner']),
                            'is_primary' => $isPrimary,
                            'joined_at'  => fake()->dateTimeBetween('-2 years', 'now'),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                        $isPrimary = false;
                    }
                }
            }

            $this->command->info('Company assignments done.');
        }

        // =============================================
        // 4. 住所作成（アクティブユーザーの約60%）
        // =============================================

        $this->command->info('Creating user addresses...');

        // 固定テストユーザー（user01）には住所を1件
        Address::factory()->forUser($activeUser)->home()->default()->create();

        // ファクトリーユーザーから60%に住所を作成
        $usersWithAddress = $activeUsers->random((int) ($activeUsers->count() * 0.6));

        foreach ($usersWithAddress as $user) {
            // 自宅住所（デフォルト）
            Address::factory()->forUser($user)->home()->default()->create();

            // 追加住所（30%の確率で会社住所も）
            if (fake()->boolean(30)) {
                Address::factory()->forUser($user)->office()->create();
            }
        }

        $this->command->info('User addresses created: ' . Address::where('addressable_type', User::class)->count());
        $this->command->info('');
        $this->command->info('=== UserSeeder Summary ===');
        $this->command->info('Total users:         ' . User::count());
        $this->command->info('Active:              ' . User::where('status', 'active')->count());
        $this->command->info('Inactive:            ' . User::where('status', 'inactive')->count());
        $this->command->info('Suspended:           ' . User::where('status', 'suspended')->count());
        $this->command->info('Pending:             ' . User::where('status', 'pending')->count());
        $this->command->info('Email verified:      ' . User::whereNotNull('email_verified_at')->count());
        $this->command->info('With company:        ' . User::has('companies')->count());
        $this->command->info('With address:        ' . User::has('addresses')->count());
        $this->command->info('All passwords: password');
    }
}
