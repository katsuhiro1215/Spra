<?php

namespace App\Exports;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UserExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    private const STATUS_LABELS = [
        'active' => '有効',
        'inactive' => '無効',
        'suspended' => '停止中',
    ];

    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        return app(UserService::class)->getForExport($this->filters);
    }

    public function headings(): array
    {
        return [
            'ID',
            'メールアドレス',
            '氏名',
            '電話番号',
            'ステータス',
            '最終ログイン日時',
            '登録日時',
        ];
    }

    public function map($user): array
    {
        /** @var User $user */
        return [
            $user->id,
            $user->email,
            $user->profile?->full_name,
            $user->profile?->phone,
            self::STATUS_LABELS[$user->status] ?? $user->status,
            $user->last_login_at?->format('Y-m-d H:i:s'),
            $user->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
