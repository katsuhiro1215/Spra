<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Log;

class ImageService
{
    /**
     * 画像をアップロードしてリサイズ
     *
     * @param UploadedFile|array $imageFile アップロードされた画像ファイル
     * @param string $folderName 保存先フォルダ名
     * @param int $width リサイズ後の幅
     * @param int $height リサイズ後の高さ
     * @param bool $maintainAspectRatio アスペクト比を保持するか（デフォルト: true）
     * @return string 保存された画像のパス（/storage/...形式）
     * @throws \Exception
     */
    public static function upload($imageFile, $folderName, $width, $height, $maintainAspectRatio = true)
    {
        try {
            $file = is_array($imageFile) ? $imageFile['image'] : $imageFile;

            if (!$file instanceof UploadedFile) {
                throw new \Exception('有効なファイルではありません。');
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->path());

            $fileName = self::generateFileName($file);

            // アスペクト比を保持してリサイズ
            if ($maintainAspectRatio) {
                $image = $image->scale(width: $width, height: $height);
            } else {
                $image = $image->resize($width, $height);
            }

            $resizedImage = $image->encode();

            $path = $folderName . '/' . $fileName;

            // ディレクトリが存在しない場合は作成
            $directory = dirname($path);
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }

            // デバッグ用ログ
            Log::info('画像アップロード開始', [
                'path' => $path,
                'full_path' => Storage::disk('public')->path($path),
                'size' => strlen($resizedImage),
                'folder' => $folderName,
                'filename' => $fileName,
                'directory_exists' => Storage::disk('public')->exists($directory)
            ]);

            $result = Storage::disk('public')->put($path, (string)$resizedImage);

            if (!$result) {
                throw new \Exception('ファイルの保存に失敗しました。');
            }

            // 保存確認
            if (Storage::disk('public')->exists($path)) {
                Log::info('画像アップロード成功', [
                    'path' => $path,
                    'file_size' => Storage::disk('public')->size($path)
                ]);
            } else {
                throw new \Exception('ファイルは保存されましたが、確認できません。');
            }

            // 相対パスのみを返す（/storage/は付けない）
            return $path;
        } catch (\Exception $e) {
            Log::error('画像アップロードエラー', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('画像のアップロードに失敗しました。' . $e->getMessage());
        }
    }

    /**
     * ユニークなファイル名を生成
     *
     * @param UploadedFile $file
     * @return string
     */
    private static function generateFileName($file)
    {
        return time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
    }

    /**
     * 画像を削除
     *
     * @param string|null $path 画像の相対パス
     * @return bool
     */
    public static function delete(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        try {
            // 旧形式の/storage/プレフィックスがある場合は削除
            $relativePath = str_replace('/storage/', '', $path);
            return Storage::disk('public')->delete($relativePath);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * ユーザー画像をアップロード（320x240）
     *
     * @param UploadedFile|array $imageFile
     * @param string $folderName
     * @return string
     */
    public static function uploadUser($imageFile, $folderName)
    {
        return self::upload($imageFile, $folderName, 320, 240);
    }

    /**
     * 大サイズサムネイルをアップロード（1920x1080）
     *
     * @param UploadedFile|array $imageFile
     * @param string $folderName
     * @return string
     */
    public static function uploadBigThumbnail($imageFile, $folderName)
    {
        return self::upload($imageFile, $folderName, 1920, 1080);
    }

    /**
     * 中サイズサムネイルをアップロード（880x640）
     *
     * @param UploadedFile|array $imageFile
     * @param string $folderName
     * @return string
     */
    public static function uploadMiddleThumbnail($imageFile, $folderName)
    {
        return self::upload($imageFile, $folderName, 880, 640);
    }

    /**
     * 小サイズサムネイルをアップロード（640x480）
     *
     * @param UploadedFile|array $imageFile
     * @param string $folderName
     * @return string
     */
    public static function uploadSmallThumbnail($imageFile, $folderName)
    {
        return self::upload($imageFile, $folderName, 640, 480);
    }

    /**
     * ロゴ画像をアップロード（120x120）
     *
     * @param UploadedFile|array $imageFile
     * @param string $folderName
     * @return string
     */
    public static function uploadLogo($imageFile, $folderName)
    {
        return self::upload($imageFile, $folderName, 120, 120);
    }
}
