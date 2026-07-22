<?php

namespace App\Exports;

use App\Models\Contract;
use App\Services\ContractService;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ContractExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        return app(ContractService::class)->getForExport($this->filters);
    }

    public function headings(): array
    {
        return [
            'ID',
            '契約番号',
            '契約名',
            '顧客名',
            '会社名',
            '契約タイプ',
            'ステータス',
            '契約総額',
            '開始日',
            '終了日',
            '登録日時',
        ];
    }

    public function map($contract): array
    {
        /** @var Contract $contract */
        return [
            $contract->id,
            $contract->contract_number,
            $contract->title,
            $contract->user?->profile?->full_name ?? $contract->user?->email,
            $contract->company?->name,
            Contract::TYPES[$contract->type] ?? $contract->type,
            Contract::STATUSES[$contract->status] ?? $contract->status,
            $contract->currentVersion?->total_amount,
            $contract->start_date?->format('Y-m-d'),
            $contract->end_date?->format('Y-m-d'),
            $contract->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
