<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyModulePermission extends Model
{
    protected $fillable = [
        'company_id',
        'module_id',
        'role_id',
        'allowed',
    ];

    protected $casts = [
        'allowed' => 'boolean',
        'role_id' => 'integer',
    ];
}
