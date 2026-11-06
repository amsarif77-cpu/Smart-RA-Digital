import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  BookOpen,
  Music,
  FileText,
  Lightbulb,
  Save,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  FlaskConical,
  Heart,
  Bot,
  Printer,
  X
} from 'lucide-react';

export const SmartAIPembelajaranView: React.FC = () => {
  const { addRPPH, addJournal, profile, academicYear, semester } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'rpph' | 'cerita' | 'lagu' | 'worksheet' | 'sains' | 'jurnal'>('rpph');
  const [loading, setLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPrintAIModalOpen, setIsPrintAIModalOpen] = useState(false);

  // RPPH Form Inputs
  const [rpphInput, setRpphInput] = useState({
    kelompok: 'Kelompok B (5-6 Tahun)',
    tema: 'Aku Hamba Allah',
    subtema: 'Mengenal Panca Indera Karunia Allah',
    nilaiIslam: 'Membaca basmalah, menjaga kesehatan mata dan telinga, bersyukur atas nikmat fisik Allah SWT',
    tujuan: 'Anak mampu mengenali 5 panca indera, membedakan aroma & rasa, merawat kebersihan tubuh, dan bekerja sama saat bermain',
    ragamMain: 'Sentra Sensori & Bahan Alam (Loose Parts)',
  });

  // Materi Ajar Form Inputs
  const [materiInput, setMateriInput] = useState({
    topik: 'Adab Berbagi & Menyayangi Teman di Sekolah',
    usia: '5 - 6 Tahun (Kelompok B)',
    fokus: 'Nilai Agama & Sosem',
  });

  // Jurnal Form Inputs
  const [jurnalInput, setJurnalInput] = useState({
    kelas: 'Kelompok B1 (Abu Bakar)',
    tema: 'Bermain Sentra Bahan Alam — Membuat Kolase Masjid dari Biji-bijian',
    jumlahSiswa: '18 Anak',
    catatan: 'Anak-anak sangat riang saat memilih biji jagung dan kuaci. Rayyan dan Fatih sempat berebut kuaci warna hitam, tetapi setelah diajak bermusyawarah mereka sepakat berbagi separuh-separuh. Waktu penutup, anak-anak hafal doa masuk masjid dengan lancar.',
  });

  // Call Server-side API for RPPH
  const handleGenerateRPPH = async () => {
    setLoading(true);
    setGeneratedOutput('');
    try {
      const res = await fetch('/api/ai/rpph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpphInput),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOutput(data.content);
      } else {
        setGeneratedOutput(`Error: ${data.error || 'Gagal membuat RPPH'}`);
      }
    } catch (e: any) {
      setGeneratedOutput(`Terjadi kesalahan jaringan: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Call Server-side API for Materi Ajar (Cerita, Lagu, Worksheet, Sains)
  const handleGenerateMateri = async (jenis: 'cerita' | 'lagu' | 'worksheet' | 'sains') => {
    setLoading(true);
    setGeneratedOutput('');
    try {
      const res = await fetch('/api/ai/materi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenis,
          topik: materiInput.topik,
          usia: materiInput.usia,
          fokus: materiInput.fokus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOutput(data.content);
      } else {
        setGeneratedOutput(`Error: ${data.error || 'Gagal membuat materi ajar'}`);
      }
    } catch (e: any) {
      setGeneratedOutput(`Terjadi kesalahan jaringan: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Call Server-side API for Jurnal Guru
  const handleGenerateJurnal = async () => {
    setLoading(true);
    setGeneratedOutput('');
    try {
      const res = await fetch('/api/ai/jurnal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jurnalInput),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOutput(data.content);
      } else {
        setGeneratedOutput(`Error: ${data.error || 'Gagal memproses jurnal'}`);
      }
    } catch (e: any) {
      setGeneratedOutput(`Terjadi kesalahan jaringan: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDatabase = () => {
    if (activeSubTab === 'rpph') {
      addRPPH({
        tanggal: new Date().toISOString().split('T')[0],
        kelompok: rpphInput.kelompok as any,
        tema: rpphInput.tema,
        subtema: rpphInput.subtema,
        nilaiIslam: rpphInput.nilaiIslam,
        tujuan: rpphInput.tujuan,
        kegiatanPembukaan: 'Ikrar bersama, doa pembuka, apersepsi dan gerak ceria.',
        kegiatanInti: generatedOutput.slice(0, 450) + '...',
        istirahatMakan: 'Antre cuci tangan, doa makan islami, makan bekal bersama.',
        kegiatanPenutup: 'Recalling, pesan moral menjaga ciptaan Allah, doa penutup.',
        pertanyaanPemantik: 'Bagaimana perasaanmu setelah bermain tadi? Apa yang paling kamu syukuri?',
        alatBahan: 'Bahan alam loose parts, kertas, dan media ajar interaktif.',
        asesmen: 'Observasi ceklis dan catatan anekdot.',
        status: 'disetujui',
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } else if (activeSubTab === 'jurnal') {
      addJournal({
        tanggal: new Date().toISOString().split('T')[0],
        guruNama: 'Guru Nurul Hidayah, S.Pd.I',
        kelas: jurnalInput.kelas,
        tema: jurnalInput.tema,
        materiKegiatan: 'Bermain sentra bahan alam dan penguatan adab musyawarah.',
        jumlahHadir: 18,
        jumlahTotal: 18,
        catatanPelaksanaan: generatedOutput.slice(0, 300) + '...',
        refleksi: 'Refleksi pembelajaran tertata rapi oleh Smart AI.',
        kendalaDanTindakLanjut: 'Variasikan loose parts dan amati anak yang masih malu-malu.',
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-800/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart AI Asisten Pendidik Raudlatul Athfal</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Smart AI Pembelajaran RA</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Membantu guru merancang RPPH otomatis berbasis Kurikulum Merdeka PAUD, cerita Islami interaktif, lagu & tepuk edukatif, lembar aktivitas, sains anak usia dini, dan draft refleksi jurnal harian.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-800/60 rounded-xl border border-emerald-600/40 text-xs">
            <Bot className="w-5 h-5 text-amber-300 animate-pulse" />
            <div>
              <div className="font-semibold text-white">Gemini 3.8 Flash</div>
              <div className="text-[10px] text-emerald-300">Siap Melayani Guru RA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => { setActiveSubTab('rpph'); setGeneratedOutput(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'rpph'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. Smart AI RPPH Generator</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('cerita'); setGeneratedOutput(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'cerita'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>2. Cerita Islami Anak</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('lagu'); setGeneratedOutput(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'lagu'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Music className="w-3.5 h-3.5 text-amber-400" />
          <span>3. Lagu & Tepuk RA</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('worksheet'); setGeneratedOutput(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'worksheet'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>4. Konsep Lembar Aktivitas</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('sains'); setGeneratedOutput(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'sains'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
          <span>5. Eksperimen Sains PAUD</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('jurnal'); setGeneratedOutput(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'jurnal'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>6. Smart AI Jurnal & Refleksi</span>
        </button>
      </div>

      {/* Main Grid: Form Inputs vs AI Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-700" />
              <span>Parameter Pembelajaran</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sesuaikan masukan untuk kebutuhan kelas dan karakteristik peserta didik.
            </p>
          </div>

          {/* Form for RPPH */}
          {activeSubTab === 'rpph' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelompok Usia</label>
                <select
                  value={rpphInput.kelompok}
                  onChange={e => setRpphInput({ ...rpphInput, kelompok: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</option>
                  <option value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tema Pembelajaran *</label>
                <input
                  type="text"
                  value={rpphInput.tema}
                  onChange={e => setRpphInput({ ...rpphInput, tema: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Misal: Aku Hamba Allah"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtema / Topik Khusus *</label>
                <input
                  type="text"
                  value={rpphInput.subtema}
                  onChange={e => setRpphInput({ ...rpphInput, subtema: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Misal: Panca Indera Karunia Allah"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nilai Karakter Islam & Doa</label>
                <textarea
                  value={rpphInput.nilaiIslam}
                  onChange={e => setRpphInput({ ...rpphInput, nilaiIslam: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Misal: Bersyukur atas nikmat Allah, doa makan, hafalan surat An-Naas"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fokus Tujuan & Ragam Main</label>
                <textarea
                  value={rpphInput.tujuan}
                  onChange={e => setRpphInput({ ...rpphInput, tujuan: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Misal: Eksplorasi botol sensori, melukis dengan bahan alam loose parts"
                />
              </div>

              <button
                onClick={handleGenerateRPPH}
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>{loading ? 'AI Sedang Merancang RPPH...' : 'Generate RPPH Lengkap'}</span>
              </button>
            </div>
          )}

          {/* Form for Materi Ajar (Cerita, Lagu, Worksheet, Sains) */}
          {(activeSubTab === 'cerita' || activeSubTab === 'lagu' || activeSubTab === 'worksheet' || activeSubTab === 'sains') && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topik Materi / Judul yang Diinginkan *</label>
                <input
                  type="text"
                  value={materiInput.topik}
                  onChange={e => setMateriInput({ ...materiInput, topik: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Misal: Kisah Burung Hud-Hud Nabi Sulaiman / Tepuk Wudhu Seru"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sasaran Usia Peserta Didik</label>
                <select
                  value={materiInput.usia}
                  onChange={e => setMateriInput({ ...materiInput, usia: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="4 - 5 Tahun (Kelompok A)">4 - 5 Tahun (Kelompok A)</option>
                  <option value="5 - 6 Tahun (Kelompok B)">5 - 6 Tahun (Kelompok B)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fokus Aspek Perkembangan</label>
                <input
                  type="text"
                  value={materiInput.fokus}
                  onChange={e => setMateriInput({ ...materiInput, fokus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Misal: Nilai Agama & Moral, Motorik Halus, STEAM"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleGenerateMateri(activeSubTab as any)}
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>{loading ? 'AI Sedang Berkreasi...' : `Buat ${activeSubTab.toUpperCase()} Edukatif`}</span>
                </button>
              </div>
            </div>
          )}

          {/* Form for Jurnal Guru */}
          {activeSubTab === 'jurnal' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelas / Rombel</label>
                <input
                  type="text"
                  value={jurnalInput.kelas}
                  onChange={e => setJurnalInput({ ...jurnalInput, kelas: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tema / Kegiatan Utama</label>
                <input
                  type="text"
                  value={jurnalInput.tema}
                  onChange={e => setJurnalInput({ ...jurnalInput, tema: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jumlah Siswa Hadir</label>
                <input
                  type="text"
                  value={jurnalInput.jumlahSiswa}
                  onChange={e => setJurnalInput({ ...jurnalInput, jumlahSiswa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Ringkas / Kasar Guru Hari Ini *</label>
                <textarea
                  value={jurnalInput.catatan}
                  onChange={e => setJurnalInput({ ...jurnalInput, catatan: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tuliskan catatan singkat apa yang terjadi di kelas hari ini..."
                />
              </div>

              <button
                onClick={handleGenerateJurnal}
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>{loading ? 'AI Sedang Menyusun Jurnal...' : 'Susun Jurnal & Refleksi Rapi'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Panel: Output Viewer & Actions (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Hasil Cerdas Smart AI</h3>
              </div>

              {generatedOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
                  </button>

                  <button
                    onClick={() => setIsPrintAIModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
                    title="Cetak Dokumen Hasil AI dengan Kop Resmi RA"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Cetak Dokumen</span>
                  </button>

                  {(activeSubTab === 'rpph' || activeSubTab === 'jurnal') && (
                    <button
                      onClick={handleSaveToDatabase}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savedSuccess ? 'Tersimpan!' : 'Simpan ke Database'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Output Display Container */}
            <div className="mt-4 min-h-[360px] max-h-[550px] overflow-y-auto bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 font-sans text-xs leading-relaxed text-slate-800 whitespace-pre-wrap select-text">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <p className="font-medium animate-pulse text-slate-600">
                    Smart AI sedang menganalisis kurikulum dan menyusun konten pembelajaran Islami terbaik...
                  </p>
                </div>
              ) : generatedOutput ? (
                <div>{generatedOutput}</div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center px-4">
                  <Bot className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
                  <h4 className="font-semibold text-slate-600 text-sm">Belum ada konten dihasilkan</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                    Isi parameter di sebelah kiri lalu klik tombol aksi untuk membuat materi pembelajaran otomatis dengan kecerdasan buatan.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Standar Kurikulum Merdeka PAUD/RA Kementerian Agama</span>
            <span>Semua hasil AI dapat disunting dan disahkan oleh guru</span>
          </div>
        </div>
      </div>

      {/* PRINT MODAL: HASIL SMART AI PEMBELAJARAN (KOP RESMI + TTD KEPALA KIRI, GURU KANAN) */}
      {isPrintAIModalOpen && generatedOutput && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Smart AI Pembelajaran RA</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setIsPrintAIModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Printable Sheet */}
            <div className="p-5 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
              {/* Kop Surat dengan Logo Resmi RA */}
              <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-2">
                <img
                  src={profile.logoUrl}
                  alt="Logo RA"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-sm font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[9px] text-slate-600 font-sans">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm} / NPSN: {profile.npsn}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">
                  {activeSubTab === 'rpph'
                    ? 'RENCANA PELAKSANAAN PEMBELAJARAN HARIAN (RPPH) KURIKULUM MERDEKA'
                    : activeSubTab === 'cerita'
                    ? 'MATERI AJAR LITERASI: CERITA ISLAMI BERKARAKTER ANAK'
                    : activeSubTab === 'lagu'
                    ? 'MATERI AJAR SENI: LAGU & TEPUK EDUKATIF RAUDLATUL ATHFAL'
                    : activeSubTab === 'worksheet'
                    ? 'LEMBAR PANDUAN AKTIVITAS & EKSPLORASI SISWA'
                    : activeSubTab === 'sains'
                    ? 'PANDUAN EKSPERIMEN SAINS & STEAM ANAK USIA DINI'
                    : 'JURNAL REFLEKSI PEMBELAJARAN GURU'}
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Tahun Ajaran {academicYear} &bull; {semester} &bull; Standar Kurikulum Merdeka PAUD/RA Kemenag RI
                </div>
              </div>

              {/* Detail Ringkas */}
              <div className="font-sans text-[11px] p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div>Tema / Topik: <strong>{activeSubTab === 'rpph' ? `${rpphInput.tema} - ${rpphInput.subtema}` : activeSubTab === 'jurnal' ? jurnalInput.tema : materiInput.topik}</strong></div>
                <div>Sasaran Usia: <strong>{activeSubTab === 'rpph' ? rpphInput.kelompok : activeSubTab === 'jurnal' ? jurnalInput.kelas : materiInput.usia}</strong></div>
              </div>

              {/* Isi Hasil AI */}
              <div className="font-sans text-[11px] leading-relaxed whitespace-pre-wrap p-4 bg-white border border-slate-300 rounded-lg text-slate-900">
                {generatedOutput}
              </div>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Guru Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui & Mengesahkan,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Guru / Pendidik Penyusun</div>
                  <div className="mt-12 font-semibold underline">Guru Nurul Hidayah, S.Pd.I</div>
                  <div>Pendidik Raudlatul Athfal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
