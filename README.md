# Algia Villa 🌴

Project ini gue buat khusus buat bantuin usaha villa saudara gue. Tujuannya biar gampang manage booking dan orang-orang bisa liat-liat villa yang available dengan enak.

## Fitur-fiturnya

Kalo lo buka websitenya, ini yang bisa dilakuin:
*   **Cari Villa:** Bisa liat foto-foto villa, cek fasilitas, sama harganya. Tampilannya udah gue bikin rapi (2 kolom) biar enak di mata.
*   **Booking:** Kalo cocok, bisa langsung pesen tanggalnya dari situ.
*   **Admin Panel:** Ini buat saudara gue ngatur villanya. Bisa tambah villa baru, update harga, atau ganti foto kalo ada renovasi.
*   **AI Description:** Gue pasang fitur AI dikit buat bantuin bikin deskripsi villa yang bagus otomatis, biar gak pusing mikir kata-kata.

## Cara Jalanin di Laptop

Kalo mau nyoba jalanin codingannya di local:

1.  **Nyalain Server (Backend):**
    Buka terminal, terus ketik:
    ```bash
    npm run server
    ```
    Tunggu sampe muncul tulisan "Server running...".

2.  **Buka Websitenya (Frontend):**
    Buka terminal satu lagi (jangan di close yang tadi), ketik:
    ```bash
    npm run dev
    ```
    Terus buka link yang muncul di browser (biasanya `http://localhost:5173`).

3.  **Cek Database (Optional):**
    Kalo mau liat datanya langsung, gue udah siapin script:
    ```bash
    npm run db:studio
    ```

## Catatan Buat Gambar
Gambar-gambarnya gue simpen di folder `public/images/`. Kalo mau ganti foto, tinggal timpa aja file `villa-1.jpg`, `villa-2.jpg` dst di situ.

---
*Semoga bermanfaat!*
