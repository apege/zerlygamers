# 🎮 Zerly Gamers - Platform Top Up Robux Roblox Modern & Terpercaya

<div align="center">
  <img src="public/logo.png" alt="Zerly Gamers Logo" width="260"/>
  <br/><br/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

  <p align="center">
    <strong>Website E-Commerce Top Up Game Modern, Cepat, dan Aman dengan Integrasi Real-Time Database Supabase PostgreSQL, Integrasi API Akun Roblox, Admin Dashboard Lengkap, dan Proteksi Sesi Terenkripsi.</strong>
  </p>
</div>

---

## 📑 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
   - [Halaman Pembeli (Storefront)](#1-halaman-pembeli-storefront)
   - [Panel Admin (Admin Dashboard)](#2-panel-admin-admin-dashboard)
2. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
3. [Struktur Proyek](#-struktur-proyek)
4. [Instalasi & Menjalankan Aplikasi](#-instalasi--menjalankan-aplikasi)
5. [Konfigurasi Environment (.env.local)](#-konfigurasi-environment-envlocal)
6. [Skema Database & API Endpoints](#-skema-database--api-endpoints)
7. [Kebijakan Retensi Penyimpanan (Storage Policy)](#-kebijakan-retensi-penyimpanan-storage-policy)
8. [Panduan Akses & Kredensial Admin](#-panduan-akses--kredensial-admin)

---

## ✨ Fitur Utama

### 1. Halaman Pembeli (Storefront)
- 🌸 **Desain Anime / Cute Gamer Aesthetic**: Tampilan modern, responsif di semua perangkat (Desktop, Tablet, Mobile) bernuansa pink & rose dengan maskot karakter.
- 🔍 **Cek Akun Roblox Otomatis**: Integrasi langsung dengan API Roblox untuk mendeteksi Username, Display Name, dan Foto Avatar pembeli secara instan.
- 💎 **Daftar Paket Robux Dinamis**: Menampilkan paket populer langsung dari database serta modal *Lihat Semua Paket*.
- 🔥 **Banner Promo & Flash Sale Real-Time**: Terhubung langsung dengan konfigurasi promo dari dashboard admin lengkap dengan countdown timer dan tombol *Ambil Promo*.
- 💳 **Metode Pemesanan Fleksibel**:
  - **Website Direct (QRIS)**: Menampilkan QRIS toko dinamis dan upload bukti transfer.
  - **WhatsApp Direct 24/7**: Generate format chat otomatis ke nomor WhatsApp admin beserta modal sukses konfirmasi pesanan (`WhatsAppSuccessModal`).
- 🌟 **Sistem Testimoni 1x Pakai (Anti-Spam)**: Pembeli dapat memberikan rating dan ulasan melalui link khusus token invoice (`?review_token=ZG-XXXXXX`) dengan validasi anti-duplikasi.
- 🛡️ **Pemeriksaan Blacklist Otomatis**: Mencegah akun Roblox atau nomor telepon bermasalah untuk melakukan order.

### 2. Panel Admin (Admin Dashboard)
- 🔐 **Autentikasi & Proteksi Sesi**: Gerbang login admin aman menggunakan *HTTP-Only HMAC Signed Cookie* dengan masa aktif hingga 30 hari.
- 📦 **Manajemen Pesanan Real-Time**:
  - Filter order berdasarkan status (*Pesanan Masuk*, *Sedang Diproses*, *Selesai*, *Dibatalkan*).
  - Tombol aksi cepat: **`Proses`**, **`Selesai ✓`**, dan **`Kirim Link Testimoni WhatsApp 💖`**.
  - Tampilan detail pesanan lengkap dengan bukti pembayaran, username, dan catatan admin.
- 🏷️ **Kelola Produk & Harga (Pricelist Robux)**: Tambah, edit harga, ubah badge (*POPULER*, *PROMO*), dan aktivasi/nonaktifkan paket.
- 👥 **Daftar Pelanggan & Blacklist Toko**: Rekapitulasi data pembeli dan blacklist akun/nomor dengan alasan pelanggaran.
- ⭐ **Moderasi Testimoni**: Setujui (*Approve*), balas ulasan (*Admin Reply*), dan buat link undang review via WhatsApp.
- ⚙️ **Pengaturan Toko & Banner**: Ubah nama toko, nomor WhatsApp CS, upload barcode QRIS, upload logo, serta pilih paket promo yang aktif secara dinamis.
- 📦 **Auto-Cleanup 90 Hari & Cadangan ZIP (H-7)**: Pembersihan otomatis foto bukti transfer berumur $\ge 90$ hari untuk menghemat storage, disertai banner peringatan dan tombol unduh seluruh bukti ke format file `.zip`.

---

## 🛠 Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack |
| **Library UI** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [Neon PostgreSQL Serverless](https://neon.tech/) |
| **Icons & Assets** | [Lucide React](https://lucide.dev/), [IDN Finlogos](https://github.com/finlogos/idn-finlogos) |
| **Arsip & Kompresi** | [JSZip](https://stuk.github.io/jszip/) |
| **Keamanan** | Node.js Crypto (HMAC SHA-256 Signed Session Cookies) |

---

## 📂 Struktur Proyek

```text
zerlygamers/
├── app/
│   ├── admin/
│   │   └── page.tsx                 # Dashboard Utama Admin & Auth Gate
│   ├── api/
│   │   ├── auth/                    # API Login, Logout, Session Check
│   │   ├── blacklists/              # API Kelola Blacklist Toko
│   │   ├── customers/               # API Daftar Pelanggan
│   │   ├── orders/                  # API Transaksi & Pesanan
│   │   │   ├── cleanup-proofs/      # API Metrik & Auto-Cleanup 90 Hari
│   │   │   └── download-proofs-zip/ # API Unduh Cadangan ZIP Bukti Transfer
│   │   ├── payments/                # API Riwayat Keuangan
│   │   ├── products/                # API Katalog Paket Robux
│   │   ├── roblox/check-user/       # API Reverse-Proxy Cek Akun Roblox
│   │   ├── settings/                # API Pengaturan Toko & Banner Promo
│   │   ├── testimonials/            # API Testimoni & Token Review
│   │   └── upload/                  # API Upload Bukti & QRIS
│   ├── layout.tsx                   # Root Layout & Metadata
│   ├── page.tsx                     # Storefront Halaman Utama Pembeli
│   └── globals.css                  # Tailwind v4 Styles & Custom Utilities
├── components/
│   ├── admin/                       # Komponen Dashboard Admin (Header, Sidebar, Views, Cards)
│   ├── modals/                      # Komponen Modal (OrderModal, CustomerReviewModal, WhatsAppSuccessModal, dll.)
│   ├── HeroSection.tsx              # Banner Promo & Maskot Karakter Hero
│   ├── Navbar.tsx                   # Navigasi Toko Dinamis
│   ├── FormOrder.tsx                # Form Input Akun Roblox & Metode Order
│   ├── TopUpRobux.tsx               # Grid Pilihan Paket Robux
│   ├── Testimonials.tsx             # Carousel Ulasan Pembeli & Balasan Admin
│   └── PaymentFooter.tsx            # Footer Metode Pembayaran & Copyright
├── data/                            # Static Fallback Data & Types
├── lib/
│   ├── auth.ts                      # Helper Autentikasi & Verifikasi Token
│   └── db.ts                        # Inisialisasi Koneksi Neon PostgreSQL
├── public/                          # Gambar Statis (Logo, Karakter, QRIS, dll.)
└── .env.local                       # Konfigurasi Database & Kredensial Admin
```

---

## 🚀 Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18.18+ atau 20+
- Database [Neon PostgreSQL](https://neon.tech/)

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/username/zerlygamers.git
cd zerlygamers
npm install
```

### 3. Buat File Environment `.env.local`
Salin atau buat file `.env.local` di direktori root:
```env
# Koneksi Database Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:password@ep-xxxx.neon.tech/neondb?sslmode=require"

# Kredensial Akun Admin
ADMIN_USERNAME=admin_zerlygamers
ADMIN_PASSWORD=@ZerlyGamers2026
ADMIN_SESSION_SECRET=zerlygamers_super_secret_admin_session_key_2026
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser dan akses:
- **Storefront Pembeli**: [http://localhost:3000](http://localhost:3000)
- **Panel Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🔐 Panduan Akses & Kredensial Admin

Panel admin dilindungi sistem autentikasi aman di endpoint `/admin`:

- **URL Akses**: `http://localhost:3000/admin`
- **Username Default**: `admin_zerlygamers`
- **Password Default**: `@ZerlyGamers2026`

> [!TIP]
> Kredensial admin dapat disesuaikan kapan saja melalui file `.env.local` pada variabel `ADMIN_USERNAME` dan `ADMIN_PASSWORD`.

---

## 📦 Kebijakan Retensi Penyimpanan (Storage Policy)

Untuk mengoptimalkan kuota gratis database dan storage hosting (0.5GB Tier):

1. **Auto-Cleanup Bukti Transfer (90 Hari)**:
   - Foto bukti pembayaran yang berumur $\ge 90$ hari dari tanggal transaksi akan dibersihkan secara otomatis.
   - *Data invoice, nominal Robux, total harga, dan riwayat pesanan tetap tersimpan 100% utuh*.
2. **Peringatan Unduh ZIP (H-7 / Hari ke-83)**:
   - Dashboard admin akan memunculkan banner peringatan saat ada bukti transfer yang berumur 83–89 hari.
   - Admin dapat mengunduh seluruh file bukti transfer dalam arsip `.zip` hanya dengan 1 klik sebelum file dibersihkan.
3. **Testimoni Pembeli**:
   - Seluruh testimoni dan ulasan bersifat **permanen** dan tidak akan dihapus otomatis oleh sistem.

---

## 📄 Lisensi
Hak Cipta &copy; 2026 **Zerly Gamers**. Seluruh hak cipta dilindungi undang-undang.
