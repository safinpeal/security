<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'key_responsibilities',
        'benefits',
        'industries_served',
        'image_path',
    ];

    protected $casts = [
        'key_responsibilities' => 'array',
        'benefits' => 'array',
        'industries_served' => 'array',
    ];

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }
}
