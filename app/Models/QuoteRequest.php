<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    protected $fillable = [
        'company_name',
        'contact_person',
        'phone',
        'email',
        'location',
        'industry',
        'guards_needed',
        'contract_type',
        'start_date',
        'additional_requirements',
        'status',
    ];
}
