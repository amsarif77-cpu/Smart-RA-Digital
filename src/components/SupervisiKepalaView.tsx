import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupervisionRecord } from '../types';
import { exportJsonToExcel } from '../utils/exportExcel';
import {
  Award,
  CheckCircle2,
  Calendar,
  FileCheck,
  TrendingUp,
  Clock,
  Printer,
  Plus,
  AlertCircle,
  FileText,
  UserCheck,
  Edit2,
  Download,
  X
} from 'lucide-react';

export const SupervisiKepalaView: React.FC = () => {
  const { supervisions, addSupervision, updateSupervision, employees, profile, academicYear } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedSupId, setSelectedSupId] = useState(supervisions[0]?.id || '');
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Supervision Plan Form state
  const [planForm, setPlanForm] = useState({
    targetTeacherName: employees[1]?.nama || 'Guru Nurul Hidayah, S.Pd.I',
    jenis: 'Supervisi Akademik' as 'Supervisi Akademik' | 'Supervisi Manajerial',
    tanggal: new Date().toISOString().split('T')[0],
    aspek: ['Perencanaan RPPH Berdiferensiasi', 'Pelaksanaan Bermain Loose Parts Alam', 'Interaksi Positif & Penguatan Adab', 'Asesmen Otentik Ceklis & Catatan Anekdot'],
    skor: 94,
    skorRpph: 95,
    skorProses: 93,
    skorAsesmen: 94,
    catatanObservasi: 'Guru sangat komunikatif, memfasilitasi anak dengan media alam terpadu, dan menghidupkan suasana kelas dengan adab Islami yang hangat dan menyenangkan.',
    rekomendasi: 'Eksplorasi variasi bahan alam loose parts untuk sentra sains dan matematika awal anak usia dini.',
  });

  const kepalaSupervisions = supervisions.filter(s => s.supervisorRole === 'kepala');
  const selectedSup = kepalaSupervisions.find(s => s.id === selectedSupId) || kepalaSupervisions[0];

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    addSupervision({
      tanggal: planForm.tanggal,
      supervisorRole: 'kepala',
      supervisorName: profile.headmasterName,
      supervisorNip: profile.headmasterNip,
      targetTeacherName: planForm.targetTeacherName,
      jenis: planForm.jenis,
      aspek: planForm.aspek,
      skor: Number(planForm.skor),
      skorRpph: Number(planForm.skorRpph),
      skorProses: Number(planForm.skorProses),
      skorAsesmen: Number(planForm.skorAsesmen),
      catatanObservasi: planForm.catatanObservasi,
      rekomendasi: planForm.rekomendasi,
      statusTindakLanjut: 'Sedang Ditindaklanjuti',
      tandaTangan: true,
    });
    setIsNewPlanModalOpen(false);
  };

  const handleUpdateStatus = (status: SupervisionRecord['statusTindakLanjut']) => {
    if (selectedSup) {
      updateSupervision({ ...selectedSup, statusTindakLanjut: status });
    }
  };

  // Export to Native Excel (.xlsx)
  const handleExportExcel = () => {
    const rows = kepalaSupervisions.map((s, idx) => ({
      No: idx + 1,
      Tanggal: s.tanggal,
      Supervisor: s.supervisorName,
      'Guru Sasaran': s.targetTeacherName || '-',
      'Jenis Supervisi': s.jenis,
      'Skor Akhir': s.skor,
      'Skor RPPH': s.skorRpph || '-',
      'Skor Proses': s.skorProses || '-',
      'Skor Asesmen': s.skorAsesmen || '-',
      'Catatan Observasi': s.catatanObservasi,
      Rekomendasi: s.rekomendasi,
      'Status Tindak Lanjut': s.statusTindakLanjut,
    }));
    exportJsonToExcel(rows, `Supervisi_Guru_Kepala_RA_${profile.name.replace(/\s+/g, '_')}.xlsx`, 'Supervisi Guru');
  };

  const steps = [
    { num: 1, title: '1. Perencanaan', desc: 'Menentukan guru sasaran, jadwal, instrumen, dan aspek supervisi.' },
    { num: 2, title: '2. Pelaksanaan', desc: 'Observasi kelas langsung, telaah RPPH, dan pengumpulan bukti.' },
    { num: 3, title: '3. Penilaian Skor', desc: 'Pengisian instrumen, pembobotan skor, dan catatan refleksi.' },
    { num: 4, title: '4. Umpan Balik', desc: 'Pertemuan pasca-observasi, dialog pedagogis & rekomendasi.' },
    { num: 5, title: '5. Monitoring Perbaikan', desc: 'Pemantauan realisasi tindak lanjut & berita acara tuntas.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Peningkatan Mutu Pembelajaran & Tata Kelola RA</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Supervisi Guru oleh Kepala RA</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Alur 5 tahap supervisi akademik terpadu, instrumen penilaian proses belajar anak usia dini, dan monitoring tindak lanjut.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Berita Acara</span>
          </button>
          <button
            onClick={() => setIsNewPlanModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Input Supervisi Guru Baru</span>
          </button>
        </div>
      </div>

      {/* 5-Step Process Visualizer */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider text-slate-400">
          Alur 5 Tahap Pelaksanaan Supervisi Guru:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`p-3 rounded-xl border cursor-pointer transition ${
                activeStep === st.num
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs">{st.title}</div>
              <p className="text-[10px] mt-1 line-clamp-2">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Daftar Supervisi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-xs">Jadwal & Riwayat Supervisi Guru</h3>
            <span className="text-[11px] text-slate-500 font-semibold">{kepalaSupervisions.length} Kegiatan</span>
          </div>

          <div className="space-y-2">
            {kepalaSupervisions.map((sup) => {
              const isSelected = selectedSup?.id === sup.id;
              return (
                <div
                  key={sup.id}
                  onClick={() => setSelectedSupId(sup.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{sup.targetTeacherName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Skor {sup.skor}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sup.tanggal}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-medium">{sup.jenis}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Status Tindak Lanjut:</span>
                    <span className={`font-semibold ${
                      sup.statusTindakLanjut === 'Tuntas Memuaskan' ? 'text-emerald-700' : 'text-amber-600'
                    }`}>
                      {sup.statusTindakLanjut}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Instrumen & Berita Acara */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          {selectedSup ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Rekam Instrumen & Berita Acara Observasi
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedSup.targetTeacherName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Supervisor: {selectedSup.supervisorName} &bull; Tanggal: {selectedSup.tanggal}
                  </p>
                </div>
                <div className="text-right flex items-center sm:flex-col sm:items-end gap-2">
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    {selectedSup.skor}
                    <span className="text-xs font-normal text-slate-400"> /100</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Predikat Amat Baik
                  </span>
                </div>
              </div>

              {/* Rincian Skor Per Aspek */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">1. Telaah Modul & RPPH</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{selectedSup.skorRpph || 95}</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Berdiferensiasi & P2RA</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">2. Proses Pembelajaran</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{selectedSup.skorProses || 93}</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Bermain Loose Parts Alam</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">3. Asesmen Otentik Anak</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{selectedSup.skorAsesmen || 94}</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Ceklis, Karya & Anekdot</div>
                </div>
              </div>

              {/* Aspek yang disupervisi */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800">Indikator & Aspek yang Ditelaah:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSup.aspek.map((asp, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      ✓ {asp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Catatan Observasi & Rekomendasi */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Catatan Observasi Kepala RA:</div>
                  <p className="text-slate-700 leading-relaxed">{selectedSup.catatanObservasi}</p>
                </div>

                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900">Rekomendasi Perbaikan & Pembinaan:</div>
                  <p className="text-slate-800 leading-relaxed">{selectedSup.rekomendasi}</p>
                </div>
              </div>

              {/* Tindak Lanjut Monitoring */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Status Tindak Lanjut Guru:</span>
                  <select
                    value={selectedSup.statusTindakLanjut}
                    onChange={e => handleUpdateStatus(e.target.value as any)}
                    className="px-2.5 py-1 border border-slate-300 rounded-lg font-semibold text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Sedang Ditindaklanjuti">Sedang Ditindaklanjuti</option>
                    <option value="Tuntas Memuaskan">Tuntas Memuaskan</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500">
                  Guru telah merevisi variasi ragam main bahan alam loose parts dan melampirkan modul ajar revisi.
                </p>
              </div>

              {/* 
                TANDA TANGAN SESUAI ATURAN #7:
                "bila hanya kepala dan guru, guru sebelah kanan dan kepala sebelah kiri"
              */}
              <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-700">
                <div className="text-left">
                  <div className="text-[11px] text-slate-400">Kepala RA (Supervisor):</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Tervalidasi Digital</span>
                  </div>
                  <div className="mt-5 font-bold underline">{selectedSup.supervisorName}</div>
                  <div className="text-[10px] text-slate-500">NIP: {profile.headmasterNip || '-'}</div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Guru yang Disupervisi:</div>
                  <div className="mt-8 font-bold underline">{selectedSup.targetTeacherName}</div>
                  <div className="text-[10px] text-slate-500">Pendidik Raudlatul Athfal</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              Pilih salah satu jadwal supervisi untuk melihat rekam berita acara.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: INPUT SUPERVISI GURU BARU */}
      {isNewPlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Input Instrumen Supervisi Guru Baru</h3>
              <button onClick={() => setIsNewPlanModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Sasaran Supervisi</label>
                <select
                  value={planForm.targetTeacherName}
                  onChange={e => setPlanForm({ ...planForm, targetTeacherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  {employees.filter(e => e.jabatan.includes('Guru') || e.jabatan.includes('Pendamping')).map(e => (
                    <option key={e.id} value={e.nama}>{e.nama} ({e.jabatan})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Supervisi</label>
                  <select
                    value={planForm.jenis}
                    onChange={e => setPlanForm({ ...planForm, jenis: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Supervisi Akademik">Supervisi Akademik</option>
                    <option value="Supervisi Manajerial">Supervisi Manajerial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Observasi</label>
                  <input
                    type="date"
                    required
                    value={planForm.tanggal}
                    onChange={e => setPlanForm({ ...planForm, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skor RPPH (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={planForm.skorRpph}
                    onChange={e => {
                      const v = Number(e.target.value);
                      const avg = Math.round((v + planForm.skorProses + planForm.skorAsesmen) / 3);
                      setPlanForm({ ...planForm, skorRpph: v, skor: avg });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skor Proses (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={planForm.skorProses}
                    onChange={e => {
                      const v = Number(e.target.value);
                      const avg = Math.round((planForm.skorRpph + v + planForm.skorAsesmen) / 3);
                      setPlanForm({ ...planForm, skorProses: v, skor: avg });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skor Asesmen (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={planForm.skorAsesmen}
                    onChange={e => {
                      const v = Number(e.target.value);
                      const avg = Math.round((planForm.skorRpph + planForm.skorProses + v) / 3);
                      setPlanForm({ ...planForm, skorAsesmen: v, skor: avg });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Skor Rata-rata</label>
                <input
                  type="number"
                  readOnly
                  value={planForm.skor}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Temuan Observasi Kelas</label>
                <textarea
                  rows={2}
                  required
                  value={planForm.catatanObservasi}
                  onChange={e => setPlanForm({ ...planForm, catatanObservasi: e.target.value })}
                  placeholder="Catatan pelaksanaan pembelajaran, keaktifan peserta didik, adab islami..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rekomendasi Tindak Lanjut Perbaikan</label>
                <textarea
                  rows={2}
                  required
                  value={planForm.rekomendasi}
                  onChange={e => setPlanForm({ ...planForm, rekomendasi: e.target.value })}
                  placeholder="Saran tindak lanjut untuk guru..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewPlanModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Supervisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRINT BERITA ACARA SUPERVISI (KOP LOGO + TTD KEPALA KIRI, GURU KANAN) */}
      {isPrintModalOpen && selectedSup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Berita Acara Hasil Supervisi Guru</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setIsPrintModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Printable Sheet */}
            <div className="p-4 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
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
                  <div className="text-[9px] text-slate-600 font-sans">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm}</div>
                </div>
              </div>

              <div className="text-center font-bold text-xs uppercase underline">
                BERITA ACARA SUPERVISI AKADEMIK GURU
              </div>

              <div className="font-sans text-[11px] leading-relaxed space-y-2">
                <p>Pada hari ini, telah dilaksanakan supervisi pembelajaran internal terhadap tenaga pendidik:</p>
                <table className="w-full text-[11px]">
                  <tbody>
                    <tr><td className="w-40 font-semibold">Nama Guru Sasaran</td><td>: {selectedSup.targetTeacherName}</td></tr>
                    <tr><td className="font-semibold">Nama Supervisor</td><td>: {selectedSup.supervisorName} (Kepala RA)</td></tr>
                    <tr><td className="font-semibold">Tanggal Pelaksanaan</td><td>: {selectedSup.tanggal}</td></tr>
                    <tr><td className="font-semibold">Jenis Supervisi</td><td>: {selectedSup.jenis}</td></tr>
                    <tr><td className="font-semibold">Skor Akhir Capaian</td><td>: <strong>{selectedSup.skor} / 100 (Amat Baik)</strong></td></tr>
                  </tbody>
                </table>

                <div className="pt-2">
                  <div className="font-bold text-slate-800">Catatan Observasi:</div>
                  <p className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">{selectedSup.catatanObservasi}</p>
                </div>

                <div className="pt-2">
                  <div className="font-bold text-slate-800">Rekomendasi Tindak Lanjut:</div>
                  <p className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">{selectedSup.rekomendasi}</p>
                </div>
              </div>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Guru Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Supervisor,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {selectedSup.tanggal}</div>
                  <div className="font-bold">Guru yang Disupervisi</div>
                  <div className="mt-12 font-semibold underline">{selectedSup.targetTeacherName}</div>
                  <div>Pendidik RA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
