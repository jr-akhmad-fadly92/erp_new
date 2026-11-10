<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('master_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('code', 50);
            $table->string('name');
            $table->string('category', 100);
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->text('description')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_data');
    }
};
