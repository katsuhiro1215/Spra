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
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
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

        .cta-button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 20px 0;
        }

        .cta-button:hover {
            background-color: #2563eb;
        }

        .process-section {
            background-color: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 3px;
        }

        .process-section ol {
            margin: 10px 0;
            padding-left: 20px;
        }

        .process-section li {
            margin: 8px 0;
            color: #1f2937;
        }

        .response-options {
            background-color: #f3f4f6;
            padding: 15px;
            margin: 15px 0;
            border-radius: 3px;
        }

        .response-options ul {
            margin: 10px 0;
            padding-left: 20px;
        }

        .response-options li {
            margin: 6px 0;
            color: #1f2937;
        }

        .cta-section {
            text-align: center;
            background-color: #dbeafe;
            padding: 30px;
            border-radius: 5px;
            margin: 30px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <p>{{ $recipientName }} 様</p>
            <p>いつもお世話になっております。</p>
        </div>

        <div class="content">
            <p>この度は、ご依頼いただいた件に関しまして、見積もりをお作りいたしました。</p>
            <p>下記の内容をご確認ください。</p>

            <h2>見積もり内容</h2>
            <p><strong>見積番号:</strong> {{ $quote->quote_number }}</p>
            @if ($quote->expires_at)
                <p><strong>有効期限:</strong> {{ $quote->expires_at->toDate()->format('Y年m月d日') }}</p>
            @endif

            <h3>見積明細</h3>
            <table>
                <thead>
                    <tr>
                        <th>項目名</th>
                        <th style="text-align: right;">数量</th>
                        <th style="text-align: right;">単価</th>
                        <th style="text-align: right;">金額</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($quote->items as $item)
                        <tr>
                            <td>{{ $item->name }}</td>
                            <td style="text-align: right;">{{ number_format($item->quantity, 2) }}</td>
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
                    <span>¥{{ number_format($quote->base_amount, 0) }}</span>
                </div>
                @if ($quote->discount_amount > 0)
                    <div class="summary-row">
                        <span>割引</span>
                        <span>-¥{{ number_format($quote->discount_amount, 0) }}</span>
                    </div>
                @endif
                <div class="summary-row">
                    <span>消費税 ({{ $quote->tax_rate }}%)</span>
                    <span>¥{{ number_format($quote->tax_amount, 0) }}</span>
                </div>
                <div class="summary-row summary-total">
                    <span>合計</span>
                    <span>¥{{ number_format($quote->total_amount, 0) }}</span>
                </div>
            </div>

            @if ($quote->requirements)
                <h3>ご要件</h3>
                <p>{!! nl2br(e($quote->requirements)) !!}</p>
            @endif

            @if ($quote->custom_specifications)
                <h3>仕様</h3>
                <p>{!! nl2br(e($quote->custom_specifications)) !!}</p>
            @endif

            <!-- プロセス説明セクション -->
            <div class="process-section">
                <h3 style="margin-top: 0; color: #1e40af;">ご依頼までの流れ</h3>
                <ol>
                    <li>以下のフォームから「ご依頼」をお知らせください</li>
                    <li>2~3営業日以内に、ユーザーアカウント作成の招待メールを送付いたします</li>
                    <li>招待メール内のリンクからアカウント作成し、会社情報をご入力ください</li>
                    <li>管理側で確認後、契約書をアカウントにアップロードいたします</li>
                    <li>ご確認・承認後、ご入金が確認されましたら作成開始いたします</li>
                </ol>
            </div>

            <!-- レスポンスフォームリンク -->
            <div class="cta-section">
                <p style="margin-top: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                    以下のボタンからご返信ください
                </p>
                <a href="{{ $responseFormUrl }}" class="cta-button">
                    お返事フォームはこちら
                </a>
                <p style="margin-bottom: 0; font-size: 14px; color: #4b5563;">
                    ご返信いただき、ご依頼をお待ちしています
                </p>
            </div>

            <p>上記の内容でよろしければ、ご確認の上、ご連絡ください。</p>
            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>

        <div class="footer">
            <p>よろしくお願いいたします。</p>
        </div>
    </div>
</body>

</html>
