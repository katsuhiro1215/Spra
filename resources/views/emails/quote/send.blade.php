<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お見積りのご送付</title>
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

        h2 {
            color: #1f2937;
            font-size: 18px;
            margin-top: 30px;
            margin-bottom: 10px;
        }

        h3 {
            color: #374151;
            font-size: 15px;
            margin-top: 20px;
            margin-bottom: 8px;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        table.items thead {
            background-color: #f8f9fa;
        }

        table.items th,
        table.items td {
            border: 1px solid #e9ecef;
            padding: 10px;
            text-align: left;
            font-size: 13px;
        }

        table.items th {
            font-weight: 600;
            color: #667eea;
        }

        .summary {
            margin: 15px 0;
        }

        .summary-row {
            display: table;
            width: 100%;
            padding: 6px 0;
            border-bottom: 1px solid #eee;
        }

        .summary-row .label,
        .summary-row .value {
            display: table-cell;
        }

        .summary-row .value {
            text-align: right;
        }

        .amount-box {
            text-align: center;
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }

        .amount-box .label {
            font-size: 14px;
            color: #6c757d;
        }

        .amount-box .amount {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            margin-top: 5px;
        }

        .steps {
            background-color: #f0f9ff;
            border-left: 4px solid #667eea;
            padding: 15px 15px 15px 35px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .steps li {
            margin: 8px 0;
            color: #1f2937;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 10px 0;
        }

        .cta-section {
            text-align: center;
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
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
            <h1>お見積りのご送付</h1>
        </div>

        <div class="content">
            <p>{{ $recipientName }} 様</p>

            <p>いつもお世話になっております。この度は、ご依頼いただいた件に関しまして、お見積りをお作りいたしました。下記の内容をご確認ください。</p>

            <div class="info-box">
                <div class="info-row">
                    <div class="info-label">見積番号</div>
                    <div class="info-value">{{ $quote->quote_number }}</div>
                </div>
                @if ($currentVersion?->expires_at)
                    <div class="info-row">
                        <div class="info-label">有効期限</div>
                        <div class="info-value">{{ $currentVersion->expires_at->toDate()->format('Y年m月d日') }}
                        </div>
                    </div>
                @endif
            </div>

            <h3>見積明細</h3>
            <table class="items">
                <thead>
                    <tr>
                        <th>項目名</th>
                        <th style="text-align: right; width: 50px;">数量</th>
                        <th style="text-align: right; width: 90px;">単価</th>
                        <th style="text-align: right; width: 90px;">金額</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($items as $item)
                        <tr>
                            <td>{{ $item->service_item?->name ?? $item->name }}</td>
                            <td style="text-align: right;">{{ number_format($item->quantity, 2) }}</td>
                            <td style="text-align: right;">¥{{ number_format($item->unit_price, 0) }}</td>
                            <td style="text-align: right;">¥{{ number_format($item->amount, 0) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="summary">
                <div class="summary-row">
                    <div class="label">小計</div>
                    <div class="value">¥{{ number_format($currentVersion?->base_amount ?? 0, 0) }}</div>
                </div>
                @if (($currentVersion?->discount_amount ?? 0) > 0)
                    <div class="summary-row">
                        <div class="label">割引</div>
                        <div class="value">-¥{{ number_format($currentVersion->discount_amount, 0) }}</div>
                    </div>
                @endif
                <div class="summary-row">
                    <div class="label">消費税 ({{ $currentVersion?->tax_rate ?? 0 }}%)</div>
                    <div class="value">¥{{ number_format($currentVersion?->tax_amount ?? 0, 0) }}</div>
                </div>
            </div>

            <div class="amount-box">
                <div class="label">お見積り合計金額（税込）</div>
                <div class="amount">¥{{ number_format($currentVersion?->total_amount ?? 0, 0) }}</div>
            </div>

            @if ($currentVersion?->requirements)
                <h3>ご要件</h3>
                <p>{!! nl2br(e($currentVersion->requirements)) !!}</p>
            @endif

            @if ($currentVersion?->custom_specifications)
                <h3>仕様</h3>
                <p>{!! nl2br(e(json_encode($currentVersion->custom_specifications, JSON_UNESCAPED_UNICODE))) !!}</p>
            @endif

            <h2>ご依頼までの流れ</h2>
            <ol class="steps">
                <li>以下のフォームから「ご依頼」をお知らせください</li>
                <li>2〜3営業日以内に、ユーザーアカウント作成の招待メールを送付いたします</li>
                <li>招待メール内のリンクからアカウント作成し、会社情報をご入力ください</li>
                <li>管理側で確認後、契約書をアカウントにアップロードいたします</li>
                <li>ご確認・承認後、ご入金が確認されましたら作成開始いたします</li>
            </ol>

            <div class="cta-section">
                <p style="margin-top: 0; font-size: 15px; font-weight: 600; color: #1f2937;">
                    以下のボタンからご返信ください
                </p>
                <a href="{{ $responseFormUrl }}" class="cta-button">
                    お返事フォームはこちら
                </a>
                <p style="margin-bottom: 0; font-size: 13px; color: #6c757d;">
                    ご返信いただき、ご依頼をお待ちしています
                </p>
            </div>

            <p>上記の内容でよろしければ、ご確認の上、ご連絡ください。<br>
                ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>

        <div class="footer">
            @include('emails.partials.organization-footer')
        </div>
    </div>
</body>

</html>
