<?php

namespace App\Services;

use App\Models\User;
use App\Mail\UserCreatedMail;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UserService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param UserRepository $repository
     */
    public function __construct(UserRepository $repository)
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
        return 'User';
    }

    /**
     * エクスポート用にフィルタ条件を適用したクエリを取得（一覧画面と同じ条件を使い回す）
     */
    public function getForExport(array $filters = []): \Illuminate\Database\Eloquent\Builder
    {
        return $this->repository->findWithFilters($filters);
    }

    /**
     * 新しいユーザーを作成（ランダムパスワード自動生成）
     *
     * @param array $data
     * @return array
     * @throws \Exception
     */
    public function createUser(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // パスワードポリシー（英大小文字・数字必須）を確実に満たすよう生成する
            $randomPassword = Str::password(12, letters: true, numbers: true, symbols: false);

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
                Log::error('User creation email failed: ' . $e->getMessage());
                // メール送信失敗してもuser作成は成功とする
            }

            return [
                'user'    => $user->load('profile'),
                'password' => $randomPassword,
            ];
        });
    }

    /**
     * ユーザー情報を更新
     * 
     * @param User $user
     * @param array $data
     * @return User
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

            $updated = $this->repository->update($user, $updateData);

            $this->logInfo('updated', $updated->id);

            return $updated->fresh();
        });
    }

    /**
     * ユーザーを削除（自分自身は不可）
     * 
     * @param User $user
     * @param string $currentUserId
     * @return bool
     * @throws \Exception
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
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveUsers()
    {
        return $this->repository->findWithFilters(['status' => 'active'])->get();
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
