<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreUserMediaRequest;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    public function __construct(
        private MediaService $mediaService,
    ) {}

    /**
     * プロフィール画像などのアップロード（ユーザー自身用）
     */
    public function store(StoreUserMediaRequest $request): JsonResponse
    {
        try {
            $media = $this->mediaService->uploadImage(
                $request->file('image'),
                $request->validated(),
            );

            return response()->json([
                'success' => true,
                'media' => $media,
                'message' => '画像をアップロードしました。',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '画像のアップロードに失敗しました: ' . $e->getMessage(),
            ], 422);
        }
    }
}
