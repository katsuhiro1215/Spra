<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'role'              => fake()->randomElement(['super_admin', 'admin', 'editor']),
            'status'            => 'active',
            'remember_token'    => Str::random(10),
        ];
    }

    public function active(): static
    {
        return $this->state(fn(array $attributes) => ['status' => 'active']);
    }

    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => ['status' => 'inactive']);
    }

    public function suspended(): static
    {
        return $this->state(fn(array $attributes) => ['status' => 'suspended']);
    }

    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => ['email_verified_at' => null]);
    }
}
