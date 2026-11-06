import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupervisionRecord, PengawasRecord } from '../types';
import { exportJsonToExcel } from '../utils/exportExcel';
import {
  ShieldAlert,
  Building2,
  CheckCircle2,
  Calendar,
  Award,
  Printer,
  Plus,
  BookOpen,
  DollarSign,
  TrendingUp,
  FileText,
  Download,
  X,
  Edit3,
  Trash2,
  UserCheck,
  Phone,
  Mail,
  FileSpreadsheet,
  Upload,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  User
} from 'lucide-react';

export const SupervisiPengawasView: React.FC = () => {
  const {
    profile,
    supervisions,
    addSupervision,
    updateSupervision,
    academicYear,
    pengawasList,
    addPengawas,
    updatePengawas,
    deletePengawas,
  } = useApp();

  type TabType = 'berita-acara' | 'data-pengawas';
  const [activeTab, setActiveTab] = useState<TabType>('data-pengawas');

  // Filter supervisions specifically conducted by Pengawas for THIS RA
  const pengawasSupervisions = supervisions.filter(s => s.supervisorRole === 'pengawas');
  const [selectedSupId, setSelectedSupId] = useState(pengawasSupervisions[0]?.id || '');
  const selectedSup = pengawasSupervisions.find(s => s.id === selectedSupId) || pengawasSupervisions[0];

  // Supervision Modals
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Pengawas CRUD Modals
  const [isPengawasModalOpen, setIsPengawasModalOpen] = useState(false);
  const [editingPengawas, setEditingPengawas] = useState<PengawasRecord | null>(null);
  const [selectedPengawasForPrint, setSelectedPengawasForPrint] = useState<PengawasRecord | null>(null);
  const [isPrintPengawasModalOpen, setIsPrintPengawasModalOpen] = useState(false);

  // Pengawas Form State
  const [pengawasForm, setPengawasForm] = useState<Omit<PengawasRecord, 'id'>>({
    nama: '',
    nip: '',
    pangkatGolongan: 'Pembina Tk. I, IV/b',
    jabatan: 'Pengawas Madrasah Ahli Madya',
    wilayahBinaan: 'Kecamatan Coblong & Sukajadi, Kota Bandung',
    noHp: '081223344556',
    email: '',
    skPenugasan: 'Kemenag.08/KP.02.1/01/2026',
    tanggalMulaiTugas: '2026-01-02',
    foto: '',
    catatan: 'Fokus pembinaan KOSP, Kurikulum Merdeka P2RA, & Akuntabilitas BOS',
  });

  // Supervision Form State (Khusus RA ini)
  const [form, setForm] = useState({
    supervisorName: pengawasList[0]?.nama || 'Drs. H. Ahmad Fauzi, M.Ag',
    supervisorNip: pengawasList[0]?.nip || '19680315 199403 1 002',
    tanggal: new Date().toISOString().split('T')[0],
    jenis: 'Supervisi Manajerial' as 'Supervisi Akademik' | 'Supervisi Manajerial',
    skor: 96,
    aspek: [
      'Kelengkapan Kurikulum Operasional RA (KORA)',
      'Integrasi Profil Pelajar Pancasila & Rahmatan Lil Alamin (P2RA)',
      'Transparansi Realisasi BOS & Kerapian SPJ',
      'Kesiapan Akreditasi 8 Standar Nasional Pendidikan',
    ],
    catatanObservasi: `RA ${profile.name} menunjukkan tata kelola kelembagaan digital yang sangat rapi dan tertib. Administrasi guru, asesmen otentik peserta didik, serta penyerapan anggaran BOS berjalan sangat akuntabel.`,
    rekomendasi: 'Pertahankan tata kelola digital terpadu; jadikan rujukan percontohan bagi madrasah binaan lain di lingkungan Kemenag Kota.',
  });

  // Auto-fill supervisor details when selected from pengawasList
  const handleSelectSupervisor = (name: string) => {
    const found = pengawasList.find(p => p.nama === name);
    if (found) {
      setForm(prev => ({
        ...prev,
        supervisorName: found.nama,
        supervisorNip: found.nip,
      }));
    } else {
      setForm(prev => ({ ...prev, supervisorName: name }));
    }
  };

  const handleCreateSupervision = (e: React.FormEvent) => {
    e.preventDefault();
    addSupervision({
      tanggal: form.tanggal,
      supervisorRole: 'pengawas',
      supervisorName: form.supervisorName,
      supervisorNip: form.supervisorNip,
      targetRaName: profile.name,
      jenis: form.jenis,
      aspek: form.aspek,
      skor: Number(form.skor),
      catatanObservasi: form.catatanObservasi,
      rekomendasi: form.rekomendasi,
      statusTindakLanjut: 'Tuntas Memuaskan',
      tandaTangan: true,
    });
    setIsInputModalOpen(false);
  };

  // Open Pengawas Modal
  const handleOpenAddPengawas = () => {
    setEditingPengawas(null);
    setPengawasForm({
      nama: '',
      nip: '',
      pangkatGolongan: 'Pembina Tk. I, IV/b',
      jabatan: 'Pengawas Madrasah Ahli Madya',
      wilayahBinaan: `Wilayah Binaan RA ${profile.name}`,
      noHp: '',
      email: '',
      skPenugasan: `SK.PW/KEMENAG/${new Date().getFullYear()}/042`,
      tanggalMulaiTugas: new Date().toISOString().split('T')[0],
      foto: '',
      catatan: 'Pembina resmi dari Seksi Pendidikan Madrasah Kantor Kemenag',
    });
    setIsPengawasModalOpen(true);
  };

  const handleOpenEditPengawas = (p: PengawasRecord) => {
    setEditingPengawas(p);
    setPengawasForm({
      nama: p.nama,
      nip: p.nip,
      pangkatGolongan: p.pangkatGolongan,
      jabatan: p.jabatan,
      wilayahBinaan: p.wilayahBinaan,
      noHp: p.noHp,
      email: p.email || '',
      skPenugasan: p.skPenugasan || '',
      tanggalMulaiTugas: p.tanggalMulaiTugas || '',
      foto: p.foto || '',
      catatan: p.catatan || '',
    });
    setIsPengawasModalOpen(true);
  };

  const handleSavePengawas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pengawasForm.nama.trim()) {
      alert('Nama pengawas pembina wajib diisi!');
      return;
    }

    if (editingPengawas) {
      updatePengawas({
        ...pengawasForm,
        id: editingPengawas.id,
      });
    } else {
      addPengawas(pengawasForm);
    }
    setIsPengawasModalOpen(false);
    setEditingPengawas(null);
  };

  const handleDeletePengawas = (p: PengawasRecord) => {
    if (confirm(`Yakin ingin menghapus data pengawas "${p.nama}"?`)) {
      deletePengawas(p.id);
    }
  };

  // Image Upload from Gallery
  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPengawasForm(prev => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Export Supervisions to Excel (.xlsx)
  const handleExportSupervisiExcel = () => {
    const rows = pengawasSupervisions.map((s, idx) => ({
      No: idx + 1,
      Tanggal: s.tanggal,
      'Nama Pengawas Pembina': s.supervisorName,
      'NIP Pengawas': s.supervisorNip || '-',
      'Lembaga RA Sasaran': profile.name,
      'Nomor Statistik (NSM)': profile.nsm,
      'Jenis Supervisi': s.jenis,
      'Skor Indeks Mutu': s.skor,
      'Catatan Observasi & Temuan': s.catatanObservasi,
      'Rekomendasi Pembinaan': s.rekomendasi,
      'Status Tindak Lanjut': s.statusTindakLanjut,
    }));
    exportJsonToExcel(rows, `Supervisi_Pengawas_Kemenag_${profile.name.replace(/\s+/g, '_')}`, 'Supervisi Pengawas');
  };

  // Export Pengawas List to Excel (.xlsx)
  const handleExportPengawasExcel = () => {
    const rows = pengawasList.map((p, idx) => ({
      No: idx + 1,
      'Nama Lengkap & Gelar': p.nama,
      NIP: p.nip,
      'Pangkat / Golongan': p.pangkatGolongan,
      Jabatan: p.jabatan,
      'Wilayah Binaan': p.wilayahBinaan,
      'No. WhatsApp / HP': p.noHp,
      Email: p.email || '-',
      'SK Penugasan': p.skPenugasan || '-',
      'Tanggal Mulai Tugas': p.tanggalMulaiTugas || '-',
      Catatan: p.catatan || '-',
    }));
    exportJsonToExcel(rows, `Data_Pengawas_Pembina_${profile.name.replace(/\s+/g, '_')}`, 'Pengawas Pembina');
  };

  const primaryPengawas = pengawasList[0];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Kementerian Agama RI &bull; Pokjawas Madrasah & Raudlatul Athfal</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Supervisi & Pembinaan Pengawas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data pengawas pembina Kemenag, rekam hasil supervisi berkala, cetak berita acara, dan ekspor berkas akuntabilitas mutu RA <strong>{profile.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'data-pengawas' ? (
            <>
              <button
                onClick={handleExportPengawasExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={handleOpenAddPengawas}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Data Pengawas</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleExportSupervisiExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-xl border border-indigo-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Berita Acara</span>
              </button>
              <button
                onClick={() => setIsInputModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Input Supervisi Pengawas</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* RA Lembaga Info Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={profile.logoUrl}
            alt="Logo RA"
            className="w-12 h-12 object-contain bg-white/10 rounded-xl p-1 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">
                Lembaga Binaan Aktif
              </span>
              <span className="text-xs text-indigo-200">NSM: {profile.nsm} &bull; NPSN: {profile.npsn}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{profile.name}</h3>
            <p className="text-xs text-indigo-200">Kepala RA: {profile.headmasterName} &bull; Akreditasi: {profile.accreditation}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-indigo-800/60 pt-3 md:pt-0 md:pl-6 text-xs">
          <div>
            <div className="text-[10px] text-indigo-300">Pengawas Pembina Utama:</div>
            <div className="font-bold text-white mt-0.5">
              {primaryPengawas?.nama || 'Drs. H. Ahmad Fauzi, M.Ag'}
            </div>
            <div className="text-[10px] text-indigo-300 font-mono">
              NIP: {primaryPengawas?.nip || '19680315 199403 1 002'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-indigo-300">Indeks Mutu RA:</div>
            <div className="text-2xl font-black text-amber-400 font-mono">96<span className="text-xs text-indigo-200">/100</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 p-1 shadow-2xs gap-2">
        <button
          onClick={() => setActiveTab('data-pengawas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'data-pengawas'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Data Pengawas Pembina ({pengawasList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('berita-acara')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'berita-acara'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Berita Acara & Riwayat Supervisi ({pengawasSupervisions.length})</span>
        </button>
      </div>

      {/* TAB 1: DATA PENGAWAS PEMBINA */}
      {activeTab === 'data-pengawas' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-950 text-sm">
                  Kelola Data Pengawas Pembina Kementerian Agama RI
                </h4>
                <p className="text-xs text-indigo-800">
                  Data pengawas pembina resmi, SK penugasan, nomor WhatsApp, serta rekam pembinaan madrasah.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenAddPengawas}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Data Pengawas Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pengawasList.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
                Belum ada data pengawas pembina. Klik "Input Data Pengawas Baru" untuk menambahkan.
              </div>
            ) : (
              pengawasList.map((p) => {
                const cleanPhone = p.noHp ? p.noHp.replace(/\D/g, '').replace(/^0/, '62') : '';
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <img
                          src={p.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160'}
                          alt={p.nama}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{p.nama}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0">
                              {p.pangkatGolongan}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">NIP: {p.nip}</div>
                          <div className="text-xs font-medium text-indigo-700 mt-1">{p.jabatan}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{p.wilayahBinaan}</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold text-slate-500">SK Penugasan:</span>
                          <span className="font-mono text-slate-800 text-[11px]">{p.skPenugasan || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold text-slate-500">Mulai Tugas:</span>
                          <span>{p.tanggalMulaiTugas || '-'}</span>
                        </div>
                        {p.catatan && (
                          <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 mt-2">
                            "{p.catatan}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Assalamu%27alaikum%20Bapak%2FIbu%20Pengawas%20Pembina%2C%20kami%20dari%20RA%20${encodeURIComponent(profile.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition"
                            title="Hubungi via WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Chat WA ({p.noHp})</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPengawasForPrint(p);
                            setIsPrintPengawasModalOpen(true);
                          }}
                          className="p-2 text-indigo-700 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                          title="Cetak Biodata & SK Tugas"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditPengawas(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                          title="Edit Data Pengawas"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePengawas(p)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Hapus Data Pengawas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BERITA ACARA & RIWAYAT SUPERVISI */}
      {activeTab === 'berita-acara' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Daftar Riwayat Supervisi untuk RA ini */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-xs">Riwayat Supervisi Pengawas RA</h3>
              <span className="text-[11px] text-slate-500 font-semibold">{pengawasSupervisions.length} Berkas</span>
            </div>

            <div className="space-y-2.5">
              {pengawasSupervisions.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">Belum ada riwayat supervisi.</div>
              ) : (
                pengawasSupervisions.map((sup) => {
                  const isSelected = (selectedSup?.id || '') === sup.id;
                  return (
                    <div
                      key={sup.id}
                      onClick={() => setSelectedSupId(sup.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">{sup.jenis}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                          Skor {sup.skor}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sup.tanggal}</span>
                        <span>&bull;</span>
                        <span className="text-slate-600 font-medium">{sup.supervisorName}</span>
                      </div>
                      <div className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{sup.statusTindakLanjut}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detail Rekam Berita Acara Supervisi Pengawas */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            {selectedSup ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      Instrumen Supervisi Pengawas Kemenag
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">
                      {selectedSup.jenis} &bull; {profile.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pengawas: {selectedSup.supervisorName} &bull; Tanggal Kunjungan: {selectedSup.tanggal}
                    </p>
                  </div>
                  <div className="text-right flex items-center sm:flex-col sm:items-end gap-2">
                    <span className="text-3xl font-black text-indigo-800 font-mono">
                      {selectedSup.skor}
                      <span className="text-xs font-normal text-slate-400"> /100</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Sangat Memuaskan
                    </span>
                  </div>
                </div>

                {/* Aspek yang Ditelaah Pengawas */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800">Fokus Aspek Supervisi & Audit Pengawas:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {selectedSup.aspek.map((asp, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed">{asp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan Observasi & Rekomendasi Pengawas */}
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-800">Hasil Telaah & Catatan Pengawas Pembina:</div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{selectedSup.catatanObservasi}</p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <div className="font-bold text-emerald-950">Rekomendasi Pembinaan Lanjutan:</div>
                    <p className="text-emerald-900 leading-relaxed text-[11px]">{selectedSup.rekomendasi}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Tersimpan secara digital &bull; Berlaku untuk Akreditasi & PKKM
                  </div>
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Berita Acara (PDF)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Pilih salah satu riwayat supervisi untuk melihat detail instrumen.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT DATA PENGAWAS PEMBINA */}
      {isPengawasModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingPengawas ? 'Edit Data Pengawas Pembina' : 'Tambah Pengawas Pembina Kemenag'}
                </h3>
                <p className="text-xs text-slate-500">Identitas resmi pembina madrasah dan raudlatul athfal</p>
              </div>
              <button
                onClick={() => {
                  setIsPengawasModalOpen(false);
                  setEditingPengawas(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePengawas} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={pengawasForm.nama}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, nama: e.target.value })}
                    placeholder="Contoh: Drs. H. Ahmad Fauzi, M.Ag"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={pengawasForm.nip}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, nip: e.target.value })}
                    placeholder="19680315 199403 1 002"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={pengawasForm.pangkatGolongan}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, pangkatGolongan: e.target.value })}
                    placeholder="Contoh: Pembina Tk. I, IV/b"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan Fungsional</label>
                  <input
                    type="text"
                    value={pengawasForm.jabatan}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, jabatan: e.target.value })}
                    placeholder="Pengawas Madrasah Ahli Madya"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wilayah Binaan / Pokjawas</label>
                  <input
                    type="text"
                    value={pengawasForm.wilayahBinaan}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, wilayahBinaan: e.target.value })}
                    placeholder="Kota Bandung Wilayah Utara"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={pengawasForm.noHp}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, noHp: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor SK Penugasan Kemenag</label>
                  <input
                    type="text"
                    value={pengawasForm.skPenugasan}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, skPenugasan: e.target.value })}
                    placeholder="SK.PW/KEMENAG/2026/042"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai Tugas</label>
                  <input
                    type="date"
                    value={pengawasForm.tanggalMulaiTugas}
                    onChange={(e) => setPengawasForm({ ...pengawasForm, tanggalMulaiTugas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Upload Foto Pengawas dari Galeri (Requirement 4) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Foto Pengawas (Upload dari Galeri / File)</label>
                <div className="flex items-center gap-3">
                  {pengawasForm.foto ? (
                    <img
                      src={pengawasForm.foto}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoUpload}
                      className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Format JPG, PNG atau WebP (maks 2MB)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Fokus Pembinaan</label>
                <textarea
                  value={pengawasForm.catatan}
                  onChange={(e) => setPengawasForm({ ...pengawasForm, catatan: e.target.value })}
                  rows={2}
                  placeholder="Catatan arahan atau fokus pembinaan kurikulum..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsPengawasModalOpen(false);
                    setEditingPengawas(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  {editingPengawas ? 'Perbarui Data Pengawas' : 'Simpan Data Pengawas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRINT BIODATA & SK TUGAS PENGAWAS */}
      {isPrintPengawasModalOpen && selectedPengawasForPrint && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Biodata & SK Tugas Pengawas Pembina</h3>
                <p className="text-xs text-slate-500">Format resmi instrumen pembinaan RA</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPrintPengawasModalOpen(false);
                    setSelectedPengawasForPrint(null);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-300"
                >
                  &larr; Kembali
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-800 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF / Print</span>
                </button>
                <button
                  onClick={() => {
                    setIsPrintPengawasModalOpen(false);
                    setSelectedPengawasForPrint(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Sheet */}
            <div className="p-6 bg-white mt-3 space-y-4 font-serif border border-slate-300 rounded-xl text-slate-900">
              <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-3">
                <img
                  src={profile.logoUrl}
                  alt="Logo RA"
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div className="text-center flex-1">
                  <div className="text-xs uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-lg font-black uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[10px] text-slate-600 font-sans">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm}</div>
                </div>
              </div>

              <div className="text-center font-bold text-sm uppercase underline mt-2">
                LEMBAR BIODATA & REKAM TUGAS PENGAWAS PEMBINA MADRASAH
              </div>
              <div className="text-[10px] text-center text-slate-500 font-sans">
                Kementerian Agama Republik Indonesia &bull; Kantor Wilayah / Kemenag Kota
              </div>

              <div className="flex items-start gap-4 pt-4 font-sans text-xs">
                <img
                  src={selectedPengawasForPrint.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160'}
                  alt={selectedPengawasForPrint.nama}
                  className="w-24 h-32 rounded-lg object-cover border border-slate-400 shrink-0"
                />
                <table className="w-full text-xs">
                  <tbody>
                    <tr><td className="w-40 font-semibold py-1">Nama Lengkap & Gelar</td><td>: <strong>{selectedPengawasForPrint.nama}</strong></td></tr>
                    <tr><td className="font-semibold py-1">NIP</td><td>: {selectedPengawasForPrint.nip}</td></tr>
                    <tr><td className="font-semibold py-1">Pangkat / Golongan</td><td>: {selectedPengawasForPrint.pangkatGolongan}</td></tr>
                    <tr><td className="font-semibold py-1">Jabatan Fungsional</td><td>: {selectedPengawasForPrint.jabatan}</td></tr>
                    <tr><td className="font-semibold py-1">Wilayah Binaan</td><td>: {selectedPengawasForPrint.wilayahBinaan}</td></tr>
                    <tr><td className="font-semibold py-1">No. SK Penugasan</td><td>: {selectedPengawasForPrint.skPenugasan || '-'}</td></tr>
                    <tr><td className="font-semibold py-1">Tanggal Mulai Tugas</td><td>: {selectedPengawasForPrint.tanggalMulaiTugas || '-'}</td></tr>
                    <tr><td className="font-semibold py-1">Kontak WhatsApp</td><td>: {selectedPengawasForPrint.noHp}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-4 font-sans text-xs">
                <div className="font-bold text-slate-800">Catatan Khusus Pembinaan RA:</div>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded mt-1 text-slate-700">
                  {selectedPengawasForPrint.catatan || 'Melaksanakan tugas supervisi akademik dan manajerial secara berkala pada RA binaan.'}
                </p>
              </div>

              <div className="pt-8 flex justify-between font-sans text-xs text-slate-700">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div className="font-bold">Kepala RA {profile.name.replace('RA ', '')}</div>
                  <div className="mt-14 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Pengawas Pembina Kemenag</div>
                  <div className="mt-14 font-semibold underline">{selectedPengawasForPrint.nama}</div>
                  <div>NIP: {selectedPengawasForPrint.nip}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INPUT SUPERVISI PENGAWAS */}
      {isInputModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Input Supervisi Pengawas Kemenag untuk {profile.name}
              </h3>
              <button
                onClick={() => setIsInputModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupervision} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Pengawas Pembina</label>
                  <select
                    value={form.supervisorName}
                    onChange={(e) => handleSelectSupervisor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    {pengawasList.map((p) => (
                      <option key={p.id} value={p.nama}>
                        {p.nama}
                      </option>
                    ))}
                    <option value="Drs. H. Ahmad Fauzi, M.Ag">Drs. H. Ahmad Fauzi, M.Ag</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP Pengawas</label>
                  <input
                    type="text"
                    value={form.supervisorNip}
                    onChange={(e) => setForm({ ...form, supervisorNip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Supervisi</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Supervisi</label>
                  <select
                    value={form.jenis}
                    onChange={(e) => setForm({ ...form, jenis: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Supervisi Manajerial">Supervisi Manajerial</option>
                    <option value="Supervisi Akademik">Supervisi Akademik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skor Indeks (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.skor}
                    onChange={(e) => setForm({ ...form, skor: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-indigo-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Observasi & Temuan Pengawas</label>
                <textarea
                  value={form.catatanObservasi}
                  onChange={(e) => setForm({ ...form, catatanObservasi: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rekomendasi & Tindak Lanjut</label>
                <textarea
                  value={form.rekomendasi}
                  onChange={(e) => setForm({ ...form, rekomendasi: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInputModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow transition"
                >
                  Simpan Supervisi Pengawas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRINT BERITA ACARA SUPERVISI PENGAWAS (KOP LOGO + TTD KEPALA KIRI, PENGAWAS KANAN) */}
      {isPrintModalOpen && selectedSup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Berita Acara Supervisi Pengawas</h3>
                <p className="text-xs text-slate-500">Standar resmi Ditjen Pendis Kemenag RI</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-300"
                >
                  &larr; Kembali
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
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
                BERITA ACARA SUPERVISI & PEMBINAAN PENGAWAS MADRASAH
              </div>

              <div className="font-sans text-[11px] leading-relaxed space-y-2">
                <p>Telah dilaksanakan supervisi dan audit mutu kelembagaan oleh Pengawas Pembina Kementerian Agama RI terhadap:</p>
                <table className="w-full text-[11px]">
                  <tbody>
                    <tr><td className="w-40 font-semibold">Nama Lembaga Sasaran</td><td>: <strong>{profile.name}</strong></td></tr>
                    <tr><td className="font-semibold">Nomor Statistik (NSM)</td><td>: {profile.nsm}</td></tr>
                    <tr><td className="font-semibold">Nama Kepala RA</td><td>: {profile.headmasterName}</td></tr>
                    <tr><td className="font-semibold">Nama Pengawas Pembina</td><td>: {selectedSup.supervisorName} (NIP: {selectedSup.supervisorNip})</td></tr>
                    <tr><td className="font-semibold">Tanggal Kunjungan</td><td>: {selectedSup.tanggal}</td></tr>
                    <tr><td className="font-semibold">Fokus Supervisi</td><td>: {selectedSup.jenis}</td></tr>
                    <tr><td className="font-semibold">Nilai Indeks Mutu</td><td>: <strong>{selectedSup.skor} / 100 (Sangat Memuaskan)</strong></td></tr>
                  </tbody>
                </table>

                <div className="pt-2">
                  <div className="font-bold text-slate-800">Catatan Temuan & Observasi Pengawas:</div>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">{selectedSup.catatanObservasi}</p>
                </div>

                <div className="pt-2">
                  <div className="font-bold text-slate-800">Rekomendasi & Tindak Lanjut:</div>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">{selectedSup.rekomendasi}</p>
                </div>
              </div>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Pengawas Sebelah Kanan */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Kepala RA,</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {selectedSup.tanggal}</div>
                  <div className="font-bold">Pengawas Pembina Kemenag</div>
                  <div className="mt-12 font-semibold underline">{selectedSup.supervisorName}</div>
                  <div>NIP: {selectedSup.supervisorNip || '19680315 199403 1 002'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
