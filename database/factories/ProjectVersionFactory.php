<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectVersion>
 */
class ProjectVersionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'version' => 1,
            'title' => fake()->sentence(3),
            'start_date' => now()->toDateString(),
            'estimated_end_date' => now()->addMonth()->toDateString(),
            'status' => 'draft',
            'is_current' => true,
        ];
    }
}
