# README Modul Quality Control

## Lokasi View
`frontend/src/views/qc/QcPage.vue`

## Tujuan Modul
Modul Quality Control dipakai untuk mengelola inspeksi QC produk, menerbitkan sertifikat QC, serta melihat ringkasan kualitas dalam bentuk laporan dan grafik.

## Fitur Utama
- CRUD Inspeksi QC
- CRUD Sertifikat QC
- Grafik hasil inspeksi
- Grafik pass rate bulanan
- Ringkasan pass rate dan defect rate
- Export CSV dan PDF

## Tab di Halaman
1. `Inspeksi QC`
2. `Sertifikat QC`

## Cara Penggunaan
### 1. Inspeksi QC
- Buka tab `Inspeksi QC`.
- Cari data berdasarkan nomor inspeksi, nama produk, atau inspector.
- Filter status `passed`, `warning`, atau `failed`.
- Klik `Tambah Inspeksi` untuk menambahkan inspeksi baru.
- Isi nomor inspeksi, tanggal, produk, quantity, sample size, defect found, inspector, status, dan catatan.
- Gunakan tombol edit untuk memperbarui data inspeksi.
- Gunakan tombol hapus untuk menghapus data inspeksi.

### 2. Sertifikat QC
- Buka tab `Sertifikat QC`.
- Cari data sertifikat berdasarkan nomor sertifikat atau nama produk.
- Klik `Tambah Sertifikat` untuk menerbitkan sertifikat baru.
- Isi nomor sertifikat, tanggal, produk, batch number, grade, masa berlaku, penerbit, dan status.
- Sistem menampilkan daftar sertifikat dan status aktif/expired.

### 3. Laporan dan Grafik
- Pada tab `Sertifikat QC`, sistem menampilkan grafik hasil inspeksi terbaru.
- Sistem juga menampilkan trend `pass rate` bulanan.
- Ringkasan statistik di bagian atas menampilkan jumlah inspeksi, jumlah sertifikat aktif, pass rate, dan defect rate.
- Klik `Unduh CSV` untuk export laporan inspeksi dan sertifikat.
- Klik `Unduh PDF` untuk membuka print preview laporan QC.

## Catatan Implementasi
- Halaman menggunakan data dummy dari `frontend/src/data/qcDummy.js`.
- Master produk saat ini masih dummy dan dipakai oleh form inspeksi/sertifikat.
- Jika backend disiapkan, sertifikat idealnya terkait langsung ke hasil inspeksi atau batch produksi.