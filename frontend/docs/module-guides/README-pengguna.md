# README Modul Pengguna

## Lokasi View
`frontend/src/views/users/UsersPage.vue`

## Tujuan Modul
Modul Pengguna dipakai untuk mengelola akun user, role, status akun, perpindahan perusahaan, dan perubahan password.

## Fitur Utama
- Tambah pengguna
- Edit pengguna
- Hapus pengguna
- Ubah password pengguna
- Pindah perusahaan pengguna
- Toggle status aktif/nonaktif
- Filter berdasarkan role, perusahaan, dan status
- Preview modul yang dapat diakses berdasarkan role dan perusahaan

## Bagian Utama Halaman
1. Statistik pengguna
2. Filter pencarian
3. Tabel daftar pengguna
4. Modal tambah/edit pengguna
5. Modal ubah password
6. Modal pindah perusahaan

## Cara Penggunaan
### 1. Menambah Pengguna
- Klik `Tambah Pengguna`.
- Isi nama lengkap, email, telepon, role, perusahaan, status, password, dan konfirmasi password.
- Setelah role dan perusahaan dipilih, sistem akan menampilkan preview modul yang bisa diakses.
- Klik `Simpan` untuk menyimpan user baru.

### 2. Mengubah Data Pengguna
- Pada tabel daftar pengguna, klik tombol edit.
- Perbarui data seperti nama, email, role, perusahaan, atau status.
- Klik `Simpan`.

### 3. Mengubah Password
- Klik ikon kunci pada baris user.
- Isi password baru dan konfirmasi password.
- Sistem menampilkan indikator kekuatan password.
- Simpan perubahan password.

### 4. Memindahkan Perusahaan
- Klik ikon gedung pada baris user.
- Pilih perusahaan tujuan.
- Simpan perubahan untuk memindahkan user ke perusahaan lain.

### 5. Filter dan Pencarian
- Cari berdasarkan nama, email, atau telepon.
- Filter berdasarkan role.
- Filter berdasarkan perusahaan.
- Filter berdasarkan status aktif/nonaktif.

## Ringkasan Kartu Statistik
- Total pengguna
- Pengguna aktif
- Pengguna nonaktif
- Jumlah perusahaan

## Catatan Implementasi
- Data role, perusahaan, modul, dan sample users saat ini berasal dari `frontend/src/data/constants.js` dan store.
- Password saat ini masih berbasis data demo di frontend, jadi backend wajib mengganti dengan hash password yang aman.