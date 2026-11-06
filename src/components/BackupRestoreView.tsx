import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BackupData } from '../types';
import {
  Download,
  Upload,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  FileText,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  FolderArchive,
  ArrowRight
} from 'lucide-react';

export const BackupRestoreView: React.FC = () => {
  const {
    profile,
    students,
    employees,
    ppdbList,
    rpphList,
    journals,
    studentAttendance,
    staffAttendance,
    assessments,
    supervisions,
    cashTransactions,
    bosComponents,
    parentMessages,
    letters,
    assets,
    childSecurity,
    exportBackupData,
    importBackupData,
    snapshots,
    createLocalSnapshot,
    restoreFromSnapshot,
    deleteSnapshot,
    resetToDefaultData,
    clearAllDemoData,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [previewBackup, setPreviewBackup] = useState<BackupData | null>(null);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const notify = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Download Backup as JSON
  const handleDownloadBackup = () => {
    const backup = exportBackupData();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const safeSchoolName = (profile.name || 'SmartRA').replace(/[^a-zA-Z0-9]/g, '_');

    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_SmartRA_${safeSchoolName}_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notify('success', 'Berkas cadangan data (JSON) berhasil diunduh ke komputer Anda!');
  };

  // 2. Handle File Upload & Parse Preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || (typeof parsed !== 'object')) {
          notify('error', 'Format berkas tidak valid atau rusak.');
          return;
        }
        setPreviewBackup(parsed);
      } catch (err: any) {
        notify('error', `Gagal membaca berkas JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. Execute Restore
  const handleExecuteRestore = () => {
    if (!previewBackup) return;

    const confirmMsg = restoreMode === 'replace'
      ? 'PERINGATAN: Seluruh data saat ini akan digantikan dengan data dari berkas cadangan. Lanjutkan?'
      : 'Data dari berkas cadangan akan digabungkan dengan data saat ini. Lanjutkan?';

    if (confirm(confirmMsg)) {
      const res = importBackupData(previewBackup, restoreMode);
      if (res.success) {
        notify('success', res.message);
        setPreviewBackup(null);
      } else {
        notify('error', res.message);
      }
    }
  };

  // 4. Create Local Snapshot
  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    createLocalSnapshot(snapshotLabel.trim() || undefined);
    setSnapshotLabel('');
    notify('success', 'Snapshot cadangan lokal berhasil disimpan!');
  };

  // Total summary count
  const totalRecords =
    students.length +
    employees.length +
    rpphList.length +
    journals.length +
    cashTransactions.length +
    assessments.length +
    supervisions.length +
    letters.length +
    assets.length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Keamanan Sistem & Manajemen Cadangan</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Backup & Restore Basis Data</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadangkan seluruh basis data Smart RA Digital ke berkas JSON atau pulihkan data kapan saja secara instan.
          </p>
        </div>

        {notification && (
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border animate-fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-red-50 text-red-800 border-red-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        )}
      </div>

      {/* Main Two Columns: Backup Card vs Restore Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Ekspor / Unduh Cadangan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase">
                  Ekspor Data (.json)
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1.5 flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-700" />
                  <span>Cadangkan Data (Backup)</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-emerald-800">{totalRecords}</span>
                <div className="text-[10px] text-slate-400">Total Entri Data</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mengunduh seluruh basis data ke dalam satu berkas format JSON terstruktur yang aman, mencakup:
            </p>

            {/* Checklist items in backup */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">Profil & Logo RA ({profile.name.slice(0, 16)}...)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">Buku Induk ({students.length} Peserta Didik)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">Pendidik & Tendik ({employees.length} PTK)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">Buku Kas & BOS ({cashTransactions.length} Transaksi)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">RPPH & Jurnal ({rpphList.length} RPPH, {journals.length} Jurnal)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">Asesmen & Portofolio ({assessments.length} Catatan)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">Supervisi & Tindak Lanjut ({supervisions.length} Berkas)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">Surat & Sarpras APE ({letters.length + assets.length} Data)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleDownloadBackup}
              className="w-full py-3 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas Cadangan Lengkap (.json)</span>
            </button>
            <div className="text-[10px] text-slate-400 text-center mt-2">
              Disarankan melakukan pencadangan berkala setiap akhir pekan atau sebelum pembaruan semester.
            </div>
          </div>
        </div>

        {/* Card 2: Impor / Pulihkan Cadangan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 uppercase">
                Impor & Pemulihan
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-1.5 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-700" />
                <span>Pulihkan Data (Restore)</span>
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih berkas cadangan (.json) dari perangkat Anda untuk memulihkan data madrasah.
            </p>

            {/* File Upload Box */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50 text-center transition">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
                id="restore-file-input"
              />
              <label
                htmlFor="restore-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-semibold text-xs text-slate-800">
                  Klik untuk Memilih Berkas Cadangan (.json)
                </div>
                <div className="text-[11px] text-slate-400">
                  Mendukung file backup hasil ekspor Smart RA Digital
                </div>
              </label>
            </div>

            {/* Preview Selected File */}
            {previewBackup && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-3 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-emerald-950 text-sm">
                      {previewBackup.schoolName || previewBackup.data?.profile?.name || 'Berkas Cadangan Terdeteksi'}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Waktu Backup: {previewBackup.timestamp || 'Tidak tertera'}
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewBackup(null)}
                    className="text-slate-400 hover:text-red-600 text-xs font-bold"
                  >
                    Batal
                  </button>
                </div>

                {/* Mode restore selection */}
                <div className="pt-2 border-t border-emerald-200/60">
                  <label className="font-bold text-slate-800 block mb-1.5">Pilih Metode Pemulihan:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRestoreMode('replace')}
                      className={`p-2 rounded-lg text-left border transition ${
                        restoreMode === 'replace'
                          ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-[11px]">Gantikan Seluruh Data</div>
                      <div className={`text-[10px] ${restoreMode === 'replace' ? 'text-emerald-100' : 'text-slate-500'}`}>
                        Timpa data yang ada
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRestoreMode('merge')}
                      className={`p-2 rounded-lg text-left border transition ${
                        restoreMode === 'merge'
                          ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-[11px]">Gabungkan Data</div>
                      <div className={`text-[10px] ${restoreMode === 'merge' ? 'text-emerald-100' : 'text-slate-500'}`}>
                        Pertahankan data lama
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteRestore}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jalankan Pemulihan Data Sekarang</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400">
            * Seluruh proses restore dilakukan di browser Anda secara aman tanpa mengirim data ke server publik.
          </div>
        </div>
      </div>

      {/* Local Snapshots / Riwayat Cadangan Cepat */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">Snapshot Cadangan Lokal (Penyimpanan Browser)</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simpan titik pemulihan cepat (snapshot) sebelum melakukan perubahan besar pada data peserta didik, rapor, atau BOS.
            </p>
          </div>

          {/* Quick Snapshot creator */}
          <form onSubmit={handleCreateSnapshot} className="flex items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Label snapshot (misal: Sebelum Ujian)"
              value={snapshotLabel}
              onChange={e => setSnapshotLabel(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Buat Snapshot</span>
            </button>
          </form>
        </div>

        {/* Snapshots Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Label Snapshot</th>
                <th className="px-3 py-3">Waktu Pembuatan</th>
                <th className="px-3 py-3">Ukuran File</th>
                <th className="px-3 py-3">Lembaga Terkait</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {snapshots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Belum ada snapshot lokal disimpan. Klik tombol "Buat Snapshot" di atas untuk membuat titik pemulihan instan.
                  </td>
                </tr>
              ) : (
                snapshots.map((snap) => (
                  <tr key={snap.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{snap.label}</td>
                    <td className="px-3 py-3 text-slate-500 font-mono text-[11px]">{snap.timestamp}</td>
                    <td className="px-3 py-3 font-mono text-slate-600">{snap.sizeKb} KB</td>
                    <td className="px-3 py-3 text-slate-700">{snap.data?.schoolName || profile.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            if (confirm(`Pulihkan data dari snapshot "${snap.label}"? Seluruh data saat ini akan disinkronkan.`)) {
                              restoreFromSnapshot(snap.id);
                              notify('success', `Data berhasil dipulihkan dari snapshot "${snap.label}"!`);
                            }
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold text-[11px] border border-emerald-200 transition"
                          title="Pulihkan dari Snapshot"
                        >
                          Pulihkan
                        </button>
                        <button
                          onClick={() => {
                            const jsonStr = JSON.stringify(snap.data, null, 2);
                            const blob = new Blob([jsonStr], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `Snapshot_${snap.label.replace(/\s+/g, '_')}.json`;
                            link.click();
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title="Unduh Snapshot Ini"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus snapshot "${snap.label}"?`)) {
                              deleteSnapshot(snap.id);
                              notify('success', 'Snapshot dihapus.');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Snapshot"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Security & Data Protection Info */}
      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Keamanan Data & Perlindungan Privasi Peserta Didik:</div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Berkas backup berisi informasi sensitif mengenai identitas peserta didik, nomor kartu keluarga, dan catatan keuangan BOS. Simpan berkas cadangan di media penyimpanan eksternal yang aman dan terenkripsi (misalnya Google Drive terproteksi kata sandi atau flashdisk resmi madrasah).
          </p>
        </div>
      </div>

      {/* Deploy Readiness: Reset / Kosongkan Data Awal untuk Domain Resmi */}
      <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 text-xs text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="font-bold text-red-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Persiapan Deploy: Kosongkan Seluruh Data Awal / Demo</span>
          </div>
          <p className="text-[11px] text-red-800 leading-relaxed">
            Gunakan tombol ini saat aplikasi telah diunggah dan dideploy di domain resmi madrasah Anda. Sistem akan menghapus seluruh data peserta didik, presensi, jurnal, supervisi, dan transaksi uji coba sehingga Anda dapat langsung menginput data riil dari nol dengan bersih.
          </p>
        </div>

        <button
          onClick={() => {
            const confirmed = window.confirm(
              'PERINGATAN PENTING:\n\nApakah Anda yakin ingin MENGOSONGKAN SELURUH DATA AWAL/DEMO?\n\nTindakan ini akan membersihkan data peserta didik, presensi, jurnal, transaksi kas, dan SPJ BOS agar Anda dapat menginput data asli madrasah dari awal.\n\nSangat disarankan untuk mengunduh Backup JSON terlebih dahulu.'
            );
            if (confirmed) {
              clearAllDemoData();
              notify('success', 'Data awal demo berhasil dikosongkan! Aplikasi siap untuk penginputan data asli.');
            }
          }}
          className="shrink-0 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Kosongkan Data Demo</span>
        </button>
      </div>
    </div>
  );
};
