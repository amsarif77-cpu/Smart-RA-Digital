import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CashTransaction, BOSComponent, BOSPlanItem, BOSRealizationItem, BOSReceipt } from '../types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  FileSpreadsheet,
  Printer,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileCheck,
  ShieldCheck,
  Edit3,
  Trash2,
  X,
  Download,
  Wallet,
  Landmark,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { exportJsonToExcel } from '../utils/exportExcel';

// Indonesian Terbilang Utility
function angkaKeTerbilang(angka: number): string {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (angka < 12) return bilangan[angka];
  if (angka < 20) return angkaKeTerbilang(angka - 10) + ' Belas';
  if (angka < 100) return angkaKeTerbilang(Math.floor(angka / 10)) + ' Puluh ' + angkaKeTerbilang(angka % 10);
  if (angka < 200) return 'Seratus ' + angkaKeTerbilang(angka - 100);
  if (angka < 1000) return angkaKeTerbilang(Math.floor(angka / 100)) + ' Ratus ' + angkaKeTerbilang(angka % 100);
  if (angka < 2000) return 'Seribu ' + angkaKeTerbilang(angka - 1000);
  if (angka < 1000000) return angkaKeTerbilang(Math.floor(angka / 1000)) + ' Ribu ' + angkaKeTerbilang(angka % 1000);
  if (angka < 1000000000) return angkaKeTerbilang(Math.floor(angka / 1000000)) + ' Juta ' + angkaKeTerbilang(angka % 1000000);
  return angka.toString();
}

export function formatTerbilang(angka: number): string {
  if (angka <= 0) return 'Nol Rupiah';
  const hasil = angkaKeTerbilang(Math.floor(angka)).trim().replace(/\s+/g, ' ');
  return `${hasil} Rupiah`;
}

interface KeuanganBOSViewProps {
  onBack?: () => void;
}

export const KeuanganBOSView: React.FC<KeuanganBOSViewProps> = ({ onBack }) => {
  const {
    cashTransactions,
    addCashTransaction,
    updateCashTransaction,
    deleteCashTransaction,
    bosComponents,
    updateBOSComponents,
    bosPlans,
    addBOSPlan,
    updateBOSPlan,
    deleteBOSPlan,
    bosRealizations,
    addBOSRealization,
    updateBOSRealization,
    deleteBOSRealization,
    receipts,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    profile,
    academicYear,
  } = useApp();

  type TabType = 'buku-kas-bos' | 'buku-kas-umum' | 'rkara-bos' | 'kuitansi-bos' | 'spj-bos' | 'ai-bos';
  const [activeTab, setActiveTab] = useState<TabType>('buku-kas-bos');

  // Modal States
  const [isAddTransModalOpen, setIsAddTransModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null);
  const [transSourceCategory, setTransSourceCategory] = useState<'BOS' | 'UMUM'>('BOS');
  
  // Transaction Form State
  const [transForm, setTransForm] = useState<Omit<CashTransaction, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    noBukti: `BOS-KMN-${Date.now().toString().slice(-4)}`,
    jenis: 'Keluar',
    sumberDana: 'BOS Kemenag',
    kategori: 'Pengadaan Bahan Ajar & Alat Permainan Edukatif (APE)',
    nominal: 1500000,
    penerimaPembayar: 'CV Media Ceria Edukasi',
    keterangan: 'Pembelian paket loose parts dan balok kayu edukasi',
    hasKwitansi: true,
  });

  // RKARA Plan Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<BOSPlanItem | null>(null);
  const [planForm, setPlanForm] = useState<Omit<BOSPlanItem, 'id'>>({
    kodeKomponen: '03',
    namaKomponen: 'Kegiatan Pembelajaran & Alat Permainan Edukatif (APE)',
    uraianKegiatan: '',
    volume: 1,
    satuan: 'Paket',
    hargaSatuan: 1000000,
    totalAnggaran: 1000000,
    tahap: 'Tahap 1',
  });

  // Receipt (Kuitansi BOS) Modal State
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<BOSReceipt | null>(null);
  const [receiptForm, setReceiptForm] = useState<Omit<BOSReceipt, 'id'>>({
    noKwitansi: `KWT/BOS-RA/${new Date().getFullYear()}/${Date.now().toString().slice(-3)}`,
    tahunAnggaran: academicYear,
    tanggal: new Date().toISOString().split('T')[0],
    sudahTerimaDari: `Bendahara BOS RA ${profile.name}`,
    jumlahUang: 1500000,
    terbilang: formatTerbilang(1500000),
    untukPembayaran: 'Pembelian paket modul pembelajaran fitrah dan APE sentra',
    kodeKomponen: '03',
    namaKomponen: 'Pengembangan Sarana, Bahan Ajar & APE',
    namaPenerima: 'Toko Kitab & Alat Peraga Pelangi Ceria',
    alamatPenerima: 'Jl. Gegerkalong Hilir No. 42 Bandung',
    npwpPenerima: '01.234.567.8-428.000',
    ppn: 0,
    pph: 0,
    statusLunas: 'Lunas',
    sumberDana: 'BOS Kemenag',
  });

  // SPJ Realization Modal State
  const [isRealizationModalOpen, setIsRealizationModalOpen] = useState(false);
  const [editingRealization, setEditingRealization] = useState<BOSRealizationItem | null>(null);
  const [realizationForm, setRealizationForm] = useState<Omit<BOSRealizationItem, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    noKwitansi: `KW-BOS/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`,
    kodeKomponen: '03',
    namaKomponen: 'Alat Permainan Edukatif (APE)',
    uraianBelanja: '',
    penerima: '',
    nominal: 1000000,
    noFakturNota: 'NOTA/RA/2026',
    pph: 0,
    ppn: 0,
    statusSPJ: 'Lengkap',
    keterangan: 'Faktur toko stempel basah dan kuitansi bermaterai',
  });

  // Printable Views
  const [isPrintBKUBosOpen, setIsPrintBKUBosOpen] = useState(false);
  const [isPrintBKUUmumOpen, setIsPrintBKUUmumOpen] = useState(false);
  const [isPrintRKARAOpen, setIsPrintRKARAOpen] = useState(false);
  const [isPrintReceiptModalOpen, setIsPrintReceiptModalOpen] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<BOSReceipt | null>(null);
  const [isPrintSPJOpen, setIsPrintSPJOpen] = useState(false);

  // Smart AI BOS Audit State
  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState('');

  // BOS Calculations (Khusus BOS Kemenag)
  const bosTransactions = cashTransactions.filter(c => c.sumberDana === 'BOS Kemenag');
  const totalMasukBOS = bosTransactions.filter(c => c.jenis === 'Masuk').reduce((acc, c) => acc + c.nominal, 0);
  const totalKeluarBOS = bosTransactions.filter(c => c.jenis === 'Keluar').reduce((acc, c) => acc + c.nominal, 0);
  const saldoBOS = totalMasukBOS - totalKeluarBOS;

  // Kas Umum Calculations (Khusus SPP, Komite, Infaq, Donasi)
  const umumTransactions = cashTransactions.filter(c => c.sumberDana !== 'BOS Kemenag');
  const totalMasukUmum = umumTransactions.filter(c => c.jenis === 'Masuk').reduce((acc, c) => acc + c.nominal, 0);
  const totalKeluarUmum = umumTransactions.filter(c => c.jenis === 'Keluar').reduce((acc, c) => acc + c.nominal, 0);
  const saldoUmum = totalMasukUmum - totalKeluarUmum;

  // RKARA calculations
  const totalPlanAnggaran = bosPlans.reduce((acc, p) => acc + p.totalAnggaran, 0);
  const totalRealizationNominal = bosRealizations.reduce((acc, r) => acc + r.nominal, 0);
  const totalReceiptsNominal = receipts.reduce((acc, r) => acc + r.jumlahUang, 0);

  // Save or Update Cash Transaction
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTransaction) {
      updateCashTransaction({
        ...transForm,
        id: editingTransaction.id,
      });
    } else {
      addCashTransaction(transForm);
    }
    setIsAddTransModalOpen(false);
    setEditingTransaction(null);
  };

  const handleOpenEditTransaction = (tx: CashTransaction) => {
    setEditingTransaction(tx);
    setTransForm({
      tanggal: tx.tanggal,
      noBukti: tx.noBukti,
      jenis: tx.jenis,
      sumberDana: tx.sumberDana,
      kategori: tx.kategori,
      nominal: tx.nominal,
      penerimaPembayar: tx.penerimaPembayar,
      keterangan: tx.keterangan,
      hasKwitansi: tx.hasKwitansi,
    });
    setTransSourceCategory(tx.sumberDana === 'BOS Kemenag' ? 'BOS' : 'UMUM');
    setIsAddTransModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi kas ini? Tindakan tidak dapat dibatalkan.')) {
      deleteCashTransaction(id);
    }
  };

  // Save or Update RKRA Plan
  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = Number(planForm.volume) * Number(planForm.hargaSatuan);
    const itemToSave = { ...planForm, totalAnggaran: calculatedTotal };
    if (editingPlan) {
      updateBOSPlan({ ...itemToSave, id: editingPlan.id });
    } else {
      addBOSPlan(itemToSave);
    }
    setIsPlanModalOpen(false);
    setEditingPlan(null);
  };

  // Save or Update Receipt (Kuitansi BOS Standar)
  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReceipt) {
      updateReceipt({
        ...receiptForm,
        id: editingReceipt.id,
      });
    } else {
      addReceipt(receiptForm);
    }
    setIsReceiptModalOpen(false);
    setEditingReceipt(null);
  };

  const handleOpenEditReceipt = (r: BOSReceipt) => {
    setEditingReceipt(r);
    setReceiptForm({
      noKwitansi: r.noKwitansi,
      tahunAnggaran: r.tahunAnggaran,
      tanggal: r.tanggal,
      sudahTerimaDari: r.sudahTerimaDari,
      jumlahUang: r.jumlahUang,
      terbilang: r.terbilang,
      untukPembayaran: r.untukPembayaran,
      kodeKomponen: r.kodeKomponen,
      namaKomponen: r.namaKomponen,
      namaPenerima: r.namaPenerima,
      alamatPenerima: r.alamatPenerima,
      npwpPenerima: r.npwpPenerima || '',
      ppn: r.ppn,
      pph: r.pph,
      statusLunas: r.statusLunas,
      sumberDana: r.sumberDana,
    });
    setIsReceiptModalOpen(true);
  };

  const handleDeleteReceipt = (id: string) => {
    if (confirm('Hapus kuitansi BOS ini?')) {
      deleteReceipt(id);
    }
  };

  // Save Realization
  const handleSaveRealization = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRealization) {
      updateBOSRealization({ ...realizationForm, id: editingRealization.id });
    } else {
      addBOSRealization(realizationForm);
    }
    setIsRealizationModalOpen(false);
    setEditingRealization(null);
  };

  // Export CSV Functions
  const downloadBlob = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Genuine Microsoft Excel (.xlsx) Exports (Requirement 8)
  const exportBOSExcel = () => {
    const data = bosTransactions.map((c, i) => ({
      'No': i + 1,
      'Tanggal': c.tanggal,
      'No. Bukti': c.noBukti,
      'Jenis': c.jenis,
      'Kategori': c.kategori,
      'Keterangan': c.keterangan,
      'Penerima / Pembayar': c.penerimaPembayar,
      'Nominal (Rp)': c.nominal,
      'Sumber Dana': c.sumberDana,
    }));
    exportJsonToExcel(data, `Buku_Kas_BOS_${profile.name.replace(/\s+/g, '_')}`, 'Kas BOS');
  };

  const exportUmumExcel = () => {
    const data = umumTransactions.map((c, i) => ({
      'No': i + 1,
      'Tanggal': c.tanggal,
      'No. Bukti': c.noBukti,
      'Sumber Dana': c.sumberDana,
      'Jenis': c.jenis,
      'Kategori': c.kategori,
      'Keterangan': c.keterangan,
      'Penerima / Pembayar': c.penerimaPembayar,
      'Nominal (Rp)': c.nominal,
    }));
    exportJsonToExcel(data, `Buku_Kas_Umum_${profile.name.replace(/\s+/g, '_')}`, 'Kas Umum');
  };

  const exportRKARAExcel = () => {
    const data = bosPlans.map((p, i) => ({
      'No': i + 1,
      'Kode Komponen': p.kodeKomponen,
      'Nama Komponen': p.namaKomponen,
      'Uraian Kegiatan': p.uraianKegiatan,
      'Tahap Pencairan': p.tahap,
      'Volume': p.volume,
      'Satuan': p.satuan,
      'Harga Satuan (Rp)': p.hargaSatuan,
      'Total Anggaran (Rp)': p.totalAnggaran,
    }));
    exportJsonToExcel(data, `RKRA_BOS_${profile.name.replace(/\s+/g, '_')}`, 'RKRA BOS');
  };

  const exportReceiptsExcel = () => {
    const data = receipts.map((r, i) => ({
      'No': i + 1,
      'No. Kwitansi': r.noKwitansi,
      'Tahun Anggaran': r.tahunAnggaran,
      'Tanggal': r.tanggal,
      'Sudah Terima Dari': r.sudahTerimaDari,
      'Jumlah Uang (Rp)': r.jumlahUang,
      'Terbilang': r.terbilang,
      'Untuk Pembayaran': r.untukPembayaran,
      'Kode Komponen': r.kodeKomponen,
      'Nama Komponen': r.namaKomponen,
      'Nama Penerima': r.namaPenerima,
      'Alamat Penerima': r.alamatPenerima,
      'NPWP': r.npwpPenerima || '-',
      'PPN (Rp)': r.ppn,
      'PPh (Rp)': r.pph,
      'Status': r.statusLunas,
    }));
    exportJsonToExcel(data, `Daftar_Kuitansi_BOS_${profile.name.replace(/\s+/g, '_')}`, 'Kuitansi BOS');
  };

  const exportSPJExcel = () => {
    const data = bosRealizations.map((r, i) => ({
      'No': i + 1,
      'Tanggal': r.tanggal,
      'No. Kwitansi': r.noKwitansi,
      'Kode Komponen': r.kodeKomponen,
      'Nama Komponen': r.namaKomponen,
      'Uraian Belanja': r.uraianBelanja,
      'Penerima': r.penerima,
      'Nominal (Rp)': r.nominal,
      'No. Faktur / Nota': r.noFakturNota,
      'PPh (Rp)': r.pph,
      'PPN (Rp)': r.ppn,
      'Status SPJ': r.statusSPJ,
      'Keterangan': r.keterangan,
    }));
    exportJsonToExcel(data, `Laporan_SPJ_BOS_${profile.name.replace(/\s+/g, '_')}`, 'SPJ BOS');
  };

  // Run Smart AI BOS Audit
  const handleRunBOSAudit = async () => {
    setAiAuditing(true);
    setAiAuditReport('');
    try {
      const res = await fetch('/api/ai/bos-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tahap: `Tahap II Tahun Anggaran ${academicYear}`,
          totalDana: '37.000.000',
          transaksi: bosTransactions.map(c => ({
            item: c.kategori + ' - ' + c.keterangan,
            nominal: c.nominal,
            kelengkapan: c.hasKwitansi ? 'Kwitansi ada, nota toko lengkap' : 'Belum lengkap',
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAuditReport(data.content);
      } else {
        setAiAuditReport(`Error: ${data.error || 'Gagal menganalisis BOS'}`);
      }
    } catch (e: any) {
      setAiAuditReport(`Terjadi kesalahan: ${e.message}`);
    } finally {
      setAiAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tombol Kembali ke Menu Utama / Dashboard (Requirement 8) */}
      {onBack && (
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            <span>&larr; Kembali ke Dashboard / Menu Utama</span>
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Akuntabilitas & Manajemen Keuangan RA</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Pengelolaan Keuangan & Dana BOS</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            RKRA, Kuitansi Pengeluaran Standar BOS Kemenag, Buku Kas BOS, Kas Umum & SPJ Digital siap cetak dan ekspor format Excel resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'buku-kas-bos' && (
            <>
              <button
                onClick={exportBOSExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintBKUBosOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cetak BKU BOS</span>
              </button>
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setTransSourceCategory('BOS');
                  setTransForm({
                    tanggal: new Date().toISOString().split('T')[0],
                    noBukti: `BOS-KMN-${Date.now().toString().slice(-4)}`,
                    jenis: 'Keluar',
                    sumberDana: 'BOS Kemenag',
                    kategori: 'Pengembangan Sarana & APE',
                    nominal: 1000000,
                    penerimaPembayar: '',
                    keterangan: '',
                    hasKwitansi: true,
                  });
                  setIsAddTransModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Transaksi BOS</span>
              </button>
            </>
          )}

          {activeTab === 'buku-kas-umum' && (
            <>
              <button
                onClick={exportUmumExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintBKUUmumOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-xl border border-blue-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Cetak Kas Umum</span>
              </button>
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setTransSourceCategory('UMUM');
                  setTransForm({
                    tanggal: new Date().toISOString().split('T')[0],
                    noBukti: `KAS-UMUM-${Date.now().toString().slice(-4)}`,
                    jenis: 'Masuk',
                    sumberDana: 'Dana Komite / Yayasan',
                    kategori: 'Iuran Komite & Infaq',
                    nominal: 500000,
                    penerimaPembayar: 'Wali Murid RA',
                    keterangan: 'Iuran kegiatan field trip',
                    hasKwitansi: true,
                  });
                  setIsAddTransModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kas Umum</span>
              </button>
            </>
          )}

          {activeTab === 'rkara-bos' && (
            <>
              <button
                onClick={exportRKARAExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintRKARAOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cetak RKRA Lengkap</span>
              </button>
              <button
                onClick={() => {
                  setEditingPlan(null);
                  setPlanForm({
                    kodeKomponen: '03',
                    namaKomponen: 'Kegiatan Pembelajaran & Alat Permainan Edukatif (APE)',
                    uraianKegiatan: '',
                    volume: 1,
                    satuan: 'Paket',
                    hargaSatuan: 1000000,
                    totalAnggaran: 1000000,
                    tahap: 'Tahap 1',
                  });
                  setIsPlanModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Item RKRA</span>
              </button>
            </>
          )}

          {activeTab === 'kuitansi-bos' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('buku-kas-bos')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
                title="Kembali ke Buku Kas"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>&larr; Kembali ke Buku Kas</span>
              </button>
              <button
                onClick={exportReceiptsExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => {
                  setEditingReceipt(null);
                  setReceiptForm({
                    noKwitansi: `KWT/BOS-RA/${new Date().getFullYear()}/${Date.now().toString().slice(-3)}`,
                    tahunAnggaran: academicYear,
                    tanggal: new Date().toISOString().split('T')[0],
                    sudahTerimaDari: `Bendahara BOS RA ${profile.name}`,
                    jumlahUang: 1000000,
                    terbilang: formatTerbilang(1000000),
                    untukPembayaran: '',
                    kodeKomponen: '03',
                    namaKomponen: 'Pengembangan Sarana, Bahan Ajar & APE',
                    namaPenerima: '',
                    alamatPenerima: '',
                    npwpPenerima: '',
                    ppn: 0,
                    pph: 0,
                    statusLunas: 'Lunas',
                    sumberDana: 'BOS Kemenag',
                  });
                  setIsReceiptModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Kuitansi Standar BOS</span>
              </button>
            </>
          )}

          {activeTab === 'spj-bos' && (
            <>
              <button
                onClick={exportSPJExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintSPJOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cetak Laporan SPJ</span>
              </button>
              <button
                onClick={() => {
                  setEditingRealization(null);
                  setRealizationForm({
                    tanggal: new Date().toISOString().split('T')[0],
                    noKwitansi: `KW-BOS/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`,
                    kodeKomponen: '03',
                    namaKomponen: 'Alat Permainan Edukatif (APE)',
                    uraianBelanja: '',
                    penerima: '',
                    nominal: 1000000,
                    noFakturNota: 'NOTA/RA/2026',
                    pph: 0,
                    ppn: 0,
                    statusSPJ: 'Lengkap',
                    keterangan: 'Faktur toko stempel basah',
                  });
                  setIsRealizationModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Belanja SPJ</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 bg-white px-3 rounded-2xl shadow-2xs">
        <button
          onClick={() => setActiveTab('buku-kas-bos')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'buku-kas-bos'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>Buku Kas BOS (Kemenag)</span>
        </button>

        <button
          onClick={() => setActiveTab('buku-kas-umum')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'buku-kas-umum'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4 text-blue-600" />
          <span>Buku Kas Umum (SPP & Infaq)</span>
        </button>

        <button
          onClick={() => setActiveTab('rkara-bos')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'rkara-bos'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Buat RKRA BOS</span>
        </button>

        <button
          onClick={() => setActiveTab('kuitansi-bos')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'kuitansi-bos'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-600" />
          <span>Kuitansi Standar BOS RA</span>
        </button>

        <button
          onClick={() => setActiveTab('spj-bos')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'spj-bos'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Realisasi & SPJ BOS</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-bos')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-bos'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Smart AI Audit BOS</span>
        </button>
      </div>

      {/* TAB 1: BUKU KAS BOS (KHUSUS BOS KEMENAG) */}
      {activeTab === 'buku-kas-bos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Pencairan Dana BOS (Masuk)</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-emerald-700 mt-1">
                Rp {totalMasukBOS.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Kemenag (Tahap I & II)</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Belanja Realisasi BOS (Keluar)</span>
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-red-600 mt-1">
                Rp {totalKeluarBOS.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Honor Guru, APE & Operasional</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-xs text-emerald-200">
                <span>Sisa Saldo Kas BOS</span>
                <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-semibold text-white">Bank Mandiri / BSI</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                Rp {saldoBOS.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-200 mt-1">Kas terdaftar rekening resmi madrasah</div>
            </div>
          </div>

          {/* BOS Transactions Table with Edit & Delete */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Daftar Transaksi Rekening Kas BOS Kemenag</span>
              <span className="text-slate-500">{bosTransactions.length} transaksi tercatat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Tanggal / No. Bukti</th>
                    <th className="px-3 py-3">Kategori Komponen BOS</th>
                    <th className="px-3 py-3">Uraian / Keterangan</th>
                    <th className="px-3 py-3">Penerima / Pembayar</th>
                    <th className="px-3 py-3 text-right">Penerimaan (Rp)</th>
                    <th className="px-3 py-3 text-right">Pengeluaran (Rp)</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bosTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        Belum ada transaksi BOS Kemenag.
                      </td>
                    </tr>
                  ) : (
                    bosTransactions.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{c.tanggal}</div>
                          <div className="font-mono text-[10px] text-emerald-700">{c.noBukti}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-semibold text-slate-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                            {c.kategori}
                          </span>
                        </td>
                        <td className="px-3 py-3 max-w-xs text-slate-600">
                          {c.keterangan}
                        </td>
                        <td className="px-3 py-3 text-slate-700 font-medium">{c.penerimaPembayar}</td>
                        <td className="px-3 py-3 text-right font-semibold text-emerald-700">
                          {c.jenis === 'Masuk' ? `Rp ${c.nominal.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-red-600">
                          {c.jenis === 'Keluar' ? `Rp ${c.nominal.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {c.hasKwitansi ? 'Kwitansi Lengkap' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditTransaction(c)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Transaksi"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(c.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUKU KAS UMUM (SPP, KOMITE, INFAQ) */}
      {activeTab === 'buku-kas-umum' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Penerimaan Kas Umum (Masuk)</span>
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-blue-700 mt-1">
                Rp {totalMasukUmum.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Iuran SPP, Komite, Infaq Jumat</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Pengeluaran Kas Umum (Keluar)</span>
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-red-600 mt-1">
                Rp {totalKeluarUmum.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Pemeliharaan, Santunan, Kegiatan RA</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-800 to-indigo-900 text-white rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-xs text-blue-200">
                <span>Saldo Kas Umum Lembaga</span>
                <span className="text-[10px] bg-blue-700 px-2 py-0.5 rounded font-semibold text-white">Kas Operasional</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                Rp {saldoUmum.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-blue-200 mt-1">Dikelola mandiri oleh Bendahara & Yayasan</div>
            </div>
          </div>

          {/* Kas Umum Transactions Table with Edit & Delete */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Daftar Transaksi Buku Kas Umum (SPP & Infaq)</span>
              <span className="text-slate-500">{umumTransactions.length} transaksi tercatat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Tanggal / No. Bukti</th>
                    <th className="px-3 py-3">Sumber Dana</th>
                    <th className="px-3 py-3">Kategori & Keterangan</th>
                    <th className="px-3 py-3">Penerima / Pembayar</th>
                    <th className="px-3 py-3 text-right">Penerimaan (Rp)</th>
                    <th className="px-3 py-3 text-right">Pengeluaran (Rp)</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {umumTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Belum ada transaksi kas umum.
                      </td>
                    </tr>
                  ) : (
                    umumTransactions.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{c.tanggal}</div>
                          <div className="font-mono text-[10px] text-blue-700">{c.noBukti}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-semibold text-slate-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                            {c.sumberDana}
                          </span>
                        </td>
                        <td className="px-3 py-3 max-w-xs text-slate-600">
                          <div className="font-medium text-slate-800">{c.kategori}</div>
                          <div className="text-[11px] text-slate-500">{c.keterangan}</div>
                        </td>
                        <td className="px-3 py-3 text-slate-700 font-medium">{c.penerimaPembayar}</td>
                        <td className="px-3 py-3 text-right font-semibold text-blue-700">
                          {c.jenis === 'Masuk' ? `Rp ${c.nominal.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-red-600">
                          {c.jenis === 'Keluar' ? `Rp ${c.nominal.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditTransaction(c)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Transaksi"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(c.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUAT RKRA BOS */}
      {activeTab === 'rkara-bos' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                RKRA
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Rencana Kerja dan Anggaran Raudlatul Athfal (RKRA BOS)
                </h4>
                <p className="text-xs text-emerald-800">
                  Tahun Anggaran {academicYear} &bull; Standar Belanja Operasional & Mutu RA Kemenag
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-700 font-medium">Total Anggaran RKRA</div>
              <div className="text-xl font-extrabold text-emerald-900">
                Rp {totalPlanAnggaran.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Rincian Anggaran Per Komponen Juknis BOS</span>
              <span className="text-slate-500">{bosPlans.length} program kegiatan</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Kode / Komponen</th>
                    <th className="px-3 py-3">Uraian Rencana Kegiatan</th>
                    <th className="px-3 py-3 text-center">Tahap</th>
                    <th className="px-3 py-3 text-center">Volume</th>
                    <th className="px-3 py-3 text-right">Harga Satuan (Rp)</th>
                    <th className="px-3 py-3 text-right">Total Anggaran (Rp)</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bosPlans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Belum ada rencana kerja RKRA.
                      </td>
                    </tr>
                  ) : (
                    bosPlans.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] mr-1.5">
                            {p.kodeKomponen}
                          </span>
                          <span>{p.namaKomponen}</span>
                        </td>
                        <td className="px-3 py-3 text-slate-600 max-w-sm">{p.uraianKegiatan}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {p.tahap}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-medium text-slate-800">
                          {p.volume} {p.satuan}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-slate-700">
                          {p.hargaSatuan.toLocaleString('id-ID')}
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-emerald-700">
                          {p.totalAnggaran.toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingPlan(p);
                                setPlanForm({
                                  kodeKomponen: p.kodeKomponen,
                                  namaKomponen: p.namaKomponen,
                                  uraianKegiatan: p.uraianKegiatan,
                                  volume: p.volume,
                                  satuan: p.satuan,
                                  hargaSatuan: p.hargaSatuan,
                                  totalAnggaran: p.totalAnggaran,
                                  tahap: p.tahap,
                                });
                                setIsPlanModalOpen(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Item RKRA"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Hapus item rencana anggaran ini?')) {
                                  deleteBOSPlan(p.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KUITANSI STANDAR BOS RA KEMENAG */}
      {activeTab === 'kuitansi-bos' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm">Kuitansi Pengeluaran BOS Sesuai Standar RA & Kemenag</h4>
              </div>
              <p className="text-xs text-emerald-100 mt-1 max-w-2xl">
                Format resmi kuitansi bukti pembayaran BOS: Dilengkapi auto-terbilang rupiah, kop RA & logo, serta 3 kolom tanda tangan (Kepala RA, Bendahara, Toko/Penyedia) siap cetak PDF.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-emerald-200">Total Nilai Kuitansi:</span>
              <div className="text-xl font-extrabold text-amber-300">
                Rp {totalReceiptsNominal.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Daftar Kuitansi Resmi Tersimpan</span>
              <span className="text-slate-500">{receipts.length} kuitansi aktif</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">No. Kuitansi / Tanggal</th>
                    <th className="px-3 py-3">Untuk Pembayaran (Uraian)</th>
                    <th className="px-3 py-3">Penerima / Toko Rekanan</th>
                    <th className="px-3 py-3">Komponen BOS</th>
                    <th className="px-3 py-3 text-right">Jumlah Uang (Rp)</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Aksi & Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Belum ada kuitansi BOS tersimpan. Klik "Input Kuitansi Standar BOS" untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    receipts.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 font-mono text-[11px]">{r.noKwitansi}</div>
                          <div className="text-[11px] text-slate-500">{r.tanggal}</div>
                        </td>
                        <td className="px-3 py-3 max-w-xs text-slate-700">
                          <div className="font-medium">{r.untukPembayaran}</div>
                          <div className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                            "{r.terbilang}"
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-800">
                          <div className="font-semibold">{r.namaPenerima}</div>
                          <div className="text-[10px] text-slate-500">{r.alamatPenerima}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {r.kodeKomponen}. {r.namaKomponen}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">
                          Rp {r.jumlahUang.toLocaleString('id-ID')}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {r.statusLunas}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedReceiptForPrint(r);
                                setIsPrintReceiptModalOpen(true);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-300 transition"
                              title="Cetak Kuitansi Standar Kemenag"
                            >
                              <Printer className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Cetak PDF</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditReceipt(r)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Kuitansi"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteReceipt(r.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Kuitansi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REALISASI & SPJ BOS */}
      {activeTab === 'spj-bos' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Daftar Transaksi SPJ Belanja Operasional BOS</span>
              <span className="text-slate-500">{bosRealizations.length} nota SPJ tercatat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Tanggal / No. Kwitansi</th>
                    <th className="px-3 py-3">Uraian Belanja</th>
                    <th className="px-3 py-3">Penerima / Rekanan</th>
                    <th className="px-3 py-3 text-right">Nominal (Rp)</th>
                    <th className="px-3 py-3 text-center">Faktur & Pajak</th>
                    <th className="px-3 py-3 text-center">Status SPJ</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bosRealizations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Belum ada belanja SPJ tercatat.
                      </td>
                    </tr>
                  ) : (
                    bosRealizations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{r.tanggal}</div>
                          <div className="font-mono text-[10px] text-emerald-700">{r.noKwitansi}</div>
                        </td>
                        <td className="px-3 py-3 max-w-xs text-slate-600">
                          <div className="font-medium text-slate-800">{r.uraianBelanja}</div>
                          <div className="text-[10px] text-slate-400">Komponen: {r.kodeKomponen} - {r.namaKomponen}</div>
                        </td>
                        <td className="px-3 py-3 text-slate-700 font-medium">{r.penerima}</td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">
                          {r.nominal.toLocaleString('id-ID')}
                        </td>
                        <td className="px-3 py-3 text-center text-[10px] text-slate-500">
                          <div>Faktur: {r.noFakturNota}</div>
                          <div>PPN: {r.ppn}% | PPh: {r.pph}%</div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${r.statusSPJ === 'Lengkap' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                            {r.statusSPJ}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingRealization(r);
                                setRealizationForm({
                                  tanggal: r.tanggal,
                                  noKwitansi: r.noKwitansi,
                                  kodeKomponen: r.kodeKomponen,
                                  namaKomponen: r.namaKomponen,
                                  uraianBelanja: r.uraianBelanja,
                                  penerima: r.penerima,
                                  nominal: r.nominal,
                                  noFakturNota: r.noFakturNota,
                                  pph: r.pph,
                                  ppn: r.ppn,
                                  statusSPJ: r.statusSPJ,
                                  keterangan: r.keterangan,
                                });
                                setIsRealizationModalOpen(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit SPJ"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Hapus bukti SPJ ini?')) {
                                  deleteBOSRealization(r.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus SPJ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SMART AI AUDIT BOS */}
      {activeTab === 'ai-bos' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl border border-amber-200 p-5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Smart AI Audit Kepatuhan BOS Kemenag</h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  Asisten cerdas menganalisis kepatuhan belanja madrasah terhadap Petunjuk Teknis (Juknis) BOS Ditjen Pendis Kemenag RI, mendeteksi pos belanja terlarang, batas honor PTK non-ASN, dan kelengkapan bukti transaksi.
                </p>
              </div>

              <button
                onClick={handleRunBOSAudit}
                disabled={aiAuditing}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer disabled:opacity-50"
              >
                {aiAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{aiAuditing ? 'Menganalisis Transaksi...' : 'Jalankan Audit AI'}</span>
              </button>
            </div>
          </div>

          {aiAuditReport && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Laporan Hasil Audit Kepatuhan:</h4>
              <div className="prose prose-sm max-w-none text-slate-700 text-xs whitespace-pre-wrap leading-relaxed">
                {aiAuditReport}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: INPUT / EDIT TRANSAKSI BUKU KAS */}
      {isAddTransModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingTransaction ? 'Edit Transaksi Kas' : 'Catat Transaksi Kas Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddTransModalOpen(false);
                  setEditingTransaction(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={transForm.tanggal}
                    onChange={(e) => setTransForm({ ...transForm, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Bukti</label>
                  <input
                    type="text"
                    value={transForm.noBukti}
                    onChange={(e) => setTransForm({ ...transForm, noBukti: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Arus Kas</label>
                  <select
                    value={transForm.jenis}
                    onChange={(e) => setTransForm({ ...transForm, jenis: e.target.value as 'Masuk' | 'Keluar' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Keluar">Kas Keluar (Pengeluaran)</option>
                    <option value="Masuk">Kas Masuk (Penerimaan)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sumber Dana</label>
                  <select
                    value={transForm.sumberDana}
                    onChange={(e) => setTransForm({ ...transForm, sumberDana: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="BOS Kemenag">BOS Kemenag</option>
                    <option value="Dana Komite / Yayasan">Dana Komite / Yayasan</option>
                    <option value="SPP Siswa">SPP Peserta Didik</option>
                    <option value="Infaq & Donasi">Infaq & Donasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Transaksi</label>
                <input
                  type="text"
                  value={transForm.kategori}
                  onChange={(e) => setTransForm({ ...transForm, kategori: e.target.value })}
                  placeholder="Misal: Pembelian APE, Honor Guru, Langganan Internet"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian / Keterangan Transaksi</label>
                <textarea
                  value={transForm.keterangan}
                  onChange={(e) => setTransForm({ ...transForm, keterangan: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penerima / Pembayar</label>
                  <input
                    type="text"
                    value={transForm.penerimaPembayar}
                    onChange={(e) => setTransForm({ ...transForm, penerimaPembayar: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    value={transForm.nominal}
                    onChange={(e) => setTransForm({ ...transForm, nominal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hasKwitansi"
                  checked={transForm.hasKwitansi}
                  onChange={(e) => setTransForm({ ...transForm, hasKwitansi: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="hasKwitansi" className="text-slate-700 font-medium">
                  Kuitansi & nota toko sah telah diverifikasi
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddTransModalOpen(false);
                    setEditingTransaction(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                >
                  {editingTransaction ? 'Simpan Perubahan' : 'Catat Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT RKRA BOS */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingPlan ? 'Edit Item RKRA BOS' : 'Tambah Rencana Belanja RKRA'}
              </h3>
              <button
                onClick={() => {
                  setIsPlanModalOpen(false);
                  setEditingPlan(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Komponen</label>
                  <input
                    type="text"
                    value={planForm.kodeKomponen}
                    onChange={(e) => setPlanForm({ ...planForm, kodeKomponen: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Penyaluran Tahap</label>
                  <select
                    value={planForm.tahap}
                    onChange={(e) => setPlanForm({ ...planForm, tahap: e.target.value as 'Tahap 1' | 'Tahap 2' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Tahap 1">Tahap 1 (Semester Ganjil)</option>
                    <option value="Tahap 2">Tahap 2 (Semester Genap)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Komponen Juknis BOS</label>
                <input
                  type="text"
                  value={planForm.namaKomponen}
                  onChange={(e) => setPlanForm({ ...planForm, namaKomponen: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian Rencana Kegiatan</label>
                <textarea
                  value={planForm.uraianKegiatan}
                  onChange={(e) => setPlanForm({ ...planForm, uraianKegiatan: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Volume</label>
                  <input
                    type="number"
                    value={planForm.volume}
                    onChange={(e) => setPlanForm({ ...planForm, volume: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={planForm.satuan}
                    onChange={(e) => setPlanForm({ ...planForm, satuan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    value={planForm.hargaSatuan}
                    onChange={(e) => setPlanForm({ ...planForm, hargaSatuan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                    min={100}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
                <span className="text-emerald-800 font-semibold">Total Anggaran Item:</span>
                <span className="text-emerald-950 font-bold text-sm">
                  Rp {(planForm.volume * planForm.hargaSatuan).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlanModalOpen(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                >
                  {editingPlan ? 'Perbarui RKRA' : 'Simpan ke RKRA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT KUITANSI STANDAR BOS RA KEMENAG */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingReceipt ? 'Edit Kuitansi Standar BOS RA' : 'Input Kuitansi Pengeluaran BOS Sesuai Juknis'}
                </h3>
                <p className="text-xs text-slate-500">Standar Kemenag RI dengan auto terbilang & 3 tanda tangan</p>
              </div>
              <button
                onClick={() => {
                  setIsReceiptModalOpen(false);
                  setEditingReceipt(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReceipt} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Kuitansi</label>
                  <input
                    type="text"
                    value={receiptForm.noKwitansi}
                    onChange={(e) => setReceiptForm({ ...receiptForm, noKwitansi: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Anggaran</label>
                  <input
                    type="text"
                    value={receiptForm.tahunAnggaran}
                    onChange={(e) => setReceiptForm({ ...receiptForm, tahunAnggaran: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Kuitansi</label>
                  <input
                    type="date"
                    value={receiptForm.tanggal}
                    onChange={(e) => setReceiptForm({ ...receiptForm, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sudah Terima Dari</label>
                <input
                  type="text"
                  value={receiptForm.sudahTerimaDari}
                  onChange={(e) => setReceiptForm({ ...receiptForm, sudahTerimaDari: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Uang Sejumlah (Nominal Rp)</label>
                  <input
                    type="number"
                    value={receiptForm.jumlahUang}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setReceiptForm({
                        ...receiptForm,
                        jumlahUang: val,
                        terbilang: formatTerbilang(val),
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-slate-700">Terbilang (Otomatis)</label>
                    <button
                      type="button"
                      onClick={() => setReceiptForm({ ...receiptForm, terbilang: formatTerbilang(receiptForm.jumlahUang) })}
                      className="text-[10px] text-emerald-700 font-semibold hover:underline"
                    >
                      Perbarui Terbilang
                    </button>
                  </div>
                  <input
                    type="text"
                    value={receiptForm.terbilang}
                    onChange={(e) => setReceiptForm({ ...receiptForm, terbilang: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 italic"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Untuk Pembayaran (Uraian Belanja Lengkap)</label>
                <textarea
                  value={receiptForm.untukPembayaran}
                  onChange={(e) => setReceiptForm({ ...receiptForm, untukPembayaran: e.target.value })}
                  rows={2}
                  placeholder="Misal: Pembelian buku cerita bergambar Islami, bahan ajar loose parts kelompok A..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Komponen BOS</label>
                  <input
                    type="text"
                    value={receiptForm.kodeKomponen}
                    onChange={(e) => setReceiptForm({ ...receiptForm, kodeKomponen: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    placeholder="Misal: 01, 02, 03..."
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Komponen BOS</label>
                  <input
                    type="text"
                    value={receiptForm.namaKomponen}
                    onChange={(e) => setReceiptForm({ ...receiptForm, namaKomponen: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="Misal: Kegiatan Pembelajaran & Bahan Ajar"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                  Identitas Penerima / Toko Rekanan (Pihak Ke-3)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nama Penerima / Nama Toko</label>
                    <input
                      type="text"
                      value={receiptForm.namaPenerima}
                      onChange={(e) => setReceiptForm({ ...receiptForm, namaPenerima: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">NPWP Penerima (Opsional)</label>
                    <input
                      type="text"
                      value={receiptForm.npwpPenerima}
                      onChange={(e) => setReceiptForm({ ...receiptForm, npwpPenerima: e.target.value })}
                      placeholder="00.000.000.0-000.000"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Alamat Penerima / Toko</label>
                  <input
                    type="text"
                    value={receiptForm.alamatPenerima}
                    onChange={(e) => setReceiptForm({ ...receiptForm, alamatPenerima: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsReceiptModalOpen(false);
                    setEditingReceipt(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                  <span>&larr; Batal / Kembali ke Daftar Kuitansi</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReceiptModalOpen(false);
                      setEditingReceipt(null);
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition cursor-pointer"
                  >
                    {editingReceipt ? 'Perbarui Kuitansi' : 'Simpan Kuitansi'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL: KUITANSI RESMI STANDAR BOS KEMENAG (3 TANDA TANGAN: KEPALA RA, BENDAHARA, TOKO) */}
      {isPrintReceiptModalOpen && selectedReceiptForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Kuitansi Standar BOS RA Kemenag</h3>
                <p className="text-xs text-slate-500">Format kuitansi resmi lengkap dengan Kop, Logo & 3 tanda tangan</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPrintReceiptModalOpen(false);
                    setSelectedReceiptForPrint(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>&larr; Kembali ke Daftar Kuitansi</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-800 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF / Print</span>
                </button>
                <button
                  onClick={() => {
                    setIsPrintReceiptModalOpen(false);
                    setSelectedReceiptForPrint(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Printable Sheet */}
            <div className="p-6 bg-white mt-3 space-y-4 font-serif border-2 border-slate-800 rounded-2xl text-slate-900">
              {/* Kop Lembaga dengan Logo & Auto-Wrap Alamat Panjang */}
              <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-3">
                {profile.logoUrl && (
                  <img
                    src={profile.logoUrl}
                    alt="Logo RA"
                    className="w-16 h-16 object-contain shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100';
                    }}
                  />
                )}
                <div className="text-center flex-1">
                  <div className="text-xs uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-lg font-black uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[10px] text-slate-700 font-sans break-words max-w-xl mx-auto leading-relaxed">
                    {profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm} / NPSN: {profile.npsn}
                  </div>
                </div>
              </div>

              {/* Judul Kuitansi */}
              <div className="flex justify-between items-center text-xs font-sans pb-1 border-b border-dashed border-slate-300">
                <span className="font-mono">Tahun Anggaran: <strong>{selectedReceiptForPrint.tahunAnggaran}</strong></span>
                <span className="font-mono">No. Bukti / Kuitansi: <strong>{selectedReceiptForPrint.noKwitansi}</strong></span>
              </div>

              <div className="text-center my-2">
                <div className="font-black text-base uppercase tracking-wider underline">
                  KUITANSI PEMBAYARAN BANTUAN OPERASIONAL SEKOLAH (BOS)
                </div>
                <div className="text-[11px] font-sans text-slate-600 mt-0.5">
                  Komponen BOS: {selectedReceiptForPrint.kodeKomponen}. {selectedReceiptForPrint.namaKomponen}
                </div>
              </div>

              {/* Data Kuitansi */}
              <div className="font-sans text-xs space-y-2.5 pt-2">
                <div className="flex items-start">
                  <span className="w-36 font-semibold shrink-0">Sudah Terima Dari</span>
                  <span className="mr-2">:</span>
                  <span className="flex-1 font-bold">{selectedReceiptForPrint.sudahTerimaDari}</span>
                </div>

                <div className="flex items-start">
                  <span className="w-36 font-semibold shrink-0">Uang Sejumlah</span>
                  <span className="mr-2">:</span>
                  <span className="flex-1 font-extrabold text-sm text-emerald-950 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    Rp {selectedReceiptForPrint.jumlahUang.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="w-36 font-semibold shrink-0">Terbilang</span>
                  <span className="mr-2">:</span>
                  <span className="flex-1 italic font-semibold text-slate-800">
                    "{selectedReceiptForPrint.terbilang}"
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="w-36 font-semibold shrink-0">Untuk Pembayaran</span>
                  <span className="mr-2">:</span>
                  <span className="flex-1 text-slate-800 leading-relaxed font-medium">
                    {selectedReceiptForPrint.untukPembayaran}
                  </span>
                </div>
              </div>

              {/* 3 KOLOM TANDA TANGAN RESMI BOS KEMENAG */}
              <div className="pt-6 font-sans text-xs text-slate-800 grid grid-cols-3 gap-2 text-center border-t border-slate-200 mt-4">
                {/* 1. KIRI: KEPALA RA */}
                <div>
                  <div className="text-[11px]">Setuju Dibayar,</div>
                  <div className="font-bold">Kepala RA {profile.name.replace('RA ', '')}</div>
                  <div className="mt-14 font-bold underline">{profile.headmasterName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">NIP: {profile.headmasterNip || '-'}</div>
                </div>

                {/* 2. TENGAH: BENDAHARA RA */}
                <div>
                  <div className="text-[11px]">Lunas Dibayar,</div>
                  <div className="font-bold">Bendahara BOS RA</div>
                  <div className="mt-14 font-bold underline">Hj. Anisa Rahmawati, S.E</div>
                  <div className="text-[10px] text-slate-500 font-mono">NUPTK: 198506122011012003</div>
                </div>

                {/* 3. KANAN: PENERIMA / TOKO */}
                <div>
                  <div className="text-[11px]">Bandung, {selectedReceiptForPrint.tanggal}</div>
                  <div className="font-bold">Yang Menerima,</div>
                  <div className="mt-14 font-bold underline">{selectedReceiptForPrint.namaPenerima}</div>
                  <div className="text-[10px] text-slate-500">{selectedReceiptForPrint.alamatPenerima}</div>
                </div>
              </div>
            </div>

            {/* Sticky/Prominent Bottom Action Bar with Kembali Button */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200 no-print">
              <button
                type="button"
                onClick={() => {
                  setIsPrintReceiptModalOpen(false);
                  setSelectedReceiptForPrint(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>&larr; Kembali ke Daftar Kuitansi</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPrintReceiptModalOpen(false);
                    setSelectedReceiptForPrint(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Tutup Preview
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: BKU BOS */}
      {isPrintBKUBosOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Buku Kas Umum BOS (Kemenag)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setIsPrintBKUBosOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-2">
                {profile.logoUrl && (
                  <img src={profile.logoUrl} alt="Logo RA" className="w-12 h-12 object-contain shrink-0" />
                )}
                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-sm font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[9px] text-slate-600 font-sans break-words">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm} / NPSN: {profile.npsn}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">BUKU KAS UMUM DANA BOS MADRASAH</div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">Tahun Anggaran {academicYear} &bull; Rekening Resmi Kemenag</div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5 w-20">Tanggal</th>
                    <th className="border border-slate-300 p-1.5 w-24">No. Bukti</th>
                    <th className="border border-slate-300 p-1.5">Uraian Transaksi</th>
                    <th className="border border-slate-300 p-1.5 w-24">Penerimaan (Rp)</th>
                    <th className="border border-slate-300 p-1.5 w-24">Pengeluaran (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {bosTransactions.map((c, i) => (
                    <tr key={c.id}>
                      <td className="border border-slate-300 p-1.5 text-center">{i + 1}</td>
                      <td className="border border-slate-300 p-1.5 text-center">{c.tanggal}</td>
                      <td className="border border-slate-300 p-1.5 font-mono">{c.noBukti}</td>
                      <td className="border border-slate-300 p-1.5">{c.kategori} - {c.keterangan}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono">
                        {c.jenis === 'Masuk' ? c.nominal.toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono">
                        {c.jenis === 'Keluar' ? c.nominal.toLocaleString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-slate-50">
                    <td colSpan={4} className="border border-slate-300 p-1.5 text-right">TOTAL ARUS KAS BOS:</td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-emerald-800">
                      Rp {totalMasukBOS.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-red-700">
                      Rp {totalKeluarBOS.toLocaleString('id-ID')}
                    </td>
                  </tr>
                  <tr className="font-bold bg-emerald-50/50">
                    <td colSpan={4} className="border border-slate-300 p-1.5 text-right">SALDO AKHIR KAS BOS:</td>
                    <td colSpan={2} className="border border-slate-300 p-1.5 text-right font-mono text-emerald-900">
                      Rp {saldoBOS.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Bendahara BOS</div>
                  <div className="mt-12 font-semibold underline">Hj. Anisa Rahmawati, S.E</div>
                  <div>NIP/NUPTK: 198506122011012003</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: BKU UMUM */}
      {isPrintBKUUmumOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Buku Kas Umum (SPP, Komite, Infaq)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setIsPrintBKUUmumOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-2">
                {profile.logoUrl && (
                  <img src={profile.logoUrl} alt="Logo RA" className="w-12 h-12 object-contain shrink-0" />
                )}
                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-sm font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[9px] text-slate-600 font-sans break-words">{profile.address} &bull; Telp: {profile.phone} &bull; Email: {profile.email}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">BUKU KAS UMUM LEMBAGA (SPP, KOMITE & INFAQ)</div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">Tahun Ajaran {academicYear} &bull; Kas Operasional Mandiri</div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5 w-20">Tanggal</th>
                    <th className="border border-slate-300 p-1.5 w-24">Sumber Dana</th>
                    <th className="border border-slate-300 p-1.5">Kategori & Keterangan</th>
                    <th className="border border-slate-300 p-1.5 w-24">Penerimaan (Rp)</th>
                    <th className="border border-slate-300 p-1.5 w-24">Pengeluaran (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {umumTransactions.map((c, i) => (
                    <tr key={c.id}>
                      <td className="border border-slate-300 p-1.5 text-center">{i + 1}</td>
                      <td className="border border-slate-300 p-1.5 text-center">{c.tanggal}</td>
                      <td className="border border-slate-300 p-1.5">{c.sumberDana}</td>
                      <td className="border border-slate-300 p-1.5">{c.kategori} - {c.keterangan}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono">
                        {c.jenis === 'Masuk' ? c.nominal.toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono">
                        {c.jenis === 'Keluar' ? c.nominal.toLocaleString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-slate-50">
                    <td colSpan={4} className="border border-slate-300 p-1.5 text-right">TOTAL TRANSAKSI KAS UMUM:</td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-blue-800">
                      Rp {totalMasukUmum.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-red-700">
                      Rp {totalKeluarUmum.toLocaleString('id-ID')}
                    </td>
                  </tr>
                  <tr className="font-bold bg-blue-50/50">
                    <td colSpan={4} className="border border-slate-300 p-1.5 text-right">SALDO AKHIR KAS UMUM:</td>
                    <td colSpan={2} className="border border-slate-300 p-1.5 text-right font-mono text-blue-900">
                      Rp {saldoUmum.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Bendahara RA</div>
                  <div className="mt-12 font-semibold underline">Hj. Anisa Rahmawati, S.E</div>
                  <div>NIP/NUPTK: 198506122011012003</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: RKRA LENGKAP */}
      {isPrintRKARAOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Rencana Kerja dan Anggaran RA (RKRA BOS)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak RKRA</span>
                </button>
                <button onClick={() => setIsPrintRKARAOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-2">
                {profile.logoUrl && (
                  <img src={profile.logoUrl} alt="Logo RA" className="w-12 h-12 object-contain shrink-0" />
                )}
                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-sm font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[9px] text-slate-600 font-sans break-words">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm} / NPSN: {profile.npsn}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">
                  RENCANA KERJA DAN ANGGARAN RAUDLATUL ATHFAL (RKRA BOS)
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Tahun Anggaran {academicYear} &bull; Berdasarkan Petunjuk Teknis BOS Madrasah
                </div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5 w-16">Kode</th>
                    <th className="border border-slate-300 p-1.5">Uraian Rencana Kegiatan</th>
                    <th className="border border-slate-300 p-1.5 w-14">Tahap</th>
                    <th className="border border-slate-300 p-1.5 w-16">Volume</th>
                    <th className="border border-slate-300 p-1.5 w-20">Harga Satuan</th>
                    <th className="border border-slate-300 p-1.5 w-24">Jumlah (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {bosPlans.map((p, i) => (
                    <tr key={p.id}>
                      <td className="border border-slate-300 p-1.5 text-center">{i + 1}</td>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">{p.kodeKomponen}</td>
                      <td className="border border-slate-300 p-1.5">
                        <div className="font-semibold">{p.namaKomponen}</div>
                        <div className="text-[9px] text-slate-600">{p.uraianKegiatan}</div>
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">{p.tahap}</td>
                      <td className="border border-slate-300 p-1.5 text-center">{p.volume} {p.satuan}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono">{p.hargaSatuan.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono font-semibold">{p.totalAnggaran.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-slate-100">
                    <td colSpan={6} className="border border-slate-300 p-1.5 text-right">TOTAL PAGU RKRA BOS TAHUNAN:</td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-emerald-900 text-xs">
                      Rp {totalPlanAnggaran.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Menyetujui & Mengesahkan,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Bendahara BOS</div>
                  <div className="mt-12 font-semibold underline">Hj. Anisa Rahmawati, S.E</div>
                  <div>NIP/NUPTK: 198506122011012003</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL: LAPORAN SPJ BOS */}
      {isPrintSPJOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Laporan Pertanggungjawaban (SPJ BOS)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Laporan SPJ</span>
                </button>
                <button onClick={() => setIsPrintSPJOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-2">
                {profile.logoUrl && (
                  <img src={profile.logoUrl} alt="Logo RA" className="w-12 h-12 object-contain shrink-0" />
                )}
                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-sm font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[9px] text-slate-600 font-sans break-words">{profile.address} &bull; Telp: {profile.phone} &bull; NSM: {profile.nsm}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-xs uppercase underline">
                  LAPORAN PERTANGGUNGJAWABAN PENGELUARAN DANA BOS (SPJ)
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Lampiran Kuitansi dan Nota Belanja Operasional &bull; Tahun Anggaran {academicYear}
                </div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5 w-20">Tanggal</th>
                    <th className="border border-slate-300 p-1.5 w-24">No. Kwitansi</th>
                    <th className="border border-slate-300 p-1.5">Uraian Pengeluaran</th>
                    <th className="border border-slate-300 p-1.5 w-24">Penerima</th>
                    <th className="border border-slate-300 p-1.5 w-24">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {bosRealizations.map((r, i) => (
                    <tr key={r.id}>
                      <td className="border border-slate-300 p-1.5 text-center">{i + 1}</td>
                      <td className="border border-slate-300 p-1.5 text-center">{r.tanggal}</td>
                      <td className="border border-slate-300 p-1.5 font-mono">{r.noKwitansi}</td>
                      <td className="border border-slate-300 p-1.5">{r.uraianBelanja} (Komponen {r.kodeKomponen})</td>
                      <td className="border border-slate-300 p-1.5">{r.penerima}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono font-semibold">{r.nominal.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-slate-100">
                    <td colSpan={5} className="border border-slate-300 p-1.5 text-right">TOTAL BELANJA SPJ BOS:</td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono text-red-700 text-xs">
                      Rp {totalRealizationNominal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui & Menyetujui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Bendahara BOS</div>
                  <div className="mt-12 font-semibold underline">Hj. Anisa Rahmawati, S.E</div>
                  <div>NIP/NUPTK: 198506122011012003</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
