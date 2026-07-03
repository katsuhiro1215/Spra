<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #ffc107;
        }

        .content {
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        thead {
            background-color: #f8f9fa;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        th {
            font-weight: 600;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .summary {
            margin: 20px 0;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .summary-total {
            font-size: 18px;
            font-weight: 600;
            border-bottom: 2px solid #333 !important;
        }

        .cta-button {
            display: inline-block;
            background-color: #dc3545;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 20px 0;
        }

        .cta-button:hover {
            background-color: #c82333;
        }

        .cta-section {
            text-align: center;
            background-color: #f8d7da;
            padding: 30px;
            border-radius: 5px;
            margin: 30px 0;
            border: 1px solid #f5c6cb;
        }

        .footer {
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 20px;
        }

        h2 {
            color: #1f2937;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        h3 {
            color: #374151;
            margin-top: 15px;
            margin-bottom: 8px;
        }

        .warning {
            color: #dc3545;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <p><strong>⚠️ お支払い期限が過ぎております</strong></p>
            <p>{{ $invoice->user->name }} 様</p>
            <p>いつも大変お世話になっております。{{ config('app.name') }}です。</p>
        </div>

        <div class="content">
            <p>{{ $invoice->issue_date->format('Y年m月') }}分のご請求につきまして、<span class="warning">お支払い期限が過ぎております</span>。</p>
            <p>ご確認の上、お早めにお支払いくださいますようお願い申し上げます。</p>

            <h2>ご請求書の内容</h2>

            <h3>請求書情報</h3>
            <table>
                <tr>
                    <td><strong>請求書番号</strong></td>
                    <td>{{ $invoice->invoice_number }}</td>
                </tr>
                <tr>
                    <td><strong>発行日</strong></td>
                    <td>{{ $invoice->issue_date->format('Y年m月d日') }}</td>
                </tr>
                <tr>
                    <td><strong>請求期間</strong></td>
                    <td>{{ $invoice->billing_period_start->format('Y年m月d日') }} 〜
                        {{ $invoice->billing_period_end->format('Y年m月d日') }}</td>
                </tr>
                <tr style="background-color: #fff3cd;">
                    <td><strong>お支払い期限</strong></td>
                    <td><span class="warning">{{ $invoice->due_date->format('Y年m月d日') }}</span></td>
                </tr>
                <tr>
                    <td><strong>ご請求内容</strong></td>
                    <td>{{ $invoice->contract->title }}</td>
                </tr>
            </table>

            <h3>請求明細</h3>
            <table>
                <thead>
                    <tr>
                        <th>説明</th>
                        <th style="text-align: right; width: 60px;">数量</th>
                        <th style="text-align: right; width: 100px;">単価</th>
                        <th style="text-align: right; width: 100px;">合計</th>
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

            <h3>金額情報</h3>
            <div class="summary">
                <div class="summary-row">
                    <span>小計</span>
                    <span>¥{{ number_format($invoice->subtotal, 0) }}</span>
                </div>
                @if ($invoice->discount_amount > 0)
                    <div class="summary-row">
                        <span>割引</span>
                        <span>-¥{{ number_format($invoice->discount_amount, 0) }}</span>
                    </div>
                @endif
                <div class="summary-row">
                    <span>消費税 ({{ $invoice->tax_rate * 100 }}%)</span>
                    <span>¥{{ number_format($invoice->tax_amount, 0) }}</span>
                </div>
                <div class="summary-row summary-total">
                    <span>合計金額</span>
                    <span>¥{{ number_format($invoice->total_amount, 0) }}</span>
                </div>
            </div>

            @if ($invoice->notes)
                <h3>備考</h3>
                <p>{!! nl2br(e($invoice->notes)) !!}</p>
            @endif

            <!-- CTAセクション -->
            <div class="cta-section">
                <p style="margin-top: 0; font-size: 16px; font-weight: 600; color: #dc3545;">
                    ご請求書の詳細をご確認ください
                </p>
                <a href="{{ route('user.invoices.show', ['id' => $invoice->id]) }}" class="cta-button">
                    ご請求書を確認する
                </a>
            </div>

            <h2>お支払い方法</h2>
            <p>ご請求書に記載の銀行口座へお振込みください。</p>
            <p>お振込み手数料は恐れ入りますがご負担くださいますようお願いいたします。</p>

            <p><strong>すでにお支払いいただいている場合は、本メールをご放念ください。</strong></p>

            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>

        <div class="footer">
            <p>今後とも何卒よろしくお願い申し上げます。</p>
            <p>{{ config('app.name') }}</p>
        </div>
    </div>
</body>

</html>
