<?php

namespace Tests\Unit;

use App\Models\Media;
use App\Models\MediaVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MediaUrlAccessorTest extends TestCase
{
    use RefreshDatabase;

    public function test_original_url_uses_public_disk_even_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $media = Media::create([
            'title' => 'テスト画像',
            'type' => 'image',
            'mime_type' => 'image/webp',
            'original_file_size' => 100,
            'original_hash' => 'hash',
            'original_path' => 'media/test/original.webp',
            'original_filename' => 'original.webp',
            'is_processed' => true,
        ]);

        // 以前はconfig('app.env')==='production'の場合に未導入のs3ディスクを
        // 参照しようとしClass not foundで例外になっていた(回帰テスト)。
        $this->assertStringContainsString('/storage/media/test/original.webp', $media->original_url);
    }

    public function test_variant_url_uses_public_disk_even_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $media = Media::create([
            'title' => 'テスト画像',
            'type' => 'image',
            'mime_type' => 'image/webp',
            'original_file_size' => 100,
            'original_hash' => 'hash',
            'original_path' => 'media/test/original.webp',
            'original_filename' => 'original.webp',
            'is_processed' => true,
        ]);

        $variant = MediaVariant::create([
            'media_id' => $media->id,
            'size' => 'medium',
            'path' => 'media/test/medium.webp',
            'width' => 800,
            'height' => 600,
            'file_size' => 50,
            'format' => 'webp',
        ]);

        $this->assertStringContainsString('/storage/media/test/medium.webp', $variant->url);
        $this->assertStringContainsString('/storage/media/test/medium.webp', $media->getVariantUrl('medium'));
    }
}
