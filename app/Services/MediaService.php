<?php

namespace App\Services;

use App\Jobs\GenerateMediaVariantsJob;
use App\Models\Media;
use App\Models\MediaVariant;
use App\Repositories\MediaRepository;
use App\Repositories\MediaSettingsRepository;
use App\Repositories\MediaVariantRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class MediaService
{
    public function __construct(
        private MediaRepository $mediaRepository,
        private MediaVariantRepository $variantRepository,
        private MediaSettingsRepository $settingsRepository
    ) {}

    /**
     * ページネーション付きでメディアを取得
     */
    public function getPaginatedMedia(array $filters, array $sort, int $perPage = 20): LengthAwarePaginator
    {
        $query = $this->mediaRepository->query();

        // フィルター適用
        if (!empty($filters['search'])) {
            $query = $this->mediaRepository->buildSearchQuery($query, $filters['search']);
        }

        if (!empty($filters['type'])) {
            $query = $this->mediaRepository->buildTypeFilter($query, $filters['type']);
        }

        if (!empty($filters['format'])) {
            $query = $this->mediaRepository->buildFormatFilter($query, $filters['format']);
        }

        // usage_type フィルター（プロフィール画像など）
        if (!empty($filters['usage_type'])) {
            $query = $this->mediaRepository->buildUsageTypeFilter($query, $filters['usage_type']);
        }

        // ソートを適用
        $sortField = $sort['field'] ?? 'created_at';
        $sortDirection = $sort['direction'] ?? 'desc';
        $query = $this->mediaRepository->applySorting($query, $sortField, $sortDirection);

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * メディア統計情報を取得
     */
    public function getStats(): array
    {
        return [
            'total' => $this->mediaRepository->getTotalCount(),
            'images' => $this->mediaRepository->getCountByType('image'),
            'videos' => $this->mediaRepository->getCountByType('video'),
            'models' => $this->mediaRepository->getCountByType('3d_model'),
            'total_size' => $this->mediaRepository->getTotalSize(),
            'profile_images' => $this->mediaRepository->getProfileImageCount(),
            'admin_profile_images' => $this->mediaRepository->getProfileImageCount('Admin'),
            'user_profile_images' => $this->mediaRepository->getProfileImageCount('User'),
            'this_month' => $this->mediaRepository->getThisMonthCount(),
        ];
    }

    /**
     * 画像アップロード＆自動バリアント生成
     */
    public function uploadImage(UploadedFile $file, array $data, ?string $adminId = null): Media
    {
        DB::beginTransaction();

        try {
            // 1. 設定取得
            $settings = $this->settingsRepository->get();

            // 2. バリデーション
            $this->validateFileSize($file, $settings);

            // 3. 重複チェック（ハッシュ）
            $hash = hash_file('sha256', $file->getRealPath());
            if ($existing = $this->mediaRepository->findByHash($hash)) {
                $existing->incrementUsage();
                DB::commit();
                return $existing;
            }

            // 4. オリジナル保存（圧縮）
            $uploadResult = $this->saveOriginal($file, $settings);

            // 5. Media作成
            $media = $this->mediaRepository->create([
                'title' => $data['title'] ?? $file->getClientOriginalName(),
                'description' => $data['description'] ?? null,
                'alt_text' => $data['alt_text'] ?? null,
                'type' => 'image',
                'mime_type' => $file->getMimeType(),
                'original_file_size' => $uploadResult['size'],
                'original_hash' => $hash,
                'original_path' => $uploadResult['path'],
                'original_filename' => $file->getClientOriginalName(),
                'original_width' => $uploadResult['width'],
                'original_height' => $uploadResult['height'],
                'quality' => $settings->compression_quality,
                'format' => $settings->output_format,
                'is_processing' => true,
                'is_processed' => false,
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            // 6. バリアント生成（ジョブに投げる）
            GenerateMediaVariantsJob::dispatch($media->id);

            DB::commit();
            return $media;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * オリジナル画像を保存（圧縮）
     */
    private function saveOriginal(UploadedFile $file, $settings): array
    {
        $manager = new ImageManager(new Driver());
        $image = $manager->read($file->path());

        // オリジナルサイズ取得
        $width = $image->width();
        $height = $image->height();

        // パス生成: media/originals/2026/02/a8f9c2d3.webp
        $date = now();
        $filename = Str::ulid()->toBase32() . '.' . $settings->output_format;
        $path = sprintf(
            'media/originals/%s/%s',
            $date->format('Y/m'),
            $filename
        );

        // 圧縮＆保存
        if ($settings->auto_compress) {
            $encoded = $image->toWebp($settings->compression_quality);
        } else {
            $encoded = $image->toWebp(100);
        }

        Storage::disk('public')->put($path, (string) $encoded);

        return [
            'path' => $path,
            'width' => $width,
            'height' => $height,
            'size' => strlen($encoded),
        ];
    }

    /**
     * カスタムバリアント作成（トリミング機能）
     */
    public function createCustomVariant(
        Media $media,
        string $customName,
        ?int $targetWidth = null,
        ?int $targetHeight = null,
        ?int $quality = null,
        ?array $cropData = null
    ): MediaVariant {
        DB::beginTransaction();

        try {
            $settings = $this->settingsRepository->get();

            // オリジナル画像読み込み
            $originalContent = Storage::disk('public')->get($media->original_path);
            $manager = new ImageManager(new Driver());
            $image = $manager->read($originalContent);

            // トリミング
            if ($cropData && isset($cropData['width']) && $cropData['width'] > 0) {
                $image = $image->crop(
                    $cropData['width'],
                    $cropData['height'],
                    $cropData['x'] ?? 0,
                    $cropData['y'] ?? 0
                );
            }

            // リサイズ
            if ($targetWidth || $targetHeight) {
                $image = $image->scale(width: $targetWidth, height: $targetHeight);
            }

            // パス生成
            $filename = pathinfo($media->original_path, PATHINFO_FILENAME);
            $path = sprintf(
                'media/variants/%s/%s_%s.%s',
                now()->format('Y/m'),
                $filename,
                $customName,
                $settings->output_format
            );

            // 保存
            $compressionQuality = $quality ?? $settings->compression_quality;
            $encoded = $image->toWebp($compressionQuality);
            Storage::disk('public')->put($path, (string) $encoded);

            // MediaVariant作成
            $variant = $this->variantRepository->create([
                'media_id' => $media->id,
                'size' => 'custom',
                'custom_name' => $customName,
                'path' => $path,
                'file_size' => strlen($encoded),
                'width' => $image->width(),
                'height' => $image->height(),
                'crop_x' => $cropData['x'] ?? null,
                'crop_y' => $cropData['y'] ?? null,
                'crop_width' => $cropData['width'] ?? null,
                'crop_height' => $cropData['height'] ?? null,
                'crop_position' => $cropData['position'] ?? 'center',
                'quality' => $compressionQuality,
                'maintain_aspect_ratio' => true,
            ]);

            DB::commit();
            return $variant;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * メディア削除（ファイルも削除）
     */
    public function deleteMedia(Media $media): bool
    {
        DB::beginTransaction();

        try {
            // オリジナルファイル削除
            if (Storage::disk('public')->exists($media->original_path)) {
                Storage::disk('public')->delete($media->original_path);
            }

            // バリアントファイル削除
            foreach ($media->variants as $variant) {
                if (Storage::disk('public')->exists($variant->path)) {
                    Storage::disk('public')->delete($variant->path);
                }
            }

            // DB削除
            $this->variantRepository->deleteByMediaId($media->id);
            $this->mediaRepository->delete($media);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * ファイルサイズバリデーション
     */
    private function validateFileSize(UploadedFile $file, $settings): void
    {
        $fileSizeKb = $file->getSize() / 1024;
        if ($fileSizeKb > $settings->max_file_size_kb) {
            throw new \Exception(sprintf(
                'ファイルサイズが上限（%dMB）を超えています。',
                $settings->max_file_size_kb / 1024
            ));
        }
    }
}
