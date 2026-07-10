契約書グループのお知らせ

{{ $contractGroup->user?->profile?->full_name ?? $contractGroup->user->email }}様

いつもお世話になっております。

{{ $contractGroup->contracts->count() }}件の契約書をお送りいたします。

【グループ情報】
グループ番号: {{ $contractGroup->group_number }}
タイトル: {{ $contractGroup->title }}
契約件数: {{ $contractGroup->contracts->count() }}件

【含まれる契約書】
@foreach ($contractGroup->contracts as $contract)
    ・{{ $contract->title }} ({{ $contract->contract_number }})
@endforeach

【ご注意】
1. 以下の添付ファイルをご確認ください
2. 内容に不備がないかご確認の上、署名をお願いいたします
3. 複数の契約書が含まれています。すべてにご署名ください

【契約書の確認・署名方法】
以下のリンクにアクセスして契約書を確認・署名してください：
{{ url('/user/contracts') }}

ご不明な点やご質問がある場合は、お気軽にお問い合わせください。

よろしくお願いいたします。
