# README Modul Accounting

## Lokasi View
`frontend/src/views/accounting/AccountingPage.vue`

## Tujuan Modul
Modul Accounting dipakai untuk mengelola jurnal akuntansi dan menampilkan laporan Neraca serta Laba/Rugi lengkap dengan grafik dan export.

## Fitur Utama
- CRUD Jurnal Akuntansi
- Tampilan Chart of Accounts sebagai ringkasan
- Laporan Neraca
- Laporan Laba/Rugi
- Grafik laba bersih bulanan
- Grafik aset vs ekuitas
- Export CSV dan PDF

## Tab di Halaman
1. `Jurnal Akuntansi`
2. `Neraca & L/R`

## Cara Penggunaan
### 1. Jurnal Akuntansi
- Buka tab `Jurnal Akuntansi`.
- Cari data berdasarkan nomor jurnal, deskripsi, atau referensi.
- Filter status `draft` atau `posted`.
- Klik `Tambah Jurnal` untuk membuat jurnal baru.
- Isi nomor jurnal, tanggal, deskripsi, akun debit, nominal debit, akun kredit, nominal kredit, referensi, dan status.
- Pastikan nilai debit sama dengan kredit sebelum menyimpan.
- Gunakan tombol edit dan hapus bila perlu.

### 2. Neraca & Laba/Rugi
- Buka tab `Neraca & L/R`.
- Pilih bulan jika ingin memfilter data ringkasan.
- Sistem menampilkan struktur Neraca: aset, liabilitas, dan ekuitas.
- Sistem juga menampilkan Laporan Laba/Rugi: pendapatan, HPP, beban, dan laba bersih.
- Grafik pertama memperlihatkan laba bersih bulanan.
- Grafik kedua memperlihatkan perbandingan aset dan ekuitas.
- Klik `Unduh CSV` untuk export laporan teks terstruktur.
- Klik `Unduh PDF` untuk membuka print preview laporan dan menyimpannya sebagai PDF.

## Ringkasan Kartu Statistik
- Jumlah jurnal
- Jumlah akun pada chart of accounts
- Total aset
- Total ekuitas

## Catatan Implementasi
- Halaman menggunakan data dummy dari `frontend/src/data/accountingDummy.js`.
- PDF saat ini memakai mekanisme `window.print()` dari halaman HTML yang dibentuk otomatis.
- Jika backend sudah siap, data summary bisa dipisah menjadi tabel transaksi dan tabel agregat.