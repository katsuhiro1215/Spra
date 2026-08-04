<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>請求書のご送付</title>
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

        .cta-section.payment {
            background-color: #ecfdf5;
        }

        .cta-section.payment .cta-button {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
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
            <h1>請求書のご送付</h1>
        </div>

        <div class="content">
            <p>{{ $invoice->user->profile?->full_name ?? $invoice->user->email }} 様</p>

            <p>いつも大変お世話になっております。{{ $invoice->issue_date->format('Y年m月') }}分のご請求書をお送りいたします。</p>

            <div class="info-box">
                <div class="info-row">
                    <div class="info-label">請求書番号</div>
                    <div class="info-value">{{ $invoice->invoice_number }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">発行日</div>
                    <div class="info-value">{{ $invoice->issue_date->format('Y年m月d日') }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">請求期間</div>
                    <div class="info-value">{{ $invoice->billing_period_start->format('Y年m月d日') }} 〜
                        {{ $invoice->billing_period_end->format('Y年m月d日') }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">ご請求内容</div>
                    <div class="info-value">{{ $invoice->contract->title }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">お支払い期限</div>
                    <div class="info-value">{{ $invoice->due_date->format('Y年m月d日') }}</div>
                </div>
            </div>

            <h3>請求明細</h3>
            <table class="items">
                <thead>
                    <tr>
                        <th>説明</th>
                        <th style="text-align: right; width: 50px;">数量</th>
                        <th style="text-align: right; width: 90px;">単価</th>
                        <th style="text-align: right; width: 90px;">金額</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($invoice->items as $item)
                        <tr>
                            <td>{{ $item->description }}</td>
                            <td style="text-align: right;">{{ $item->quantity }}</td>
                            <td style="text-align: right;">¥{{ number_format($item->unit_price, 0) }}</td>
                            <td style="text-align: right;">¥{{ number_format($item->amount, 0) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="summary">
                <div class="summary-row">
                    <div class="label">小計</div>
                    <div class="value">¥{{ number_format($invoice->subtotal, 0) }}</div>
                </div>
                @if ($invoice->discount_amount > 0)
                    <div class="summary-row">
                        <div class="label">割引</div>
                        <div class="value">-¥{{ number_format($invoice->discount_amount, 0) }}</div>
                    </div>
                @endif
                <div class="summary-row">
                    <div class="label">消費税 ({{ $invoice->tax_rate * 100 }}%)</div>
                    <div class="value">¥{{ number_format($invoice->tax_amount, 0) }}</div>
                </div>
            </div>

            <div class="amount-box">
                <div class="label">ご請求金額（税込）</div>
                <div class="amount">¥{{ number_format($invoice->total_amount, 0) }}</div>
            </div>

            @if ($invoice->notes)
                <h3>備考</h3>
                <p>{!! nl2br(e($invoice->notes)) !!}</p>
            @endif

            <div class="cta-section">
                <p style="margin-top: 0; font-size: 15px; font-weight: 600; color: #1f2937;">
                    ご請求書の詳細をご確認ください
                </p>
                <a href="{{ route('user.invoice.show', $invoice->id) }}" class="cta-button">
                    ご請求書を確認する
                </a>
            </div>

            <h2>お支払い方法</h2>
            <p>ご請求書に記載の銀行口座へお振込みください。<br>
                お振込み手数料は恐れ入りますがご負担くださいますようお願いいたします。</p>

            @if ($invoice->payment_report_token)
                <div class="cta-section payment">
                    <p style="margin-top: 0; font-size: 15px; font-weight: 600; color: #1f2937;">
                        入金した場合は以下より有無をお知らせください
                    </p>
                    <a href="{{ route('invoice.payment.show', $invoice->payment_report_token) }}" class="cta-button">
                        入金を報告する
                    </a>
                </div>
            @endif

            <p>ご不明な点がございましたら、お気軽にお問い合わせください。<br>
                今後とも何卒よろしくお願い申し上げます。</p>
        </div>

        <div class="footer">
            @include('emails.partials.organization-footer')
        </div>
    </div>
</body>

</html>
