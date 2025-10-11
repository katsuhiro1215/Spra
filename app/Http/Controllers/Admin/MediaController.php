<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMediaRequest;
use App\Http\Requests\UpdateMediaRequest;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Media::with(['uploader']);

        // フィルタリング
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('folder')) {
            $query->where('folder', $request->folder);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('original_name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // ソート
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $media = $query->paginate(24)->withQueryString();

        // 統計情報
        $stats = [
            'total' => Media::count(),
            'images' => Media::images()->count(),
            'videos' => Media::videos()->count(),
            'documents' => Media::documents()->count(),
            'total_size' => Media::sum('size'),
        ];

        // フォルダ一覧
        $folders = Media::whereNotNull('folder')
            ->distinct()
            ->pluck('folder')
            ->sort()
            ->values();

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
            'stats' => $stats,
            'folders' => $folders,
            'filters' => $request->only(['type', 'folder', 'search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMediaRequest $request): RedirectResponse
    {
        $uploadedFiles = [];

        foreach ($request->file('files', []) as $file) {
            $mediaData = $this->processUploadedFile($file, $request);
            $media = Media::create($mediaData);
            $uploadedFiles[] = $media;
        }

        $count = count($uploadedFiles);
        return redirect()->back()->with('success', "{$count}個のファイルをアップロードしました。");
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $media): Response
    {
        $media->load(['uploader']);

        return Inertia::render('Admin/Media/Show', [
            'media' => $media,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMediaRequest $request, Media $media): RedirectResponse
    {
        $media->update($request->validated());

        return redirect()->back()->with('success', 'メディア情報を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media): RedirectResponse
    {
        // ファイルを削除
        if (Storage::disk($media->disk)->exists($media->path)) {
            Storage::disk($media->disk)->delete($media->path);
        }

        $media->delete();

        return redirect()->route('admin.media.index')
            ->with('success', 'メディアファイルを削除しました。');
    }

    /**
     * Bulk delete media files
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'media_ids' => 'required|array',
            'media_ids.*' => 'exists:media,id',
        ]);

        $mediaFiles = Media::whereIn('id', $request->media_ids)->get();

        foreach ($mediaFiles as $media) {
            // ファイルを削除
            if (Storage::disk($media->disk)->exists($media->path)) {
                Storage::disk($media->disk)->delete($media->path);
            }
            $media->delete();
        }

        $count = $mediaFiles->count();
        return redirect()->back()->with('success', "{$count}個のメディアファイルを削除しました。");
    }

    /**
     * Process uploaded file and create media data
     */
    private function processUploadedFile(UploadedFile $file, Request $request): array
    {
        $originalName = $file->getClientOriginalName();
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $type = Media::getTypeFromMime($mimeType);

        // フォルダパスを設定
        $folder = $request->get('folder', 'uploads');
        $path = $folder . '/' . $filename;

        // ファイルを保存
        $file->storeAs($folder, $filename, 'public');

        // 画像の場合、基本的なサイズ情報を取得（後で画像処理ライブラリで拡張）
        $dimensions = null;
        if ($type === 'image') {
            try {
                // getimagesize を使用してサイズ情報を取得
                $imageInfo = getimagesize($file->getPathname());
                if ($imageInfo) {
                    $dimensions = [
                        'width' => $imageInfo[0],
                        'height' => $imageInfo[1],
                    ];
                }
            } catch (\Exception $e) {
                // 画像処理エラーは無視
            }
        }

        return [
            'name' => pathinfo($originalName, PATHINFO_FILENAME),
            'original_name' => $originalName,
            'filename' => $filename,
            'path' => $path,
            'url' => Storage::url($path),
            'disk' => 'public',
            'mime_type' => $mimeType,
            'type' => $type,
            'size' => $size,
            'dimensions' => $dimensions,
            'folder' => $folder,
            'alt_text' => $request->get('alt_text'),
            'description' => $request->get('description'),
            'tags' => $request->get('tags') ? explode(',', $request->get('tags')) : null,
            'is_public' => $request->get('is_public', true),
            'uploaded_by' => auth('admin')->id(),
        ];
    }
}
