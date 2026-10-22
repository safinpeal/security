<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'client_name',
        'designation',
        'company',
        'feedback',
        'rating',
        'image_path',
    ];
}
