<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Http\Request;
use App\Http\Controllers\ReportBuilderController;

Route::get('/report-builder', [ReportBuilderController::class, 'index'])->name('report.builder');
Route::post('/report-builder/upload', [ReportBuilderController::class, 'upload'])->name('report.builder.upload');
Route::get('/report-builder/files/{filename}', [ReportBuilderController::class, 'show'])->name('report.builder.show');

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
