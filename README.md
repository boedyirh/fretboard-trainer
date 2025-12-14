# Fretboard Trainer version 1.0
By: Boedy Irhadtanto (Dibantu oleh AI)
Terinspirasi dari Random music generator https://ro-che.info/random-key

Aplikasi web sederhana untuk melatih pengenalan nada pada fretboard gitar. Aplikasi ini menampilkan nada acak dan string yang harus Anda identifikasi pada fretboard.

**Fitur utama**
- Menampilkan nada acak (C–B).
- Menampilkan nomor string (1–6) untuk latihan penempatan nada.
- Mode otomatis: ganti latihan setiap beberapa detik dengan hitungan mundur.
- Kontrol start/stop dan pengaturan interval.

**Struktur proyek**
- `index.html` — antarmuka pengguna utama.
- `script.js` — logika pemilihan nada acak dan timer.
- `styles.css` — gaya visual aplikasi.
- `random-key/` — (opsional) aset atau file terkait fitur acak.

**Cara menjalankan**
1. Buka `index.html` langsung di browser (cukup buka file), atau jalankan server HTTP sederhana jika fitur berkaitan dengan CORS atau pengujian lokal diperlukan.


**Cara menggunakan**
- Aplikasi akan memulai mode otomatis (default 5 detik). Gunakan tombol `Start` untuk memulai atau mengubah interval, dan `Stop` untuk menghentikan.
- Perhatikan nada yang muncul (`display-note`) dan nomor string (`string-num`) lalu cari posisi yang sesuai di fretboard.
- Hitungan mundur ditampilkan di elemen `countdown` untuk mengetahui waktu tersisa sebelum perubahan note untuk latihan.

**Catatan pengembang**
- `script.js` menempatkan nada acak dan nomor string, serta mengontrol timer otomatis. Elemen DOM yang digunakan: `display-note`, `string-num`, `countdown`, `start-btn`, `stop-btn`, `interval-input`.

**Kontribusi**
- Perbaikan kecil dan fitur tambahan diterima via pull request. Disarankan menambahkan screenshot, mode latihan lain (mis. tampilkan fret), dan pengaturan kesulitan.

**Lisensi**
- Bebas digunakan untuk tujuan pribadi dan edukasi. Tambahkan lisensi eksplisit jika ingin mendistribusikan ulang.

--
Jika Anda ingin, saya bisa menambahkan contoh screenshot, instruksi deploy, atau memperluas README ke bahasa Inggris.

