<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'key',
        'label',
        'description',
        'allowed_roles',
        'allowed_actions',
        'is_active',
    ];

    protected $casts = [
        'allowed_roles' => 'array',
        'allowed_actions' => 'array',
        'is_active' => 'boolean',
    ];
}
