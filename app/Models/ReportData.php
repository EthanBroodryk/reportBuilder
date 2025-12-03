<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportData extends Model
{
    protected $table = 'report_data';

    protected $fillable = [
        'report_name',
        'report_json_data',
    ];

    protected $casts = [
        'report_json_data' => 'array',
    ];
}
