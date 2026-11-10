<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UploadService
{
    public function store(UploadedFile $file, array $data): array
    {
        $directory = config('modules.upload.directory', 'uploads');
        $storedPath = $file->store($directory, config('modules.upload.disk', 'public'));

        return [
            'company_id' => $data['company_id'],
            'module_key' => $data['module_key'],
            'original_name' => $file->getClientOriginalName(),
            'path' => $storedPath,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $data['uploaded_by'] ?? null,
            'description' => $data['description'] ?? null,
            'meta' => [
                'slug' => Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)),
                'disk' => config('modules.upload.disk', 'public'),
            ],
        ];
    }
}
