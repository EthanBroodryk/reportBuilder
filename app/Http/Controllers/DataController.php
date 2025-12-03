<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory; 
use App\Models\ReportData;

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

// public function saveMapping(Request $request)
// {

//    // dd($request);
//     $validated = $request->validate([
//         'file' => 'required|string',
//         'categoryColumn' => 'sometimes|string',
//         'valueColumns' => 'required|array',
//     ]);

//     // Clean nulls out of valueColumns
//     $validated['valueColumns'] = array_filter($validated['valueColumns']);

    
//     ReportData::create([
//         'report_name' => $validated['file'],
//         'report_json_data' => $validated, 
//     ]);

//     return response()->json(['message' => 'Mapping saved successfully!']);
// }
public function saveMapping(Request $request)
{
    
    // $request->validate([
    //     'file' => 'required|string',
    //     'categoryColumn' => 'nullable|string',
    //     'valueColumns' => 'required|array',
    //     // DO NOT validate excelData here unless necessary
    // ]);

    $validated = $request->validate([
    'file' => 'required|string',

    // Allow both metadata mode and normal mode
    'categoryColumn' => 'nullable|string',
    'valueColumns' => 'nullable|array',

    'categoryRow' => 'nullable|array',
    'valueRow' => 'nullable|array',

    'excelData' => 'required|array',
]);



    $data = $request->all();

    
    if (isset($data['valueColumns'])) {
        $data['valueColumns'] = array_filter($data['valueColumns']);
    }
    
    ReportData::create([
        'report_name' => $data['file'],
        'report_json_data' => $data,  
    ]);

    return response()->json([
        'message' => 'Mapping saved successfully!'
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
