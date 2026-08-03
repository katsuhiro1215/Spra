<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'status' => 'todo',
            'priority' => 'medium',
            'admin_id' => null,
            'created_by' => Admin::factory(),
            'due_date' => fake()->dateTimeBetween('now', '+2 weeks')->format('Y-m-d'),
            'due_time' => null,
        ];
    }
}
