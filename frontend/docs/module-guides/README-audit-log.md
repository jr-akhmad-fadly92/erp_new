# README Modul Audit Log

## Lokasi View
`frontend/src/views/auditlog/AuditLogPage.vue`

## Tujuan Modul
Modul Audit Log dipakai untuk memantau aktivitas user, melihat histori perubahan, serta menganalisis distribusi aktivitas per bulan, per modul, dan per jenis aksi.

## Fitur Utama
- Pencarian log aktivitas
- Filter action dan status
- Laporan aktivitas bulanan
- Grafik distribusi action
- Ringkasan penggunaan modul
- Ringkasan top users
- Export CSV dan PDF

## Tab di Halaman
1. `Audit Log`
2. `Laporan Aktivitas`

## Cara Penggunaan
### 1. Audit Log
- Buka tab `Audit Log`.
- Cari log berdasarkan nama user, action, module, reference, atau deskripsi.
- Filter action seperti `CREATE`, `UPDATE`, `DELETE`, `VIEW`, atau `EXPORT`.
- Filter status `success` atau `failed`.
- Tabel akan menampilkan waktu, user, action, modul, referensi, deskripsi, IP address, dan status.
- Klik `CSV` untuk export data log.
- Klik `PDF` untuk membuka print preview log.

### 2. Laporan Aktivitas
- Buka tab `Laporan Aktivitas`.
- Lihat grafik aktivitas bulanan untuk total event per bulan.
- Lihat grafik distribusi action untuk membandingkan CREATE, UPDATE, DELETE, VIEW, dan EXPORT.
- Lihat kartu `Module Usage` untuk memantau modul paling aktif.
- Lihat `Top Users` untuk memantau user dengan aktivitas terbanyak.
- Lihat tabel ringkasan bulanan di bagian bawah.

## Ringkasan Kartu Statistik
- Total log
- Total action CREATE
- Total action UPDATE
- Total action DELETE

## Catatan Implementasi
- Halaman menggunakan data dummy dari `frontend/src/data/auditLogDummy.js`.
- Halaman saat ini fokus pada monitoring dan reporting, bukan form CRUD manual.
- Struktur `changes` pada log cocok disimpan sebagai JSON untuk histori perubahan data.