<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Company::orderBy('name')->get(),
        ]);
    }

    public function show(Company $company): JsonResponse
    {
        return response()->json([
            'data' => $company,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $attributes = $request->validate([
            'code' => ['nullable', 'string', 'max:30', 'unique:companies,code'],
            'name' => ['required', 'string', 'max:255'],
            'kota' => ['nullable', 'string', 'max:100'],
            'bidang' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:aktif,trial,nonaktif'],
            'modules' => ['nullable', 'integer', 'min:0'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        if (empty($attributes['code'])) {
            $attributes['code'] = $this->generateCode($attributes['name']);
        }

        $attributes['is_active'] = $attributes['status'] !== 'nonaktif';
        $attributes['modules'] = $attributes['modules'] ?? 0;
        $attributes['color'] = $attributes['color'] ?? '#26B99A';

        $company = Company::create($attributes);

        return response()->json([
            'data' => $company,
        ], 201);
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        $attributes = $request->validate([
            'code' => ['nullable', 'string', 'max:30', 'unique:companies,code,' . $company->id],
            'name' => ['required', 'string', 'max:255'],
            'kota' => ['nullable', 'string', 'max:100'],
            'bidang' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:aktif,trial,nonaktif'],
            'modules' => ['nullable', 'integer', 'min:0'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        $attributes['code'] = $attributes['code'] ?? $company->code;
        $attributes['is_active'] = $attributes['status'] !== 'nonaktif';
        $attributes['modules'] = $attributes['modules'] ?? $company->modules;
        $attributes['color'] = $attributes['color'] ?? $company->color;

        $company->update($attributes);

        return response()->json([
            'data' => $company,
        ]);
    }

    public function destroy(Company $company): JsonResponse
    {
        $company->delete();

        return response()->json([
            'message' => 'Perusahaan berhasil dihapus.',
        ]);
    }

    private function generateCode(string $name): string
    {
        $prefix = 'CMP-'.Str::upper(Str::substr(preg_replace('/[^A-Z0-9]+/', '', Str::upper($name)), 0, 6));
        $code = $prefix;
        $counter = 1;

        while (Company::where('code', $code)->exists()) {
            $code = sprintf('%s-%02d', $prefix, $counter++);
        }

        return $code;
    }
}
