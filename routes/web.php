<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Http\Request;
use App\Http\Controllers\ReportBuilderController;
use App\Http\Controllers\DataController;
use Illuminate\Support\Facades\File;

Route::prefix('data')->group(function () {
    Route::get('/', [DataController::class, 'importData'])->name('data.index');
    Route::post('/import-data/upload', [DataController::class, 'upload'])->name('data.store');
    Route::get('/import-data/data/{filename}', [DataController::class, 'getData']);
    Route::post('/import-data/save-mapping', [DataController::class, 'saveMapping']);
});


 Route::get('/api/reports',[DataController::class,'getfiles']);

// Route::get('/api/reports',function(){

//     $path = public_path('storage/imports');
//     $files = collect(File::files($path))->map(function($file){
//         return [
//             'title' => pathinfo($file->getFilename(), PATHINFO_FILENAME),
//             'href' => '/reports/' . strtolower(str_replace(' ', '-', pathinfo($file->getFilename(), PATHINFO_FILENAME))),
//             'icon' => 'FileText', 
//         ];

//     });
//      return response()->json($files);

// });

Route::prefix('report-builder')->name('report.')->group(function () {
    Route::get('/', [ReportBuilderController::class, 'index'])->name('builder');
    Route::post('/upload', [ReportBuilderController::class, 'upload'])->name('builder.upload');
    Route::get('/files/{filename}', [ReportBuilderController::class, 'show'])->name('builder.show');
});



// Route::get('/report-builder', [ReportBuilderController::class, 'index'])->name('report.builder');
// Route::post('/report-builder/upload', [ReportBuilderController::class, 'upload'])->name('report.builder.upload');
// Route::get('/report-builder/files/{filename}', [ReportBuilderController::class, 'show'])->name('report.builder.show');



Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});






require __DIR__.'/settings.php';
