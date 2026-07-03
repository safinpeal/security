<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecurityGuard extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'email',
        'national_id',
        'address',
        'experience',
        'status',
        'resume_path',
        'certificate_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
