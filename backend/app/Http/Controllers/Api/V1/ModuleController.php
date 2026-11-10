<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ModuleRegistry;
use Illuminate\Http\JsonResponse;

class ModuleController extends Controller
{
    public function __construct(private readonly ModuleRegistry $modules)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->modules->all(),
        ]);
    }

    public function show(string $module): JsonResponse
    {
        $detail = $this->modules->find($module);

        if (! $detail) {
            return response()->json([
                'message' => 'Modul tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'data' => $detail,
        ]);
    }

    public function permissions(string $module): JsonResponse
    {
        $detail = $this->modules->find($module);

        if (! $detail) {
            return response()->json([
                'message' => 'Modul tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'data' => [
                'module' => $detail,
                'roles' => $this->modules->matrix($module),
            ],
        ]);
    }
}
