# Rencana Tabel per Modul

Folder ini berisi versi pecahan dari file `rencana_tabel_modul_view.txt`.

## Daftar File
- `00-master-akses-dan-perusahaan.txt`
- `01-import.txt`
- `02-sales.txt`
- `03-finance.txt`
- `04-accounting.txt`
- `05-quality-control.txt`
- `06-audit-log.txt`
- `07-gudang.txt`
- `08-purchasing.txt`
- `09-pengguna.txt`
- `10-hak-akses.txt`
- `11-perusahaan.txt`

## Tujuan
- Memudahkan tim backend membaca rencana tabel per domain modul.
- Memudahkan pembagian pekerjaan migration/API per modul.
- Memisahkan tabel master umum dari tabel transaksi.

## Catatan
- Isi file-file ini diturunkan dari `docs/rencana_tabel_modul_view.txt`.
- Jika ada perubahan struktur view atau model backend, file terkait perlu ikut diperbarui.
