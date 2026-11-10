<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UploadRequest;
use App\Models\Attachment;
use App\Services\UploadService;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function __construct(private readonly UploadService $uploads)
    {
    }

    public function store(UploadRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $stored = $this->uploads->store($file, $request->validated());

        $attachment = Attachment::create($stored);

        return response()->json([
            'message' => 'File berhasil diupload.',
            'data' => $attachment,
        ], 201);
    }
}
