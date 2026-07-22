{{ $user->profile?->full_name ?? $user->email }}さんが契約書「{{ $contract->title }}」に署名しました。

契約ID: {{ $contract->id }}
署名方法: {{ $signatureMethod }}
署名日時: {{ $signedAt }}

管理画面から署名を確認・検証してください。

{{ config('app.name') }}
