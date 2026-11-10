<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            ['code' => 'CMP-001', 'name' => 'PT Nusantara Sukses', 'kota' => 'Jakarta', 'bidang' => 'Manufacturing', 'status' => 'aktif', 'modules' => 18, 'color' => '#26B99A', 'is_active' => true],
            ['code' => 'CMP-002', 'name' => 'PT Mitra Global Industri', 'kota' => 'Surabaya', 'bidang' => 'Trading', 'status' => 'aktif', 'modules' => 12, 'color' => '#1c84c6', 'is_active' => true],
            ['code' => 'CMP-003', 'name' => 'PT Sentra Distribusi Prima', 'kota' => 'Bandung', 'bidang' => 'Distribution', 'status' => 'trial', 'modules' => 8, 'color' => '#f0ad4e', 'is_active' => true],
        ];

        foreach ($companies as $company) {
            DB::table('companies')->updateOrInsert(
                ['code' => $company['code']],
                [
                    'name' => $company['name'],
                    'is_active' => $company['is_active'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
