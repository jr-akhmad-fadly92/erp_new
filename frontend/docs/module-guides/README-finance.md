# README Modul Finance

## Lokasi View
`frontend/src/views/finance/FinancePage.vue`

## Tujuan Modul
Modul Finance dipakai untuk mengelola akun kas/bank, transaksi kas masuk dan keluar, serta menampilkan laporan keuangan bulanan.

## Fitur Utama
- CRUD Akun Kas & Bank
- CRUD Transaksi Kas & Bank
- Laporan keuangan bulanan
- Grafik laba bersih bulanan
- Export laporan ke CSV
- Ringkasan saldo dan laba

## Tab di Halaman
1. `Kas & Bank`
2. `Laporan Keuangan`

## Cara Penggunaan
### 1. Kas & Bank
- Buka tab `Kas & Bank`.
- Bagian pertama dipakai untuk master akun kas/bank.
- Cari akun berdasarkan kode atau nama akun.
- Filter akun berdasarkan status `aktif` atau `nonaktif`.
- Klik `Tambah Akun` untuk menambahkan akun baru.
- Isi kode akun, nama akun, tipe, nama bank, nomor rekening, saldo, dan status.

### 2. Transaksi Kas & Bank
- Masih di tab `Kas & Bank`, lihat tabel transaksi pada bagian bawah.
- Cari transaksi berdasarkan nomor transaksi, referensi, atau kategori.
- Filter tipe transaksi `masuk` atau `keluar`.
- Filter status `draft` atau `posted`.
- Klik `Tambah Transaksi` untuk membuat transaksi baru.
- Isi nomor transaksi, tanggal, akun, tipe, kategori, referensi, nominal, dan status.

### 3. Laporan Keuangan
- Buka tab `Laporan Keuangan`.
- Pilih tahun untuk memfilter data laporan.
- Sistem menampilkan ringkasan total pendapatan, beban, laba bersih, dan arus kas bersih.
- Sistem menampilkan grafik laba bersih bulanan.
- Tabel laporan memperlihatkan pendapatan, beban, laba bersih, kas masuk, kas keluar, dan net cash flow.
- Klik `Unduh CSV` untuk export laporan.

## Ringkasan Kartu Statistik
- Jumlah akun kas & bank
- Jumlah transaksi
- Total saldo seluruh akun
- Total laba bersih laporan

## Catatan Implementasi
- Halaman menggunakan data dummy dari `frontend/src/data/financeDummy.js`.
- Report bulanan bersifat agregat dan cocok dipetakan ke tabel summary/reporting.
- Export saat ini tersedia dalam format CSV.