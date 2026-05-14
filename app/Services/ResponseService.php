<?php

namespace App\Services;

use App\Models\Response;
use App\Repositories\ResponseRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactResponseMail;

class ResponseService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param ResponseRepository $repository
     */
    public function __construct(ResponseRepository $repository)
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
        return 'Response';
    }

    /**
     * Contactに関連するResponseを取得
     * 
     * @param string $contactId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByContact(string $contactId)
    {
        return $this->repository->getByContact($contactId);
    }

    /**
     * 新しいResponseを作成（下書き）
     * 
     * @param array $data
     * @return Response
     * @throws \Exception
     */
    public function createResponse(array $data): Response
    {
        return DB::transaction(function () use ($data) {
            // プレースホルダー置換（テンプレート使用時）
            if (!empty($data['response_template_id'])) {
                $response = $this->repository->create($data);

                // プレースホルダー置換
                $response->subject = $response->replacePlaceholders($response->subject);
                $response->body = $response->replacePlaceholders($response->body);
                $response->save();

                return $response;
            }

            return $this->repository->create($data);
        });
    }

    /**
     * Responseを更新
     * 
     * @param Response $response
     * @param array $data
     * @return Response
     */
    public function updateResponse(Response $response, array $data): Response
    {
        return DB::transaction(function () use ($response, $data) {
            $this->repository->update($response, $data);
            return $response->fresh();
        });
    }

    /**
     * Responseを削除
     * 
     * @param Response $response
     * @throws \Exception
     */
    public function deleteResponse(Response $response): void
    {
        // 送信済みの返答は削除できない
        if ($response->isSent()) {
            throw new \Exception('送信済みの返答は削除できません。');
        }

        DB::transaction(function () use ($response) {
            $this->repository->delete($response);
        });
    }

    /**
     * Responseを送信
     * 
     * @param Response $response
     * @return bool
     */
    public function sendResponse(Response $response): bool
    {
        try {
            // メール送信
            Mail::to($response->recipient_email)
                ->send(new ContactResponseMail($response));

            // 送信済みにマーク
            $response->markAsSent();

            // Contactのステータスを更新
            $contact = $response->contact;
            if ($contact->status === 'new') {
                $contact->update([
                    'status' => 'replied',
                    'responded_at' => now(),
                ]);
            }

            $this->logInfo('sent', $response->id, [
                'contact_id' => $response->contact_id,
                'recipient' => $response->recipient_email,
            ]);

            return true;
        } catch (\Exception $e) {
            // エラーを記録
            $response->recordSendError($e->getMessage());

            $this->logError('send_failed', $e, $response->id, [
                'contact_id' => $response->contact_id,
                'recipient' => $response->recipient_email,
            ]);

            throw $e;
        }
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            'draft' => '下書き',
            'sent' => '送信済み',
        ];
    }
}
