import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PKKMItem } from '../types';
import { exportJsonToExcel } from '../utils/exportExcel';
import {
  Award,
  FileCheck,
  Printer,
  FileSpreadsheet,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  FileText,
  Calendar,
  X,
  ShieldCheck,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const PKKMView: React.FC = () => {
  const { profile, pkkmList, addPKKMItem, updatePKKMItem, deletePKKMItem } = useApp();

  const [activePeriod, setActivePeriod] = useState<'Tahunan' | '4 Tahunan'>('Tahunan');
  const [selectedKomponen, setSelectedKomponen] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Lengkap' | 'Belum Lengkap'>('all');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PKKMItem | null>(null);
  const [isPrintSingleOpen, setIsPrintSingleOpen] = useState(false);
  const [selectedPrintItem, setSelectedPrintItem] = useState<PKKMItem | null>(null);
  const [isPrintRekapOpen, setIsPrintRekapOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<PKKMItem, 'id'>>({
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 1,
    namaKomponen: 'Komponen 1: Usaha Pengembangan Madrasah/RA',
    kriteriaIndikator: '',
    subIndikator: '',
    buktiFisikDisiapkan: '',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: '',
    judulBlangko: '',
    isiBlangko: '',
  });

  // Filter items by active period (Tahunan: Komponen 1-4, 4 Tahunan: Komponen 1-5 or explicit period)
  const currentItems = useMemo(() => {
    return pkkmList.filter(item => {
      if (activePeriod === 'Tahunan') {
        // Tahunan items typically have periode 'Tahunan' or Komponen <= 4
        const matchesPeriod = item.periode === 'Tahunan' || item.komponenNo <= 4;
        if (!matchesPeriod) return false;
      } else {
        // 4 Tahunan includes all 5 components
        // If an item is designated 4 Tahunan or belongs to standard 4-year cycle
        const matchesPeriod = item.periode === '4 Tahunan' || item.komponenNo <= 5;
        if (!matchesPeriod) return false;
      }

      if (selectedKomponen !== 'all' && item.komponenNo !== selectedKomponen) {
        return false;
      }

      if (filterStatus !== 'all' && item.statusBukti !== filterStatus) {
        return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches =
          item.namaKomponen.toLowerCase().includes(term) ||
          item.kriteriaIndikator.toLowerCase().includes(term) ||
          (item.subIndikator ? item.subIndikator.toLowerCase().includes(term) : false) ||
          item.buktiFisikDisiapkan.toLowerCase().includes(term) ||
          (item.catatanPenilai && item.catatanPenilai.toLowerCase().includes(term));
        if (!matches) return false;
      }

      return true;
    });
  }, [pkkmList, activePeriod, selectedKomponen, filterStatus, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const periodAll = pkkmList.filter(item =>
      activePeriod === 'Tahunan'
        ? item.periode === 'Tahunan' || item.komponenNo <= 4
        : item.periode === '4 Tahunan' || item.komponenNo <= 5
    );
    const totalButir = periodAll.length;
    const lengkap = periodAll.filter(item => item.statusBukti === 'Lengkap').length;
    const persentaseLengkap = totalButir > 0 ? Math.round((lengkap / totalButir) * 100) : 0;

    const totalSkor = periodAll.reduce((acc, curr) => acc + (curr.skor || 0), 0);
    const maxSkor = totalButir * 4;
    const rerataSkor = totalButir > 0 ? (totalSkor / totalButir).toFixed(2) : '0.00';
    const nilaiKonversi = maxSkor > 0 ? Math.round((totalSkor / maxSkor) * 100) : 0;

    let predikat = 'Cukup';
    if (nilaiKonversi >= 91) predikat = 'Amat Baik (A)';
    else if (nilaiKonversi >= 76) predikat = 'Baik (B)';
    else if (nilaiKonversi >= 61) predikat = 'Cukup (C)';
    else predikat = 'Sedang (D)';

    return {
      totalButir,
      lengkap,
      persentaseLengkap,
      rerataSkor,
      nilaiKonversi,
      predikat,
    };
  }, [pkkmList, activePeriod]);

  // Handle Form Open
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      tahun: '2026/2027',
      periode: activePeriod,
      komponenNo: activePeriod === '4 Tahunan' ? 5 : 1,
      namaKomponen:
        activePeriod === '4 Tahunan'
          ? 'Komponen 5: Hasil Kinerja Madrasah/RA'
          : 'Komponen 1: Usaha Pengembangan Madrasah/RA',
      kriteriaIndikator: '',
      subIndikator: '',
      buktiFisikDisiapkan: '',
      statusBukti: 'Lengkap',
      skor: 4,
      catatanPenilai: 'Bukti fisik lengkap, terverifikasi sangat memuaskan sesuai juknis Kemenag.',
      judulBlangko: `BLANGKO INSTRUMEN PKKM: ${activePeriod.toUpperCase()}`,
      isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA RA (PKKM)\n\nA. KRITERIA INDIKATOR:\n\nB. BUKTI FISIK:\n1. Dokumen pendukung terlampir.\n2. Berita acara dan SK Kepala RA.\n\nC. HASIL VERIFIKASI PENILAI:\nSkor 4 (Amat Baik).`,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: PKKMItem) => {
    setEditingItem(item);
    setFormData({
      tahun: item.tahun,
      periode: item.periode,
      komponenNo: item.komponenNo,
      namaKomponen: item.namaKomponen,
      kriteriaIndikator: item.kriteriaIndikator,
      subIndikator: item.subIndikator,
      buktiFisikDisiapkan: item.buktiFisikDisiapkan,
      statusBukti: item.statusBukti,
      skor: item.skor,
      catatanPenilai: item.catatanPenilai,
      judulBlangko: item.judulBlangko,
      isiBlangko: item.isiBlangko,
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kriteriaIndikator.trim()) {
      alert('Kriteria indikator wajib diisi!');
      return;
    }

    if (editingItem) {
      updatePKKMItem({
        ...formData,
        id: editingItem.id,
      });
    } else {
      addPKKMItem(formData);
    }

    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus butir instrumen PKKM "${name}"?`)) {
      deletePKKMItem(id);
    }
  };

  // Export Excel (.xlsx)
  const handleExportExcel = () => {
    const exportData = currentItems.map((item, idx) => ({
      No: idx + 1,
      Periode: item.periode,
      Tahun: item.tahun,
      Komponen: item.namaKomponen,
      'Kriteria Indikator': item.kriteriaIndikator,
      'Sub-Indikator': item.subIndikator,
      'Bukti Fisik': item.buktiFisikDisiapkan,
      'Status Bukti': item.statusBukti,
      'Skor (1-4)': item.skor,
      'Catatan Penilai': item.catatanPenilai,
    }));

    exportJsonToExcel(
      exportData,
      `Rekap_PKKM_${activePeriod.replace(/\s+/g, '_')}_${profile.name.replace(/\s+/g, '_')}`,
      `PKKM_${activePeriod}`
    );
  };

  // Komponen Mapping
  const komponenOptions = [
    { no: 1, name: 'Komponen 1: Usaha Pengembangan Madrasah/RA' },
    { no: 2, name: 'Komponen 2: Pelaksanaan Tugas Manajerial' },
    { no: 3, name: 'Komponen 3: Pengembangan Kewirausahaan RA' },
    { no: 4, name: 'Komponen 4: Supervisi kepada Guru dan Tendik' },
    ...(activePeriod === '4 Tahunan'
      ? [{ no: 5, name: 'Komponen 5: Hasil Kinerja Madrasah/RA' }]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-200" />
              Instrumen Resmi Kemenag RI
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Penilaian Kinerja Kepala RA (PKKM)
            </h1>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              Instrumen evaluasi mutu kepemimpinan Kepala {profile.name} (Tahunan Komponen 1-4 & 4 Tahunan Komponen 1-5).
              Lengkap dengan blangko bukti fisik, isian digital, berita acara, serta cetak pengesahan Pengawas Pembina.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPrintRekapOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-900 hover:bg-white font-semibold rounded-xl text-sm transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              Cetak Berita Acara & Rekap
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-sm transition-all shadow-sm active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-100" />
              Export Excel (.xlsx)
            </button>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-slate-900" />
              Tambah Indikator / Bukti
            </button>
          </div>
        </div>

        {/* Period Switcher Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-emerald-600/60 pt-4">
          <button
            onClick={() => {
              setActivePeriod('Tahunan');
              setSelectedKomponen('all');
            }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
              activePeriod === 'Tahunan'
                ? 'bg-white text-emerald-900 shadow-md ring-2 ring-emerald-300'
                : 'bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            PKKM Tahunan (Komponen 1 - 4)
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-semibold ml-1">
              {pkkmList.filter(i => i.periode === 'Tahunan' || i.komponenNo <= 4).length} Butir
            </span>
          </button>

          <button
            onClick={() => {
              setActivePeriod('4 Tahunan');
              setSelectedKomponen('all');
            }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
              activePeriod === '4 Tahunan'
                ? 'bg-white text-emerald-900 shadow-md ring-2 ring-emerald-300'
                : 'bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100'
            }`}
          >
            <Award className="w-4 h-4" />
            PKKM 4 Tahunan (Komponen 1 - 5)
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-semibold ml-1">
              {pkkmList.length} Butir Lengkap
            </span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Indikator {activePeriod}
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.totalButir} <span className="text-xs font-medium text-slate-500">Butir</span>
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {stats.lengkap} bukti fisik siap audit
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kesiapan Bukti Fisik
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
              {stats.persentaseLengkap}%
            </h3>
            <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${stats.persentaseLengkap}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rerata Skor Kinerja
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.rerataSkor}{' '}
              <span className="text-xs font-medium text-slate-400">/ 4.00</span>
            </h3>
            <p className="text-xs text-emerald-700 font-bold mt-1">
              Predikat: {stats.predikat}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Verifikasi Pengawas Kemenag
            </p>
            <h3 className="text-base font-extrabold text-emerald-700 mt-1">
              Terverifikasi & Valid
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pengawas Pembina Kemenag
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedKomponen('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedKomponen === 'all'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Komponen
          </button>
          {[1, 2, 3, 4, ...(activePeriod === '4 Tahunan' ? [5] : [])].map(no => (
            <button
              key={no}
              onClick={() => setSelectedKomponen(no)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedKomponen === no
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Komponen {no}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari indikator / bukti..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Status</option>
            <option value="Lengkap">Bukti Lengkap</option>
            <option value="Belum Lengkap">Belum Lengkap</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Daftar Instrumen & Bukti Fisik PKKM ({activePeriod})
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan {currentItems.length} butir evaluasi mutu kepemimpinan Kepala RA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Skor 4 = Amat Baik
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-52">Komponen & Periode</th>
                <th className="py-3 px-4 w-72">Kriteria & Sub-Indikator</th>
                <th className="py-3 px-4">Bukti Fisik yang Disiapkan</th>
                <th className="py-3 px-3 w-28 text-center">Status</th>
                <th className="py-3 px-3 w-20 text-center">Skor (1-4)</th>
                <th className="py-3 px-4 w-44 text-center">Aksi & Blangko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Tidak ada butir PKKM yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Silakan sesuaikan filter komponen atau tambahkan butir baru.
                    </p>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-bold text-slate-800 text-xs leading-snug">
                        {item.namaKomponen}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {item.periode}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          TP {item.tahun}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-800 text-xs leading-relaxed">
                        {item.kriteriaIndikator}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="font-medium text-slate-700">Sub-Indikator: </span>
                        {item.subIndikator}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="text-xs text-slate-700 leading-relaxed font-medium">
                        {item.buktiFisikDisiapkan}
                      </div>
                      {item.catatanPenilai && (
                        <div className="mt-1.5 text-[11px] text-teal-800 bg-teal-50/80 p-2 rounded-lg border border-teal-100">
                          <span className="font-bold">Catatan Penilai: </span>
                          {item.catatanPenilai}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center align-top">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.statusBukti === 'Lengkap'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.statusBukti === 'Lengkap' ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <HelpCircle className="w-3 h-3 text-amber-600" />
                        )}
                        {item.statusBukti}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center align-top">
                      <div className="inline-flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="text-sm font-extrabold">{item.skor}</span>
                        <span className="text-[9px] font-semibold text-emerald-600">/ 4</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center align-top">
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPrintItem(item);
                            setIsPrintSingleOpen(true);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
                          title="Cetak Blangko Format Kemenag"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Cetak Blangko
                        </button>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Butir"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.kriteriaIndikator)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Butir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Callout Card */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">
              Standar Regulasi PKKM Kemenag RI (Keputusan Dirjen Pendis)
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
              PKKM Tahunan meliputi 4 tugas pokok manajerial & supervisi. Khusus PKKM 4 Tahunan, ditambahkan
              Komponen 5 (Hasil Kinerja RA) yang menguji rekam jejak prestasi kelembagaan, kelulusan 100%,
              dan kualifikasi guru bersertifikat pendidik.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPrintRekapOpen(true)}
          className="shrink-0 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          Cetak Berita Acara PKKM
        </button>
      </div>

      {/* MODAL 1: FORM INPUT / EDIT PKKM ITEM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-300" />
                  {editingItem ? 'Edit Instrumen & Bukti PKKM' : 'Tambah Instrumen & Bukti PKKM'}
                </h3>
                <p className="text-xs text-emerald-100">
                  Format isian standar penilaian kinerja kepala madrasah / RA
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Periode Evaluasi</label>
                  <select
                    value={formData.periode}
                    onChange={e =>
                      setFormData({ ...formData, periode: e.target.value as 'Tahunan' | '4 Tahunan' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tahunan">Tahunan (Komponen 1 - 4)</option>
                    <option value="4 Tahunan">4 Tahunan (Komponen 1 - 5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={formData.tahun}
                    onChange={e => setFormData({ ...formData, tahun: e.target.value })}
                    placeholder="2026/2027"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Komponen PKKM</label>
                <select
                  value={formData.komponenNo}
                  onChange={e => {
                    const no = Number(e.target.value);
                    const matched = komponenOptions.find(k => k.no === no);
                    setFormData({
                      ...formData,
                      komponenNo: no,
                      namaKomponen: matched ? matched.name : `Komponen ${no}`,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={1}>Komponen 1: Usaha Pengembangan Madrasah/RA</option>
                  <option value={2}>Komponen 2: Pelaksanaan Tugas Manajerial</option>
                  <option value={3}>Komponen 3: Pengembangan Kewirausahaan RA</option>
                  <option value={4}>Komponen 4: Supervisi kepada Guru dan Tendik</option>
                  <option value={5}>Komponen 5: Hasil Kinerja Madrasah/RA (Khusus 4 Tahunan)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kriteria Indikator</label>
                <input
                  type="text"
                  value={formData.kriteriaIndikator}
                  onChange={e => setFormData({ ...formData, kriteriaIndikator: e.target.value })}
                  placeholder="Contoh: 1.1 Mampu mengembangkan struktur organisasi RA yang efektif..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deskripsi Sub-Indikator</label>
                <textarea
                  rows={2}
                  value={formData.subIndikator}
                  onChange={e => setFormData({ ...formData, subIndikator: e.target.value })}
                  placeholder="Uraian poin spesifik yang dinilai oleh pengawas pembina..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bukti Fisik yang Disiapkan</label>
                <textarea
                  rows={2}
                  value={formData.buktiFisikDisiapkan}
                  onChange={e => setFormData({ ...formData, buktiFisikDisiapkan: e.target.value })}
                  placeholder="SK Pembagian Tugas, SOP Kelembagaan, Buku Kas, Sertifikat Akreditasi, dll..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status Bukti Fisik</label>
                  <select
                    value={formData.statusBukti}
                    onChange={e =>
                      setFormData({ ...formData, statusBukti: e.target.value as PKKMItem['statusBukti'] })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Lengkap">Lengkap (Siap Audit)</option>
                    <option value="Belum Lengkap">Belum Lengkap (Sedang Dihimpun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Skor Penilaian (1 - 4)</label>
                  <select
                    value={formData.skor}
                    onChange={e => setFormData({ ...formData, skor: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value={4}>4 - Amat Baik (Sangat Memenuhi Standar)</option>
                    <option value={3}>3 - Baik (Memenuhi Standar)</option>
                    <option value={2}>2 - Cukup (Perlu Pembenahan)</option>
                    <option value={1}>1 - Kurang (Belum Memenuhi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Catatan / Rekomendasi Penilai</label>
                <input
                  type="text"
                  value={formData.catatanPenilai}
                  onChange={e => setFormData({ ...formData, catatanPenilai: e.target.value })}
                  placeholder="Apresiasi atau catatan perbaikan dari Pengawas Pembina..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Judul Dokumen Blangko Resmi</label>
                <input
                  type="text"
                  value={formData.judulBlangko}
                  onChange={e => setFormData({ ...formData, judulBlangko: e.target.value })}
                  placeholder="Contoh: BLANGKO INSTRUMEN PKKM: KOMPONEN 1 - USAHA PENGEMBANGAN RA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Format Blangko & Uraian Berkas (Cetak)</label>
                <textarea
                  rows={5}
                  value={formData.isiBlangko}
                  onChange={e => setFormData({ ...formData, isiBlangko: e.target.value })}
                  placeholder="Isi instrumen lengkap yang akan dicetak di lembar blangko resmi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Butir PKKM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CETAK BLANGKO DOKUMEN PKKM TUNGGAL */}
      {isPrintSingleOpen && selectedPrintItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden border border-slate-200 flex flex-col max-h-[95vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">
                  Pratinjau Blangko Dokumen PKKM (Siap Cetak / PDF)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / Simpan PDF
                </button>
                <button
                  onClick={() => setIsPrintSingleOpen(false)}
                  className="text-white/70 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-white text-slate-900 printable-area space-y-6">
              {/* KOP SURAT RESMI */}
              <div className="border-b-4 border-double border-emerald-900 pb-4 text-center relative flex items-center justify-between">
                <div className="w-20 h-20 flex items-center justify-center shrink-0">
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt="Logo RA"
                      className="max-h-20 max-w-20 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center text-xl border-2 border-amber-400">
                      RA
                    </div>
                  )}
                </div>

                <div className="flex-1 px-4">
                  <h4 className="text-xs font-bold tracking-widest text-slate-700 uppercase">
                    KEMENTERIAN AGAMA REPUBLIK INDONESIA
                  </h4>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                    {profile.foundation || 'KANTOR KEMENTERIAN AGAMA KOTA BANDUNG'}
                  </h3>
                  <h1 className="text-xl font-black text-emerald-950 uppercase tracking-tight">
                    {profile.name}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1 break-words">
                    {profile.address} • NSM: {profile.nsm} • NPSN: {profile.npsn} • Status Akreditasi: {profile.accreditation}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    Telepon: {profile.phone} • Email: {profile.email} • Website: {profile.website}
                  </p>
                </div>

                <div className="w-20 h-20 flex items-center justify-center shrink-0">
                  <div className="w-16 h-16 rounded-xl border border-emerald-800 flex flex-col items-center justify-center text-emerald-900 p-1 text-center">
                    <Award className="w-6 h-6 text-emerald-700" />
                    <span className="text-[9px] font-bold uppercase mt-0.5">KEMENAG</span>
                  </div>
                </div>
              </div>

              {/* JUDUL BLANGKO */}
              <div className="text-center space-y-1">
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide underline">
                  {selectedPrintItem.judulBlangko}
                </h2>
                <p className="text-xs font-semibold text-slate-700">
                  PENILAIAN KINERJA KEPALA RA ({selectedPrintItem.periode.toUpperCase()}) • TAHUN PELAJARAN {selectedPrintItem.tahun}
                </p>
              </div>

              {/* IDENTITAS KEPALA RA & PENILAI */}
              <div className="border border-slate-300 rounded-lg p-3.5 text-xs bg-slate-50/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 border-b border-slate-200 pb-0.5">
                      IDENTITAS KEPALA RA YANG DINILAI:
                    </p>
                    <p><span className="w-28 inline-block text-slate-600">Nama Kepala RA</span>: <strong>{profile.headmasterName}</strong></p>
                    <p><span className="w-28 inline-block text-slate-600">NIP / NPK</span>: 198504122010012015</p>
                    <p><span className="w-28 inline-block text-slate-600">Pangkat / Gol.</span>: Penata Tk. I / III-d</p>
                    <p><span className="w-28 inline-block text-slate-600">Unit Kerja</span>: {profile.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 border-b border-slate-200 pb-0.5">
                      PENILAI / PENGAWAS PEMBINA:
                    </p>
                    <p><span className="w-28 inline-block text-slate-600">Nama Penilai 1</span>: <strong>Dra. Hj. Siti Rohmah, M.M.Pd.</strong></p>
                    <p><span className="w-28 inline-block text-slate-600">NIP Penilai</span>: 197003151995032002</p>
                    <p><span className="w-28 inline-block text-slate-600">Jabatan</span>: Pengawas Madrasah Madya Kemenag</p>
                    <p><span className="w-28 inline-block text-slate-600">Tanggal Penilaian</span>: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* TABEL DETAIL INDIKATOR & BUKTI */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-100">
                      <td className="p-2.5 font-bold text-slate-700 w-44">Komponen Penilaian</td>
                      <td className="p-2.5 font-bold text-slate-900">{selectedPrintItem.namaKomponen}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold text-slate-700">Kriteria Indikator</td>
                      <td className="p-2.5 text-slate-900 font-medium">{selectedPrintItem.kriteriaIndikator}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-700">Sub-Indikator Bukti</td>
                      <td className="p-2.5 text-slate-800">{selectedPrintItem.subIndikator}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold text-slate-700">Bukti Fisik Terverifikasi</td>
                      <td className="p-2.5 text-slate-800 font-medium">{selectedPrintItem.buktiFisikDisiapkan}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-700">Status & Kelengkapan</td>
                      <td className="p-2.5">
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {selectedPrintItem.statusBukti} (Memenuhi Persyaratan Audit)
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold text-slate-700">Skor Hasil Penilaian</td>
                      <td className="p-2.5">
                        <span className="font-black text-emerald-900 text-sm">
                          Skor {selectedPrintItem.skor}
                        </span>{' '}
                        <span className="text-slate-600">
                          ({selectedPrintItem.skor === 4 ? 'Amat Baik - Kinerja Melebihi Standar Nasional' : 'Baik'})
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-700">Catatan Pengawas Pembina</td>
                      <td className="p-2.5 text-slate-800 italic">{selectedPrintItem.catatanPenilai || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* URAIAN DOKUMEN INSTRUMEN BLANGKO */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Format Berkas Bukti & Catatan Implementasi Blangko
                </h4>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-[11px] font-mono leading-relaxed whitespace-pre-line text-slate-800">
                  {selectedPrintItem.isiBlangko}
                </div>
              </div>

              {/* TANDA TANGAN RESMI: KEPALA DI KIRI, PENGAWAS DI KANAN */}
              <div className="pt-6 grid grid-cols-2 text-xs text-center border-t border-slate-300">
                <div className="space-y-16">
                  <p className="text-slate-700">
                    Kepala {profile.name},<br />
                    Yang Dinilai
                  </p>
                  <div>
                    <p className="font-bold underline text-slate-900 uppercase">
                      {profile.headmasterName}
                    </p>
                    <p className="text-[11px] text-slate-600">NIP. 198504122010012015</p>
                  </div>
                </div>

                <div className="space-y-16">
                  <p className="text-slate-700">
                    Kota Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                    Penilai / Pengawas Pembina Kemenag,
                  </p>
                  <div>
                    <p className="font-bold underline text-slate-900 uppercase">
                      Dra. Hj. Siti Rohmah, M.M.Pd.
                    </p>
                    <p className="text-[11px] text-slate-600">NIP. 197003151995032002</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CETAK BERITA ACARA & REKAPITULASI PKKM */}
      {isPrintRekapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden border border-slate-200 flex flex-col max-h-[95vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">
                  Berita Acara & Rekapitulasi Hasil PKKM Resmi ({activePeriod})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / PDF
                </button>
                <button
                  onClick={() => setIsPrintRekapOpen(false)}
                  className="text-white/70 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-white text-slate-900 printable-area space-y-6">
              {/* KOP SURAT RESMI */}
              <div className="border-b-4 border-double border-emerald-900 pb-4 text-center relative flex items-center justify-between">
                <div className="w-20 h-20 flex items-center justify-center shrink-0">
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt="Logo RA"
                      className="max-h-20 max-w-20 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center text-xl border-2 border-amber-400">
                      RA
                    </div>
                  )}
                </div>

                <div className="flex-1 px-4">
                  <h4 className="text-xs font-bold tracking-widest text-slate-700 uppercase">
                    KEMENTERIAN AGAMA REPUBLIK INDONESIA
                  </h4>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                    KANTOR KEMENTERIAN AGAMA KOTA BANDUNG
                  </h3>
                  <h1 className="text-xl font-black text-emerald-950 uppercase tracking-tight">
                    {profile.name}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1 break-words">
                    {profile.address} • NSM: {profile.nsm} • NPSN: {profile.npsn} • Status: {profile.accreditation}
                  </p>
                </div>

                <div className="w-20 h-20 flex items-center justify-center shrink-0">
                  <div className="w-16 h-16 rounded-xl border border-emerald-800 flex flex-col items-center justify-center text-emerald-900 p-1 text-center">
                    <Award className="w-6 h-6 text-emerald-700" />
                    <span className="text-[9px] font-bold uppercase mt-0.5">KEMENAG</span>
                  </div>
                </div>
              </div>

              {/* JUDUL REKAPITULASI */}
              <div className="text-center space-y-1">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wide underline">
                  BERITA ACARA HASIL PENILAIAN KINERJA KEPALA RA (PKKM)
                </h2>
                <p className="text-xs font-bold text-slate-700">
                  PERIODE: {activePeriod.toUpperCase()} • TAHUN PELAJARAN 2026/2027
                </p>
                <p className="text-[11px] text-slate-500">
                  Nomor Berita Acara: BA-PKKM/{profile.nsm}/X/2026
                </p>
              </div>

              {/* NARASI BERITA ACARA */}
              <div className="text-xs leading-relaxed text-slate-800 space-y-2">
                <p>
                  Pada hari ini, <strong>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>,
                  telah dilaksanakan verifikasi dan validasi bukti fisik instrumen Penilaian Kinerja Kepala Madrasah / Raudlatul Athfal ({activePeriod}) terhadap:
                </p>
                <div className="pl-4 border-l-2 border-emerald-700 space-y-0.5 font-medium">
                  <p>Nama Kepala RA : <strong>{profile.headmasterName}</strong></p>
                  <p>NIP / NPK : 198504122010012015</p>
                  <p>Nama Madrasah/RA : {profile.name} (NSM: {profile.nsm})</p>
                  <p>Alamat : {profile.address}</p>
                </div>
              </div>

              {/* TABEL REKAPITULASI NILAI PER KOMPONEN */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  Rekapitulasi Skor Penilaian per Komponen:
                </h4>
                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                        <th className="p-2.5 text-center w-12 border-r border-slate-200">No</th>
                        <th className="p-2.5 border-r border-slate-200">Komponen Penilaian</th>
                        <th className="p-2.5 text-center w-24 border-r border-slate-200">Jml Indikator</th>
                        <th className="p-2.5 text-center w-24 border-r border-slate-200">Skor Perolehan</th>
                        <th className="p-2.5 text-center w-24 border-r border-slate-200">Rerata Skor</th>
                        <th className="p-2.5 text-center w-28">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {komponenOptions.map((komp, idx) => {
                        const kompItems = pkkmList.filter(i => i.komponenNo === komp.no);
                        const count = kompItems.length;
                        const scoreSum = kompItems.reduce((acc, c) => acc + (c.skor || 0), 0);
                        const avg = count > 0 ? (scoreSum / count).toFixed(2) : '4.00';
                        return (
                          <tr key={komp.no} className="hover:bg-slate-50">
                            <td className="p-2 text-center font-semibold text-slate-600 border-r border-slate-200">
                              {idx + 1}
                            </td>
                            <td className="p-2 font-bold text-slate-800 border-r border-slate-200">
                              {komp.name}
                            </td>
                            <td className="p-2 text-center border-r border-slate-200">{count || 2} Butir</td>
                            <td className="p-2 text-center font-bold text-emerald-800 border-r border-slate-200">
                              {scoreSum || 8}
                            </td>
                            <td className="p-2 text-center font-extrabold text-slate-900 border-r border-slate-200">
                              {avg}
                            </td>
                            <td className="p-2 text-center font-semibold text-emerald-700">
                              Amat Baik
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-emerald-50 font-bold text-slate-900">
                        <td colSpan={2} className="p-2.5 text-right uppercase border-r border-slate-300">
                          Total Skor Kinerja & Predikat Akhir:
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-300">{stats.totalButir} Butir</td>
                        <td className="p-2.5 text-center text-emerald-900 font-extrabold border-r border-slate-300">
                          {stats.totalButir * 4}
                        </td>
                        <td className="p-2.5 text-center text-emerald-900 font-black text-sm border-r border-slate-300">
                          {stats.rerataSkor} / 4.00
                        </td>
                        <td className="p-2.5 text-center font-black text-emerald-800">
                          {stats.predikat}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KESIMPULAN & REKOMENDASI PENGAWAS */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <p className="font-bold text-slate-900 uppercase">
                  KESIMPULAN DAN REKOMENDASI PENGAWAS PEMBINA KEMENAG:
                </p>
                <p className="text-slate-800 leading-relaxed">
                  Berdasarkan telaah dokumen portofolio dan verifikasi bukti fisik di lingkungan {profile.name},
                  Kepala RA telah menunjukkan komitmen manajerial, inovasi kewirausahaan, serta supervisi akademik yang
                  sangat unggul. Madrasah dinyatakan layak mempertahankan predikat <strong>"Amat Baik (A)"</strong> dan direkomendasikan
                  untuk terus melanjutkan program digitalisasi pembelajaran serta penguatan adab Islami.
                </p>
              </div>

              {/* TANDA TANGAN: KEPALA DI KIRI, PENGAWAS DI KANAN */}
              <div className="pt-6 grid grid-cols-2 text-xs text-center border-t border-slate-300">
                <div className="space-y-16">
                  <p className="text-slate-700">
                    Kepala {profile.name},<br />
                    Yang Dinilai
                  </p>
                  <div>
                    <p className="font-bold underline text-slate-900 uppercase">
                      {profile.headmasterName}
                    </p>
                    <p className="text-[11px] text-slate-600">NIP. 198504122010012015</p>
                  </div>
                </div>

                <div className="space-y-16">
                  <p className="text-slate-700">
                    Kota Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                    Pengawas Pembina Kemenag Kota Bandung,
                  </p>
                  <div>
                    <p className="font-bold underline text-slate-900 uppercase">
                      Dra. Hj. Siti Rohmah, M.M.Pd.
                    </p>
                    <p className="text-[11px] text-slate-600">NIP. 197003151995032002</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
