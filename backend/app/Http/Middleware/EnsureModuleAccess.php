<?php

namespace App\Http\Middleware;

use App\Models\CompanyModulePermission;
use App\Services\ModuleRegistry;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleAccess
{
    public function __construct(private readonly ModuleRegistry $modules)
    {
    }

    public function handle(Request $request, Closure $next, string $moduleKey): Response|JsonResponse
    {
        $roleId = (int) $request->header('X-Role-Id', $request->integer('role_id', 0));
        $companyId = (int) $request->header('X-Company-Id', $request->integer('company_id', 0));

        if ($roleId <= 0) {
            return response()->json([
                'message' => 'Role header X-Role-Id atau role_id wajib dikirim.',
            ], 401);
        }

        if ($companyId > 0 && Schema::hasTable('company_module_permissions')) {
            $permission = CompanyModulePermission::where('company_id', $companyId)
                ->where('module_id', $moduleKey)
                ->where('role_id', $roleId)
                ->first();

            if ($permission !== null) {
                if (! $permission->allowed) {
                    return response()->json([
                        'message' => 'Role tidak memiliki akses ke modul ini.',
                        'module' => $moduleKey,
                    ], 403);
                }

                return $next($request);
            }
        }

        if (! $this->modules->canAccess($roleId, $moduleKey)) {
            return response()->json([
                'message' => 'Role tidak memiliki akses ke modul ini.',
                'module' => $moduleKey,
            ], 403);
        }

        return $next($request);
    }
}
