<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'code',
        'name',
        'kota',
        'bidang',
        'status',
        'modules',
        'color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'modules' => 'integer',
    ];

    protected $attributes = [
        'status' => 'aktif',
        'modules' => 0,
        'color' => '#26B99A',
    ];
}
