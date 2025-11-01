<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReportBuilderController extends Controller
{
    /**
     * Show the Report Builder page.
     */
    public function index()
    {
        // Get all uploaded Excel files
        $files = collect(Storage::files('public/excel'))
            ->map(function ($path) {
                return [
                    'name' => basename($path),
                    'url' => asset(str_replace('public/', 'storage/', $path)),
                ];
            });

        return Inertia::render('ReportBuilder', [
            'files' => $files,
        ]);
    }

    /**
     * Handle Excel file uploads.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');

        $path = $file->storeAs('public/excel', $file->getClientOriginalName());

        return response()->json([
            'message' => 'File uploaded successfully',
            'path' => $path,
            'url' => asset(str_replace('public/', 'storage/', $path)),
        ]);
    }

    /**
     * Fetch file content (optional - for reading Excel into JSON later).
     */
    public function show($filename)
    {
        $path = 'public/excel/' . $filename;

        if (!Storage::exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Example: just return file path; you can later use PhpSpreadsheet to parse Excel
        return response()->json([
            'name' => $filename,
            'path' => $path,
            'url' => asset(str_replace('public/', 'storage/', $path)),
        ]);
    }
}
