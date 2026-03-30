<?php

use App\Http\Controllers\UiBlockController;
use Illuminate\Support\Facades\Route;

// ── OPTIONS preflight (CORS) ───────────────────────────────
Route::options('/{any}', [UiBlockController::class, 'options'])->where('any', '.*');

// ── Admin routes ───────────────────────────────────────────
Route::prefix('admin/blocks')->group(function () {
    Route::get('/',          [UiBlockController::class, 'adminIndex']);
    Route::post('/',         [UiBlockController::class, 'store']);
    Route::put('/reorder',   [UiBlockController::class, 'reorder']);
    Route::put('/{uiBlock}', [UiBlockController::class, 'update']);
    Route::patch('/{uiBlock}/toggle', [UiBlockController::class, 'toggle']);
    Route::delete('/{uiBlock}',       [UiBlockController::class, 'destroy']);
});

// ── Client route ───────────────────────────────────────────
Route::get('client/blocks', [UiBlockController::class, 'clientIndex']);
