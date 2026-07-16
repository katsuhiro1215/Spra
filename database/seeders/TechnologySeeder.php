<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Technology;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Admin::where('email', 'katsuhiro.k1215@gmail.com')->first();

        $technologies = [
            ['name' => 'HTML', 'color' => '#E34F26'],
            ['name' => 'CSS', 'color' => '#1572B6'],
            ['name' => 'Sass', 'color' => '#CC6699'],
            ['name' => 'Bootstrap', 'color' => '#7952B3'],
            ['name' => 'Tailwind CSS', 'color' => '#06B6D4'],
            ['name' => 'JavaScript', 'color' => '#F7DF1E'],
            ['name' => 'TypeScript', 'color' => '#3178C6'],
            ['name' => 'Vue', 'color' => '#4FC08D'],
            ['name' => 'React', 'color' => '#61DAFB'],
            ['name' => 'Next', 'color' => '#000000'],
            ['name' => 'Node', 'color' => '#339933'],
            ['name' => 'PHP', 'color' => '#777BB4'],
            ['name' => 'Laravel', 'color' => '#FF2D20'],
            ['name' => 'Ruby', 'color' => '#CC342D'],
            ['name' => 'Ruby on Rails', 'color' => '#CC0000'],
            ['name' => 'Python', 'color' => '#3776AB'],
            ['name' => 'Django', 'color' => '#092E20'],
            ['name' => 'Java', 'color' => '#007396'],
            ['name' => 'Spring', 'color' => '#6DB33F'],
            ['name' => 'Kotlin', 'color' => '#7F52FF'],
            ['name' => 'Swift', 'color' => '#F05138'],
            ['name' => 'Flutter', 'color' => '#02569B'],
            ['name' => 'React Native', 'color' => '#61DAFB'],
            ['name' => 'WordPress', 'color' => '#21759B'],
            ['name' => 'SQLite', 'color' => '#003B57'],
            ['name' => 'MySQL', 'color' => '#4479A1'],
            ['name' => 'PostgreSQL', 'color' => '#336791'],
            ['name' => 'MongoDB', 'color' => '#47A248'],
            ['name' => 'Redis', 'color' => '#DC382D'],
            ['name' => 'GraphQL', 'color' => '#E10098'],
            ['name' => 'REST API', 'color' => '#FF6F61'],
            ['name' => 'Asteria Warp', 'color' => '#FF6F61'],
            ['name' => 'AWS', 'color' => '#FF9900'],
            ['name' => 'Docker', 'color' => '#2496ED'],
            ['name' => 'Firebase', 'color' => '#FFCA28'],
        ];

        foreach ($technologies as $index => $technology) {
            Technology::create([
                'name' => $technology['name'],
                'color' => $technology['color'],
                'sort_order' => $index,
                'is_active' => true,
                'created_by' => $admin?->id,
                'updated_by' => $admin?->id,
            ]);
        }
    }
}
