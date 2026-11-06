# PANDUAN DEPLOY MANDIRI 1 FILE ZIP - SMART RA DIGITAL
Sistem Manajemen Raudlatul Athfal Terpadu Berbasis Web
Versi: 2.5.0 Production Ready

Paket ZIP ini adalah kode sumber lengkap aplikasi Smart RA Digital yang siap diekstrak dan langsung dijalankan di server VPS, cPanel, Cloud Hosting, atau Komputer Lokal.

=======================================================
METODE 1: CPANEL / SHARED HOSTING (Node.js Selector)
=======================================================
1. Buka File Manager cPanel Anda, arahkan ke folder website (misal `public_html` atau subdomain).
2. Upload file ZIP ini, klik kanan lalu pilih "Extract".
3. Buka menu cPanel "Setup Node.js App":
   - Node.js Version: 18.x, 20.x, atau 22.x
   - Application Mode: Production
   - Application Root: path folder tempat ekstraksi file
   - Application URL: domain/subdomain madrasah Anda
   - Application Startup File: server.ts
4. Klik tombol "Run NPM Install".
5. Buka terminal atau klik "Run JS Script" -> "build".
6. Klik tombol "Restart App".
7. Buka browser: domain Anda sudah aktif dan siap digunakan!

=======================================================
METODE 2: VPS UBUNTU / DEBIAN (NGINX + PM2)
=======================================================
1. Ekstrak file zip ke direktori `/var/www/smartra`:
   unzip smart-ra-digital-full-package.zip -d /var/www/smartra
   cd /var/www/smartra

2. Install dependencies & build:
   npm install
   npm run build

3. Jalankan aplikasi menggunakan PM2:
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup

4. Konfigurasi Nginx Reverse Proxy (port 3000):
   server {
       listen 80;
       server_name ra-anda.sch.id;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

5. Aktifkan SSL gratis (Certbot Let's Encrypt):
   sudo certbot --nginx -d ra-anda.sch.id

=======================================================
METODE 3: DIJALANKAN DI LAPTOP / PC LOKAL
=======================================================
1. Pastikan Node.js (v18+) sudah terinstall di laptop/PC Anda.
2. Ekstrak zip ke folder pilihan Anda.
3. Buka Terminal / Command Prompt di folder tersebut.
4. Jalankan:
   npm install
   npm run dev
5. Buka browser di http://localhost:3000

=======================================================
PEMBERSIHAN DATA DEMO UNTUK DATA BARU
=======================================================
Setelah login sebagai Administrator atau Kepala RA:
1. Klik tombol "Bersihkan Data Demo" pada banner Dashboard, atau klik ikon tersamar di sudut kanan paling bawah footer.
2. Seluruh data peserta didik, presensi, buku kas demo akan dikosongkan secara aman dengan auto-snapshot cadangan.
3. Anda siap menginput data riil siswa, guru, dan BOS RA Anda!
