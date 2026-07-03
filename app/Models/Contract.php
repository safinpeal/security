<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = [
        'client_id',
        'service_id',
        'contract_type_id',
        'start_date',
        'end_date',
        'monthly_rate',
        'total_amount',
        'status',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function contractType()
    {
        return $this->belongsTo(ContractType::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
