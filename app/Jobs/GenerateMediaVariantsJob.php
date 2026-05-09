<?php

namespace App\Jobs;

use App\Models\Media;
use App\Models\MediaSetting;
use App\Repositories\MediaVariantRepository;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class GenerateMediaVariantsJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private string $mediaId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $media = Media::find($this->mediaId);
        if (!$media) {
            return;
        }

        $settings = MediaSetting::first() ?? MediaSetting::create([
            'max_file_size_kb' => 5120,
            'max_total_storage_mb' => 1024,
            'auto_compress' => true,
            'compression_quality' => 85,
            'output_format' => 'webp',
            'large_width' => 1024,
            'large_height' => 1024,
            'medium_width' => 768,
            'medium_height' => 768,
            'small_width' => 300,
            'small_height' => 300,
            'generate_large' => true,
            'generate_medium' => true,
            'generate_small' => true,
            'allow_video_upload' => false,
            'max_video_size_mb' => 50,
            'max_video_duration_seconds' => 60,
        ]);
        $variantRepository = app(MediaVariantRepository::class);

        try {
            // オリジナル画像読み込み
            $originalContent = Storage::disk('public')->get($media->original_path);
            $manager = new ImageManager(new Driver());

            // Large生成
            if ($settings->generate_large) {
                $this->generateVariant(
                    $media,
                    $manager,
                    $originalContent,
                    'large',
                    $settings->large_width,
                    $settings->large_height,
                    $settings->compression_quality,
                    $settings->output_format,
                    $variantRepository
                );
            }

            // Medium生成
            if ($settings->generate_medium) {
                $this->generateVariant(
                    $media,
                    $manager,
                    $originalContent,
                    'medium',
                    $settings->medium_width,
                    $settings->medium_height,
                    $settings->compression_quality,
                    $settings->output_format,
                    $variantRepository
                );
            }

            // Small生成
            if ($settings->generate_small) {
                $this->generateVariant(
                    $media,
                    $manager,
                    $originalContent,
                    'small',
                    $settings->small_width,
                    $settings->small_height,
                    $settings->compression_quality,
                    $settings->output_format,
                    $variantRepository
                );
            }

            // 処理完了フラグ
            $media->update([
                'is_processed' => true,
                'is_processing' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('バリアント生成エラー', [
                'media_id' => $this->mediaId,
                'error' => $e->getMessage(),
            ]);

            $media->update(['is_processing' => false]);
        }
    }

    /**
     * バリアント生成
     */
    private function generateVariant(
        Media $media,
        ImageManager $manager,
        string $originalContent,
        string $size,
        int $targetWidth,
        int $targetHeight,
        int $quality,
        string $format,
        MediaVariantRepository $repository
    ): void {
        // 既存バリアントチェック
        if ($repository->findBySize($media->id, $size)) {
            return;
        }

        // 画像読み込み＆リサイズ
        $image = $manager->read($originalContent);
        $image = $image->scale(width: $targetWidth, height: $targetHeight);

        // パス生成
        $filename = pathinfo($media->original_path, PATHINFO_FILENAME);
        $path = sprintf(
            'media/variants/%s/%s_%s.%s',
            now()->format('Y/m'),
            $filename,
            $size,
            $format
        );

        // 保存
        $encoded = $image->toWebp($quality);
        Storage::disk('public')->put($path, (string) $encoded);

        // MediaVariant作成
        $repository->create([
            'media_id' => $media->id,
            'size' => $size,
            'path' => $path,
            'file_size' => strlen($encoded),
            'width' => $image->width(),
            'height' => $image->height(),
            'quality' => $quality,
            'maintain_aspect_ratio' => true,
        ]);
    }
}
