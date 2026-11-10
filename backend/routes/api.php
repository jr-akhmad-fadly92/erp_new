<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CompanyController;
use App\Http\Controllers\Api\V1\CompanyPermissionController;
use App\Http\Controllers\Api\V1\ExportController;
use App\Http\Controllers\Api\V1\MasterDataController;
use App\Http\Controllers\Api\V1\ModuleController;
use App\Http\Controllers\Api\V1\UploadController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/modules', [ModuleController::class, 'index']);
    Route::get('/modules/{module}', [ModuleController::class, 'show']);
    Route::get('/modules/{module}/permissions', [ModuleController::class, 'permissions']);

    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::middleware('module.access:master-data')->group(function () {
        Route::apiResource('/master-data', MasterDataController::class);
        Route::apiResource('/companies', CompanyController::class);
        Route::apiResource('/users', UserController::class);
        Route::get('/companies/{company}/permissions', [CompanyPermissionController::class, 'index']);
        Route::put('/companies/{company}/permissions', [CompanyPermissionController::class, 'update']);
        Route::post('/master-data/{master_data}/upload', [UploadController::class, 'store']);
        Route::get('/master-data/export/pdf', [ExportController::class, 'pdf']);
        Route::get('/master-data/export/excel', [ExportController::class, 'excel']);
    });

    Route::middleware('module.access:reporting')->group(function () {
        Route::get('/reports/{module}/pdf', [ExportController::class, 'pdf']);
        Route::get('/reports/{module}/excel', [ExportController::class, 'excel']);
    });
});
