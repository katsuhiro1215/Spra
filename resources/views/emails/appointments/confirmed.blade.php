<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>予約確定</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .info-box {
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .appointment-details {
            background-color: #f8f9fa;
            border: 2px solid #3b82f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .detail-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-weight: bold;
            min-width: 120px;
            color: #6b7280;
        }

        .detail-value {
            flex: 1;
            color: #111827;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>✅ 予約が確定されました</h1>
        </div>

        <p>{{ $appointment->company->name ?? 'お客様' }} 様</p>

        <p>ご予約が確定されましたのでお知らせいたします。</p>

        <div class="info-box">
            <strong>予約が確定しました</strong><br>
            以下の内容でご予約を承りました。当日お待ちしております。
        </div>

        <div class="appointment-details">
            <h2 style="margin-top: 0; color: #3b82f6;">📅 予約詳細</h2>

            <div class="detail-row">
                <div class="detail-label">日時:</div>
                <div class="detail-value">
                    {{ \Carbon\Carbon::parse($slot->date)->format('Y年m月d日') }}（{{ ['日', '月', '火', '水', '木', '金', '土'][\Carbon\Carbon::parse($slot->date)->dayOfWeek] }}）
                    {{ substr($slot->start_time, 0, 5) }} ～ {{ substr($slot->end_time, 0, 5) }}
                </div>
            </div>

            <div class="detail-row">
                <div class="detail-label">種類:</div>
                <div class="detail-value">
                    @php
                        $types = [
                            'meeting' => '面談',
                            'progress_review' => '進捗会',
                            'consultation' => '相談',
                            'other' => 'その他',
                        ];
                    @endphp
                    {{ $types[$slot->slot_type] ?? $slot->slot_type }}
                </div>
            </div>

            <div class="detail-row">
                <div class="detail-label">件名:</div>
                <div class="detail-value">{{ $appointment->subject }}</div>
            </div>

            @if ($appointment->description)
                <div class="detail-row">
                    <div class="detail-label">詳細:</div>
                    <div class="detail-value">{{ $appointment->description }}</div>
                </div>
            @endif

            @if ($company)
                <div class="detail-row">
                    <div class="detail-label">企業:</div>
                    <div class="detail-value">{{ $company->name }}</div>
                </div>
            @endif

            @if ($project)
                <div class="detail-row">
                    <div class="detail-label">プロジェクト:</div>
                    <div class="detail-value">{{ $project->title }}</div>
                </div>
            @endif

            @if ($assignedAdmin)
                <div class="detail-row">
                    <div class="detail-label">担当者:</div>
                    <div class="detail-value">{{ $assignedAdmin->profile->full_name ?? $assignedAdmin->name }}</div>
                </div>
            @endif
        </div>

        @if ($appointment->client_notes)
            <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
                <strong>📝 メモ:</strong><br>
                {{ $appointment->client_notes }}
            </div>
        @endif

        <p style="margin-top: 30px;">
            ご不明な点やご変更がございましたら、お早めにご連絡ください。
        </p>

        <div class="footer">
            <p>このメールは自動送信されています。</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
