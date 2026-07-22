<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Requests\Media\UpdateMediaRequest;
use App\Models\Media;
use App\Models\MediaVariant;
use App\Repositories\MediaRepository;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(
        private MediaRepository $mediaRepository,
        private MediaService $mediaService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->query('search'),
            'type' => $request->query('type'),
            'format' => $request->query('format'),
            'usage_type' => $request->query('usage_type'),
        ];

        $sort = [
            'field' => $request->query('sort_field', 'created_at'),
            'direction' => $request->query('sort_direction', 'desc'),
        ];

        $mediaList = $this->mediaService->getPaginatedMedia(
            $filters,
            $sort,
            20
        );

        // 統計情報を取得
        $stats = $this->mediaService->getStats();

        return Inertia::render('Admin/Media/Index', [
            'mediaList' => $mediaList,
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Media/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMediaRequest $request)
    {
        try {
            $adminId = Auth::guard('admins')->id();

            $media = $this->mediaService->uploadImage(
                $request->file('image'),
                $request->validated(),
                $adminId
            );

            // Ajaxリクエストの場合はJSONを返す（モーダルからのアップロード用）
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'media' => $media,
                    'message' => __('messages.media.uploaded_variants_processing'),
                ]);
            }

            return redirect()
                ->route('admin.media.show', $media)
                ->with('success', __('messages.media.uploaded_variants_processing'));
        } catch (\Exception $e) {
            // Ajaxリクエストの場合はJSONエラーを返す
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => __('messages.action_failed_detail', ['attribute' => 'メディアのアップロード', 'message' => $e->getMessage()]),
                ], 422);
            }

            return back()
                ->withInput()
                ->with('error', __('messages.action_failed_detail', ['attribute' => 'メディアのアップロード', 'message' => $e->getMessage()]));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $medium): Response
    {
        $medium->load('variants');

        return Inertia::render('Admin/Media/Show', [
            'media' => $medium,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Media $medium): Response
    {
        $medium->load('variants');

        return Inertia::render('Admin/Media/Edit', [
            'media' => $medium,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMediaRequest $request, Media $media)
    {
        try {
            $this->mediaRepository->update($media->id, $request->validated());

            return back()->with('success', __('messages.updated', ['attribute' => 'メディア情報']));
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', __('messages.action_failed_detail', ['attribute' => 'メディア情報の更新', 'message' => $e->getMessage()]));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media)
    {
        try {
            $this->mediaService->deleteMedia($media->id);

            return redirect()
                ->route('admin.media.index')
                ->with('success', __('messages.deleted', ['attribute' => 'メディア']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'メディアの削除', 'message' => $e->getMessage()]));
        }
    }

    /**
     * Create custom variant with cropping
     */
    public function createVariant(Request $request, Media $media)
    {
        $validated = $request->validate([
            'custom_name' => ['required', 'string', 'max:50'],
            'target_width' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'target_height' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'quality' => ['nullable', 'integer', 'min:1', 'max:100'],
            'crop_data' => ['nullable', 'array'],
            'crop_data.x' => ['nullable', 'integer', 'min:0'],
            'crop_data.y' => ['nullable', 'integer', 'min:0'],
            'crop_data.width' => ['nullable', 'integer', 'min:1'],
            'crop_data.height' => ['nullable', 'integer', 'min:1'],
        ]);

        try {
            $variant = $this->mediaService->createCustomVariant(
                $media,
                $validated['custom_name'],
                $validated['target_width'] ?? null,
                $validated['target_height'] ?? null,
                $validated['quality'] ?? null,
                $validated['crop_data'] ?? null
            );

            return back()->with('success', __('messages.created', ['attribute' => 'カスタムバリアント']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'バリアントの作成', 'message' => $e->getMessage()]));
        }
    }

    /**
     * バリアント削除
     */
    public function destroyVariant(Media $media, MediaVariant $variant)
    {
        abort_unless($variant->media_id === $media->id, 404);

        try {
            $this->mediaService->deleteVariant($variant);

            return back()->with('success', __('messages.deleted', ['attribute' => 'バリアント']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'バリアントの削除', 'message' => $e->getMessage()]));
        }
    }
}
