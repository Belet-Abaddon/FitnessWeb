<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BmiRecord extends Model
{
    protected $fillable = ['user_id', 'weight', 'height', 'bmi_value', 'bmi_category'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
