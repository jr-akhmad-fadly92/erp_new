# README Modul Hak Akses

## Lokasi View
`frontend/src/views/permission/PermissionPage.vue`

## Tujuan Modul
Modul Hak Akses dipakai untuk mengatur izin akses modul per role dan per perusahaan dalam bentuk matrix permission.

## Fitur Utama
- Matrix hak akses role vs modul
- Filter tampilan per grup role
- Toggle izin akses per modul
- Simpan perubahan permission
- Reset permission ke default
- Menampilkan perusahaan aktif yang sedang diatur

## Bagian Utama Halaman
1. Filter grup role
2. Legend status izin
3. Tabel matrix permission
4. Save bar untuk perubahan yang belum disimpan

## Cara Penggunaan
### 1. Memilih Grup Role
- Gunakan tab filter role group seperti `Semua Role`, `Pimpinan`, `Procurement`, `Gudang`, `Sales`, `Keuangan`, atau `Operasional`.
- Tabel akan menampilkan hanya role yang termasuk grup tersebut.

### 2. Mengubah Hak Akses
- Pada matrix, cari modul yang ingin diatur.
- Aktifkan atau nonaktifkan toggle pada role tertentu.
- Beberapa role utama dikunci dan tidak bisa diubah langsung.
- Perubahan akan masuk ke mode `unsaved changes`.

### 3. Menyimpan Perubahan
- Klik `Simpan Perubahan` di header atau `Simpan Sekarang` pada save bar.
- Sistem menyimpan permission untuk perusahaan aktif.

### 4. Reset Default
- Klik `Reset Default` jika ingin mengembalikan seluruh permission perusahaan aktif ke setelan awal.

## Catatan Implementasi
- Data role, modul, dan default permission saat ini berasal dari `frontend/src/data/constants.js`.
- Permission disimpan per `company_id`, `module_id`, dan `role_id`.
- Struktur backend paling cocok menggunakan tabel matrix permission, bukan kolom akses per modul di tabel role.