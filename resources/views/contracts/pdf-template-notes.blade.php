<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>契約書 - 備考</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        h1 {
            font-size: 16px;
            margin: 10px 0;
            text-align: center;
        }

        h2 {
            font-size: 14px;
            margin: 15px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
            background-color: #f0f0f0;
            padding: 5px;
        }

        .content {
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.8;
            padding: 10px;
        }

        .signature-table {
            width: 100%;
            margin-top: 40px;
            border-collapse: separate;
            border-spacing: 10px 0;
        }

        .signature-table td {
            width: 50%;
            vertical-align: top;
        }

        .signature-area {
            position: relative;
            text-align: center;
            border: 1px solid #999;
            padding: 15px;
            background-color: #f9f9f9;
        }

        .signature-printed-name {
            width: 100%;
            height: 80px;
            line-height: 80px;
            border: 1px solid #ccc;
            background-color: white;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            overflow: hidden;
        }

        .signature-label {
            font-size: 11px;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }

        .signature-canvas-area {
            width: 100%;
            height: 80px;
            border: 1px dashed #ccc;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .signature-canvas-area img {
            max-width: 90%;
            max-height: 90%;
            display: block;
            margin: 0 auto;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #999;
            padding-top: 10px;
        }

        .page-number {
            text-align: right;
            font-size: 10px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>契約書</h1>
        <p>契約番号：{{ $contract->contract_number }}</p>
    </div>

    <h2>備考</h2>
    <div class="content">
        {{ $notes }}
    </div>

    <!-- 署名欄（甲：SmartSprouts側は担当者名を印字、乙：クライアント側はデジタル署名） -->
    <table class="signature-table">
        <tr>
            <td>
                <div class="signature-area">
                    <div class="signature-label">甲（SmartSprouts）</div>
                    <div class="signature-printed-name">{{ $adminName ?? 'SmartSprouts' }}</div>
                </div>
            </td>
            <td>
                <div class="signature-area">
                    <div class="signature-label">乙（{{ $userName ?? 'クライアント' }}）</div>
                    <div class="signature-canvas-area" id="signature-placeholder">
                        @if ($signatureBase64)
                            <img src="data:image/png;base64,{{ $signatureBase64 }}"
                                style="width:100%; height:100%; object-fit:contain;" alt="デジタル署名" />
                        @else
                            <div class="signature-printed-name" style="border:none;">{{ $userName ?? '' }}</div>
                        @endif
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>本契約書は重要な法的文書です。内容をご理解の上、署名してください。</p>
        <div class="page-number">ページ 4/4</div>
    </div>
</body>

</html>
