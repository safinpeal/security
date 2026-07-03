<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $table = 'gallery'; // Override pluralization to stay matching DB table
    protected $fillable = ['title', 'category', 'image_path'];
}
