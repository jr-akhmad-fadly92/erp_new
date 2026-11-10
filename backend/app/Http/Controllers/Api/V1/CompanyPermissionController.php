<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyModulePermission;
use App\Services\ModuleRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class CompanyPermissionController extends Controller
{
    public function index(Company $company, ModuleRegistry $modules): JsonResponse
    {
        $stored = CompanyModulePermission::where('company_id', $company->id)->get();
        $matrix = [];

        foreach ($stored as $permission) {
            $matrix[$permission->module_id][$permission->role_id] = $permission->allowed;
        }

        if (empty($matrix)) {
            foreach ($modules->all() as $moduleKey => $moduleConfig) {
                foreach ($modules->roles() as $roleId => $roleName) {
                    $matrix[$moduleKey][$roleId] = in_array($roleId, $moduleConfig['allowed_roles'] ?? [], true);
                }
            }
        }

        return response()->json([
            'data' => $matrix,
        ]);
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        $payload = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*.module_id' => ['required', 'string'],
            'permissions.*.role_id' => ['required', 'integer'],
            'permissions.*.allowed' => ['required', 'boolean'],
        ]);

        CompanyModulePermission::where('company_id', $company->id)->delete();

        $records = array_map(fn ($item) => [
            'company_id' => $company->id,
            'module_id' => $item['module_id'],
            'role_id' => $item['role_id'],
            'allowed' => $item['allowed'],
            'created_at' => now(),
            'updated_at' => now(),
        ], $payload['permissions']);

        if (! empty($records)) {
            CompanyModulePermission::insert($records);
        }

        return response()->json([
            'message' => 'Hak akses modul perusahaan berhasil disimpan.',
        ]);
    }
}
