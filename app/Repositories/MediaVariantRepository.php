<?php

namespace App\Repositories;

use App\Models\MediaVariant;
use Illuminate\Database\Eloquent\Collection;

class MediaVariantRepository
{
  /**
   * メディアIDでバリアント取得
   */
  public function getByMediaId(string $mediaId): Collection
  {
    return MediaVariant::where('media_id', $mediaId)
      ->orderBy('size')
      ->get();
  }

  /**
   * 特定サイズのバリアント取得
   */
  public function findBySize(string $mediaId, string $size, ?string $customName = null): ?MediaVariant
  {
    $query = MediaVariant::where('media_id', $mediaId)
      ->where('size', $size);

    if ($customName) {
      $query->where('custom_name', $customName);
    }

    return $query->first();
  }

  /**
   * 作成
   */
  public function create(array $data): MediaVariant
  {
    return MediaVariant::create($data);
  }

  /**
   * 更新
   */
  public function update(MediaVariant $variant, array $data): bool
  {
    return $variant->update($data);
  }

  /**
   * 削除
   */
  public function delete(MediaVariant $variant): bool
  {
    return $variant->delete();
  }

  /**
   * メディアの全バリアント削除
   */
  public function deleteByMediaId(string $mediaId): int
  {
    return MediaVariant::where('media_id', $mediaId)->delete();
  }
}
