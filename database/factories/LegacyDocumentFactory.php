<?php

namespace Database\Factories;

use App\Models\LegacyDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<LegacyDocument>
 */
class LegacyDocumentFactory extends Factory
{
    protected $model = LegacyDocument::class;

    public function definition(): array
    {
        return [
            'document_type' => fake()->randomElement(LegacyDocument::DOCUMENT_TYPES),
            'client_name' => fake()->company(),
            'issued_at' => fake()->date(),
            'total_amount' => fake()->randomFloat(2, 10000, 1000000),
        ];
    }
}
