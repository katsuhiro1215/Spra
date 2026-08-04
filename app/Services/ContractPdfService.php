<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\ContractSignature;
use App\Models\DocumentVersion;
use App\Support\PdfFontRegistrar;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\Log;

class ContractPdfService
{
    /**
     * mPDFインスタンスを生成する共通ヘルパー（日本語フォント登録込み）
     *
     * @param array<string, mixed> $overrides
     */
    private function newMpdf(array $overrides = []): Mpdf
    {
        $baseOptions = [
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 10,
            'margin_right' => 10,
            'margin_top' => 10,
            'margin_bottom' => 10,
            'tempDir' => storage_path('app/temp'),
            'setAutoTopMargin' => 'pad',
            'setAutoBottomMargin' => 'pad',
        ];

        return new Mpdf(array_merge($baseOptions, PdfFontRegistrar::mpdfConfig(), $overrides));
    }

    /**
     * 契約書をPDFで生成
     */
    public function generate(Contract $contract)
    {
        // テンプレートをHTML文字列としてレンダリング
        // 最新の署名を contract_signatures テーブルから取得
        $signatureBase64 = null;

        Log::info('ContractPdfService: Generating PDF for contract', [
            'contract_id' => $contract->id,
        ]);

        $latestSignature = ContractSignature::where('contract_id', $contract->id)
            ->where('signature_type', 'user')
            ->where('status', 'signed')
            ->latest('signed_at')
            ->first();

        if ($latestSignature && $latestSignature->signature_image) {
            $signatureBase64 = $latestSignature->signature_image;
            Log::info('Signature found from contract_signatures', [
                'signature_id' => $latestSignature->id,
                'length' => strlen($signatureBase64),
            ]);
        } else {
            Log::warning('No signature found for contract', [
                'contract_id' => $contract->id,
            ]);
        }

        $html = view('contracts.pdf-template', [
            'contract' => $contract,
            'formattedAmount' => $this->formatAmount($this->calculateTaxableAmount($contract)),
            'totalWithTax' => $this->formatAmount($this->calculateTotalWithTax($contract)),
            'generatedAt' => now()->format('Y年m月d日'),
            'signatureBase64' => $signatureBase64, // Base64エンコード済み署名画像データ
        ])->render();

        // mPDF インスタンスを生成（日本語対応）
        $mpdf = $this->newMpdf();

        // HTML を PDF に変換
        $mpdf->WriteHTML($html);

        return $mpdf;
    }

    /**
     * 金額をフォーマット
     */
    private function formatAmount(?float $amount): string
    {
        if ($amount === null || $amount === 0) {
            return '0円';
        }
        return number_format($amount, 0) . '円';
    }

    /**
     * 税抜き金額（税率・割引適用後の課税対象額）を計算
     */
    private function calculateTaxableAmount(Contract $contract): float
    {
        $baseAmount = $contract->currentVersion?->base_amount ?? 0;
        $discountAmount = $contract->currentVersion?->discount_amount ?? 0;
        return $baseAmount - $discountAmount;
    }

    /**
     * 税込合計を取得
     *
     * ContractVersion.total_amount は ContractService::recalculateVersionAmounts() で
     * 既に税込みの金額として計算・保存されているため、ここで税率を再度掛けてはならない
     * （以前はここで total_amount に (1 + taxRate) を掛けて二重に課税してしまっていた）
     */
    private function calculateTotalWithTax(Contract $contract): float
    {
        return $contract->currentVersion?->total_amount ?? 0;
    }

    /**
     * PDFファイル名を生成
     */
    public function getFileName(Contract $contract): string
    {
        return sprintf(
            '契約書_%s_%s.pdf',
            $contract->contract_number,
            now()->format('Ymd')
        );
    }

    /**
     * PDFを保存パスで取得
     */
    public function getSavePath(Contract $contract): string
    {
        return sprintf(
            'contracts/%s/%s.pdf',
            $contract->id,
            now()->format('YmdHis')
        );
    }

    /**
     * 4ページの完全な契約書PDFを生成
     * ページ1：金額情報
     * ページ2：契約条項
     * ページ3：特別条項
     * ページ4：備考＋署名
     */
    public function generateFullContract(Contract $contract)
    {
        $signatureBase64 = null;

        $latestSignature = ContractSignature::where('contract_id', $contract->id)
            ->where('signature_type', 'user')
            ->where('status', 'signed')
            ->latest('signed_at')
            ->first();

        if ($latestSignature && $latestSignature->signature_image) {
            $signatureBase64 = $latestSignature->signature_image;

            Log::info('Signature found for PDF generation', [
                'contract_id' => $contract->id,
                'signature_id' => $latestSignature->id,
                'image_length' => strlen($signatureBase64),
            ]);
        }

        // mPDF インスタンスを生成（画像サポート強化）
        $mpdf = $this->newMpdf([
            'ignore_invalid_utf8' => true,
            'protect' => false,
        ]);

        // ページ1：金額情報
        $page1 = view('contracts.pdf-template', [
            'contract' => $contract,
            'formattedAmount' => $this->formatAmount($this->calculateTaxableAmount($contract)),
            'totalWithTax' => $this->formatAmount($this->calculateTotalWithTax($contract)),
            'generatedAt' => now()->format('Y年m月d日'),
            'signatureBase64' => null, // ページ1には署名を表示しない
        ])->render();

        $mpdf->WriteHTML($page1);

        // ページ2：契約条項
        if ($contract->currentVersion?->terms_and_conditions) {
            $mpdf->AddPage();
            $page2 = view('contracts.pdf-template-terms', [
                'contract' => $contract,
                'terms' => $contract->currentVersion->terms_and_conditions,
            ])->render();
            $mpdf->WriteHTML($page2);
        }

        // ページ3：特別条項
        if ($contract->currentVersion?->special_provisions) {
            $mpdf->AddPage();
            $page3 = view('contracts.pdf-template-special-provisions', [
                'contract' => $contract,
                'provisions' => $contract->currentVersion->special_provisions,
            ])->render();
            $mpdf->WriteHTML($page3);
        }

        // ページ4：備考（必ず生成、署名を含める）
        // 甲（SmartSprouts側）の署名欄には、クライアントが自分で描画する必要が無いよう
        // 契約作成者（Admin）の氏名を最初から印字しておく
        $admin = $contract->creator?->loadMissing('profile');

        $mpdf->AddPage();
        $page4 = view('contracts.pdf-template-notes', [
            'contract' => $contract,
            'notes' => $contract->currentVersion?->notes ?? '', // notesがない場合は空文字列
            'signatureBase64' => $signatureBase64, // 最終ページに署名を表示
            'adminName' => $admin?->profile?->full_name ?? $admin?->email,
        ])->render();
        $mpdf->WriteHTML($page4);

        return $mpdf;
    }

    /**
     * 金額ページのみを生成（プレビュー用）
     */
    public function generateAmountPage(Contract $contract)
    {
        return $this->generate($contract);
    }

    /**
     * 契約条項ページのみを生成（プレビュー用）
     */
    public function generateTermsPage(Contract $contract)
    {
        $html = view('contracts.pdf-template-terms', [
            'contract' => $contract,
            'terms' => $contract->currentVersion?->terms_and_conditions ?? '未記入',
        ])->render();

        $mpdf = $this->newMpdf();

        $mpdf->WriteHTML($html);
        return $mpdf;
    }

    /**
     * 特別条項ページのみを生成（プレビュー用）
     */
    public function generateSpecialProvisionsPage(Contract $contract)
    {
        $html = view('contracts.pdf-template-special-provisions', [
            'contract' => $contract,
            'provisions' => $contract->currentVersion?->special_provisions ?? '未記入',
        ])->render();

        $mpdf = $this->newMpdf();

        $mpdf->WriteHTML($html);
        return $mpdf;
    }

    /**
     * 備考ページのみを生成（プレビュー用）
     */
    public function generateNotesPage(Contract $contract)
    {
        $admin = $contract->creator?->loadMissing('profile');

        $html = view('contracts.pdf-template-notes', [
            'contract' => $contract,
            'notes' => $contract->currentVersion?->notes ?? '未記入',
            'signatureBase64' => null,
            'adminName' => $admin?->profile?->full_name ?? $admin?->email,
        ])->render();

        $mpdf = $this->newMpdf();

        $mpdf->WriteHTML($html);
        return $mpdf;
    }

    /**
     * 規約文書(DocumentVersion)をPDFとして生成
     *
     * 契約書送付メール（ContractEmail/ContractGroupEmail）に添付する
     * terms_and_conditions.pdf用。従来HTML文字列をそのままPDFと偽って
     * 添付していたため開封時に破損ファイル扱いになっていた不具合の修正。
     */
    public function generateDocumentPdf(DocumentVersion $version): Mpdf
    {
        $title = e($version->document->title);
        $content = $version->content;
        $effectiveDate = optional($version->effective_date)->format('Y年m月d日') ?? '未設定';

        $html = <<<HTML
        <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { line-height: 1.6; margin: 20px; }
                    h1 { font-size: 24px; margin-bottom: 20px; }
                    h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
                    .footer { margin-top: 40px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <h1>{$title}</h1>
                <p>発効日: {$effectiveDate}</p>
                <hr>
                {$content}
                <div class="footer">
                    <p>このドキュメントは {$title} v{$version->version} です。</p>
                </div>
            </body>
        </html>
        HTML;

        $mpdf = $this->newMpdf();
        $mpdf->WriteHTML($html);

        return $mpdf;
    }
}
