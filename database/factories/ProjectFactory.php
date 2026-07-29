<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_code' => 'PRJ-' . fake()->unique()->numerify('####-####'),
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'status' => 'planning',
            'priority' => 'medium',
            'start_date' => now()->toDateString(),
            'estimated_end_date' => now()->addMonth()->toDateString(),
            'is_client_visible' => true,
        ];
    }
}
