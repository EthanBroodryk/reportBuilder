<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory; // ✅ For reading Excel files

class DataController extends Controller
{
    public function importData()
    {
        // Get list of previously uploaded Excel files
        $files = collect(Storage::files('public/import-data'))
            ->map(fn($path) => basename($path))
            ->values();

        return Inertia::render('importData', [
            'files' => $files,
        ]);
    }

    
 public function upload(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls|max:5120', 
    ]);

    $file = $request->file('file');
    $fileName = $file->getClientOriginalName();
    $path = $file->storeAs('public/imports', $fileName);

    
    return response()->json([
        'message' => 'File uploaded successfully!',
        'filename' => basename($path),
    ]);
}


    
public function getData($filename)
{
    $path = storage_path('app/public/imports/' . $filename);

    if (!file_exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    $spreadsheet = IOFactory::load($path);
    $sheet = $spreadsheet->getActiveSheet();
    $rows = $sheet->toArray();
    // Convert first row to headers
    $headers = array_shift($rows); // first row = headers
    $data = [];

    foreach ($rows as $row) {
        // Fill missing values with null
        $row = array_pad($row, count($headers), null);
        $data[] = array_combine($headers, $row);
    }

    return response()->json($data);
}

}
