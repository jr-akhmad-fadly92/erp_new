<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => User::with('company')->orderBy('name')->get(),
        ]);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => $user,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $attributes = $request->validate([
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role_id' => ['required', 'integer'],
            'status' => ['required', 'in:aktif,nonaktif'],
        ]);

        $attributes['password'] = Hash::make($attributes['password']);

        $user = User::create($attributes);

        return response()->json([
            'data' => $user,
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $attributes = $request->validate([
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:6'],
            'role_id' => ['required', 'integer'],
            'status' => ['required', 'in:aktif,nonaktif'],
        ]);

        if (empty($attributes['password'])) {
            unset($attributes['password']);
        } else {
            $attributes['password'] = Hash::make($attributes['password']);
        }

        $user->update($attributes);

        return response()->json([
            'data' => $user,
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus.',
        ]);
    }
}
