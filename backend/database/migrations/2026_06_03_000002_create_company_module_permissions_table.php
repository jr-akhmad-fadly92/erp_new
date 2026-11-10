<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_module_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('module_id');
            $table->unsignedInteger('role_id');
            $table->boolean('allowed')->default(false);
            $table->timestamps();

            $table->unique(['company_id', 'module_id', 'role_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_module_permissions');
    }
};
