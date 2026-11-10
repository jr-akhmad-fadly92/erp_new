<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\MasterDataRequest;
use App\Models\MasterData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MasterDataController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = MasterData::query()
            ->when($request->integer('company_id'), function ($query, $companyId) {
                $query->where('company_id', $companyId);
            })
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json($items);
    }

    public function store(MasterDataRequest $request): JsonResponse
    {
        $item = MasterData::create($request->validated());

        return response()->json([
            'message' => 'Master data berhasil dibuat.',
            'data' => $item,
        ], 201);
    }

    public function show(MasterData $masterData): JsonResponse
    {
        return response()->json([
            'data' => $masterData,
        ]);
    }

    public function update(MasterDataRequest $request, MasterData $masterData): JsonResponse
    {
        $masterData->update($request->validated());

        return response()->json([
            'message' => 'Master data berhasil diperbarui.',
            'data' => $masterData->refresh(),
        ]);
    }

    public function destroy(MasterData $masterData): JsonResponse
    {
        $masterData->delete();

        return response()->json([
            'message' => 'Master data berhasil dihapus.',
        ]);
    }
}
