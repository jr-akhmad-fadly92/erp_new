<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterData extends Model
{
    protected $fillable = [
        'company_id',
        'code',
        'name',
        'category',
        'status',
        'description',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
