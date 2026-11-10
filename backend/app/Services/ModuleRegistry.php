<?php

namespace App\Services;

class ModuleRegistry
{
    public function all(): array
    {
        return config('modules.modules', []);
    }

    public function find(string $moduleKey): ?array
    {
        return $this->all()[$moduleKey] ?? null;
    }

    public function roles(): array
    {
        return config('modules.roles', []);
    }

    public function allowedRoles(string $moduleKey): array
    {
        return $this->find($moduleKey)['allowed_roles'] ?? [];
    }

    public function actions(string $moduleKey): array
    {
        return $this->find($moduleKey)['actions'] ?? [];
    }

    public function canAccess(int $roleId, string $moduleKey): bool
    {
        return in_array($roleId, $this->allowedRoles($moduleKey), true);
    }

    public function matrix(string $moduleKey): array
    {
        $module = $this->find($moduleKey);

        if (!$module) {
            return [];
        }

        $matrix = [];

        foreach ($this->roles() as $roleId => $roleName) {
            $matrix[] = [
                'role_id' => (int) $roleId,
                'role_name' => $roleName,
                'allowed' => in_array((int) $roleId, $module['allowed_roles'], true),
                'actions' => $module['actions'],
            ];
        }

        return $matrix;
    }
}
