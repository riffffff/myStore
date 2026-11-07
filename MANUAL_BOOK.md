# Buku Panduan Pengguna & Pengelola Toko Online (Manual Book)

Dokumen ini berisi panduan operasional lengkap untuk sistem aplikasi toko online. Panduan ini disusun untuk membantu pengguna umum (pelanggan) dan administrator toko dalam memanfaatkan seluruh fitur yang tersedia.

---

## Daftar Isi

1. [Bagian 1: Gambaran Umum & Hak Akses Sistem](#bagian-1-gambaran-umum--hak-akses-sistem)
   - [1.1 Pengenalan Aplikasi](#11-pengenalan-aplikasi)
   - [1.2 Peran Pengguna & Matriks Hak Akses](#12-peran-pengguna--matriks-hak-akses)
   - [1.3 Persyaratan Perangkat & Peramban](#13-persyaratan-perangkat--peramban)
2. [Bagian 2: Panduan Operasional Pelanggan (Storefront)](#bagian-2-panduan-operasional-pelanggan-storefront)
   - [2.1 Halaman Beranda (Home)](#21-halaman-beranda-home)
   - [2.2 Pencarian & Katalog Produk](#22-pencarian--katalog-produk)
   - [2.3 Halaman Detail Produk & Varian](#23-halaman-detail-produk--varian)
   - [2.4 Pengelolaan Keranjang Belanja](#24-pengelolaan-keranjang-belanja)
   - [2.5 Proses Checkout & Pembayaran QRIS](#25-proses-checkout--pembayaran-qris)
   - [2.6 Konfirmasi & Pelacakan Pesanan](#26-konfirmasi--pelacakan-pesanan)
   - [2.7 Membaca Artikel Toko](#27-membaca-artikel-toko)
   - [2.8 Memberikan Ulasan Produk](#28-memberikan-ulasan-produk)
3. [Bagian 3: Panduan Operasional Administrator (Admin Panel)](#bagian-3-panduan-operasional-administrator-admin-panel)
   - [3.1 Akses & Masuk ke Panel Admin](#31-akses--masuk-ke-panel-admin)
   - [3.2 Dashboard & Ringkasan Statistik](#32-dashboard--ringkasan-statistik)
   - [3.3 Manajemen Produk](#33-manajemen-produk)
   - [3.4 Manajemen Artikel & Blog](#34-manajemen-artikel--blog)
   - [3.5 Manajemen Pesanan Masuk](#35-manajemen-pesanan-masuk)
   - [3.6 Moderasi Ulasan Pelanggan](#36-moderasi-ulasan-pelanggan)
   - [3.7 Pengaturan Toko (Shop Settings)](#37-pengaturan-toko-shop-settings)
   - [3.8 Navigasi Mode Pratinjau & Kembali ke Admin](#38-navigasi-mode-pratinjau--kembali-ke-admin)

---

## Bagian 1: Gambaran Umum & Hak Akses Sistem

### 1.1 Pengenalan Aplikasi

Aplikasi Toko Online ini dirancang untuk memfasilitasi transaksi jual beli produk secara terstruktur dan efisien. Sistem mencakup etalase publik yang responsif untuk pelanggan serta panel kontrol terpadu untuk pengelola toko dalam mengatur katalog, memproses pesanan, menerbitkan artikel, dan mengelola konfigurasi operasional toko.

### 1.2 Peran Pengguna & Matriks Hak Akses

Sistem membagi pengguna ke dalam tiga tingkatan peran:

| Fitur / Modul | Pengunjung (Tamu) | Pelanggan Terdaftar | Administrator Toko |
| :--- | :---: | :---: | :---: |
| Jelajah Katalog & Detail Produk | Ya | Ya | Ya |
| Pencarian & Filter Kategori | Ya | Ya | Ya |
| Membaca Artikel Publik | Ya | Ya | Ya |
| Menambahkan Item ke Keranjang | Tidak (Perlu Login) | Ya | Ya |
| Checkout & Pembayaran QRIS | Tidak (Perlu Login) | Ya | Ya |
| Melacak Status Pesanan (`/track`) | Ya (Via Kode Pesanan) | Ya | Ya |
| Menulis Ulasan Produk | Tidak | Ya | Ya |
| Akses Dashboard Admin (`/admin`) | Tidak | Tidak | Ya |
| Tambah / Ubah / Hapus Produk | Tidak | Tidak | Ya |
| Kelola Pesanan & Ubah Status | Tidak | Tidak | Ya |
| Terbitkan / Sunting Artikel | Tidak | Tidak | Ya |
| Moderasi Ulasan Masuk | Tidak | Tidak | Ya |
| Konfigurasi Toko & QRIS | Tidak | Tidak | Ya |

### 1.3 Persyaratan Perangkat & Peramban

Aplikasi berbasis web modern (Single Page Application via Inertia.js dan React) dan dapat diakses menggunakan peramban modern:
- Google Chrome (versi 90 ke atas)
- Mozilla Firefox (versi 90 ke atas)
- Apple Safari (versi 14 ke atas)
- Microsoft Edge (versi 90 ke atas)
- Peramban ponsel cerdas (Android Chrome, iOS Safari) dengan resolusi layar minimal 360px lebar.

---

## Bagian 2: Panduan Operasional Pelanggan (Storefront)

### 2.1 Halaman Beranda (Home)

Halaman Beranda merupakan pintu masuk utama pengunjung toko:
1. **Hero Banner**: Menampilkan pesan selamat datang, slogan promosi toko, dan tombol aksi langsung menuju katalog.
2. **Kategori Unggulan**: Tautan cepat untuk menyaring produk berdasarkan kelompok kategori.
3. **Produk Terbaru & Populer**: Daftar produk teratas yang siap dipesan langsung.
4. **Artikel Terkini**: Ringkasan artikel edukasi atau kabar terbaru seputar produk dan toko.
5. **Footer**: Informasi profil toko, alamat fisik, jam operasional, dan tautan langsung ke obrolan WhatsApp toko.

### 2.2 Pencarian & Katalog Produk

Pelanggan dapat menemukan produk yang diinginkan melalui halaman Katalog:
1. **Pencarian Kata Kunci**:
   - Ketik nama produk pada kolom pencarian di bagian atas layar.
   - Pada perangkat seluler, tekan ikon kaca pembesar untuk membuka kolom pencarian cepat.
2. **Filter Kategori**:
   - Klik tab kategori yang tersedia (misalnya: Roti, Kue Kering, Minuman) untuk menyaring produk.
   - Pilihan "Semua" menampilkan seluruh katalog tanpa filter.
3. **Pemberitahuan Ketersediaan**:
   - Kartu produk menampilkan label status stok jika stok mendekati habis atau habis.

### 2.3 Halaman Detail Produk & Varian

Halaman ini menyajikan informasi menyeluruh tentang satu produk spesifik:
1. **Galeri Gambar**: Menampilkan foto produk berkualitas tinggi. Klik atau geser untuk melihat sudut pengambilan gambar yang berbeda.
2. **Informasi Harga & Stok**: Menampilkan harga resmi dan jumlah stok yang tersedia.
3. **Pilihan Varian**: Jika produk memiliki variasi (misal: ukuran, rasa, kemasan), pilih varian yang diinginkan. Harga dan ketersediaan stok akan otomatis menyesuaikan varian terpilih.
4. **Deskripsi Produk**: Ulasan tekstual lengkap mengenai spesifikasi, bahan, atau manfaat produk.
5. **Tombol Masukkan Keranjang**: Tekan tombol untuk menambahkan produk ke dalam keranjang belanja.

### 2.4 Pengelolaan Keranjang Belanja

Keranjang belanja menampung item yang telah dipilih sebelum melakukan pembayaran:
1. **Membuka Keranjang**: Klik ikon keranjang belanja pada bagian kanan atas navigasi (menampilkan badge jumlah item).
2. **Mengubah Kuantitas**:
   - Tekan tombol minus (-) untuk mengurangi jumlah pesanan item.
   - Tekan tombol plus (+) untuk menambah kuantitas item.
3. **Menghapus Item**:
   - Tekan ikon tempat sampah di samping item untuk membatalkan pesanan produk tersebut.
4. **Ringkasan Total Belanja**:
   - Menampilkan total subtotal barang yang ada di dalam keranjang.
5. **Lanjut ke Checkout**: Klik tombol "Lanjut ke Pembayaran" untuk mengisi formulir pemesanan.

### 2.5 Proses Checkout & Pembayaran QRIS

Proses penyelesaian pesanan dilakukan melalui halaman checkout satu pintu:
1. **Informasi Penerima**:
   - Masukkan Nama Penerima barang.
   - Masukkan Nomor Telepon / WhatsApp aktif untuk konfirmasi pengiriman.
   - Masukkan Alamat Pengiriman lengkap dan catatan tambahan (jika ada).
2. **Rincian Biaya**:
   - Sistem menampilkan subtotal produk, biaya pengiriman (sesuai wilayah layanan toko), dan total tagihan akhir.
3. **Metode Pembayaran QRIS Dinamis**:
   - Pilih metode pembayaran QRIS.
   - Sistem akan memunculkan gambar QRIS resmi toko beserta nominal tepat yang harus dibayarkan.
   - Buka aplikasi perbankan digital atau dompet digital (GoPay, OVO, Dana, BCA Mobile, dll).
   - Pindai kode QRIS dan selesaikan pembayaran.
4. **Konfirmasi Pesanan**:
   - Tekan tombol "Konfirmasi Pembayaran & Buat Pesanan".

### 2.6 Konfirmasi & Pelacakan Pesanan

1. **Halaman Sukses**:
   - Setelah pesanan berhasil dicatat, sistem mengarahkan ke halaman sukses yang memuat **Nomor Pesanan / Kode Unik** (misal: `ORD-20261107-XXXX`).
   - Terdapat tombol pintas untuk langsung menghubungi pengelola toko melalui WhatsApp dengan template pesan otomatis.
2. **Pelacakan Status Pesanan (`/track`)**:
   - Buka menu "Pesanan" pada navigasi utama.
   - Masukkan Nomor Pesanan pada kolom pelacakan.
   - Sistem akan menampilkan status terkini:
     - *Pending*: Menunggu verifikasi pembayaran.
     - *Processing*: Pesanan sedang disiapkan atau dikemas oleh toko.
     - *Shipped*: Barang telah diserahkan ke kurir pengiriman.
     - *Completed*: Pesanan telah diterima oleh pembeli.
     - *Cancelled*: Pesanan dibatalkan.

### 2.7 Membaca Artikel Toko

1. Buka menu "Artikel" pada bilah navigasi.
2. Pilih judul artikel yang diminati untuk membuka ulasan lengkap.
3. Halaman artikel menyajikan format baca yang bersih, gambar pendukung, tanggal terbit, dan navigasi kembali ke katalog produk.

### 2.8 Memberikan Ulasan Produk

1. Pada halaman detail produk, gulir ke bagian "Ulasan Pelanggan".
2. Pilih rating bintang (skala 1 sampai 5).
3. Tulis komentar atau testimoni mengenai kualitas barang dan layanan toko.
4. Klik tombol "Kirim Ulasan".
5. Ulasan yang dikirim akan masuk ke antrean moderasi administrator sebelum tampil ke publik.

---

## Bagian 3: Panduan Operasional Administrator (Admin Panel)

### 3.1 Akses & Masuk ke Panel Admin

1. Buka URL: `http://<domain-atau-ip-toko>/admin` atau `http://<domain-atau-ip-toko>/login`.
2. Masukkan alamat email administrator dan kata sandi yang sah.
3. Tekan tombol "Masuk".
4. Jika kredensial sesuai dan memiliki hak `is_admin = true`, sistem akan langsung mengarahkan Anda ke Dashboard Admin.

### 3.2 Dashboard & Ringkasan Statistik

Dashboard menyajikan metrik performa toko secara real-time:
1. **Kartu Ringkasan (KPI Cards)**:
   - Total Pendapatan Toko.
   - Jumlah Pesanan Baru (Pending / Processing).
   - Total Produk Aktif dalam Katalog.
   - Jumlah Ulasan yang Menunggu Persetujuan.
2. **Tabel Pesanan Terbaru**: Daftar transaksi pesanan terkini yang memerlukan tindakan pengiriman atau verifikasi.
3. **Pemberitahuan Stok Kritis**: Daftar produk dengan kuantitas stok yang menipis atau kosong.

### 3.3 Manajemen Produk

Modul untuk mengelola seluruh katalog barang dagangan:
1. **Melihat Daftar Produk**:
   - Buka menu "Produk" pada bilah sisi kiri (sidebar).
   - Gunakan fitur pencarian dan penyaringan untuk mencari produk spesifik.
2. **Menambah Produk Baru**:
   - Klik tombol "Tambah Produk".
   - Isi Formulir Produk:
     - Nama Produk.
     - Kategori Produk.
     - Deskripsi Lengkap.
     - Harga Dasar (Rp).
     - Jumlah Stok Awal.
     - Unggah Foto Produk (format PNG/JPG, disarankan rasio 1:1 atau 4:3).
     - Tambahkan varian produk jika ada (misal ukuran, opsi rasa, dll).
   - Tekan "Simpan Produk".
3. **Mengubah (Edit) Produk**:
   - Klik ikon pensil/edit pada baris produk yang ingin diubah.
   - Perbarui informasi atau foto yang diperlukan, lalu tekan "Perbarui Produk".
4. **Menonaktifkan / Menghapus Produk**:
   - Klik ikon tempat sampah untuk menghapus produk dari database (jika belum terkait dengan riwayat transaksi) atau ubah status ketersediaan menjadi nonaktif.

### 3.4 Manajemen Artikel & Blog

Modul publikasi konten untuk pemasaran dan edukasi pelanggan:
1. **Melihat Daftar Artikel**: Buka menu "Artikel" pada sidebar admin.
2. **Membuat Artikel Baru**:
   - Klik tombol "Tulis Artikel Baru".
   - Masukkan Judul Artikel.
   - Unggah Gambar Sampul (Cover Image).
   - Tulis isi artikel menggunakan editor teks yang rapi.
   - Atur status publikasi: Draf atau Publikasi Langsung.
   - Tekan tombol "Simpan & Publikasikan".
3. **Mengedit & Menghapus Artikel**:
   - Pilih artikel yang ingin disunting, lakukan perubahan, lalu simpan.
   - Hapus artikel yang sudah tidak relevan melalui tombol hapus.

### 3.5 Manajemen Pesanan Masuk

Modul operasional harian untuk memproses pesanan belanja pelanggan:
1. **Daftar Pesanan**:
   - Buka menu "Pesanan" pada sidebar admin.
   - Tabel menampilkan Kode Pesanan, Nama Pembeli, Tanggal, Total Tagihan, dan Status Terkini.
2. **Memeriksa Rincian Pesanan**:
   - Klik tombol "Lihat Detail" pada nomor pesanan terkait.
   - Periksa daftar barang yang dipesan, kuantitas, catatan khusus pembeli, serta alamat tujuan pengiriman.
3. **Memperbarui Status Pesanan**:
   - Administrator dapat memperbarui status pesanan sesuai kemajuan riil di lapangan:
     - Dari `Pending` menjadi `Processing` setelah verifikasi pembayaran diterima.
     - Dari `Processing` menjadi `Shipped` saat paket diserahkan ke jasa kirim/kurir.
     - Dari `Shipped` menjadi `Completed` setelah barang terkonfirmasi sampai ke pelanggan.
     - Menjadi `Cancelled` jika transaksi dibatalkan atas kesepakatan bersama.
   - Perubahan status ini langsung tercermin saat pelanggan memeriksa via halaman `/track`.

### 3.6 Moderasi Ulasan Pelanggan

Modul penjaga kualitas testimoni toko:
1. Buka menu "Ulasan" pada sidebar admin.
2. Daftar ulasan terbagi atas: *Menunggu Moderasi*, *Disetujui*, dan *Ditolak*.
3. Pada ulasan yang berstatus *Menunggu*:
   - Klik "Setujui" agar ulasan dan rating langsung muncul di halaman produk publik.
   - Klik "Tolak / Hapus" apabila ulasan mengandung kata-kata yang tidak pantas atau tidak relevan.

### 3.7 Pengaturan Toko (Shop Settings)

Pusat kendali identitas dan preferensi bisnis toko:
1. **Identitas Toko**:
   - Nama Toko: Nama resmi yang tampil di header dan footer.
   - Deskripsi Singkat: Slogan toko untuk meta deskripsi dan bagian perkenalan.
   - Alamat Fisik & Jam Operasional: Ditampilkan pada bagian informasi kontak footer.
2. **Kontak & Pesan Otomatis WhatsApp**:
   - Nomor WhatsApp Toko: Format internasional (misal: `6281234567890`).
   - Template Pesan Konfirmasi: Format teks otomatis yang memuat detail pesanan saat pembeli menekan tombol konfirmasi WhatsApp.
3. **Visual & Logo Toko**:
   - Unggah Logo Toko (Mode Terang dan Mode Gelap).
   - Unggah Favicon peramban web.
   - Teks Banner Hero 1 & Banner Hero 2 pada halaman beranda.
4. **Konfigurasi Pembayaran QRIS**:
   - Unggah Foto Kode QRIS resmi toko.
   - Masukkan Nama Akun Pemilik QRIS untuk memastikan kesesuaian saat pembeli memindai.
5. **Pengaturan Wilayah & Pengiriman**:
   - Masukkan daftar wilayah jangkauan pengiriman toko.
   - Tentukan estimasi hari pengiriman barang.
6. Simpan seluruh konfigurasi dengan menekan tombol "Simpan Pengaturan".

### 3.8 Navigasi Mode Pratinjau & Kembali ke Admin

Untuk memastikan kemudahan navigasi saat administrator meninjau tampilan publik toko:
1. **Beralih ke Toko Publik dari Admin Panel**:
   - Pada panel admin, klik tombol "Lihat Toko Publik".
2. **Tampilan Mode Pratinjau di Toko Publik**:
   - Ketika administrator sedang membuka toko publik, sistem menampilkan banner khusus berwarna gelap di bagian paling atas layar yang berbunyi:
     - Di layar desktop: `Mode Pratinjau Toko (Administrator)`
     - Di layar ponsel: `Mode Admin`
3. **Kembali ke Panel Admin**:
   - Klik tombol **"Kembali ke Admin"** yang berada di sisi kanan banner atas tersebut.
   - Sistem akan langsung membawa Anda kembali ke Dashboard Admin tanpa perlu mengetik ulang alamat URL.
   - Banner ini terkunci rapi (sticky) di bagian paling atas dan tidak menutupi menu navigasi toko.

---
Dokumen panduan ini dapat dicetak atau disimpan dalam format PDF untuk keperluan pelatihan staf dan arsip operasional bisnis.
