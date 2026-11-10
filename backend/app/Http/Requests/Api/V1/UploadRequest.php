<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'module_key' => ['required', 'string', 'max:100'],
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'file' => ['required', 'file', 'max:10240'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
