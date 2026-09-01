# 📚 e-Learning Pendidikan Pancasila - SRT 39 Garut

Aplikasi e-Learning untuk mata pelajaran Pendidikan Pancasila di Sekolah Rakyat Terintegrasi 39 Garut. Dibangun dengan HTML, CSS, dan JavaScript murni (tanpa framework) untuk kemudahan penggunaan dan pengembangan.

## ✨ Fitur Utama

- 🔐 **Login Guru** (default: guru / pancasila)
- 📋 **Dashboard** - Ringkasan siswa, kehadiran harian
- 📱 **Absensi QR Code** - Scan QR Code siswa untuk absensi
- 🖨️ **Generate & Unduh QR Code** - Buat QR Code per siswa (via qrzap.fun)
- 📊 **Daftar Kehadiran** - Filter dan ekspor kehadiran ke Excel
- 📅 **Agenda Harian** - Catat kegiatan pembelajaran
- 📖 **Materi Ajar** - Lengkap per kelas (SD I-VI, SMP VII-IX, SMA X-XII) sesuai Kurikulum Merdeka
- ✏️ **Edit & Unggah Materi** - Guru dapat menambahkan atau mengubah materi ajar
- 📈 **Administrasi Nilai** - Kelola dan ekspor nilai siswa
- 📂 **Impor/Ekspor Data** - Menggunakan format Excel (.xlsx)

## 📁 Struktur Folder
e-learning-pancasila/
├── index.html # Halaman utama
├── README.md # Dokumentasi
├── .gitignore # File yang diabaikan Git
├── css/
│ └── style.css # Semua gaya CSS
└── js/
├── data.js # Data siswa & materi default
├── utils.js # Fungsi utilitas (toast, library loader)
└── app.js # Logika utama aplikasi

## 🚀 Cara Menjalankan

1.  Clone repositori ini ke komputer Anda.
2.  Buka file `index.html` menggunakan browser web modern (Chrome, Firefox, Edge).
3.  Login dengan username `guru` dan password `pancasila`.

## 🛠️ Teknologi yang Digunakan

- HTML5, CSS3, JavaScript (ES6)
- [Font Awesome](https://fontawesome.com/) - Ikon
- [SheetJS (xlsx)](https://sheetjs.com/) - Impor/Ekspor Excel
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - Scanner QR Code
- [qrzap.fun](https://qrzap.fun/) - API Generate QR Code gratis

## 📝 Catatan Pengembangan

- Data siswa dan materi disimpan di `js/data.js`. Anda dapat mengubahnya sesuai kebutuhan.
- Data yang diunggah/ diedit (materi, kehadiran, agenda, nilai) disimpan di `localStorage` browser.

## 🤝 Kontribusi

Silakan fork repositori ini dan kirimkan pull request untuk perbaikan atau penambahan fitur.

## 📧 Kontak

Untuk pertanyaan lebih lanjut, hubungi pengelola SRT 39 Garut.

---

**Dibuat untuk** : SRT 39 Garut, Pusat Pendidikan, Pelatihan, dan Pengembangan Profesi, Kementerian Sosial RI.
