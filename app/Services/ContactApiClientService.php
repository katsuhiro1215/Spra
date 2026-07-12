<?php

namespace App\Services;

use App\Models\ContactApiClient;
use App\Repositories\ContactApiClientRepository;
use Illuminate\Support\Facades\DB;

class ContactApiClientService extends BaseService
{
    public function __construct(ContactApiClientRepository $repository)
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
        return 'ContactApiClient';
    }

    /**
     * 新しいAPIクライアントを作成する
     * 平文キーはレスポンスのために一度だけ返す
     *
     * @param array $data
     * @param string|null $adminId
     * @return array{client: ContactApiClient, plainKey: string}
     */
    public function createWithKey(array $data, ?string $adminId): array
    {
        return DB::transaction(function () use ($data, $adminId) {
            $generated = ContactApiClient::generateKey();

            $client = $this->repository->create([
                'name' => $data['name'],
                'api_key_hash' => $generated['hash'],
                'key_preview' => $generated['preview'],
                'is_active' => true,
                'created_by' => $adminId,
            ]);

            $this->logInfo('created', $client->id);

            return ['client' => $client, 'plainKey' => $generated['plainKey']];
        });
    }

    /**
     * APIキーを再発行する(旧キーは即失効)
     *
     * @param ContactApiClient $client
     * @return array{client: ContactApiClient, plainKey: string}
     */
    public function regenerateKey(ContactApiClient $client): array
    {
        return DB::transaction(function () use ($client) {
            $generated = ContactApiClient::generateKey();

            $client->update([
                'api_key_hash' => $generated['hash'],
                'key_preview' => $generated['preview'],
            ]);

            $this->logInfo('key_regenerated', $client->id);

            return ['client' => $client->fresh(), 'plainKey' => $generated['plainKey']];
        });
    }
}
