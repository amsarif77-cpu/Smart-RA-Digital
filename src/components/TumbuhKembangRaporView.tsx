import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChildAssessment, ChildReport } from '../types';
import {
  Baby,
  Sparkles,
  Printer,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Heart,
  Bot,
  RefreshCw,
  Copy,
  Check,
  UserCheck
} from 'lucide-react';

export const TumbuhKembangRaporView: React.FC = () => {
  const { students, assessments, addAssessment, profile, academicYear, semester } = useApp();

  const [activeTab, setActiveTab] = useState<'asesmen' | 'ai-narasi' | 'cetak-rapor'>('asesmen');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [filterAspek, setFilterAspek] = useState('Semua');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // New assessment modal / state
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [newAsm, setNewAsm] = useState({
    aspek: 'Nilai Agama & Moral' as ChildAssessment['aspek'],
    jenis: 'Catatan Anekdot' as ChildAssessment['jenis'],
    deskripsi: '',
    capaian: 'BSH (Berkembang Sesuai Harapan)' as ChildAssessment['capaian'],
  });

  // AI Narasi Generator state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReportDraft, setAiReportDraft] = useState('');
  const [aiInputs, setAiInputs] = useState({
    capaianAgama: 'Hafal 8 surat pendek dengan makhraj baik, membaca doa sebelum belajar dan adab makan mandiri.',
    capaianJatidiri: 'Berani memimpin doa dhuha, berbagi giliran main balok kayu bersama teman dengan rukun.',
    capaianLiterasiSteam: 'Sangat tertarik membaca buku cerita bergambar, mampu mengenali huruf awal namanya, dan aktif merangkai loose parts biji alam.',
    rekomendasi: 'Dukungan orang tua untuk terus membiasakan membaca buku bersama dan melatih kemandirian merapikan barang pribadi di rumah.',
  });

  // Filtered assessments
  const studentAssessments = assessments.filter(a => {
    const matchStudent = a.studentId === selectedStudentId;
    const matchAspek = filterAspek === 'Semua' || a.aspek === filterAspek;
    return matchStudent && matchAspek;
  });

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    addAssessment({
      studentId: selectedStudent.id,
      studentName: selectedStudent.nama,
      tanggal: new Date().toISOString().split('T')[0],
      aspek: newAsm.aspek,
      jenis: newAsm.jenis,
      deskripsi: newAsm.deskripsi,
      capaian: newAsm.capaian,
      fotoKarya: newAsm.jenis === 'Hasil Karya' ? 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400' : undefined,
    });
    setIsNewAssessmentOpen(false);
    setNewAsm({ ...newAsm, deskripsi: '' });
  };

  const handleGenerateAiNarasi = async () => {
    setAiLoading(true);
    setAiReportDraft('');
    try {
      const res = await fetch('/api/ai/rapor-narasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaSiswa: selectedStudent.nama,
          kelompok: selectedStudent.kelas,
          capaianAgama: aiInputs.capaianAgama,
          capaianJatidiri: aiInputs.capaianJatidiri,
          capaianLiterasiSteam: aiInputs.capaianLiterasiSteam,
          rekomendasi: aiInputs.rekomendasi,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiReportDraft(data.content);
      } else {
        setAiReportDraft(`Error: ${data.error || 'Gagal membuat narasi rapor'}`);
      }
    } catch (e: any) {
      setAiReportDraft(`Terjadi kesalahan jaringan: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Baby className="w-4 h-4" />
            <span>Asesmen Otentik 7 Aspek Perkembangan</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Tumbuh Kembang, Asesmen & Rapor RA</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Observasi harian, catatan anekdot, hasil karya anak, penyusunan narasi rapor dengan Smart AI, dan cetak rapor resmi.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-600 pl-2">Pilih Peserta Didik:</span>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.nama} ({s.kelas.slice(0, 11)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('asesmen')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'asesmen'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Portofolio & Asesmen Harian</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-narasi')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'ai-narasi'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Smart AI Narasi Rapor</span>
        </button>

        <button
          onClick={() => setActiveTab('cetak-rapor')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'cetak-rapor'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Lembar Rapor Resmi RA</span>
        </button>
      </div>

      {/* Tab 1: Portofolio & Asesmen */}
      {activeTab === 'asesmen' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent.foto}
                alt={selectedStudent.nama}
                className="w-10 h-10 rounded-full object-cover border border-emerald-300"
              />
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedStudent.nama}</div>
                <div className="text-slate-500 text-[11px]">NIS: {selectedStudent.nis} • {selectedStudent.kelas}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterAspek}
                onChange={e => setFilterAspek(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Semua">Semua Aspek Perkembangan</option>
                <option value="Nilai Agama & Moral">Nilai Agama & Moral</option>
                <option value="Jati Diri & Sosem">Jati Diri & Sosem</option>
                <option value="Literasi & Komunikasi">Literasi & Komunikasi</option>
                <option value="STEAM & Kognitif">STEAM & Kognitif</option>
                <option value="Fisik Motorik">Fisik Motorik</option>
                <option value="Seni & Kreativitas">Seni & Kreativitas</option>
              </select>

              <button
                onClick={() => setIsNewAssessmentOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Asesmen</span>
              </button>
            </div>
          </div>

          {/* Assessment cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentAssessments.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-slate-400 text-xs">
                Belum ada catatan observasi untuk peserta didik ini pada filter aspek yang dipilih.
              </div>
            ) : (
              studentAssessments.map(asm => (
                <div key={asm.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-emerald-300 transition space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      {asm.aspek}
                    </span>
                    <span className="text-slate-400 text-[10px]">{asm.tanggal}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{asm.jenis}:</span>
                    <span className="font-bold text-emerald-800">{asm.capaian}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 italic">
                    "{asm.deskripsi}"
                  </p>

                  {asm.fotoKarya && (
                    <div className="mt-2">
                      <div className="text-[10px] text-slate-500 font-semibold mb-1">Dokumentasi Karya Anak:</div>
                      <img
                        src={asm.fotoKarya}
                        alt="Karya anak"
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Smart AI Narasi Rapor */}
      {activeTab === 'ai-narasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6">
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Penyusun Narasi Rapor Deskriptif</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Membantu guru menyusun narasi rapor yang apresiatif, humanis, dan mendidik berdasarkan poin observasi nyata.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Poin Observasi Nilai Agama & Moral</label>
              <textarea
                rows={2}
                value={aiInputs.capaianAgama}
                onChange={e => setAiInputs({ ...aiInputs, capaianAgama: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Poin Observasi Jati Diri & Sosem</label>
              <textarea
                rows={2}
                value={aiInputs.capaianJatidiri}
                onChange={e => setAiInputs({ ...aiInputs, capaianJatidiri: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Poin Observasi Dasar Literasi & STEAM</label>
              <textarea
                rows={2}
                value={aiInputs.capaianLiterasiSteam}
                onChange={e => setAiInputs({ ...aiInputs, capaianLiterasiSteam: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rekomendasi / Dukungan Orang Tua di Rumah</label>
              <textarea
                rows={2}
                value={aiInputs.rekomendasi}
                onChange={e => setAiInputs({ ...aiInputs, rekomendasi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleGenerateAiNarasi}
              disabled={aiLoading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4 text-amber-300" />}
              <span>{aiLoading ? 'Menyusun Narasi Pedagogis...' : 'Generate Narasi Rapor Peserta Didik'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 text-xs">Pratinjau Draf Narasi Rapor Resmi:</span>
                {aiReportDraft && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiReportDraft);
                      alert('Draf narasi disalin ke clipboard!');
                    }}
                    className="flex items-center gap-1 text-xs text-emerald-700 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>
                )}
              </div>

              <div className="mt-3 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap min-h-[300px]">
                {aiLoading ? (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>AI sedang merangkai narasi perkembangan ananda {selectedStudent.nama}...</span>
                  </div>
                ) : aiReportDraft ? (
                  aiReportDraft
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 italic text-center">
                    Klik "Generate Narasi Rapor Peserta Didik" untuk menyusun teks deskriptif otomatis.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400">
              * AI bertindak sebagai asisten bahasa; verifikasi dan validasi akhir narasi tetap merupakan hak prerogatif guru kelas.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cetak Lembar Rapor Resmi RA */}
      {activeTab === 'cetak-rapor' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Lembar Laporan Capaian Perkembangan Anak (Rapor RA)</h3>
              <p className="text-xs text-slate-500">Format Resmi Standar Kementerian Agama RI & Kurikulum Merdeka PAUD.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak PDF Rapor</span>
            </button>
          </div>

          {/* Printable Report Sheet */}
          <div className="p-6 bg-white border border-slate-300 rounded-xl space-y-5 text-xs font-serif">
            {/* Kop Madrasah with Logo */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 gap-4">
              <img
                src={profile.logoUrl}
                alt="Logo RA"
                className="w-14 h-14 object-contain shrink-0"
              />
              <div className="flex-1 text-center">
                <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                <div className="text-base font-extrabold uppercase text-slate-900">{profile.name}</div>
                <div className="text-[10px] text-slate-600 font-sans">
                  NSM: {profile.nsm} • NPSN: {profile.npsn} • Status: {profile.accreditation}
                </div>
                <div className="text-[9px] text-slate-600 font-sans">{profile.address}</div>
              </div>
              <div className="w-14 shrink-0" />
            </div>

            <div className="text-center font-bold text-xs uppercase underline">
              LAPORAN CAPAIAN PERKEMBANGAN PESERTA DIDIK RAUDLATUL ATHFAL
            </div>

            {/* Student Info */}
            <table className="w-full font-sans text-[11px] leading-relaxed">
              <tbody>
                <tr>
                  <td className="w-28 font-semibold">Nama Peserta Didik</td>
                  <td>: <strong>{selectedStudent.nama}</strong></td>
                  <td className="w-24 font-semibold">Tahun Ajaran</td>
                  <td>: {academicYear}</td>
                </tr>
                <tr>
                  <td className="font-semibold">NIS / NISN</td>
                  <td>: {selectedStudent.nis} / {selectedStudent.nisn}</td>
                  <td className="font-semibold">Semester</td>
                  <td>: {semester}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Kelompok / Kelas</td>
                  <td>: {selectedStudent.kelas}</td>
                  <td className="font-semibold">Usia</td>
                  <td>: {selectedStudent.kelompok === 'A' ? '4 - 5 Tahun' : '5 - 6 Tahun'}</td>
                </tr>
              </tbody>
            </table>

            {/* Narrative 1: Nilai Agama & Budi Pekerti */}
            <div className="p-3 border border-slate-200 rounded-lg space-y-1">
              <div className="font-bold text-slate-900 font-sans uppercase text-[11px]">
                I. Nilai Agama & Budi Pekerti
              </div>
              <p className="text-slate-800 leading-relaxed font-sans text-[11px]">
                Ananda {selectedStudent.nama} menunjukkan perkembangan yang sangat baik dalam pembiasaan adab Islami sehari-hari. Ananda terbiasa mengucapkan salam, membaca basmalah sebelum beraktivitas, mandiri saat mengambil air wudhu, dan antusias mengikuti sholat dhuha berjamaah. Hafalan surat pendek ananda sudah mencapai 8 surat dengan makhraj yang baik.
              </p>
            </div>

            {/* Narrative 2: Jati Diri & Sosem */}
            <div className="p-3 border border-slate-200 rounded-lg space-y-1">
              <div className="font-bold text-slate-900 font-sans uppercase text-[11px]">
                II. Jati Diri & Sosial Emosional
              </div>
              <p className="text-slate-800 leading-relaxed font-sans text-[11px]">
                Ananda mampu bersikap percaya diri dalam berinteraksi dengan guru dan teman sebaya. Saat berkegiatan di sentra, ananda menunjukkan sikap empati yang tinggi, senang membantu teman merapikan alat main, serta sabar menunggu giliran.
              </p>
            </div>

            {/* Narrative 3: Dasar Literasi & STEAM */}
            <div className="p-3 border border-slate-200 rounded-lg space-y-1">
              <div className="font-bold text-slate-900 font-sans uppercase text-[11px]">
                III. Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni
              </div>
              <p className="text-slate-800 leading-relaxed font-sans text-[11px]">
                Rasa ingin tahu ananda berkembang sangat pesat. Ananda antusias bereksplorasi dengan berbagai loose parts bahan alam (biji-bijian, ranting, pasir), mampu menyusun pola berulang, mengenali huruf hijaiyah, dan menciptakan kreasi seni kolase yang indah.
              </p>
            </div>

            {/* Pertumbuhan Fisik & Kehadiran */}
            <div className="grid grid-cols-2 gap-4 font-sans text-[11px]">
              <div className="p-2.5 border border-slate-200 rounded-lg">
                <div className="font-bold mb-1">Pertumbuhan Fisik (UKS):</div>
                <div>Tinggi Badan: 110 cm</div>
                <div>Berat Badan: 18.5 kg (Ideal)</div>
                <div>Lingkar Kepala: 50 cm</div>
              </div>
              <div className="p-2.5 border border-slate-200 rounded-lg">
                <div className="font-bold mb-1">Rekapitulasi Kehadiran:</div>
                <div>Hadir: 86 Hari</div>
                <div>Sakit: 2 Hari (Dengan Izin Ortu)</div>
                <div>Izin: 1 Hari</div>
                <div>Tanpa Keterangan: 0 Hari</div>
              </div>
            </div>

            {/* Tanda Tangan: 3 Pihak (Ortu KIRI, Kepala TENGAH, Guru KANAN) */}
            <div className="pt-8 flex justify-between font-sans text-[10px] text-slate-800">
              <div className="text-center w-1/3">
                <div>Mengetahui,</div>
                <div className="font-bold">Orang Tua / Wali Murid</div>
                <div className="mt-14 font-semibold">({selectedStudent.namaAyah || selectedStudent.namaIbu || 'Wali Murid'})</div>
              </div>

              <div className="text-center w-1/3">
                <div>Mengetahui & Mengesahkan,</div>
                <div className="font-bold">Kepala Raudlatul Athfal</div>
                <div className="mt-14 font-semibold underline">{profile.headmasterName}</div>
                <div>NIP: {profile.headmasterNip || '-'}</div>
              </div>

              <div className="text-center w-1/3">
                <div>Bandung, 18 Desember 2026</div>
                <div className="font-bold">Guru / Wali Kelas</div>
                <div className="mt-14 font-semibold underline">Guru Nurul Hidayah, S.Pd.I</div>
                <div>NIP: -</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Asesmen */}
      {isNewAssessmentOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Entri Asesmen Perkembangan Peserta Didik</h3>
            <p className="text-xs text-slate-500 mt-0.5">Peserta Didik: {selectedStudent.nama}</p>

            <form onSubmit={handleSaveAssessment} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aspek Perkembangan</label>
                <select
                  value={newAsm.aspek}
                  onChange={e => setNewAsm({ ...newAsm, aspek: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Nilai Agama & Moral">Nilai Agama & Moral</option>
                  <option value="Jati Diri & Sosem">Jati Diri & Sosem</option>
                  <option value="Literasi & Komunikasi">Literasi & Komunikasi</option>
                  <option value="STEAM & Kognitif">STEAM & Kognitif</option>
                  <option value="Fisik Motorik">Fisik Motorik</option>
                  <option value="Seni & Kreativitas">Seni & Kreativitas</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Instrumen Asesmen</label>
                <select
                  value={newAsm.jenis}
                  onChange={e => setNewAsm({ ...newAsm, jenis: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Catatan Anekdot">Catatan Anekdot</option>
                  <option value="Hasil Karya">Hasil Karya Anak</option>
                  <option value="Ceklis Observasi">Ceklis Observasi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tingkat Capaian</label>
                <select
                  value={newAsm.capaian}
                  onChange={e => setNewAsm({ ...newAsm, capaian: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="BSB (Berkembang Sangat Baik)">BSB (Berkembang Sangat Baik)</option>
                  <option value="BSH (Berkembang Sesuai Harapan)">BSH (Berkembang Sesuai Harapan)</option>
                  <option value="MB (Mulai Berkembang)">MB (Mulai Berkembang)</option>
                  <option value="BB (Belum Berkembang)">BB (Belum Berkembang)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Hasil Observasi / Perilaku *</label>
                <textarea
                  required
                  rows={3}
                  value={newAsm.deskripsi}
                  onChange={e => setNewAsm({ ...newAsm, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Catat apa yang dikatakan, dibuat, atau dilakukan anak secara faktual..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAssessmentOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
