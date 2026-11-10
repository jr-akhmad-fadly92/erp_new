<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            if (!Schema::hasColumn('companies', 'kota')) {
                $table->string('kota')->nullable();
            }
            if (!Schema::hasColumn('companies', 'bidang')) {
                $table->string('bidang')->nullable();
            }
            if (!Schema::hasColumn('companies', 'status')) {
                $table->string('status')->default('aktif');
            }
            if (!Schema::hasColumn('companies', 'modules')) {
                $table->unsignedInteger('modules')->default(0);
            }
            if (!Schema::hasColumn('companies', 'color')) {
                $table->string('color')->default('#26B99A');
            }
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            if (Schema::hasColumn('companies', 'kota')) {
                $table->dropColumn('kota');
            }
            if (Schema::hasColumn('companies', 'bidang')) {
                $table->dropColumn('bidang');
            }
            if (Schema::hasColumn('companies', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('companies', 'modules')) {
                $table->dropColumn('modules');
            }
            if (Schema::hasColumn('companies', 'color')) {
                $table->dropColumn('color');
            }
        });
    }
};
