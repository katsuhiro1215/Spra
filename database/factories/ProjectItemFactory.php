<?php

namespace Database\Factories;

use App\Models\ProjectVersion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectItem>
 */
class ProjectItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_version_id' => ProjectVersion::factory(),
            'name' => fake()->sentence(3),
            'type' => 'task',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addWeek()->toDateString(),
            'status' => 'not_started',
            'progress' => 0,
            'priority' => 'medium',
            'sort_order' => 0,
            'is_client_visible' => true,
        ];
    }
}
