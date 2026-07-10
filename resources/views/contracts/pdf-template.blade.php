<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>契約書</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-size: 12px;
            line-height: 1.5;
        }

        .signature-area {
            position: relative;
            width: 40%;
            margin-left: auto;
            margin-top: 30px;
            text-align: center;
            border: 1px solid #999;
            padding: 10px;
            background-color: #f9f9f9;
        }

        .signature-label {
            font-size: 10px;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .signature-canvas-area {
            width: 100%;
            height: 60px;
            border: 1px dashed #999;
            background-color: white;
        }

        h1 {
            font-size: 20px;
            margin: 10px 0;
            text-align: center;
        }

        h2 {
            font-size: 14px;
            margin: 10px 0 5px 0;
            border-bottom: 1px solid #000;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }

        td {
            border: 1px solid #999;
            padding: 5px;
        }

        .text-right {
            text-align: right;
        }
    </style>
</head>

<body>
    <div class="content">
        <h1>契約書</h1>

        <h2>契約基本情報</h2>
        <table>
            <tr>
                <td style="width:30%">契約番号</td>
                <td>{{ $contract->contract_number ?? '-' }}</td>
            </tr>
            <tr>
                <td>作成日</td>
                <td>{{ $generatedAt }}</td>
            </tr>
            <tr>
                <td>タイトル</td>
                <td>{{ $contract->title }}</td>
            </tr>
        </table>

        @if ($contract->user)
            <h2>契約者情報</h2>
            <table>
                <tr>
                    <td style="width:30%">氏名</td>
                    <td>{{ $contract->user->profile?->full_name ?? $contract->user->email }}</td>
                </tr>
                <tr>
                    <td>メール</td>
                    <td>{{ $contract->user->email }}</td>
                </tr>
            </table>
        @endif

        <h2>契約金額</h2>
        <table>
            <tr>
                <td style="width:30%">金額</td>
                <td class="text-right">{{ $formattedAmount }}</td>
            </tr>
            <tr>
                <td>税率</td>
                <td class="text-right">{{ $contract->tax_rate }}%</td>
            </tr>
            <tr>
                <td style="font-weight:bold">税込合計</td>
                <td class="text-right" style="font-weight:bold">{{ $totalWithTax }}</td>
            </tr>
        </table>

        <h2>契約期間</h2>
        <table>
            <tr>
                <td style="width:30%">開始日</td>
                <td>{{ $contract->start_date?->format('Y年m月d日') ?? '-' }}</td>
            </tr>
            <tr>
                <td>終了日</td>
                <td>{{ $contract->end_date?->format('Y年m月d日') ?? '-' }}</td>
            </tr>
        </table>

        @if ($contract->payment_terms)
            <h2>支払条件</h2>
            <p>{{ $contract->payment_terms }}</p>
        @endif

        @if ($contract->description)
            <h2>説明</h2>
            <p>{{ $contract->description }}</p>
        @endif

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #000;">
        <p style="text-align: center; margin-top: 10px; font-size: 10px;">生成日時: {{ now()->format('Y年m月d日 H:i') }}</p>
    </div>

    <!-- デジタルサイン用エリア（右下） -->
    <div class="signature-area">
        <div class="signature-label">署名欄</div>
        <div class="signature-canvas-area" id="signature-placeholder">
            @if ($signatureBase64)
                <img src="data:image/png;base64,{{ $signatureBase64 }}"
                    style="width:100%; height:100%; object-fit:contain;" alt="デジタル署名" />
            @endif
        </div>
    </div>
</body>

</html>
