<?php

namespace App\Services;

use App\Models\User;
use App\Mail\UserCreatedMail;
use App\Repositories\UserRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UserService
{
    public function __construct(
        private UserRepository $repository
    ) {}

    /**
     * ページネーション付きでユーザー一覧を取得
     * フィルター・ソート・ページネーションの責務はRepositoryに委譲
     */
    public function getPaginatedUsers(array $filters = [], array $sort = [], int $perPage = 20): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $filters, $sort);
    }

    /**
     * ユーザーの統計情報を取得
     */
    public function getUserStats(): array
    {
        return [
            'all' => User::withTrashed()->count(),
            'active' => User::count(),
            'trashed' => User::onlyTrashed()->count(),
        ];
    }

    /**
     * 新しいユーザーを作成（ランダムパスワード自動生成）
     */
    public function createUser(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $randomPassword = Str::random(12);

            $user = $this->repository->create([
                'email'    => $data['email'],
                'password' => Hash::make($randomPassword),
                'status'   => 'active',
            ]);

            // プロフィール作成（名前が提供された場合）
            if (!empty($data['name'])) {
                // 名前を姓名に分割（簡易的な処理）
                $nameParts = explode(' ', $data['name'], 2);
                $user->profile()->create([
                    'last_name' => $nameParts[0] ?? null,
                    'first_name' => $nameParts[1] ?? null,
                    'phone' => $data['phone'] ?? null,
                ]);
            }

            // メール送信
            try {
                Mail::to($user->email)->send(new UserCreatedMail($user, $randomPassword));
            } catch (\Exception $e) {
                Log::error('Admin creation email failed: ' . $e->getMessage());
                // メール送信失敗してもadmin作成は成功とする
            }

            return [
                'user'    => $user->load('profile'),
                'password' => $randomPassword,
            ];
        });
    }

    /**
     * ユーザー情報を更新
     */
    public function updateUser(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $updateData = [
                'email'  => $data['email'],
                'status' => $data['status'] ?? $user->status,
            ];

            if (!empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }

            $this->repository->update($user, $updateData);

            return $user->fresh();
        });
    }

    /**
     * ユーザーを削除（自分自身は不可）
     */
    public function deleteUser(User $user, string $currentUserId): void
    {
        if ($user->id === $currentUserId) {
            throw new \Exception('自分自身を削除することはできません。');
        }

        DB::transaction(function () use ($user) {
            $this->repository->delete($user);
        });
    }

    /**
     * アクティブなユーザー一覧を取得（選択肢用など）
     */
    public function getActiveUsers()
    {
        return $this->repository->findWithFilters(['status' => 'active'])->get();
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
