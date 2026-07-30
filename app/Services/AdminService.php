<?php

namespace App\Services;

use App\Models\Admin;
use App\Mail\AdminCreatedMail;
use App\Repositories\AdminRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * 管理者サービス
 * 
 * BaseServiceを継承し、Admin固有のビジネスロジックを実装
 */
class AdminService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param AdminRepository $repository
     */
    public function __construct(AdminRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     * 
     * @return string
     */
    protected function getEntityName(): string
    {
        return 'Admin';
    }

    /**
     * 新しい管理者を作成（ランダムパスワード自動生成）
     * 
     * @param array $data
     * @return array
     * @throws \Exception
     */
    public function createAdmin(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // パスワードポリシー（英大小文字・数字必須）を確実に満たすよう生成する
            $randomPassword = Str::password(12, letters: true, numbers: true, symbols: false);

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

            $this->logInfo('created with password', $admin->id);

            return [
                'admin'    => $admin->load('profile'),
                'password' => $randomPassword,
            ];
        });
    }

    /**
     * 管理者情報を更新
     * 
     * @param Admin $admin
     * @param array $data
     * @return Admin
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

            $updated = $this->repository->update($admin, $updateData);

            $this->logInfo('updated', $updated->id);

            return $updated;
        });
    }

    /**
     * 管理者を削除（自分自身は不可）
     * 
     * @param Admin $admin
     * @param string $currentAdminId
     * @return bool
     * @throws \Exception
     */
    public function deleteAdmin(Admin $admin, string $currentAdminId): bool
    {
        if ($admin->id === $currentAdminId) {
            throw new \Exception('自分自身を削除することはできません。');
        }

        return $this->delete($admin);
    }

    /**
     * アクティブな管理者一覧を取得（選択肢用など）
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveAdmins()
    {
        return $this->repository->findWithFilters(['status' => 'active'])->get();
    }

    /**
     * ロール定義を取得
     * 
     * @return array
     */
    public function getRoles(): array
    {
        return collect(\App\Models\Admin::ROLES)
            ->map(fn(string $label, string $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
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
