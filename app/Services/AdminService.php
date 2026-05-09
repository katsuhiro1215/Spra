<?php

namespace App\Services;

use App\Models\Admin;
use App\Mail\AdminCreatedMail;
use App\Repositories\AdminRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AdminService
{
    public function __construct(
        private AdminRepository $repository
    ) {}

    /**
     * ページネーション付きで管理者一覧を取得
     * フィルター・ソート・ページネーションの責務はRepositoryに委譲
     */
    public function getPaginatedAdmins(array $filters = [], array $sort = [], int $perPage = 20): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $filters, $sort);
    }

    /**
     * 管理者の統計情報を取得
     */
    public function getAdminStats(): array
    {
        return [
            'all' => Admin::withTrashed()->count(),
            'active' => Admin::count(),
            'trashed' => Admin::onlyTrashed()->count(),
        ];
    }

    /**
     * 新しい管理者を作成（ランダムパスワード自動生成）
     */
    public function createAdmin(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $randomPassword = Str::random(12);

            $admin = $this->repository->create([
                'email'    => $data['email'],
                'password' => Hash::make($randomPassword),
                'role'     => $data['role'],
                'status'   => 'active',
            ]);

            // プロフィール作成（名前が提供された場合）
            if (!empty($data['name'])) {
                // 名前を姓名に分割（簡易的な処理）
                $nameParts = explode(' ', $data['name'], 2);
                $admin->profile()->create([
                    'last_name' => $nameParts[0] ?? null,
                    'first_name' => $nameParts[1] ?? null,
                    'phone' => $data['phone'] ?? null,
                ]);
            }

            // メール送信
            try {
                Mail::to($admin->email)->send(new AdminCreatedMail($admin, $randomPassword));
            } catch (\Exception $e) {
                Log::error('Admin creation email failed: ' . $e->getMessage());
                // メール送信失敗してもadmin作成は成功とする
            }

            return [
                'admin'    => $admin->load('profile'),
                'password' => $randomPassword,
            ];
        });
    }

    /**
     * 管理者情報を更新
     */
    public function updateAdmin(Admin $admin, array $data): Admin
    {
        return DB::transaction(function () use ($admin, $data) {
            $updateData = [
                'email'  => $data['email'],
                'role'   => $data['role'],
                'status' => $data['status'] ?? $admin->status,
            ];

            if (!empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }

            $this->repository->update($admin, $updateData);

            return $admin->fresh();
        });
    }

    /**
     * 管理者を削除（自分自身は不可）
     */
    public function deleteAdmin(Admin $admin, string $currentAdminId): void
    {
        if ($admin->id === $currentAdminId) {
            throw new \Exception('自分自身を削除することはできません。');
        }

        DB::transaction(function () use ($admin) {
            $this->repository->delete($admin);
        });
    }

    /**
     * アクティブな管理者一覧を取得（選択肢用など）
     */
    public function getActiveAdmins()
    {
        return $this->repository->findWithFilters(['status' => 'active'])->get();
    }

    /**
     * ロール定義を取得
     */
    public function getRoles(): array
    {
        return [
            ['value' => 'owner', 'label' => 'オーナー'],
            ['value' => 'super_admin', 'label' => 'スーパー管理者'],
            ['value' => 'admin', 'label' => '管理者'],
            ['value' => 'editor', 'label' => '編集者'],
        ];
    }

    /**
     * ステータス定義を取得
     */
    public function getStatuses(): array
    {
        return [
            ['value' => 'active', 'label' => '有効'],
            ['value' => 'inactive', 'label' => '無効'],
            ['value' => 'suspended', 'label' => '停止中'],
        ];
    }
}
