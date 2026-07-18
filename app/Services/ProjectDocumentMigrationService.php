<?php

namespace App\Services;

use App\Models\ProjectDocumentSection;
use App\Models\ProjectDocumentSectionColumn;
use Illuminate\Support\Str;

/**
 * DB設計セクション（db_table）のカラム定義からLaravelのmigrationファイルの雛形を生成する。
 *
 * 生成結果はあくまで叩き台であり、そのまま本番運用に耐える完成品ではない
 * （インデックス設計・auto increment・soft deletesの要否などは開発者の判断で調整する前提）。
 */
class ProjectDocumentMigrationService
{
    /**
     * @var array<string, string> data_type文字列 -> Blueprintメソッド名
     */
    private const TYPE_MAP = [
        'ulid'       => 'ulid',
        'uuid'       => 'uuid',
        'string'     => 'string',
        'varchar'    => 'string',
        'text'       => 'text',
        'longtext'   => 'longText',
        'integer'    => 'integer',
        'int'        => 'integer',
        'biginteger' => 'bigInteger',
        'bigint'     => 'bigInteger',
        'boolean'    => 'boolean',
        'bool'       => 'boolean',
        'date'       => 'date',
        'datetime'   => 'dateTime',
        'timestamp'  => 'timestamp',
        'decimal'    => 'decimal',
        'float'      => 'float',
        'json'       => 'json',
    ];

    public function generate(ProjectDocumentSection $section): string
    {
        $section->loadMissing('columns');
        $tableName = Str::snake($section->title);

        $lines = [];
        foreach ($section->columns as $column) {
            $lines[] = $this->buildColumnLine($column);
            if ($column->references_table && $column->references_column) {
                $lines[] = $this->buildForeignKeyLine($column);
            }
        }

        $columnsCode = implode("\n", array_map(fn ($l) => "            {$l}", $lines));

        return <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * {$section->title} セクション（DB設計文書）から自動生成された叩き台です。
 * インデックス構成・soft deletesの要否などは実装前に見直してください。
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('{$tableName}', function (Blueprint \$table) {
{$columnsCode}

            \$table->timestamps();
            // 必要に応じて \$table->softDeletes(); を追加してください
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('{$tableName}');
    }
};

PHP;
    }

    public function getFileName(ProjectDocumentSection $section): string
    {
        $tableName = Str::snake($section->title);

        return now()->format('Y_m_d_His') . "_create_{$tableName}_table.php";
    }

    private function buildColumnLine(ProjectDocumentSectionColumn $column): string
    {
        $method = self::TYPE_MAP[strtolower($column->data_type ?? '')] ?? 'string';
        $name = var_export($column->name, true);

        $args = [$name];
        if ($method === 'string' && $column->length) {
            $args[] = (int) $column->length;
        } elseif ($method === 'decimal' && $column->length && str_contains($column->length, ',')) {
            [$precision, $scale] = array_map('trim', explode(',', $column->length, 2));
            $args[] = (int) $precision;
            $args[] = (int) $scale;
        }

        $line = "\$table->{$method}(" . implode(', ', $args) . ')';

        if ($column->is_primary_key) {
            $line .= '->primary()';
        } else {
            if ($column->nullable) {
                $line .= '->nullable()';
            }
            if ($column->is_unique) {
                $line .= '->unique()';
            }
        }

        if ($column->default_value !== null && $column->default_value !== '') {
            $default = is_numeric($column->default_value)
                ? $column->default_value
                : var_export($column->default_value, true);
            $line .= "->default({$default})";
        }

        if ($column->comment) {
            $line .= '->comment(' . var_export($column->comment, true) . ')';
        }

        return $line . ';';
    }

    private function buildForeignKeyLine(ProjectDocumentSectionColumn $column): string
    {
        $referencesTable = Str::snake($column->references_table);
        $name = var_export($column->name, true);
        $refColumn = var_export($column->references_column, true);
        $refTable = var_export($referencesTable, true);

        return "\$table->foreign({$name})->references({$refColumn})->on({$refTable})->cascadeOnDelete();";
    }
}
