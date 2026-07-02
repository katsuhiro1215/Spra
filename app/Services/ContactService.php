<?php

namespace App\Services;

use App\Models\Contact;
use App\Repositories\ContactRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactService extends BaseService
{
    /**
     * コンストラクタ
     *
     * @param ContactRepository $repository
     */
    public function __construct(ContactRepository $repository)
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
        return 'Contact';
    }

    /**
     * 新しいお問い合わせを作成
     *
     * @param array $data
     * @return Contact
     * @throws \Exception
     */
    public function createContact(array $data): Contact
    {
        return DB::transaction(function () use ($data) {
            $contact = $this->repository->create($data);

            $this->logInfo('created', $contact->id);

            return $contact;
        });
    }

    /**
     * お問い合わせを更新
     *
     * @param Contact $contact
     * @param array $data
     * @return Contact
     */
    public function updateContact(Contact $contact, array $data): Contact
    {
        return DB::transaction(function () use ($contact, $data) {
            // ステータスに応じて responded_at を自動設定
            $this->repository->setResponseDateIfNeeded($contact, $data);

            $this->repository->update($contact, $data);

            $this->logInfo('updated', $contact->id);

            return $contact->fresh();
        });
    }

    /**
     * お問い合わせを削除
     *
     * @param Contact $contact
     * @throws \Exception
     */
    public function deleteContact(Contact $contact): void
    {
        DB::transaction(function () use ($contact) {
            $this->repository->delete($contact);

            $this->logInfo('deleted', $contact->id);
        });
    }

    /**
     * Admin用にページネーション付きリストを取得
     *
     * @param array $filters
     * @param array $sort
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedForAdmin(
        array $filters = [],
        array $sort = [],
        int $perPage = 20
    ): LengthAwarePaginator {
        return $this->getPaginated($filters, $sort, $perPage);
    }

    /**
     * Admin用の統計情報を取得
     *
     * @return array
     */
    public function getStatsForAdmin(): array
    {
        return $this->repository->getStats();
    }

    /**
     * 複数のお問い合わせのステータスを一括更新
     *
     * @param array $contactIds
     * @param array $data
     * @return int
     * @throws \Exception
     */
    public function bulkUpdateStatus(array $contactIds, array $data): int
    {
        if (empty($contactIds)) {
            throw new \Exception('更新対象のお問い合わせが指定されていません。');
        }

        if (empty($data['status'])) {
            throw new \Exception('ステータスが指定されていません。');
        }

        return DB::transaction(function () use ($contactIds, $data) {
            // ステータスが返信済み、解決済み、クローズの場合は responded_at を設定
            if (in_array($data['status'], ['replied', 'resolved', 'closed'])) {
                $data['responded_at'] = now();
            }

            $updatedCount = $this->repository->updateBulk($contactIds, $data);

            $this->logInfo('bulk_updated', implode(',', $contactIds));

            return $updatedCount;
        });
    }

    /**
     * お問い合わせデータをエクスポート用に取得
     *
     * @param array $filters
     * @param array $sort
     * @return array
     */
    public function getForExport(array $filters = [], array $sort = []): array
    {
        $query = $this->repository->findWithFilters($filters);
        $query = $this->repository->applySorting(
            $query,
            $sort['field'] ?? 'created_at',
            $sort['direction'] ?? 'desc'
        );

        return $query->get()->toArray();
    }

    /**
     * メールアドレスで検索
     *
     * @param string $email
     * @return Contact|null
     */
    public function findByEmail(string $email): ?Contact
    {
        return $this->repository->findByEmail($email);
    }

    /**
     * 未読件数を取得
     *
     * @return int
     */
    public function getUnreadCount(): int
    {
        return $this->repository->getUnreadCount();
    }
}
