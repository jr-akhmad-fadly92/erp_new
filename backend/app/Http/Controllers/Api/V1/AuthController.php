<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ModuleRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request, ModuleRegistry $modules): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.',
            ], 401);
        }

        if ($user->status === 'nonaktif') {
            return response()->json([
                'message' => 'Akun Anda tidak aktif. Hubungi administrator.',
            ], 403);
        }

        return response()->json([
            'message' => 'Login berhasil.',
            'token_type' => 'Bearer',
            'access_token' => 'access-token-' . $user->id,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => (int) $user->role_id,
                'company_id' => (int) $user->company_id,
                'status' => $user->status,
            ],
        ]);
    }

    public function logout(): JsonResponse
    {
        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }
}
