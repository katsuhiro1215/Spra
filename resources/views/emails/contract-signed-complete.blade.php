<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>契約書の署名が完了しました</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .content {
            padding: 40px 30px;
        }

        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .info-row {
            display: table;
            width: 100%;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            display: table-cell;
            width: 140px;
            font-weight: bold;
            color: #667eea;
            vertical-align: top;
        }

        .info-value {
            display: table-cell;
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        .button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
        }

        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            margin: 5px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>✓ 契約書の署名が完了しました</h1>
        </div>

        <div class="content">
            <p>{{ $user->profile?->full_name ?? $user->email }} 様</p>

            <p>いつもお世話になっております。契約書「{{ $contract->title }}」が完全に署名されましたのでお知らせいたします。</p>

            <div class="info-box">
                <div class="info-row">
                    <div class="info-label">契約番号</div>
                    <div class="info-value">{{ $contract->contract_number }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">契約金額</div>
                    <div class="info-value">¥{{ number_format($contract->currentVersion?->total_amount ?? 0) }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">契約期間</div>
                    <div class="info-value">
                        {{ \Carbon\Carbon::parse($contract->start_date)->format('Y年m月d日') }}
                        @if ($contract->end_date)
                            〜 {{ \Carbon\Carbon::parse($contract->end_date)->format('Y年m月d日') }}
                        @endif
                    </div>
                </div>
            </div>

            <div class="button-container">
                <a href="{{ route('user.contract.show', $contract->id) }}" class="button">
                    契約書を確認する
                </a>
            </div>

            <p>今後とも何卒よろしくお願い申し上げます。</p>
        </div>

        <div class="footer">
            @include('emails.partials.organization-footer')
        </div>
    </div>
</body>

</html>
