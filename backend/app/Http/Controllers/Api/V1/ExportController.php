<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MasterData;
use App\Services\Exports\ModuleCollectionExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function pdf(Request $request, string $module)
    {
        $rows = $this->sampleRows($module, $request);

        $pdf = Pdf::loadView('exports.master-data', [
            'module' => $module,
            'rows' => $rows,
        ]);

        return $pdf->download($module . '.pdf');
    }

    public function excel(Request $request, string $module)
    {
        $rows = $this->sampleRows($module, $request);

        return Excel::download(
            new ModuleCollectionExport($rows, strtoupper(str_replace('-', ' ', $module))),
            $module . '.xlsx'
        );
    }

    private function sampleRows(string $module, Request $request)
    {
        if ($module === 'master-data') {
            return MasterData::query()
                ->when($request->integer('company_id'), function ($query, $companyId) {
                    $query->where('company_id', $companyId);
                })
                ->get();
        }

        return collect([
            [
                'code' => 'SAMPLE-001',
                'name' => 'Contoh data ' . $module,
                'status' => 'Active',
            ],
        ]);
    }
}
