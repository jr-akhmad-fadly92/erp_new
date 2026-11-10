<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('module_key', 100);
            $table->string('original_name');
            $table->string('path');
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->string('description')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['module_key', 'company_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
