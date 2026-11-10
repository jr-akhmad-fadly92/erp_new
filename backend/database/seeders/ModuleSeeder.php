<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = config('modules.modules', []);

        foreach ($modules as $key => $module) {
            DB::table('modules')->updateOrInsert(
                ['key' => $key],
                [
                    'label' => $module['label'],
                    'description' => $module['description'] ?? null,
                    'allowed_roles' => json_encode($module['allowed_roles']),
                    'allowed_actions' => json_encode($module['actions'] ?? []),
                    'is_active' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
