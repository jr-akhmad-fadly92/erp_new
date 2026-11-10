<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        h1 { font-size: 18px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        th { background: #f3f4f6; }
    </style>
</head>
<body>
    <h1>Export {{ strtoupper($module) }}</h1>
    <table>
        <thead>
            <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Status</th>
                <th>Deskripsi</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $row)
                <tr>
                    <td>{{ data_get($row, 'code', '-') }}</td>
                    <td>{{ data_get($row, 'name', '-') }}</td>
                    <td>{{ data_get($row, 'status', '-') }}</td>
                    <td>{{ data_get($row, 'description', '-') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4">Tidak ada data.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
