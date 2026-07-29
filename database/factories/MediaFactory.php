<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
class MediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'type' => 'image',
            'mime_type' => 'image/webp',
            'original_file_size' => $this->faker->numberBetween(1000, 500000),
            'original_hash' => hash('sha256', $this->faker->uuid()),
            'original_path' => 'media/originals/' . $this->faker->uuid() . '.webp',
            'original_filename' => $this->faker->word() . '.webp',
            'format' => 'webp',
        ];
    }
}
