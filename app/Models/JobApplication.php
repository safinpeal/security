<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'national_id',
        'address',
        'experience',
        'resume_path',
        'certificate_path',
        'status',
    ];
}
