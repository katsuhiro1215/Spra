<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Media;
use App\Models\Admin;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating media...');

        // 管理者（作成者として使用）
        $admin = Admin::where('email', 'katsuhiro.k1215@gmail.com')->first();

        if (!$admin) {
            $this->command->warn('Admin not found. Skipping media seeding.');
            return;
        }

        // Picsumから画像をダウンロードして保存
        $images = [
            ['title' => 'ビーチの風景', 'width' => 1920, 'height' => 1080, 'id' => 1],
            ['title' => '山の風景', 'width' => 1920, 'height' => 1080, 'id' => 10],
            ['title' => '都市の夜景', 'width' => 1920, 'height' => 1080, 'id' => 20],
            ['title' => '森の風景', 'width' => 1920, 'height' => 1080, 'id' => 30],
            ['title' => '花の接写', 'width' => 1200, 'height' => 800, 'id' => 40],
            ['title' => 'コーヒーカップ', 'width' => 1200, 'height' => 800, 'id' => 50],
            ['title' => 'ノートパソコン', 'width' => 1200, 'height' => 800, 'id' => 60],
            ['title' => 'プロフィール画像1', 'width' => 400, 'height' => 400, 'id' => 70],
            ['title' => 'プロフィール画像2', 'width' => 400, 'height' => 400, 'id' => 80],
            ['title' => 'プロフィール画像3', 'width' => 400, 'height' => 400, 'id' => 90],
        ];

        $manager = new ImageManager(new Driver());
        $date = now();

        foreach ($images as $imageData) {
            try {
                $this->command->info("Downloading: {$imageData['title']}");

                // Picsum APIから画像を取得
                $url = "https://picsum.photos/{$imageData['width']}/{$imageData['height']}?random={$imageData['id']}";
                $response = Http::timeout(30)->get($url);

                if ($response->successful()) {
                    // 画像を処理してWebP形式で保存
                    $image = $manager->read($response->body());

                    $width = $image->width();
                    $height = $image->height();

                    // WebP圧縮（品質85%）
                    $encoded = $image->toWebp(85);

                    // ファイル名とパス
                    $filename = Str::ulid()->toBase32() . '.webp';
                    $path = sprintf('media/originals/%s/%s/%s', $date->format('Y'), $date->format('m'), $filename);

                    // ストレージに保存
                    Storage::disk('public')->put($path, (string) $encoded);

                    // ハッシュ計算
                    $hash = hash('sha256', $encoded);

                    // Mediaレコード作成
                    Media::create([
                        'title' => $imageData['title'],
                        'description' => "{$imageData['title']}の画像",
                        'alt_text' => $imageData['title'],
                        'type' => 'image',
                        'mime_type' => 'image/webp',
                        'original_file_size' => strlen($encoded),
                        'original_hash' => $hash,
                        'original_path' => $path,
                        'original_filename' => $filename,
                        'original_width' => $width,
                        'original_height' => $height,
                        'quality' => 85,
                        'format' => 'webp',
                        'is_processing' => false,
                        'is_processed' => true,
                        'usage_count' => 0,
                        'last_used_at' => now(),
                        'created_by' => $admin->id,
                        'updated_by' => $admin->id,
                    ]);

                    $this->command->info("✓ Created: {$imageData['title']}");
                } else {
                    $this->command->warn("✗ Failed to download {$imageData['title']}: HTTP {$response->status()}");
                }
            } catch (\Exception $e) {
                $this->command->warn("✗ Failed to create {$imageData['title']}: " . $e->getMessage());
            }
        }

        $this->command->info('Total media: ' . Media::count());
    }
}
