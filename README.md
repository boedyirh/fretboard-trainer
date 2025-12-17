# Fretboard Trainer version 1.3
Boedy irhadtanto (with AI)
Demo Page https://boedyirh.github.io/

Terinspirasi dari Random music generator https://ro-che.info/random-key

Aplikasi web sederhana untuk melatih pengenalan nada pada fretboard gitar. Aplikasi ini menampilkan nada acak dan string yang harus Anda identifikasi pada fretboard.

**Fitur utama**
- Menampilkan nada acak (C–B).
- Terdapat Pengaturan Level agar jumlah kunci dibatasi munculnya.
- Menampilkan nomor string (1–6) untuk latihan penempatan nada.
- Mode otomatis: ganti latihan setiap beberapa detik dengan hitungan mundur.
- Terdapat suara untuk setiap pergantian nada.
- Pergantian Key ke key baru harus berbeda dengan Key sebelumnya.
- Kontrol start/stop dan pengaturan interval.

**Struktur proyek**
- `index.html` — antarmuka pengguna utama.
- `script.js` — logika pemilihan nada acak dan timer.
- `styles.css` — gaya visual aplikasi.
- `sound file A.mp3 sampai kunci G#.mp3` — untuk suara , saat pergantian key.
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



