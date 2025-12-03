<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportBuilderController extends Controller
{
    public function index(Request $request)
    {
        $fileName = $request->query('file');
        

        if (!$fileName) {
            return Inertia::render('ReportBuilder', [
                'fileData' => null,
                'error' => 'No file name provided.',
            ]);
        }

        $files = Storage::files('public/imports');

        $matchedFile = collect($files)->first(function ($file) use ($fileName) {
            return str_contains($file, $fileName);
        });

        if (!$matchedFile) {
            return Inertia::render('ReportBuilder', [
                'fileData' => null,
                'error' => "File '{$fileName}' not found.",
            ]);
        }

        $fullPath = Storage::path($matchedFile);

       // dd($fullPath);
        $array = Excel::toArray([], $fullPath);
        return Inertia::render('ReportBuilder', [
        'fileData' => [
            'filename' => basename($matchedFile),
            'sheets'   => $array,
            ],
            'error' => null,
        ]);

    }
}
