# Dokumentasi Modul View ERP Frontend

Dokumentasi ini merangkum panduan penggunaan modul view yang sudah dibuat di frontend ERP.

## Struktur Dokumentasi
- `module-guides/` : panduan penggunaan per modul view
- `rencana_tabel_modul_view.txt` : usulan rencana tabel backend untuk mendukung masing-masing modul view
- `rencana-tabel-modul/` : versi pecahan file rencana tabel per modul/domain
- `alur_penggunaan_aplikasi.txt` : alur penggunaan aplikasi dari awal sampai akhir
- `rencana_api_backend_semua_modul.txt` : kontrak endpoint API backend untuk semua modul

## Daftar Panduan Modul
1. Import
   - File: `module-guides/README-import.md`
   - Cakupan: penerimaan barang, clearance barang, dokumen impor, laporan import

2. Gudang
   - File: `module-guides/README-gudang.md`
   - Cakupan: stock barang, mutasi gudang, opname stok, laporan gudang

3. Purchasing
   - File: `module-guides/README-purchasing.md`
   - Cakupan: supplier, purchase order, invoice pembelian, laporan purchasing

4. Pengguna
   - File: `module-guides/README-pengguna.md`
   - Cakupan: manajemen akun user, password, pindah perusahaan, status user

5. Hak Akses
   - File: `module-guides/README-hak-akses.md`
   - Cakupan: matrix permission role vs modul per perusahaan

6. Perusahaan
   - File: `module-guides/README-perusahaan.md`
   - Cakupan: master perusahaan, detail perusahaan, distribusi user

7. Sales
   - File: `module-guides/README-sales.md`
   - Cakupan: pelanggan, sales order, target sales, invoice, laporan sales

8. Finance
   - File: `module-guides/README-finance.md`
   - Cakupan: akun kas & bank, transaksi kas/bank, laporan keuangan

9. Accounting
   - File: `module-guides/README-accounting.md`
   - Cakupan: jurnal akuntansi, neraca, laba/rugi, export CSV/PDF

10. Quality Control
   - File: `module-guides/README-quality-control.md`
   - Cakupan: inspeksi QC, sertifikat QC, laporan dan grafik QC

11. Audit Log
   - File: `module-guides/README-audit-log.md`
   - Cakupan: log aktivitas, laporan aktivitas, distribusi action, export CSV/PDF

## File Rencana Tabel
- `rencana_tabel_modul_view.txt`
- Isi file ini berupa usulan tabel backend, relasi utama, dan kolom inti untuk tiap modul view.
- `rencana-tabel-modul/README.md`
- Folder ini berisi file `.txt` per modul agar pembacaan dan pembagian pekerjaan backend lebih mudah.

## File Alur Aplikasi
- `alur_penggunaan_aplikasi.txt`
- File ini berisi alur penggunaan aplikasi secara end-to-end, mulai dari login, setup admin, operasional tiap modul, sampai monitoring dan audit.

## File Rencana API Backend
- `rencana_api_backend_semua_modul.txt`
- File ini berisi rencana endpoint API, request payload, dan response data semua modul agar backend dapat langsung menyesuaikan implementasi.

## Urutan Baca yang Disarankan
1. Baca panduan modul yang ingin dipakai.
2. Cocokkan form dan tabel pada view dengan data dummy di `src/data/`.
3. Gunakan `rencana_tabel_modul_view.txt` sebagai referensi saat membuat migration dan API backend.

## Catatan
- Dokumentasi ini mengikuti implementasi frontend saat ini.
- Jika struktur form atau field di view berubah, file README dan rencana tabel perlu ikut diperbarui.
