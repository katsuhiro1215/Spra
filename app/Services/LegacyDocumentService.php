<?php

namespace App\Services;

use App\Models\LegacyDocument;
use App\Repositories\Contracts\LegacyDocumentRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class LegacyDocumentService extends BaseService
{
    public function __construct(LegacyDocumentRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'LegacyDocument';
    }

    public function register(array $data, ?UploadedFile $file, ?string $creatorId): LegacyDocument
    {
        return DB::transaction(function () use ($data, $file, $creatorId) {
            $disk = 'private';
            $path = $file ? $file->store('legacy-documents', $disk) : null;

            return $this->repository->create([
                'document_type' => $data['document_type'],
                'client_name' => $data['client_name'],
                'issued_at' => $data['issued_at'],
                'total_amount' => $data['total_amount'],
                'disk' => $disk,
                'pdf_path' => $path,
                'notes' => $data['notes'] ?? null,
                'created_by' => $creatorId,
            ]);
        });
    }

    /**
     * @param LegacyDocument $model
     */
    public function delete(mixed $model): bool
    {
        return DB::transaction(function () use ($model) {
            if ($model->pdf_path) {
                Storage::disk($model->disk)->delete($model->pdf_path);
            }

            return $this->repository->delete($model);
        });
    }
}
