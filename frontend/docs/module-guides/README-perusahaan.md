# README Modul Perusahaan

## Lokasi View
`frontend/src/views/perusahaan/PerusahaanPage.vue`

## Tujuan Modul
Modul Perusahaan dipakai untuk mengelola data perusahaan, melihat ringkasan jumlah pengguna per perusahaan, serta melihat distribusi user berdasarkan role.

## Fitur Utama
- Tambah perusahaan
- Edit perusahaan
- Hapus perusahaan
- Daftar kartu perusahaan
- Detail perusahaan
- Ringkasan jumlah pengguna dan jumlah modul
- Shortcut ke modul Hak Akses dan Pengguna

## Bagian Utama Halaman
1. Grid kartu perusahaan
2. Detail perusahaan terpilih
3. Grafik distribusi pengguna per role
4. Modal tambah/edit perusahaan
5. Modal konfirmasi hapus perusahaan

## Cara Penggunaan
### 1. Menambah Perusahaan
- Klik `Tambah Perusahaan`.
- Isi nama perusahaan, kota, bidang usaha, alamat, telepon, NPWP, status, dan warna identitas.
- Klik `Simpan`.

### 2. Mengubah Perusahaan
- Pada kartu perusahaan, klik `Edit`.
- Perbarui data perusahaan.
- Simpan perubahan.

### 3. Menghapus Perusahaan
- Klik ikon hapus pada kartu perusahaan.
- Sistem menampilkan konfirmasi hapus dan jumlah user yang terdaftar.
- Data pengguna tidak ikut terhapus dari informasi yang ditampilkan di frontend.

### 4. Melihat Detail
- Klik salah satu kartu perusahaan.
- Panel detail akan menampilkan informasi perusahaan dan distribusi user berdasarkan role.
- Gunakan tombol cepat `Hak Akses` dan `Pengguna` untuk pindah ke modul terkait.

## Ringkasan Data yang Ditampilkan
- Nama perusahaan
- Kota
- Bidang usaha
- Status
- Jumlah pengguna
- Jumlah modul
- Alamat, telepon, NPWP
- Distribusi role pengguna

## Catatan Implementasi
- Data perusahaan saat ini mengacu pada `frontend/src/data/constants.js` dan store perusahaan.
- Field `modules` di frontend masih berupa angka ringkasan, bukan relasi detail modul perusahaan.