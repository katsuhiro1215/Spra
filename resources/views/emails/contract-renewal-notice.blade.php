契約「{{ $contract->title }}」がまもなく契約終了日を迎えます。

契約番号: {{ $contract->contract_number }}
クライアント: {{ $contract->user->profile?->full_name ?? $contract->user->email }}
@if ($contract->company)
会社: {{ $contract->company->name }}
@endif
契約終了日: {{ $contract->end_date->format('Y年m月d日') }}（あと{{ now()->diffInDays($contract->end_date) }}日）

この契約は自動更新設定になっていますが、実際の更新契約の作成は自動では行われません。
管理画面から更新契約を作成するか、クライアントへ更新意向の確認をお願いします。

管理画面: {{ route('admin.contract.show', $contract->id) }}

{{ config('app.name') }}
