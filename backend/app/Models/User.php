<?php

namespace App\Models;

use App\Models\Company;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'role_id',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'role_id' => 'integer',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
