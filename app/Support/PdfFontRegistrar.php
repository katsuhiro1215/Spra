<?php

namespace App\Support;

use Barryvdh\DomPDF\PDF as DomPdfWrapper;

/**
 * PDF生成(DomPDF/mPDF)で日本語(IPAゴシック)を確実に描画するための共通設定。
 *
 * DomPDF・mPDFともに標準では日本語グリフを持つフォントが同梱されておらず、
 * CSSでフォント名を指定するだけでは文字化けする。resources/fonts/ipag.ttf を
 * 明示的に登録することで環境に依存せず日本語を描画する。
 */
class PdfFontRegistrar
{
    /**
     * PDFテンプレートのCSSで指定する論理フォント名
     */
    public const FONT_FAMILY = 'Noto Sans JP';

    public static function fontPath(): string
    {
        return resource_path('fonts/ipag.ttf');
    }

    /**
     * DomPDFインスタンスにIPAゴシックを登録する
     *
     * 太字用の別ファイルは無いため、normal/bold/italic/bold-italicの全スタイルに
     * 同じフォントファイルを登録する(登録しないスタイルは日本語グリフを持たない
     * フォントにフォールバックし文字化けするため、見出し等の太字テキストも
     * カバーする必要がある)。
     */
    public static function registerDomPdf(DomPdfWrapper $pdf): void
    {
        $fontMetrics = $pdf->getDomPDF()->getFontMetrics();

        foreach (['normal', 'bold'] as $weight) {
            foreach (['normal', 'italic'] as $style) {
                $fontMetrics->registerFont(
                    ['family' => self::FONT_FAMILY, 'style' => $style, 'weight' => $weight],
                    self::fontPath()
                );
            }
        }
    }

    /**
     * mPDF初期化用のフォント設定を返す
     *
     * @return array<string, mixed>
     */
    public static function mpdfConfig(): array
    {
        $fontDirs = (new \Mpdf\Config\ConfigVariables())->getDefaults()['fontDir'];
        $fontData = (new \Mpdf\Config\FontVariables())->getDefaults()['fontdata'];

        return [
            'fontDir' => array_merge($fontDirs, [resource_path('fonts')]),
            'fontdata' => $fontData + [
                'notosansjp' => [
                    'R' => 'ipag.ttf',
                    'B' => 'ipag.ttf',
                    'I' => 'ipag.ttf',
                    'BI' => 'ipag.ttf',
                ],
            ],
            'default_font' => 'notosansjp',
        ];
    }
}
