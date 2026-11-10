<?php

namespace App\Services;

use App\Services\Exports\ModuleCollectionExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class ExportService
{
    public function pdf(string $viewName, array $payload, string $fileName = 'export.pdf')
    {
        return Pdf::loadView($viewName, $payload)->download($fileName);
    }

    public function excel(iterable $rows, string $moduleLabel = 'Export')
    {
        return Excel::download(new ModuleCollectionExport($rows, $moduleLabel), strtolower(str_replace(' ', '-', $moduleLabel)) . '.xlsx');
    }
}
