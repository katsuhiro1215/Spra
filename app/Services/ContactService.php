<?php

namespace App\Services;

use App\Models\Contact;
use App\Repositories\ContactRepository;
use Illuminate\Support\Facades\DB;

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
     * 未読お問い合わせ件数を取得
     * 
     * @return int
     */
    public function getUnreadCount(): int
    {
        return $this->repository->getUnreadCount();
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            'new' => '新規',
            'in_progress' => '対応中',
            'replied' => '返信済み',
            'closed' => '完了',
        ];
    }

    /**
     * ソース定義を取得
     * 
     * @return array
     */
    public function getSources(): array
    {
        return [
            'web' => 'Webサイト',
            'phone' => '電話',
            'email' => 'メール',
            'sns' => 'SNS',
            'referral' => '紹介',
            'other' => 'その他',
        ];
    }
}
