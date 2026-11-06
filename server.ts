import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import JSZip from 'jszip';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for calling Gemini 3.8 Flash
async function callGemini(systemInstruction: string, prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text || '';
  } catch (err: any) {
    console.error('Gemini API error:', err);
    throw new Error(err.message || 'Gagal memproses permintaan AI');
  }
}

// 1. RPPH Generator API
app.post('/api/ai/rpph', async (req, res) => {
  try {
    const { tema, subtema, kelompok, durasi, nilaiIslam, tujuan, ragamMain } = req.body;
    const systemInstruction = `Anda adalah asisten cerdas perencana pembelajaran Raudlatul Athfal (PAUD Islam formal Kementerian Agama RI). Anda menguasai Kurikulum Merdeka PAUD/RA, pendekatan bermain bermakna, penguatan Profil Pelajar Rahmatan lil 'Alamin (P2RA) dan Profil Pelajar Pancasila, serta stimulasi 7 aspek perkembangan anak usia dini. Kembalikan teks dalam format rapi, ramah guru, dan siap diterapkan di kelas.`;
    
    const prompt = `Buatkan rancangan RPPH (Rencana Pelaksanaan Pembelajaran Harian) untuk Raudlatul Athfal dengan rincian berikut:
- Kelompok Usia: ${kelompok || 'Kelompok B (5-6 Tahun)'}
- Tema: ${tema || 'Aku Hamba Allah'}
- Subtema / Topik: ${subtema || 'Tubuhku Ciptaan Allah'}
- Nilai Agama/Karakter Islam: ${nilaiIslam || 'Syukur atas anggota tubuh pemberian Allah, doa sebelum kegiatan, hafalan surat pendek'}
- Tujuan Pembelajaran: ${tujuan || 'Anak mengenal anggota tubuh, fungsi, merawat ciptaan Allah, dan bersyukur'}
- Ragam Main: ${ragamMain || 'Sensori motor, literasi awal, eksplorasi seni kreasi'}

Rancangan RPPH harus mencakup:
1. IDENTITAS PEMBELAJARAN (Satuan, Kelompok, Semester/Minggu, Alokasi Waktu)
2. CAPAIAN & TUJUAN PEMBELAJARAN (Nilai Agama & Budi Pekerti, Jati Diri, Dasar Literasi/STEAM)
3. ALAT & BAHAN AJAR (Mudah didapat & Loose Parts)
4. KEGIATAN PEMBUKAAN (±30 menit: Ikrar/Doa, Hafalan Hadits/Surat Pendek, Apersepsi, Gerak & Lagu)
5. KEGIATAN INTI BERBASIS BERMAIN (±60 menit: 3-4 Ragam Main Pilihan Anak yang Menyenangkan)
6. ISTIRAHAT & MAKAN (±30 menit: Cuci tangan, adab & doa makan islami, bermain bebas)
7. KEGIATAN PENUTUP (±30 menit: Recalling, refleksi anak, pesan moral, doa penutup majelis)
8. PERTANYAAN PEMANTIK (Menstimulasi rasa ingin tahu dan nalar kritis anak)
9. RENCANA ASESMEN (Instrumen observasi / ceklis / catatan anekdot)`;

    const result = await callGemini(systemInstruction, prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Materi Ajar & Media Generator API
app.post('/api/ai/materi', async (req, res) => {
  try {
    const { jenis, topik, usia, fokus } = req.body;
    const systemInstruction = `Anda adalah pakar media pembelajaran dan materi ajar kreatif untuk Raudlatul Athfal (RA/PAUD Islam). Buatkan materi yang sangat ramah anak, edukatif, bernuansa Islami yang ceria, santun, dan mudah dipraktikkan.`;
    
    let prompt = '';
    if (jenis === 'cerita') {
      prompt = `Buatkan Cerita Islami Anak Usia Dini (${usia || '5-6 tahun'}) dengan topik: "${topik || 'Adab Berbagi & Menyayangi Teman'}". 
Sertakan:
- Judul yang menarik dan ceria
- Tokoh cerita (nama anak muslim/muslimah yang ramah)
- Alur cerita sederhana yang penuh petualangan/kegiatan sehari-hari
- Dialog yang mudah dipahami anak RA
- 1 Hadits pendek atau kutipan ayat Al-Qur'an berserta artinya yang relevan
- Pesan moral & pertanyaan interaktif yang bisa diajukan guru ke anak setelah bercerita.`;
    } else if (jenis === 'lagu') {
      prompt = `Ciptakan 2 Lagu/Tepuk Edukatif Anak RA bertema: "${topik || 'Aku Anak Sholeh'}".
Sertakan lirik dengan rima ceria, gunakan nada lagu anak populer yang sudah dikenal (misal: Balonku, Menanam Jagung, Pelangi-Pelangi, Dua Mata Saya) dan panduan gerakan tepuk tangan yang seru.`;
    } else if (jenis === 'worksheet') {
      prompt = `Rancang konsep Worksheet / Lembar Kerja Aktivitas Anak RA bertema: "${topik || 'Mengenal Huruf Hijaiyah & Angka Arab'}".
Jelaskan instruksi yang ramah anak, panduan guru/orang tua, sketsa elemen visual yang perlu digambar, dan aktivitas motorik halus (mewarnai, menghubungkan titik, melingkari, menempel kolase).`;
    } else if (jenis === 'sains') {
      prompt = `Rancang 1 Eksperimen Sains Sederhana untuk Anak RA bertema: "${topik || 'Air dan Pelangi Ciptaan Allah'}".
Sertakan:
- Bahan-bahan dapur/loose part aman
- Langkah-langkah bersama anak
- Konsep sains sederhana dengan bahasa anak
- Kaitkan dengan kebesaran Allah SWT.`;
    } else {
      prompt = `Buatkan materi ajar kreatif dan media edukasi RA untuk topik "${topik || 'Adab Harian Anak Muslim'}", lengkap dengan doa harian arab-latin-arti, panduan guru, dan kegiatan bermain.`;
    }

    const result = await callGemini(systemInstruction, prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Jurnal Guru & Refleksi API
app.post('/api/ai/jurnal', async (req, res) => {
  try {
    const { catatan, kelas, tema, jumlahSiswa } = req.body;
    const systemInstruction = `Anda adalah supervisor pendidikan RA yang membantu guru merumuskan jurnal harian dan refleksi pembelajaran secara profesional, pedagogis, dan humanis sesuai standar kurikulum PAUD Kementerian Agama.`;
    
    const prompt = `Bantu guru RA merapikan dan menyusun Jurnal Harian & Refleksi Pembelajaran dari catatan ringkas guru berikut:
- Kelas: ${kelas || 'Kelompok B1'}
- Tema/Kegiatan: ${tema || 'Kegiatan Bermain Sentra Bahan Alam'}
- Jumlah Siswa Hadir: ${jumlahSiswa || '15 Anak'}
- Catatan Kasar Guru: "${catatan || 'Anak-anak senang membuat bentuk masjid dari tanah liat dan balok, ada 2 anak yang awalnya berebut balok tapi diajak bermusyawarah akhirnya mau berbagi. Waktu kegiatan penutup anak bisa menghafal doa masuk masjid.'}"

Susun output menjadi:
1. Ringkasan Keterlaksanaan Pembelajaran
2. Dinamika & Keterlibatan Anak (Sosial-Emosional & Kolaborasi)
3. Pencapaian Pembelajaran Utama
4. Kendala / Tantangan yang Muncul
5. Refleksi Guru & Tindak Lanjut untuk Pembelajaran Esok Hari`;

    const result = await callGemini(systemInstruction, prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Narasi Rapor Perkembangan Anak API
app.post('/api/ai/rapor-narasi', async (req, res) => {
  try {
    const { namaSiswa, kelompok, capaianAgama, capaianJatidiri, capaianLiterasiSteam, rekomendasi } = req.body;
    const systemInstruction = `Anda adalah pakar asesmen PAUD/Raudlatul Athfal. Susun narasi rapor deskriptif perkembangan anak yang bernada hangat, positif, mengapresiasi keunikan anak, membangun kemitraan dengan orang tua, dan berbasis observasi nyata. Jangan gunakan istilah vonis atau negatif; gunakan pendekatan apresiatif.`;

    const prompt = `Susunkan draf narasi Rapor Perkembangan Semester untuk:
- Nama Anak: ${namaSiswa || 'Aisyah Humaira'}
- Kelompok: ${kelompok || 'Kelompok B (5-6 Tahun)'}
- Poin Observasi Nilai Agama & Budi Pekerti: ${capaianAgama || 'Sudah mandiri membaca doa harian, hafal 5 surat pendek dengan tajwid baik, terbiasa mengucapkan tolong dan terima kasih.'}
- Poin Observasi Jati Diri & Sosial Emosional: ${capaianJatidiri || 'Percaya diri saat memimpin barisan, mampu mengekspresikan emosi dengan wajar, sabar menunggu giliran main.'}
- Poin Observasi Dasar Literasi & STEAM: ${capaianLiterasiSteam || 'Sangat tertarik dengan buku cerita bergambar, mampu mengenali huruf awal namanya, antusias saat eksplorasi balok dan warna.'}
- Catatan Tambahan/Rekomendasi di Rumah: ${rekomendasi || 'Dukungan orang tua untuk terus membiasakan membaca buku bersama sebelum tidur.'}

Berikan narasi resmi yang siap disalin ke lembar rapor RA.`;

    const result = await callGemini(systemInstruction, prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Smart AI BOS & SPJ Checker API
app.post('/api/ai/bos-audit', async (req, res) => {
  try {
    const { transaksi, tahap, totalDana } = req.body;
    const systemInstruction = `Anda adalah auditor dan konsultan BOS Madrasah/Raudlatul Athfal Kementerian Agama RI. Anda memahami Juknis BOS Kemenag terbaru, prinsip akuntabilitas, transparansi, efektivitas, perpajakan (PPh 21, PPh 22, PPh 23, PPN), serta kelengkapan SPJ (Surat Pertanggungjawaban).`;

    const prompt = `Analisis dan berikan telaah atas rencana/realisasi belanja dana BOS RA berikut:
- Tahap Pencairan: ${tahap || 'Tahap I Tahun Anggaran Berjalan'}
- Pagu/Total Dana: Rp ${totalDana || '30.000.000'}
- Rincian Transaksi/Belanja: 
${JSON.stringify(transaksi || [
  { item: 'Pembelian Buku Cerita & Media loose parts', nominal: 4500000, kelengkapan: 'Kuitansi, nota toko, faktur' },
  { item: 'Honorarium Guru RA non-sertifikasi (3 orang)', nominal: 6000000, kelengkapan: 'Daftar tanda terima honor, SK Kepala RA' },
  { item: 'Pengadaan APE Luar (Ayunan & Perosotan)', nominal: 7000000, kelengkapan: 'Surat pesanan, kuitansi bermaterai, berita acara penerimaan' },
  { item: 'Konsumsi Rapat Wali Murid & parenting', nominal: 1500000, kelengkapan: 'Nota warung makan, daftar hadir, foto kegiatan' },
  { item: 'Pembelian ATK & bahan habis pakai kegiatan siswa', nominal: 2500000, kelengkapan: 'Nota toko stempel basah' }
], null, 2)}

Mohon berikan:
1. Kesesuaian dengan Komponen Juknis BOS Kemenag (Pengembangan Kompetensi, Pembelajaran, Operasional, dsb.)
2. Checklist Kelengkapan Dokumen SPJ per transaksi
3. Aspek Perpajakan yang perlu diperhatikan (kapan kena PPh/PPN)
4. Rekomendasi Perbaikan Administrasi agar lolos verifikasi Pengawas & Kemenag
5. Ringkasan Draft Narasi Laporan Realisasi BOS`;

    const result = await callGemini(systemInstruction, prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Smart RA Digital', timestamp: new Date().toISOString() });
});

// Endpoint: Full-Source Runnable Zip Generator for 1-Click Deployment (Requirement 7)
app.get('/api/deploy/full-source-zip', async (req, res) => {
  try {
    const zip = new JSZip();
    const rootDir = __dirname;

    // Helper to recursively add directory
    function addDirToZip(currentDir: string, zipFolder: JSZip) {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (
          item === 'node_modules' ||
          item === '.git' ||
          item === 'dist' ||
          item === '.aistudio' ||
          item === '.vite' ||
          item === '.cache' ||
          item.endsWith('.log')
        ) {
          continue;
        }

        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          if (subFolder) {
            addDirToZip(fullPath, subFolder);
          }
        } else if (stat.isFile()) {
          const fileData = fs.readFileSync(fullPath);
          zipFolder.file(item, fileData);
        }
      }
    }

    addDirToZip(rootDir, zip);

    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="smart-ra-digital-full-package-${Date.now().toString().slice(-4)}.zip"`
    );
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error: any) {
    console.error('Error generating deploy zip:', error);
    res.status(500).json({ success: false, error: error.message || 'Gagal memaketkan berkas deploy' });
  }
});

// Setup Vite middlewares for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Smart RA Digital Server running at http://localhost:${port}`);
  });
}

startServer();
