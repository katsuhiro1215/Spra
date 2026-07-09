<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\ContractSignature;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\Log;

class ContractPdfService
{
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
            'formattedAmount' => $this->formatAmount($contract->currentVersion?->total_amount ?? 0),
            'totalWithTax' => $this->formatAmount($this->calculateTotalWithTax($contract)),
            'generatedAt' => now()->format('Y年m月d日'),
            'signatureBase64' => $signatureBase64, // Base64エンコード済み署名画像データ
        ])->render();

        // mPDF インスタンスを生成（日本語対応）
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 10,
            'margin_right' => 10,
            'margin_top' => 10,
            'margin_bottom' => 10,
            'tempDir' => storage_path('app/temp'),
            'autoScriptToLang' => true,
            'autoLangToFont' => true,
            'setAutoTopMargin' => 'pad',
            'setAutoBottomMargin' => 'pad',
        ]);

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
     * 税込合計を計算
     */
    private function calculateTotalWithTax(Contract $contract): float
    {
        $taxRate = $contract->currentVersion?->tax_rate ?? 0;
        $amount = $contract->currentVersion?->total_amount ?? 0;
        return $amount * (1 + $taxRate / 100);
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
}
