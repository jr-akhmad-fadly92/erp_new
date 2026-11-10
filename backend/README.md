# ERP Backend

Backend ini disiapkan sebagai scaffold Laravel 13 untuk ERP multi perusahaan yang mengikuti struktur modul di frontend.

## Kebutuhan

- PHP 8.3 atau lebih baru
- Composer
- MySQL / MariaDB
- Ekstensi PHP standar Laravel

## Fitur Scaffold

- Sistem modul mengikuti frontend
- API modular per modul ERP
- Middleware akses modul berdasarkan role
- Export PDF dan Excel
- Upload file per modul

## Modul

- Dashboard
- Master Data
- Purchasing
- Import
- Gudang
- Sales
- Finance
- Quality Control
- Laporan Direksi
- Pengaturan Sistem

## Endpoint API

- `GET /api/v1/modules`
- `GET /api/v1/modules/{module}`
- `GET /api/v1/modules/{module}/permissions`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/master-data`
- `POST /api/v1/master-data`
- `PUT /api/v1/master-data/{id}`
- `DELETE /api/v1/master-data/{id}`
- `POST /api/v1/master-data/{id}/upload`
- `GET /api/v1/master-data/export/pdf`
- `GET /api/v1/master-data/export/excel`

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

## Catatan

Environment ini saat ini berjalan di PHP 8.2, sementara Laravel 13 membutuhkan PHP 8.3. Scaffold sudah dibuat, tetapi untuk menjalankan dependensi Laravel 13 secara penuh perlu upgrade PHP ke 8.3+ atau gunakan environment lain yang kompatibel.
