import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StudentAttendance, TeachingJournal, StaffAttendance } from '../types';
import { exportJsonToExcel } from '../utils/exportExcel';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Calendar,
  Send,
  Plus,
  BookOpen,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  Printer,
  Download,
  Paperclip,
  FileText,
  Eye,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';

export const JurnalPresensiView: React.FC = () => {
  const {
    students,
    employees,
    studentAttendance,
    saveStudentAttendance,
    staffAttendance,
    addStaffAttendance,
    approveStaffAttendance,
    journals,
    addJournal,
    rpphList,
    currentRole,
    playAttendanceChime,
    profile,
    academicYear,
    semester,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'presensi-siswa' | 'jurnal-guru' | 'presensi-guru'>('presensi-siswa');
  const [selectedClass, setSelectedClass] = useState('Kelompok B1 (Abu Bakar)');
  const [selectedDate, setSelectedDate] = useState('2026-11-04');

  // Student Attendance State
  const classStudents = students.filter(s => s.kelas.includes(selectedClass.slice(0, 11)) && s.status !== 'alumni');
  
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'>>({});
  const [attendanceDetails, setAttendanceDetails] = useState<Record<string, {
    keterangan?: string;
    suratIzinUrl?: string;
    suratDokterUrl?: string;
    jenisIzin?: 'Sakit dengan Surat Dokter' | 'Izin Tertulis Orang Tua' | 'Izin Khusus' | 'Tanpa Keterangan';
  }>>({});

  // Sync state with studentAttendance and selected date/class
  useEffect(() => {
    const statusMap: Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'> = {};
    const detailMap: Record<string, any> = {};

    classStudents.forEach(s => {
      const existing = studentAttendance.find(a => a.studentId === s.id && a.tanggal === selectedDate);
      if (existing) {
        statusMap[s.id] = existing.status;
        detailMap[s.id] = {
          keterangan: existing.keterangan,
          suratIzinUrl: existing.suratIzinUrl,
          suratDokterUrl: existing.suratDokterUrl,
          jenisIzin: existing.jenisIzin,
        };
      } else {
        statusMap[s.id] = 'Hadir';
        detailMap[s.id] = {};
      }
    });

    setCurrentAttendance(statusMap);
    setAttendanceDetails(detailMap);
  }, [selectedDate, selectedClass, studentAttendance]);

  const [savedAttendanceNotice, setSavedAttendanceNotice] = useState(false);
  const [waNotificationSent, setWaNotificationSent] = useState<string | null>(null);

  // Permit & Doctor Letter Upload Modal
  const [permitModalOpen, setPermitModalOpen] = useState(false);
  const [selectedStudentForPermit, setSelectedStudentForPermit] = useState<any>(null);
  const [tempPermitData, setTempPermitData] = useState<{
    status: 'Sakit' | 'Izin';
    jenisIzin: 'Sakit dengan Surat Dokter' | 'Izin Tertulis Orang Tua' | 'Izin Khusus' | 'Tanpa Keterangan';
    keterangan: string;
    suratIzinUrl: string;
    suratDokterUrl: string;
  }>({
    status: 'Sakit',
    jenisIzin: 'Sakit dengan Surat Dokter',
    keterangan: '',
    suratIzinUrl: '',
    suratDokterUrl: '',
  });

  // Preview Document Modal
  const [previewDocModal, setPreviewDocModal] = useState<{
    isOpen: boolean;
    title: string;
    studentName: string;
    url: string;
    date: string;
    keterangan?: string;
  }>({
    isOpen: false,
    title: '',
    studentName: '',
    url: '',
    date: '',
    keterangan: '',
  });

  // Print Modals
  const [printAttendanceModalOpen, setPrintAttendanceModalOpen] = useState(false);
  const [printJournalModalOpen, setPrintJournalModalOpen] = useState(false);
  const [selectedJournalForPrint, setSelectedJournalForPrint] = useState<TeachingJournal | null>(null);

  // New Journal Form Modal state
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [newJournal, setNewJournal] = useState({
    guruNama: 'Guru Nurul Hidayah, S.Pd.I',
    kelas: 'Kelompok B1 (Abu Bakar)',
    tema: 'Mengenal Panca Indera Karunia Allah',
    materiKegiatan: 'Eksplorasi botol sensori aroma dan kolase wajah biji-bijian.',
    jumlahHadir: 18,
    jumlahTotal: 18,
    catatanPelaksanaan: 'Seluruh anak dapat mengikuti ragam main dengan gembira dan tertib.',
    refleksi: 'Pembelajaran berbasis sensori sangat memancing rasa ingin tahu anak.',
    kendalaDanTindakLanjut: 'Menyediakan lebih banyak botol aroma yang kontras esok hari.',
  });

  // Staff check-in simulated state
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);

  const handleUpdateStudentStatus = (studentId: string, status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa') => {
    setCurrentAttendance(prev => ({ ...prev, [studentId]: status }));
    if (status === 'Sakit' || status === 'Izin') {
      const student = classStudents.find(s => s.id === studentId);
      if (student) {
        openPermitModal(student, status);
      }
    }
  };

  const openPermitModal = (student: any, defaultStatus?: 'Sakit' | 'Izin') => {
    const existingDetail = attendanceDetails[student.id] || {};
    const status = defaultStatus || (currentAttendance[student.id] === 'Sakit' ? 'Sakit' : 'Izin');
    
    setSelectedStudentForPermit(student);
    setTempPermitData({
      status,
      jenisIzin: existingDetail.jenisIzin || (status === 'Sakit' ? 'Sakit dengan Surat Dokter' : 'Izin Tertulis Orang Tua'),
      keterangan: existingDetail.keterangan || '',
      suratIzinUrl: existingDetail.suratIzinUrl || '',
      suratDokterUrl: existingDetail.suratDokterUrl || '',
    });
    setPermitModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'suratIzinUrl' | 'suratDokterUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setTempPermitData(prev => ({
        ...prev,
        [field]: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSavePermit = () => {
    if (!selectedStudentForPermit) return;
    const studentId = selectedStudentForPermit.id;

    setCurrentAttendance(prev => ({
      ...prev,
      [studentId]: tempPermitData.status,
    }));

    setAttendanceDetails(prev => ({
      ...prev,
      [studentId]: {
        keterangan: tempPermitData.keterangan || (tempPermitData.status === 'Sakit' ? 'Sakit (Izin Terdaftar)' : 'Izin Tidak Masuk'),
        suratIzinUrl: tempPermitData.suratIzinUrl,
        suratDokterUrl: tempPermitData.suratDokterUrl,
        jenisIzin: tempPermitData.jenisIzin,
      },
    }));

    setPermitModalOpen(false);
  };

  const handleSaveAttendance = () => {
    const records: StudentAttendance[] = classStudents.map(s => {
      const status = currentAttendance[s.id] || 'Hadir';
      const detail = attendanceDetails[s.id] || {};
      return {
        id: `sa_${s.id}_${selectedDate}`,
        tanggal: selectedDate,
        kelas: selectedClass,
        studentId: s.id,
        studentName: s.nama,
        status,
        jamMasuk: status === 'Hadir' ? '07.20 WIB' : '-',
        keterangan: detail.keterangan || (status === 'Sakit' ? 'Sakit (Izin Wali Murid)' : status === 'Izin' ? 'Izin Tidak Masuk' : undefined),
        suratIzinUrl: detail.suratIzinUrl,
        suratDokterUrl: detail.suratDokterUrl,
        jenisIzin: detail.jenisIzin || (status === 'Sakit' ? 'Sakit dengan Surat Dokter' : status === 'Izin' ? 'Izin Tertulis Orang Tua' : undefined),
      };
    });

    saveStudentAttendance(records);
    setSavedAttendanceNotice(true);
    setTimeout(() => setSavedAttendanceNotice(false), 2500);
  };

  const handleSimulateWhatsApp = (studentName: string, status: string, parentPhone: string) => {
    setWaNotificationSent(`Pesan WA presensi terkirim ke wali murid ananda ${studentName} (${parentPhone}): "Ananda berstatus ${status} pada tanggal ${selectedDate}".`);
    setTimeout(() => setWaNotificationSent(null), 4000);
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    addJournal({
      tanggal: selectedDate,
      guruNama: newJournal.guruNama,
      kelas: newJournal.kelas,
      tema: newJournal.tema,
      materiKegiatan: newJournal.materiKegiatan,
      jumlahHadir: Number(newJournal.jumlahHadir),
      jumlahTotal: Number(newJournal.jumlahTotal),
      catatanPelaksanaan: newJournal.catatanPelaksanaan,
      refleksi: newJournal.refleksi,
      kendalaDanTindakLanjut: newJournal.kendalaDanTindakLanjut,
      fotoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
    });
    setIsNewJournalOpen(false);
  };

  const handleStaffCheckIn = (employeeId: string, employeeName: string, jabatan: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')} WIB`;
    addStaffAttendance({
      tanggal: selectedDate,
      employeeId,
      employeeName,
      jabatan,
      jamMasuk: timeStr,
      jamPulang: '-',
      status: 'Hadir',
      lokasiGps: '-6.9175, 107.6191 (Radius 15m - Terverifikasi Area RA)',
      approvalKepala: 'Disetujui',
    });
    setCheckInNotice(`Presensi Datang Sukses! ${employeeName} berhasil check-in pada pukul ${timeStr} (Lokasi GPS Valid).`);
    setTimeout(() => setCheckInNotice(null), 3500);
  };

  // Export Attendance to Excel (.xlsx)
  const exportAttendanceExcel = () => {
    const rows = classStudents.map((s, idx) => {
      const st = currentAttendance[s.id] || 'Hadir';
      const dt = attendanceDetails[s.id] || {};
      return {
        No: idx + 1,
        'Nama Peserta Didik': s.nama,
        NIS: s.nis,
        Kelas: s.kelas,
        Tanggal: selectedDate,
        'Status Kehadiran': st,
        'Keterangan Izin': dt.keterangan || '-',
        'Jenis Izin': dt.jenisIzin || '-',
        'Ada Surat Izin': dt.suratIzinUrl ? 'Ya (Terlampir)' : 'Tidak',
        'Ada Surat Dokter': dt.suratDokterUrl ? 'Ya (Terlampir)' : 'Tidak',
        'No. HP Wali Murid': s.noHpOrtu,
      };
    });
    exportJsonToExcel(rows, `Presensi_${selectedClass.replace(/\s+/g, '_')}_${selectedDate}.xlsx`, 'Presensi Siswa');
  };

  // Export Journal to Excel (.xlsx)
  const exportJournalExcel = () => {
    const rows = journals.map((j, idx) => ({
      No: idx + 1,
      Tanggal: j.tanggal,
      'Guru Kelas': j.guruNama,
      Kelas: j.kelas,
      'Tema Pembelajaran': j.tema,
      'Materi & Ragam Main': j.materiKegiatan,
      'Kehadiran Siswa': `${j.jumlahHadir}/${j.jumlahTotal}`,
      'Catatan Pelaksanaan': j.catatanPelaksanaan,
      'Refleksi Guru': j.refleksi,
      'Kendala & Tindak Lanjut': j.kendalaDanTindakLanjut,
    }));
    exportJsonToExcel(rows, `Jurnal_Mengajar_${profile.name.replace(/\s+/g, '_')}.xlsx`, 'Jurnal Mengajar');
  };

  // Calculations for summary
  const totalStudentsCount = classStudents.length;
  const hadirCount = classStudents.filter(s => (currentAttendance[s.id] || 'Hadir') === 'Hadir').length;
  const sakitCount = classStudents.filter(s => currentAttendance[s.id] === 'Sakit').length;
  const izinCount = classStudents.filter(s => currentAttendance[s.id] === 'Izin').length;
  const alpaCount = classStudents.filter(s => currentAttendance[s.id] === 'Alpa').length;
  const persentaseHadir = totalStudentsCount > 0 ? Math.round((hadirCount / totalStudentsCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <ClipboardCheck className="w-4 h-4" />
            <span>Keterlaksanaan Harian & Kehadiran Digital</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Jurnal Mengajar & Presensi Digital</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan presensi siswa real-time, upload surat izin & surat dokter, cetak dokumen PDF, jurnal refleksi guru, serta presensi PTK GPS.
          </p>
        </div>

        {savedAttendanceNotice && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300">
            <Check className="w-4 h-4" />
            <span>Presensi siswa berhasil disimpan & bel berbunyi!</span>
          </div>
        )}
      </div>

      {/* Notifications */}
      {waNotificationSent && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{waNotificationSent}</span>
        </div>
      )}

      {checkInNotice && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{checkInNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('presensi-siswa')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'presensi-siswa'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Presensi Siswa Hari Ini ({classStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jurnal-guru')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'jurnal-guru'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Jurnal Mengajar Guru ({journals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('presensi-guru')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'presensi-guru'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Presensi Guru & Tendik (GPS/QR)</span>
        </button>
      </div>

      {/* Tab 1: Presensi Siswa */}
      {activeTab === 'presensi-siswa' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-5 space-y-4">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Pilih Kelas:</span>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-800"
                >
                  <option value="Kelompok B1 (Abu Bakar)">Kelompok B1 (Abu Bakar)</option>
                  <option value="Kelompok B2 (Umar bin Khattab)">Kelompok B2 (Umar bin Khattab)</option>
                  <option value="Kelompok A1 (Khadijah)">Kelompok A1 (Khadijah)</option>
                  <option value="Kelompok A2 (Fathimah Az-Zahra)">Kelompok A2 (Fathimah Az-Zahra)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              {/* Statistics Pill */}
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg font-semibold text-[11px]">
                <span>H: {hadirCount}</span>
                <span>•</span>
                <span className="text-amber-700">S: {sakitCount}</span>
                <span>•</span>
                <span className="text-blue-700">I: {izinCount}</span>
                <span>•</span>
                <span className="text-red-700">A: {alpaCount}</span>
                <span>•</span>
                <span className="text-emerald-700">{persentaseHadir}% Hadir</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportAttendanceExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
                title="Download data presensi dalam file Excel .xlsx"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintAttendanceModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
                title="Cetak lembar daftar hadir kelas resmi"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap Presensi</span>
              </button>

              <button
                onClick={handleSaveAttendance}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                Simpan Presensi Kelas
              </button>
            </div>
          </div>

          {/* Student attendance list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Nama Peserta Didik</th>
                  <th className="px-3 py-3">NIS</th>
                  <th className="px-4 py-3 text-center">Status Kehadiran</th>
                  <th className="px-4 py-3">Keterangan & Lampiran Surat Izin / Dokter</th>
                  <th className="px-3 py-3 text-right">Notifikasi Orang Tua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((s) => {
                  const status = currentAttendance[s.id] || 'Hadir';
                  const detail = attendanceDetails[s.id] || {};

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.foto}
                            alt={s.nama}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{s.nama}</div>
                            <div className="text-[10px] text-slate-400">Ortu: {s.namaIbu || s.namaAyah}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-600">{s.nis}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-1.5">
                          {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleUpdateStudentStatus(s.id, st)}
                              className={`px-3 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
                                status === st
                                  ? st === 'Hadir'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : st === 'Sakit'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : st === 'Izin'
                                    ? 'bg-blue-500 text-white shadow-xs'
                                    : 'bg-red-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {(status === 'Sakit' || status === 'Izin') ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => openPermitModal(s)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-semibold text-[10px] cursor-pointer"
                              >
                                <Paperclip className="w-3 h-3 text-amber-600" />
                                <span>{detail.suratIzinUrl || detail.suratDokterUrl ? 'Edit Surat' : 'Upload Surat'}</span>
                              </button>

                              {detail.suratIzinUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewDocModal({
                                    isOpen: true,
                                    title: 'Surat Izin Tertulis Orang Tua',
                                    studentName: s.nama,
                                    url: detail.suratIzinUrl!,
                                    date: selectedDate,
                                    keterangan: detail.keterangan,
                                  })}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded text-[10px] font-medium cursor-pointer"
                                >
                                  <FileText className="w-3 h-3 text-blue-600" />
                                  <span>Lihat Surat Izin</span>
                                </button>
                              )}

                              {detail.suratDokterUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewDocModal({
                                    isOpen: true,
                                    title: 'Surat Keterangan Dokter',
                                    studentName: s.nama,
                                    url: detail.suratDokterUrl!,
                                    date: selectedDate,
                                    keterangan: detail.keterangan,
                                  })}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded text-[10px] font-medium cursor-pointer"
                                >
                                  <FileText className="w-3 h-3 text-emerald-600" />
                                  <span>Lihat Surat Dokter</span>
                                </button>
                              )}
                            </div>

                            {detail.keterangan && (
                              <div className="text-[10px] text-slate-500 italic">
                                {detail.keterangan}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleSimulateWhatsApp(s.nama, status, s.noHpOrtu)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-medium text-[11px] border border-emerald-200 transition cursor-pointer"
                          title="Kirim Pesan WhatsApp Otomatis ke Wali Murid"
                        >
                          <Send className="w-3 h-3 text-emerald-600" />
                          <span>Kirim WA</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Jurnal Mengajar Guru */}
      {activeTab === 'jurnal-guru' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daftar Jurnal Mengajar Harian</h3>
              <p className="text-xs text-slate-500">Terhubung langsung dengan RPPH, supervisi Kepala RA, dan portofolio anak.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportJournalExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>

              <button
                onClick={() => setIsNewJournalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tulis Jurnal Baru</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {journals.map((j) => (
              <div key={j.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded">
                      {j.kelas}
                    </span>
                    <span className="font-semibold text-slate-700">{j.guruNama}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">{j.tanggal} • Kehadiran: {j.jumlahHadir}/{j.jumlahTotal} Peserta Didik</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJournalForPrint(j);
                        setPrintJournalModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                      title="Cetak Jurnal Harian Resmi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="font-bold text-slate-800 text-sm">{j.tema}</div>
                  <div className="text-slate-700 font-medium">Materi & Ragam Main: {j.materiKegiatan}</div>
                  <p className="text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100">
                    "{j.catatanPelaksanaan}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60">
                  <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                    <div className="font-bold text-emerald-900 text-[11px] mb-0.5">Refleksi Guru:</div>
                    <div className="text-slate-700">{j.refleksi}</div>
                  </div>
                  <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                    <div className="font-bold text-amber-900 text-[11px] mb-0.5">Kendala & Rencana Tindak Lanjut:</div>
                    <div className="text-slate-700">{j.kendalaDanTindakLanjut}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Presensi Guru & Pegawai (GPS/QR) */}
      {activeTab === 'presensi-guru' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-5 space-y-5">
          {/* Role Access Restriction Notice */}
          {!(currentRole === 'superadmin' || currentRole === 'tu' || currentRole === 'kepala') && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <strong>Hak Akses Terbatas:</strong> Daftar hadir real-time dan dokumentasi luar kantor berkoordinat GPS hanya dapat dilihat secara lengkap oleh akun <strong>Super Administrator</strong> dan <strong>Admin Tata Usaha / Kepala RA</strong>.
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>Geofencing & Kehadiran Digital Guru RA</span>
              </div>
              <h3 className="font-bold text-base text-white">Presensi Mandiri Guru & Tendik</h3>
              <p className="text-xs text-blue-100/90 mt-0.5 max-w-xl">
                Radius terdeteksi: 15 meter dari titik koordinat RA. Mendukung presensi masuk, pulang, dan pengajuan izin/dinas luar.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStaffCheckIn('e2', 'Guru Nurul Hidayah, S.Pd.I', 'Guru Kelas')}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasi Check-In GPS</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Nama Pegawai</th>
                  <th className="px-3 py-3">Jabatan</th>
                  <th className="px-3 py-3">Jam Masuk / Pulang</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Verifikasi GPS Real</th>
                  <th className="px-4 py-3 text-right">Approval Kepala RA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffAttendance.map((sta) => {
                  const canViewSensitiveGPS = currentRole === 'superadmin' || currentRole === 'tu' || currentRole === 'kepala';

                  return (
                    <tr key={sta.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">{sta.employeeName}</td>
                      <td className="px-3 py-3 text-slate-600">{sta.jabatan}</td>
                      <td className="px-3 py-3 font-mono text-slate-700">
                        <div>Masuk: {sta.jamMasuk}</div>
                        <div className="text-[10px] text-slate-400">Pulang: {sta.jamPulang}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-emerald-100 text-emerald-800">
                          {sta.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[11px] text-slate-500">
                        {canViewSensitiveGPS ? (
                          <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            {sta.lokasiGps}
                          </span>
                        ) : (
                          <span className="text-[10px] italic text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            Terkunci (Khusus Super Admin & Admin)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canViewSensitiveGPS ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {sta.approvalKepala}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Hanya Kepala / Admin</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD SURAT IZIN & SURAT DOKTER */}
      {permitModalOpen && selectedStudentForPermit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Formulir Keterangan Izin / Sakit</h3>
                <p className="text-xs text-slate-500">
                  {selectedStudentForPermit.nama} • NIS: {selectedStudentForPermit.nis}
                </p>
              </div>
              <button onClick={() => setPermitModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Kehadiran</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempPermitData({ ...tempPermitData, status: 'Sakit', jenisIzin: 'Sakit dengan Surat Dokter' })}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border cursor-pointer ${
                      tempPermitData.status === 'Sakit'
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Sakit
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempPermitData({ ...tempPermitData, status: 'Izin', jenisIzin: 'Izin Tertulis Orang Tua' })}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border cursor-pointer ${
                      tempPermitData.status === 'Izin'
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Izin
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori / Jenis Keterangan</label>
                <select
                  value={tempPermitData.jenisIzin}
                  onChange={e => setTempPermitData({ ...tempPermitData, jenisIzin: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="Sakit dengan Surat Dokter">Sakit dengan Surat Dokter</option>
                  <option value="Izin Tertulis Orang Tua">Izin Tertulis Orang Tua</option>
                  <option value="Izin Khusus">Izin Khusus / Acara Keluarga</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian / Catatan Keterangan</label>
                <textarea
                  rows={2}
                  value={tempPermitData.keterangan}
                  onChange={e => setTempPermitData({ ...tempPermitData, keterangan: e.target.value })}
                  placeholder="Misal: Demam flu disertai batuk sejak malam, disarankan istirahat 2 hari..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              {/* Upload Surat Izin Orang Tua */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Upload Surat Izin Orang Tua (Foto / Galeri)</span>
                  </label>
                  {tempPermitData.suratIzinUrl && (
                    <button
                      type="button"
                      onClick={() => setTempPermitData({ ...tempPermitData, suratIzinUrl: '' })}
                      className="text-red-600 hover:text-red-700 text-[10px] font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => handleFileUpload(e, 'suratIzinUrl')}
                  className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 cursor-pointer"
                />

                {tempPermitData.suratIzinUrl && (
                  <div className="mt-2 relative">
                    <img
                      src={tempPermitData.suratIzinUrl}
                      alt="Preview Surat Izin"
                      className="max-h-36 rounded-lg border border-slate-300 object-contain mx-auto bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Upload Surat Keterangan Dokter */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Upload Surat Keterangan Dokter (Foto / Galeri)</span>
                  </label>
                  {tempPermitData.suratDokterUrl && (
                    <button
                      type="button"
                      onClick={() => setTempPermitData({ ...tempPermitData, suratDokterUrl: '' })}
                      className="text-red-600 hover:text-red-700 text-[10px] font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => handleFileUpload(e, 'suratDokterUrl')}
                  className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />

                {tempPermitData.suratDokterUrl && (
                  <div className="mt-2 relative">
                    <img
                      src={tempPermitData.suratDokterUrl}
                      alt="Preview Surat Dokter"
                      className="max-h-36 rounded-lg border border-slate-300 object-contain mx-auto bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPermitModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSavePermit}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Keterangan & Lampiran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW SURAT DOKUMEN IZIN / DOKTER */}
      {previewDocModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{previewDocModal.title}</h3>
                <p className="text-xs text-slate-500">
                  Peserta Didik: {previewDocModal.studentName} • Tanggal: {previewDocModal.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Surat</span>
                </button>
                <button
                  onClick={() => setPreviewDocModal({ ...previewDocModal, isOpen: false })}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              {previewDocModal.keterangan && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                  <strong>Catatan:</strong> {previewDocModal.keterangan}
                </div>
              )}

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center p-2">
                <img
                  src={previewDocModal.url}
                  alt={previewDocModal.title}
                  className="max-h-[60vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CETAK REKAP PRESENSI KELAS (PDF) */}
      {printAttendanceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Rekapitulasi Presensi Peserta Didik</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setPrintAttendanceModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  DAFTAR HADIR PESERTA DIDIK RAUDLATUL ATHFAL
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Kelas / Rombel: {selectedClass} &bull; Tanggal: {selectedDate} &bull; Tahun Ajaran: {academicYear}
                </div>
              </div>

              <table className="w-full font-sans text-[10px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-300 p-1.5 w-8">No</th>
                    <th className="border border-slate-300 p-1.5 w-24">NIS</th>
                    <th className="border border-slate-300 p-1.5">Nama Peserta Didik</th>
                    <th className="border border-slate-300 p-1.5 w-16">L/P</th>
                    <th className="border border-slate-300 p-1.5 w-20">Status</th>
                    <th className="border border-slate-300 p-1.5">Keterangan / Dokumen Lampiran</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((s, idx) => {
                    const st = currentAttendance[s.id] || 'Hadir';
                    const dt = attendanceDetails[s.id] || {};
                    return (
                      <tr key={s.id}>
                        <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-slate-300 p-1.5 font-mono text-center">{s.nis}</td>
                        <td className="border border-slate-300 p-1.5 font-semibold">{s.nama}</td>
                        <td className="border border-slate-300 p-1.5 text-center">{s.jk}</td>
                        <td className="border border-slate-300 p-1.5 text-center font-bold">
                          <span className={st === 'Hadir' ? 'text-emerald-800' : st === 'Sakit' ? 'text-amber-700' : st === 'Izin' ? 'text-blue-700' : 'text-red-700'}>
                            {st}
                          </span>
                        </td>
                        <td className="border border-slate-300 p-1.5">
                          {dt.keterangan || (st === 'Hadir' ? 'Hadir Tepat Waktu' : '-')}
                          {dt.suratIzinUrl && ' [Surat Izin Ortu]'}
                          {dt.suratDokterUrl && ' [Surat Dokter]'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary Stats Box */}
              <div className="font-sans text-[10px] p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                <div>Total Peserta Didik: <strong>{totalStudentsCount} Anak</strong></div>
                <div>Hadir: <strong>{hadirCount}</strong> | Sakit: <strong>{sakitCount}</strong> | Izin: <strong>{izinCount}</strong> | Alpa: <strong>{alpaCount}</strong></div>
                <div>Persentase Kehadiran: <strong className="text-emerald-800">{persentaseHadir}%</strong></div>
              </div>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Guru Kelas Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui & Mengesahkan,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {selectedDate}</div>
                  <div className="font-bold">Guru Kelas / Wali Kelas</div>
                  <div className="mt-12 font-semibold underline">Guru Nurul Hidayah, S.Pd.I</div>
                  <div>Pendidik RA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CETAK JURNAL HARIAN GURU (PDF) */}
      {printJournalModalOpen && selectedJournalForPrint && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Siap Cetak: Jurnal Mengajar Harian Guru</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button onClick={() => setPrintJournalModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  JURNAL HARIAN PELAKSANAAN PEMBELAJARAN (RPPH)
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Kurikulum Merdeka PAUD/RA &bull; Tahun Ajaran {academicYear}
                </div>
              </div>

              <div className="font-sans text-[11px] leading-relaxed space-y-2">
                <table className="w-full text-[11px]">
                  <tbody>
                    <tr><td className="w-40 font-semibold">Nama Guru Kelas</td><td>: {selectedJournalForPrint.guruNama}</td></tr>
                    <tr><td className="font-semibold">Kelas / Kelompok</td><td>: {selectedJournalForPrint.kelas}</td></tr>
                    <tr><td className="font-semibold">Hari / Tanggal</td><td>: {selectedJournalForPrint.tanggal}</td></tr>
                    <tr><td className="font-semibold">Kehadiran Peserta Didik</td><td>: {selectedJournalForPrint.jumlahHadir} dari {selectedJournalForPrint.jumlahTotal} Anak</td></tr>
                    <tr><td className="font-semibold">Tema Pembelajaran</td><td>: <strong>{selectedJournalForPrint.tema}</strong></td></tr>
                    <tr><td className="font-semibold">Materi & Ragam Main</td><td>: {selectedJournalForPrint.materiKegiatan}</td></tr>
                  </tbody>
                </table>

                <div className="pt-2">
                  <div className="font-bold text-slate-800">Catatan Pelaksanaan Pembelajaran:</div>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">{selectedJournalForPrint.catatanPelaksanaan}</p>
                </div>

                <div className="pt-2">
                  <div className="font-bold text-slate-800">Refleksi Guru:</div>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">{selectedJournalForPrint.refleksi}</p>
                </div>

                <div className="pt-2">
                  <div className="font-bold text-slate-800">Kendala & Rencana Tindak Lanjut:</div>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">{selectedJournalForPrint.kendalaDanTindakLanjut}</p>
                </div>
              </div>

              {/* Tanda Tangan: Kepala Sebelah Kiri, Guru Sebelah Kanan (Aturan #7) */}
              <div className="pt-6 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {selectedJournalForPrint.tanggal}</div>
                  <div className="font-bold">Guru Kelas</div>
                  <div className="mt-12 font-semibold underline">{selectedJournalForPrint.guruNama}</div>
                  <div>Pendidik RA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TULIS JURNAL BARU */}
      {isNewJournalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Entri Jurnal Harian Guru</h3>
              <button onClick={() => setIsNewJournalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJournal} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru & Kelas</label>
                <input
                  type="text"
                  value={`${newJournal.guruNama} - ${newJournal.kelas}`}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tema / Subtema Hari Ini *</label>
                <input
                  type="text"
                  required
                  value={newJournal.tema}
                  onChange={e => setNewJournal({ ...newJournal, tema: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Materi & Ragam Main</label>
                <input
                  type="text"
                  required
                  value={newJournal.materiKegiatan}
                  onChange={e => setNewJournal({ ...newJournal, materiKegiatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Pelaksanaan Pembelajaran</label>
                <textarea
                  rows={2}
                  value={newJournal.catatanPelaksanaan}
                  onChange={e => setNewJournal({ ...newJournal, catatanPelaksanaan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Refleksi Guru</label>
                  <textarea
                    rows={2}
                    value={newJournal.refleksi}
                    onChange={e => setNewJournal({ ...newJournal, refleksi: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kendala & Tindak Lanjut</label>
                  <textarea
                    rows={2}
                    value={newJournal.kendalaDanTindakLanjut}
                    onChange={e => setNewJournal({ ...newJournal, kendalaDanTindakLanjut: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewJournalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
