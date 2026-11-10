<?php

namespace App\Services\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ModuleCollectionExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    public string $fileName;

    public function __construct(private readonly iterable $rows, string $moduleLabel = 'Export')
    {
        $this->fileName = str_replace(' ', '-', strtolower($moduleLabel)) . '.xlsx';
    }

    public function collection(): Collection
    {
        return collect($this->rows)->map(function ($row) {
            return [
                $row['code'] ?? $row->code ?? '-',
                $row['name'] ?? $row->name ?? '-',
                $row['status'] ?? $row->status ?? '-',
                $row['description'] ?? $row->description ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return ['Code', 'Name', 'Status', 'Description'];
    }
}
