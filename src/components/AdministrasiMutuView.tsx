import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LetterRecord, AssetRecord, ChildSecurityRecord, AccreditationStandardItem } from '../types';
import { exportJsonToExcel } from '../utils/exportExcel';
import {
  Archive,
  Mail,
  ShieldCheck,
  Package,
  Plus,
  Printer,
  Download,
  Edit3,
  Trash2,
  X,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export const AdministrasiMutuView: React.FC = () => {
  const {
    letters,
    addLetter,
    updateLetter,
    deleteLetter,
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    childSecurity,
    addChildSecurity,
    updateChildSecurity,
    deleteChildSecurity,
    updateChildSecurityStatus,
    accreditationItems,
    addAccreditationItem,
    updateAccreditationItem,
    deleteAccreditationItem,
    profile,
    students,
    academicYear
  } = useApp();

  const [activeTab, setActiveTab] = useState<'surat' | 'aset' | 'keamanan' | 'akreditasi'>('surat');

  // Surat Modal State
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<LetterRecord | null>(null);
  const [letterForm, setLetterForm] = useState<Omit<LetterRecord, 'id'>>({
    jenis: 'Surat Keluar',
    noSurat: `047/RA-AC/SRT/XI/2026`,
    tanggal: new Date().toISOString().split('T')[0],
    perihal: 'Surat Keterangan Peserta Didik Aktif Belajar',
    pengirimPenerima: 'Wali Murid Ananda Muhammad Rayyan',
    keterangan: 'Untuk kelengkapan administrasi instansi orang tua',
    status: 'Terkirim',
  });

  // Asset Modal State
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [assetForm, setAssetForm] = useState<Omit<AssetRecord, 'id'>>({
    kode: `AST-IND-${Date.now().toString().slice(-3)}`,
    nama: 'Plastisin Non-Toxic Edukasi Motorik Halus',
    kategori: 'APE Dalam (Indoor)',
    jumlah: 15,
    kondisi: 'Baik',
    lokasi: 'Sentra Seni & Kreativitas',
  });

  // Security Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [editingSecurity, setEditingSecurity] = useState<ChildSecurityRecord | null>(null);
  const [securityForm, setSecurityForm] = useState<Omit<ChildSecurityRecord, 'id'>>({
    studentId: students[0]?.id || 's1',
    studentName: students[0]?.nama || 'Muhammad Rayyan Al-Ghifari',
    kelas: students[0]?.kelas || 'Kelompok B1',
    namaPenjemput: 'Ibu Rina Wardani',
    hubungan: 'Orang Tua Kandung',
    noHpPenjemput: '081234567890',
    statusHariIni: 'Belum Dijemput',
    catatanPetugas: 'Penjemputan terdaftar',
  });

  // Accreditation Modal State
  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState<AccreditationStandardItem | null>(null);
  const [accForm, setAccForm] = useState<Omit<AccreditationStandardItem, 'id'>>({
    standardNo: 1,
    standardName: 'Standar Tingkat Pencapaian Perkembangan Anak (STPPA)',
    indikator: 'Rekam capaian 7 aspek tumbuh kembang terintegrasi nilai P2RA',
    berkasDisiapkan: 'Buku rekap portofolio, catatan anekdot, dan hasil karya anak',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Guru Nurul Hidayah, S.Pd.I',
    catatan: 'Tersedia di map dokumen dan aplikasi Smart RA',
    judulBlangko: 'BLANGKO INSTRUMEN REKAPITULASI PENCAPAIAN PERKEMBANGAN ANAK (STPPA RA)',
    isiBlangko: '',
  });

  // Print Modals
  const [isPrintAccreditationOpen, setIsPrintAccreditationOpen] = useState(false);
  const [isPrintSingleBlangkoOpen, setIsPrintSingleBlangkoOpen] = useState(false);
  const [selectedPrintBlangko, setSelectedPrintBlangko] = useState<AccreditationStandardItem | null>(null);
  const [isPrintLetterOpen, setIsPrintLetterOpen] = useState(false);
  const [selectedPrintLetter, setSelectedPrintLetter] = useState<LetterRecord | null>(null);
  const [isPrintAssetOpen, setIsPrintAssetOpen] = useState(false);
  const [isPrintSecurityOpen, setIsPrintSecurityOpen] = useState(false);

  // Save Surat
  const handleSaveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLetter) {
      updateLetter({ ...letterForm, id: editingLetter.id });
    } else {
      addLetter(letterForm);
    }
    setIsLetterModalOpen(false);
  };

  // Save Aset
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset) {
      updateAsset({ ...assetForm, id: editingAsset.id });
    } else {
      addAsset(assetForm);
    }
    setIsAssetModalOpen(false);
  };

  // Save Security
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSecurity) {
      updateChildSecurity({ ...securityForm, id: editingSecurity.id });
    } else {
      addChildSecurity(securityForm);
    }
    setIsSecurityModalOpen(false);
  };

  // Save Accreditation
  const handleSaveAccreditation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAcc) {
      updateAccreditationItem({ ...accForm, id: editingAcc.id });
    } else {
      addAccreditationItem(accForm);
    }
    setIsAccModalOpen(false);
  };

  // Export Native Excel (.xlsx) Accreditation
  const exportAccreditationExcel = () => {
    const rows = accreditationItems.map((a, idx) => ({
      No: idx + 1,
      'Nomor Standar': a.standardNo,
      'Nama Standar': a.standardName,
      'Indikator Mutu': a.indikator,
      'Berkas yang Disiapkan': a.berkasDisiapkan,
      'Status Kelengkapan': a.statusKelengkapan,
      'Penanggung Jawab': a.penanggungJawab,
      'Judul Blangko': a.judulBlangko || '-',
      Catatan: a.catatan || '-',
    }));
    exportJsonToExcel(rows, `8_Standar_Akreditasi_${profile.name.replace(/\s+/g, '_')}.xlsx`, '8 Standar');
  };

  // Export Native Excel (.xlsx) Letters
  const exportLettersExcel = () => {
    const rows = letters.map((l, idx) => ({
      No: idx + 1,
      'Jenis Surat': l.jenis,
      'Nomor Surat': l.noSurat,
      Tanggal: l.tanggal,
      'Perihal Surat': l.perihal,
      'Asal / Penerima': l.pengirimPenerima,
      Status: l.status,
      Keterangan: l.keterangan,
    }));
    exportJsonToExcel(rows, `Buku_Agenda_Surat_${profile.name.replace(/\s+/g, '_')}.xlsx`, 'Agenda Surat');
  };

  // Export Native Excel (.xlsx) Assets
  const exportAssetsExcel = () => {
    const rows = assets.map((ast, idx) => ({
      No: idx + 1,
      'Kode Aset': ast.kode,
      'Nama Sarana / APE': ast.nama,
      Kategori: ast.kategori,
      Jumlah: `${ast.jumlah} unit`,
      Kondisi: ast.kondisi,
      'Lokasi Penempatan': ast.lokasi,
    }));
    exportJsonToExcel(rows, `Inventaris_Aset_APE_${profile.name.replace(/\s+/g, '_')}.xlsx`, 'Inventaris APE');
  };

  const STANDARD_NAMES: Record<number, string> = {
    1: 'Standar Tingkat Pencapaian Perkembangan Anak (STPPA)',
    2: 'Standar Isi (Kurikulum Operasional RA - KORA)',
    3: 'Standar Proses Pembelajaran (Bermain Loose Parts)',
    4: 'Standar Pendidik & Tenaga Kependidikan (PTK)',
    5: 'Standar Sarana dan Prasarana (Sarpras & APE)',
    6: 'Standar Pengelolaan Madrasah / RA',
    7: 'Standar Pembiayaan & Akuntabilitas BOS',
    8: 'Standar Penilaian Otentik Pendidikan',
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Archive className="w-4 h-4" />
            <span>Tata Kelola Kelembagaan & Penjaminan Mutu</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Administrasi & Evaluasi Mutu RA</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agenda surat masuk/keluar, inventaris aset & APE, keamanan penjemputan anak, serta 8 Standar Akreditasi BAN-PDM & Kemenag (bisa tambah, edit, hapus, cetak & ekspor).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'surat' && (
            <>
              <button
                onClick={exportLettersExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => {
                  setEditingLetter(null);
                  setLetterForm({
                    jenis: 'Surat Keluar',
                    noSurat: `0${letters.length + 1}/RA-AC/SRT/XI/2026`,
                    tanggal: new Date().toISOString().split('T')[0],
                    perihal: 'Surat Keterangan Peserta Didik Aktif Belajar',
                    pengirimPenerima: '',
                    keterangan: 'Kelengkapan administrasi peserta didik',
                    status: 'Terkirim',
                  });
                  setIsLetterModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Buat / Catat Surat</span>
              </button>
            </>
          )}

          {activeTab === 'aset' && (
            <>
              <button
                onClick={exportAssetsExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintAssetOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Inventaris Sarpras</span>
              </button>
              <button
                onClick={() => {
                  setEditingAsset(null);
                  setAssetForm({
                    kode: `AST-APE-${Date.now().toString().slice(-3)}`,
                    nama: '',
                    kategori: 'APE Dalam (Indoor)',
                    jumlah: 1,
                    kondisi: 'Baik',
                    lokasi: 'Sentra Bahan Alam',
                  });
                  setIsAssetModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Aset / APE</span>
              </button>
            </>
          )}

          {activeTab === 'keamanan' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrintSecurityOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Daftar Penjemput</span>
              </button>
              <button
                onClick={() => {
                  setEditingSecurity(null);
                  setSecurityForm({
                    studentId: students[0]?.id || 's1',
                    studentName: students[0]?.nama || 'Muhammad Rayyan Al-Ghifari',
                    kelas: students[0]?.kelas || 'Kelompok B1',
                    namaPenjemput: '',
                    hubungan: 'Orang Tua Kandung',
                    noHpPenjemput: '',
                    statusHariIni: 'Belum Dijemput',
                    catatanPetugas: 'Terdaftar resmi',
                  });
                  setIsSecurityModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Daftarkan Penjemput Anak</span>
              </button>
            </div>
          )}

          {activeTab === 'akreditasi' && (
            <>
              <button
                onClick={exportAccreditationExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintAccreditationOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap 8 Standar</span>
              </button>
              <button
                onClick={() => {
                  setEditingAcc(null);
                  setAccForm({
                    standardNo: 1,
                    standardName: STANDARD_NAMES[1],
                    indikator: '',
                    berkasDisiapkan: '',
                    statusKelengkapan: 'Lengkap',
                    penanggungJawab: profile.headmasterName,
                    catatan: '',
                  });
                  setIsAccModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Input Berkas Standar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('surat')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'surat'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Surat Masuk & Keluar ({letters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('aset')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'aset'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventaris & APE ({assets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('keamanan')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'keamanan'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Keamanan Penjemputan Peserta Didik ({childSecurity.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('akreditasi')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'akreditasi'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>8 Standar Akreditasi Kemenag ({accreditationItems.length} Berkas)</span>
        </button>
      </div>

      {/* Tab 1: Surat Masuk & Keluar (CRUD) */}
      {activeTab === 'surat' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-3 py-3">Nomor Surat</th>
                  <th className="px-3 py-3">Tanggal</th>
                  <th className="px-4 py-3">Perihal Surat</th>
                  <th className="px-3 py-3">Asal / Penerima</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {letters.map((ltr) => (
                  <tr key={ltr.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        ltr.jenis === 'Surat Keluar' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ltr.jenis}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-800">{ltr.noSurat}</td>
                    <td className="px-3 py-3 text-slate-500">{ltr.tanggal}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{ltr.perihal}</td>
                    <td className="px-3 py-3 text-slate-700">{ltr.pengirimPenerima}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-700">
                        {ltr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrintLetter(ltr);
                            setIsPrintLetterOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Cetak Surat Resmi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLetter(ltr);
                            setLetterForm({
                              jenis: ltr.jenis,
                              noSurat: ltr.noSurat,
                              tanggal: ltr.tanggal,
                              perihal: ltr.perihal,
                              pengirimPenerima: ltr.pengirimPenerima,
                              keterangan: ltr.keterangan,
                              status: ltr.status,
                            });
                            setIsLetterModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit Surat"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus surat nomor "${ltr.noSurat}"?`)) {
                              deleteLetter(ltr.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventaris & APE (CRUD) */}
      {activeTab === 'aset' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Kode Aset</th>
                  <th className="px-4 py-3">Nama Sarana / APE</th>
                  <th className="px-3 py-3">Kategori</th>
                  <th className="px-3 py-3">Jumlah Unit</th>
                  <th className="px-3 py-3">Kondisi</th>
                  <th className="px-3 py-3">Lokasi Penempatan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-700">{ast.kode}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{ast.nama}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ast.kategori}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-800">{ast.jumlah} unit</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ast.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                        ast.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {ast.kondisi}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{ast.lokasi}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAsset(ast);
                            setAssetForm({
                              kode: ast.kode,
                              nama: ast.nama,
                              kategori: ast.kategori,
                              jumlah: ast.jumlah,
                              kondisi: ast.kondisi,
                              lokasi: ast.lokasi,
                            });
                            setIsAssetModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Edit Aset"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus aset "${ast.nama}"?`)) {
                              deleteAsset(ast.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Keamanan Penjemputan Peserta Didik (CRUD) */}
      {activeTab === 'keamanan' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Sistem Keamanan & Verifikasi Penjemputan Peserta Didik</span>
            <span className="text-slate-500">{childSecurity.length} anak terdaftar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Peserta Didik & Kelas</th>
                  <th className="px-3 py-3">Nama Penjemput Resmi</th>
                  <th className="px-3 py-3">Hubungan Keluarga</th>
                  <th className="px-3 py-3">Kontak WA</th>
                  <th className="px-3 py-3">Status Hari Ini</th>
                  <th className="px-3 py-3">Jam Jemput & Catatan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {childSecurity.map((sec) => (
                  <tr key={sec.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{sec.studentName}</div>
                      <div className="text-[10px] text-slate-500">{sec.kelas}</div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-800">{sec.namaPenjemput}</td>
                    <td className="px-3 py-3 text-slate-600">{sec.hubungan}</td>
                    <td className="px-3 py-3 font-mono text-emerald-700">{sec.noHpPenjemput}</td>
                    <td className="px-3 py-3">
                      <select
                        value={sec.statusHariIni}
                        onChange={e => updateChildSecurityStatus(sec.id, e.target.value as any)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border ${
                          sec.statusHariIni === 'Sudah Dijemput Aman'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : sec.statusHariIni === 'Izin Penjemput Baru'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Belum Dijemput">Belum Dijemput</option>
                        <option value="Sudah Dijemput Aman">Sudah Dijemput Aman</option>
                        <option value="Izin Penjemput Baru">Izin Penjemput Baru</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-700">{sec.jamJemput || '-'}</div>
                      <div className="text-[10px] text-slate-500">{sec.catatanPetugas || 'Standar'}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSecurity(sec);
                            setSecurityForm({
                              studentId: sec.studentId,
                              studentName: sec.studentName,
                              kelas: sec.kelas,
                              namaPenjemput: sec.namaPenjemput,
                              hubungan: sec.hubungan,
                              noHpPenjemput: sec.noHpPenjemput,
                              statusHariIni: sec.statusHariIni,
                              catatanPetugas: sec.catatanPetugas,
                            });
                            setIsSecurityModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Edit Penjemput"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus data penjemput untuk ${sec.studentName}?`)) {
                              deleteChildSecurity(sec.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: 8 Standar Akreditasi Kemenag (LENGKAP INPUT, BERKAS DISIAPKAN, CETAK & EXCEL) */}
      {activeTab === 'akreditasi' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">8 Standar Nasional Pendidikan / Akreditasi RA BAN-PDM & Kemenag</h3>
              <p className="text-xs text-slate-500">
                Daftar butir indikator mutu dan berkas fisik/digital yang disiapkan untuk visitasi akreditasi (output siap cetak & Excel).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg">
                Status RA: Akreditasi A (Unggul)
              </span>
            </div>
          </div>

          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3">Standar Nasional & Indikator Mutu</th>
                  <th className="px-4 py-3">Berkas yang Disiapkan</th>
                  <th className="px-3 py-3 text-center">Status Berkas</th>
                  <th className="px-3 py-3">Penanggung Jawab</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accreditationItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-3 py-3 text-center font-bold text-slate-700">{item.standardNo}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-bold text-slate-900">{item.standardName}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{item.indikator}</div>
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-[11px] leading-relaxed">
                        {item.berkasDisiapkan}
                      </div>
                      {item.catatan && (
                        <div className="text-[10px] text-emerald-700 mt-1">Catatan: {item.catatan}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.statusKelengkapan === 'Lengkap' ? 'bg-emerald-100 text-emerald-800' :
                        item.statusKelengkapan === 'Sebagian' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.statusKelengkapan}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">{item.penanggungJawab}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrintBlangko(item);
                            setIsPrintSingleBlangkoOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-semibold border border-emerald-200 transition cursor-pointer"
                          title="Lihat & Cetak Contoh Blangko Resmi Standar Ini"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cetak Blangko</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAcc(item);
                            setAccForm({
                              standardNo: item.standardNo,
                              standardName: item.standardName,
                              indikator: item.indikator,
                              berkasDisiapkan: item.berkasDisiapkan,
                              statusKelengkapan: item.statusKelengkapan,
                              penanggungJawab: item.penanggungJawab,
                              catatan: item.catatan || '',
                              judulBlangko: item.judulBlangko || '',
                              isiBlangko: item.isiBlangko || '',
                            });
                            setIsAccModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Edit Berkas Standar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus butir standar "${item.standardName}"?`)) {
                              deleteAccreditationItem(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT SURAT */}
      {isLetterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingLetter ? 'Edit Data Surat' : 'Registrasi Surat Masuk / Keluar'}
              </h3>
              <button onClick={() => setIsLetterModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLetter} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Surat</label>
                <select
                  value={letterForm.jenis}
                  onChange={e => setLetterForm({ ...letterForm, jenis: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Surat Keluar">Surat Keluar</option>
                  <option value="Surat Masuk">Surat Masuk</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Surat *</label>
                <input
                  type="text"
                  required
                  value={letterForm.noSurat}
                  onChange={e => setLetterForm({ ...letterForm, noSurat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Surat</label>
                <input
                  type="date"
                  required
                  value={letterForm.tanggal}
                  onChange={e => setLetterForm({ ...letterForm, tanggal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perihal Surat *</label>
                <input
                  type="text"
                  required
                  value={letterForm.perihal}
                  onChange={e => setLetterForm({ ...letterForm, perihal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tujuan / Asal Surat</label>
                <input
                  type="text"
                  required
                  value={letterForm.pengirimPenerima}
                  onChange={e => setLetterForm({ ...letterForm, pengirimPenerima: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={letterForm.status}
                  onChange={e => setLetterForm({ ...letterForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Terkirim">Terkirim</option>
                  <option value="Arsip">Arsip</option>
                  <option value="Diproses">Diproses</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLetterModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Arsip Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT ASET */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingAsset ? 'Edit Sarana / APE' : 'Registrasi Aset Sarpras & APE'}
              </h3>
              <button onClick={() => setIsAssetModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Aset</label>
                <input
                  type="text"
                  value={assetForm.kode}
                  onChange={e => setAssetForm({ ...assetForm, kode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Sarana / APE *</label>
                <input
                  type="text"
                  required
                  value={assetForm.nama}
                  onChange={e => setAssetForm({ ...assetForm, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={assetForm.kategori}
                  onChange={e => setAssetForm({ ...assetForm, kategori: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="APE Dalam (Indoor)">APE Dalam (Indoor)</option>
                  <option value="APE Luar (Outdoor)">APE Luar (Outdoor)</option>
                  <option value="Media Audio-Visual">Media Audio-Visual</option>
                  <option value="Perabot Kelas">Perabot Kelas</option>
                  <option value="Perlengkapan UKS">Perlengkapan UKS</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Unit</label>
                  <input
                    type="number"
                    min={1}
                    value={assetForm.jumlah}
                    onChange={e => setAssetForm({ ...assetForm, jumlah: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kondisi</label>
                  <select
                    value={assetForm.kondisi}
                    onChange={e => setAssetForm({ ...assetForm, kondisi: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi Penempatan</label>
                <input
                  type="text"
                  value={assetForm.lokasi}
                  onChange={e => setAssetForm({ ...assetForm, lokasi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT KEAMANAN PENJEMPUTAN */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingSecurity ? 'Edit Data Penjemput' : 'Daftarkan Penjemput Anak'}
              </h3>
              <button onClick={() => setIsSecurityModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Peserta Didik</label>
                <select
                  value={securityForm.studentId}
                  onChange={e => {
                    const s = students.find(item => item.id === e.target.value);
                    if (s) {
                      setSecurityForm({
                        ...securityForm,
                        studentId: s.id,
                        studentName: s.nama,
                        kelas: s.kelas,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.nama} ({s.kelas})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Penjemput Resmi *</label>
                <input
                  type="text"
                  required
                  value={securityForm.namaPenjemput}
                  onChange={e => setSecurityForm({ ...securityForm, namaPenjemput: e.target.value })}
                  placeholder="Misal: Ibu Rina Wardani (Ibu Kandung)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hubungan</label>
                  <input
                    type="text"
                    required
                    value={securityForm.hubungan}
                    onChange={e => setSecurityForm({ ...securityForm, hubungan: e.target.value })}
                    placeholder="Orang Tua / Kakek / Sopir"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={securityForm.noHpPenjemput}
                    onChange={e => setSecurityForm({ ...securityForm, noHpPenjemput: e.target.value })}
                    placeholder="0812xxxx"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Penjemput
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT 8 STANDAR AKREDITASI */}
      {isAccModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingAcc ? 'Edit Berkas Standar Akreditasi' : 'Input Berkas & Indikator Akreditasi'}
              </h3>
              <button onClick={() => setIsAccModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccreditation} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Nomor Standar Nasional (1 - 8)</label>
                <select
                  value={accForm.standardNo}
                  onChange={e => {
                    const no = Number(e.target.value);
                    setAccForm({
                      ...accForm,
                      standardNo: no,
                      standardName: STANDARD_NAMES[no] || `Standar ${no}`,
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(no => (
                    <option key={no} value={no}>Standar {no}: {STANDARD_NAMES[no]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Standar</label>
                <input
                  type="text"
                  required
                  value={accForm.standardName}
                  onChange={e => setAccForm({ ...accForm, standardName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Indikator Mutu yang Dinilai *</label>
                <textarea
                  rows={2}
                  required
                  value={accForm.indikator}
                  onChange={e => setAccForm({ ...accForm, indikator: e.target.value })}
                  placeholder="Kriteria penilaian visitasi akreditasi BAN-PDM..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Berkas Fisik & Digital yang Disiapkan *</label>
                <textarea
                  rows={2}
                  required
                  value={accForm.berkasDisiapkan}
                  onChange={e => setAccForm({ ...accForm, berkasDisiapkan: e.target.value })}
                  placeholder="Buku rekap portofolio, SK pendirian, sertifikat guru, BAP sarpras..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Kelengkapan</label>
                  <select
                    value={accForm.statusKelengkapan}
                    onChange={e => setAccForm({ ...accForm, statusKelengkapan: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Lengkap">Lengkap (100%)</option>
                    <option value="Sebagian">Sebagian Dipersiapkan</option>
                    <option value="Belum Ada">Belum Ada</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab Berkas</label>
                  <input
                    type="text"
                    required
                    value={accForm.penanggungJawab}
                    onChange={e => setAccForm({ ...accForm, penanggungJawab: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen / Blangko Standar</label>
                <input
                  type="text"
                  value={accForm.judulBlangko || ''}
                  onChange={e => setAccForm({ ...accForm, judulBlangko: e.target.value })}
                  placeholder="Misal: BLANGKO INSTRUMEN REKAPITULASI STPPA..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi & Format Dokumen Blangko Siap Cetak</label>
                <textarea
                  rows={4}
                  value={accForm.isiBlangko || ''}
                  onChange={e => setAccForm({ ...accForm, isiBlangko: e.target.value })}
                  placeholder="Format butir penilaian, kriteria, atau instrumen standar..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAccModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Berkas Akreditasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL: 8 STANDAR AKREDITASI (KOP LOGO + TANDA TANGAN KEPALA KIRI, KOORDINATOR KANAN) */}
      {isPrintAccreditationOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Instrumen 8 Standar Akreditasi RA</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setIsPrintAccreditationOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  <div className="text-[9px] text-slate-600 font-sans">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm} / NPSN: {profile.npsn}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">
                  DAFTAR KELENGKAPAN BERKAS 8 STANDAR NASIONAL PENDIDIKAN / AKREDITASI RA
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Tahun Ajaran {academicYear} &bull; Instrumen Visitasi Akreditasi BAN-PDM & Kemenag RI
                </div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5 w-40">Standar Nasional</th>
                    <th className="border border-slate-300 p-1.5">Indikator Mutu</th>
                    <th className="border border-slate-300 p-1.5">Berkas yang Disiapkan</th>
                    <th className="border border-slate-300 p-1.5 w-20">Status</th>
                    <th className="border border-slate-300 p-1.5 w-24">Penanggung Jawab</th>
                  </tr>
                </thead>
                <tbody>
                  {accreditationItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">{item.standardNo}</td>
                      <td className="border border-slate-300 p-1.5 font-semibold">{item.standardName}</td>
                      <td className="border border-slate-300 p-1.5">{item.indikator}</td>
                      <td className="border border-slate-300 p-1.5">{item.berkasDisiapkan}</td>
                      <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">{item.statusKelengkapan}</td>
                      <td className="border border-slate-300 p-1.5">{item.penanggungJawab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Koordinator Akreditasi Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui & Mengesahkan,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Koordinator Tim Penjaminan Mutu RA</div>
                  <div className="mt-12 font-semibold underline">Guru Nurul Hidayah, S.Pd.I</div>
                  <div>NUPTK: 9283746501928374</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: SURAT KELUAR RESMI (KOP LOGO + TTD KEPALA) */}
      {isPrintLetterOpen && selectedPrintLetter && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Cetak Surat Resmi Lembaga</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Surat</span>
                </button>
                <button onClick={() => setIsPrintLetterOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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

              <div className="font-sans text-[11px] leading-relaxed space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div>Nomor: {selectedPrintLetter.noSurat}</div>
                    <div>Lampiran: -</div>
                    <div>Perihal: <strong>{selectedPrintLetter.perihal}</strong></div>
                  </div>
                  <div className="text-right">
                    <div>Bandung, {selectedPrintLetter.tanggal}</div>
                    <div>Kepada Yth:</div>
                    <div className="font-bold">{selectedPrintLetter.pengirimPenerima}</div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                  <p>
                    Dengan hormat, sehubungan dengan {selectedPrintLetter.perihal.toLowerCase()}, pimpinan Raudlatul Athfal {profile.name} menerbitkan surat resmi ini sebagai dokumen sah administrasi kelembagaan.
                  </p>
                  <p>
                    Demikian surat ini disampaikan untuk dipergunakan sebagaimana mestinya. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.
                  </p>
                  <p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
                </div>

                <div className="pt-8 flex justify-end font-sans text-[10px] text-slate-700">
                  <div className="text-center">
                    <div>Kepala RA {profile.name}</div>
                    <div className="mt-14 font-semibold underline">{profile.headmasterName}</div>
                    <div>NIP: {profile.headmasterNip || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: BLANGKO DOKUMEN 8 STANDAR INDIVIDU (SIAP CETAK) */}
      {isPrintSingleBlangkoOpen && selectedPrintBlangko && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Contoh Blangko Resmi Dokumen Standar {selectedPrintBlangko.standardNo}</h3>
                <p className="text-xs text-slate-500">{selectedPrintBlangko.standardName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Blangko</span>
                </button>
                <button onClick={() => setIsPrintSingleBlangkoOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  {selectedPrintBlangko.judulBlangko || selectedPrintBlangko.standardName}
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Standar {selectedPrintBlangko.standardNo}: {selectedPrintBlangko.standardName} &bull; Penanggung Jawab: {selectedPrintBlangko.penanggungJawab}
                </div>
              </div>

              <div className="font-sans text-[11px] leading-relaxed p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-800">Indikator Mutu yang Dinilai:</div>
                <div className="text-slate-700 mt-0.5">{selectedPrintBlangko.indikator}</div>
                <div className="font-bold text-slate-800 mt-2">Berkas Kelengkapan Fisik & Digital:</div>
                <div className="text-slate-700 mt-0.5">{selectedPrintBlangko.berkasDisiapkan}</div>
              </div>

              {/* Isi Format Blangko */}
              <div className="font-sans text-[11px] leading-relaxed whitespace-pre-wrap p-4 bg-white border border-slate-300 rounded-lg text-slate-900">
                {selectedPrintBlangko.isiBlangko || `FORMAT BLANGKO DOKUMEN RESMI STANDAR ${selectedPrintBlangko.standardNo}
Nama Standar: ${selectedPrintBlangko.standardName}
Lembaga: ${profile.name} (NSM: ${profile.nsm})

I. BUTIR-BUTIR PENILAIAN DOKUMEN:
1. Kesesuaian berkas dengan panduan BAN-PDM / Kemenag RI.
2. Kelengkapan administrasi fisik di map dokumen dan aplikasi Smart RA.
3. Keterlaksanaan program dan dokumentasi foto/catatan.

II. CATATAN VERIFIKASI ASESOR:
....................................................................................................
....................................................................................................`}
              </div>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Penanggung Jawab Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui & Mengesahkan,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Koordinator / Penanggung Jawab Standar</div>
                  <div className="mt-12 font-semibold underline">{selectedPrintBlangko.penanggungJawab}</div>
                  <div>Tim Penjaminan Mutu RA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: BUKU INVENTARIS SARANA PRASARANA & APE */}
      {isPrintAssetOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Buku Induk Inventaris Sarpras & APE</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setIsPrintAssetOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  <div className="text-[9px] text-slate-600 font-sans">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">
                  BUKU INDUK INVENTARIS SARANA PRASARANA & ALAT PERMAINAN EDUKATIF (APE)
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Tahun Anggaran {academicYear} &bull; Standar Sarpras Permendikbud & Kemenag RI
                </div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5 w-24">Kode Aset</th>
                    <th className="border border-slate-300 p-1.5">Nama Sarana / APE</th>
                    <th className="border border-slate-300 p-1.5 w-32">Kategori</th>
                    <th className="border border-slate-300 p-1.5 w-16">Jumlah</th>
                    <th className="border border-slate-300 p-1.5 w-20">Kondisi</th>
                    <th className="border border-slate-300 p-1.5">Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((ast, idx) => (
                    <tr key={ast.id}>
                      <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-slate-300 p-1.5 font-mono text-center">{ast.kode}</td>
                      <td className="border border-slate-300 p-1.5 font-semibold">{ast.nama}</td>
                      <td className="border border-slate-300 p-1.5">{ast.kategori}</td>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">{ast.jumlah} unit</td>
                      <td className="border border-slate-300 p-1.5 text-center">{ast.kondisi}</td>
                      <td className="border border-slate-300 p-1.5">{ast.lokasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Pengelola Sarpras Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui & Menyetujui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Penanggung Jawab Sarana & Prasarana</div>
                  <div className="mt-12 font-semibold underline">Hj. Anisa Rahmawati, S.E</div>
                  <div>Pengelola Aset RA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: BUKU KEAMANAN & PENJEMPUTAN PESERTA DIDIK */}
      {isPrintSecurityOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Daftar Penjemputan Resmi Peserta Didik</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setIsPrintSecurityOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  <div className="text-[9px] text-slate-600 font-sans">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">
                  BUKU INDUK SISTEM KEAMANAN & DAFTAR PENJEMPUT RESMI PESERTA DIDIK
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Standar Perlindungan Anak & SOP Keamanan Madrasah &bull; Tahun Ajaran {academicYear}
                </div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5">Nama Peserta Didik</th>
                    <th className="border border-slate-300 p-1.5 w-24">Kelas</th>
                    <th className="border border-slate-300 p-1.5">Nama Penjemput Resmi</th>
                    <th className="border border-slate-300 p-1.5 w-24">Hubungan</th>
                    <th className="border border-slate-300 p-1.5 w-28">Kontak WA</th>
                    <th className="border border-slate-300 p-1.5 w-24">Status Hari Ini</th>
                  </tr>
                </thead>
                <tbody>
                  {childSecurity.map((sec, idx) => (
                    <tr key={sec.id}>
                      <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-slate-300 p-1.5 font-semibold">{sec.studentName}</td>
                      <td className="border border-slate-300 p-1.5">{sec.kelas}</td>
                      <td className="border border-slate-300 p-1.5">{sec.namaPenjemput}</td>
                      <td className="border border-slate-300 p-1.5">{sec.hubungan}</td>
                      <td className="border border-slate-300 p-1.5 font-mono">{sec.noHpPenjemput}</td>
                      <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">{sec.statusHariIni}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Petugas Keamanan/Kesiswaan Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui & Menyetujui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Petugas Keamanan & Kesiswaan</div>
                  <div className="mt-12 font-semibold underline">Muhammad Ridwan, S.Kom</div>
                  <div>Koordinator Layanan Anak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
