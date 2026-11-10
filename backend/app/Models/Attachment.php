<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'company_id',
        'module_key',
        'original_name',
        'path',
        'mime_type',
        'size',
        'uploaded_by',
        'description',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
