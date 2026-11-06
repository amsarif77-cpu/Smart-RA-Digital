import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from './Sidebar';
import {
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Clock,
  BookOpen,
  AlertCircle,
  Bell,
  X,
  FileSpreadsheet,
  Baby,
  MessageSquare,
  Globe,
  HeartHandshake
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    profile,
    currentUser,
    currentRole,
    students,
    employees,
    rpphList,
    journals,
    studentAttendance,
    staffAttendance,
    cashTransactions,
    bosComponents,
    supervisions,
    parentMessages,
    academicYear,
    semester,
  } = useApp();

  const [toastDismissed, setToastDismissed] = useState(false);

  // Metrics
  const maleStudents = students.filter(s => s.jk === 'L').length;
  const femaleStudents = students.filter(s => s.jk === 'P').length;
  const groupAStudents = students.filter(s => s.kelompok === 'A').length;
  const groupBStudents = students.filter(s => s.kelompok === 'B').length;

  const certifiedTeachers = employees.filter(e => e.sertifikasi).length;
  const totalStaff = employees.length;

  const todayStudentPresent = studentAttendance.filter(a => a.status === 'Hadir').length;
  const todayStudentTotal = studentAttendance.length || students.length;
  const studentPresentPct = todayStudentTotal ? Math.round((todayStudentPresent / todayStudentTotal) * 100) : 100;

  const todayStaffPresent = staffAttendance.filter(a => a.status === 'Hadir').length;

  // BOS & Cash Metrics
  const totalCashIn = cashTransactions
    .filter(c => c.jenis === 'Masuk')
    .reduce((acc, c) => acc + c.nominal, 0);
  const totalCashOut = cashTransactions
    .filter(c => c.jenis === 'Keluar')
    .reduce((acc, c) => acc + c.nominal, 0);
  const currentBalance = totalCashIn - totalCashOut;

  const totalBOSBudget = bosComponents.reduce((acc, c) => acc + c.anggaran, 0);
  const totalBOSRealized = bosComponents.reduce((acc, c) => acc + c.realisasi, 0);
  const bosAbsorptionPct = totalBOSBudget ? Math.round((totalBOSRealized / totalBOSBudget) * 100) : 0;

  // Unread messages
  const pendingMessages = parentMessages.filter(m => m.status === 'Menunggu Tanggapan').length;

  // Supervision stats & Due tasks in next 3 days
  const pendingSupervisions = supervisions.filter(s => s.statusTindakLanjut !== 'Tuntas Memuaskan');
  const urgentSupervisions = pendingSupervisions.slice(0, 3);

  // Monthly admission trends (Bar chart data) for current academic year
  const admissionTrendData = [
    { bulan: 'Jul', kelompokA: 14, kelompokB: 8, total: 22 },
    { bulan: 'Agt', kelompokA: 6, kelompokB: 4, total: 10 },
    { bulan: 'Sep', kelompokA: 3, kelompokB: 2, total: 5 },
    { bulan: 'Okt', kelompokA: 4, kelompokB: 3, total: 7 },
    { bulan: 'Nov', kelompokA: 2, kelompokB: 1, total: 3 },
    { bulan: 'Des', kelompokA: 5, kelompokB: 3, total: 8 },
    { bulan: 'Jan', kelompokA: 7, kelompokB: 4, total: 11 },
    { bulan: 'Feb', kelompokA: 3, kelompokB: 2, total: 5 },
    { bulan: 'Mar', kelompokA: 4, kelompokB: 3, total: 7 },
    { bulan: 'Apr', kelompokA: 2, kelompokB: 1, total: 3 },
    { bulan: 'Mei', kelompokA: 5, kelompokB: 4, total: 9 },
    { bulan: 'Jun', kelompokA: 8, kelompokB: 6, total: 14 },
  ];

  // Year-over-Year Child Growth Analysis (Area chart data)
  const growthComparisonData = [
    { bulan: 'Jul', tahunIni: 48, tahunLalu: 40 },
    { bulan: 'Agt', tahunIni: 54, tahunLalu: 43 },
    { bulan: 'Sep', tahunIni: 57, tahunLalu: 45 },
    { bulan: 'Okt', tahunIni: 61, tahunLalu: 47 },
    { bulan: 'Nov', tahunIni: 63, tahunLalu: 48 },
    { bulan: 'Des', tahunIni: 68, tahunLalu: 51 },
    { bulan: 'Jan', tahunIni: 74, tahunLalu: 54 },
    { bulan: 'Feb', tahunIni: 76, tahunLalu: 56 },
    { bulan: 'Mar', tahunIni: 79, tahunLalu: 57 },
    { bulan: 'Apr', tahunIni: 81, tahunLalu: 58 },
    { bulan: 'Mei', tahunIni: 86, tahunLalu: 60 },
    { bulan: 'Jun', tahunIni: 92, tahunLalu: 64 },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification for Supervisions due in 3 days */}
      {!toastDismissed && urgentSupervisions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-white rounded-2xl p-4 shadow-xl flex items-center justify-between border border-amber-300/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">
                  Peringatan Jatuh Tempo: {urgentSupervisions.length} Tugas Supervisi Segera Berakhir!
                </h4>
                <span className="bg-white/20 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  3 Hari Ke Depan
                </span>
              </div>
              <p className="text-xs text-amber-50 mt-0.5 line-clamp-1">
                Tindak lanjut: {urgentSupervisions[0].jenis} ({urgentSupervisions[0].targetTeacherName || 'Guru RA'}) — "{urgentSupervisions[0].rekomendasi.slice(0, 75)}..."
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(currentRole === 'pengawas' ? 'supervisi-pengawas' : 'supervisi-kepala')}
              className="px-3 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow transition"
            >
              Tindak Lanjuti
            </button>
            <button
              onClick={() => setToastDismissed(true)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-6 md:p-8 shadow-xl border border-emerald-700/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sistem Manajemen Terpadu Berbasis Smart AI & Kurikulum Merdeka RA</span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Selamat Datang, {currentUser.name}
          </h2>
          <p className="text-emerald-100/90 text-xs md:text-sm leading-relaxed mb-5">
            {profile.name} — Siap mewujudkan ekosistem Raudlatul Athfal yang modern, bernafaskan nilai Islam, transparan, dan berorientasi pada kemerdekaan tumbuh kembang fitrah anak.
          </p>

          {currentRole === 'orangtua' ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('tumbuh-kembang')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <Baby className="w-4 h-4" />
                <span>Portofolio & Rapor Ananda</span>
              </button>
              <button
                onClick={() => onNavigate('ruang-ortu-guru')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/80 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl border border-emerald-500/40 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>Konsultasi Guru & Ajukan Izin</span>
              </button>
              <button
                onClick={() => onNavigate('website-publik')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20 transition cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-300" />
                <span>Website Publik RA</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('smart-ai')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Smart AI Pembelajaran</span>
              </button>
              <button
                onClick={() => onNavigate('jurnal-presensi')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/80 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl border border-emerald-500/40 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Presensi Hari Ini ({studentPresentPct}%)</span>
              </button>
              <button
                onClick={() => onNavigate('keuangan-bos')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20 transition cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-emerald-300" />
                <span>Realisasi BOS: {bosAbsorptionPct}%</span>
              </button>
            </div>
          )}
        </div>

        {/* Decorative Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300 via-emerald-400 to-transparent" />
      </div>



      {/* Role-Specific Alert / Action Note */}
      {currentRole === 'orangtua' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 text-sm">Mode Tampilan Orang Tua / Wali Murid</h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Anda dapat memantau presensi ananda hari ini, melihat dokumentasi observasi guru, mengajukan izin sakit, dan berkonsultasi langsung dengan guru kelas.
            </p>
            <div className="mt-2 flex gap-3">
              <button onClick={() => onNavigate('ruang-ortu-guru')} className="text-xs font-semibold text-amber-800 underline">
                Kirim Pesan / Ajukan Izin
              </button>
              <span className="text-amber-400">•</span>
              <button onClick={() => onNavigate('tumbuh-kembang')} className="text-xs font-semibold text-amber-800 underline">
                Lihat Portofolio Ananda
              </button>
            </div>
          </div>
        </div>
      )}

      {currentRole === 'pengawas' && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl text-indigo-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-indigo-900 text-sm">Dashboard Pengawas Pembina Kementerian Agama</h4>
            <p className="text-xs text-indigo-700 mt-0.5">
              Anda berwenang melakukan supervisi manajerial dan akademik terhadap RA binaan, menelaah ketercapaian Kurikulum RA, serta memonitor pertanggungjawaban BOS.
            </p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onNavigate('supervisi-pengawas')} className="text-xs font-semibold text-indigo-800 underline">
                Buka Lembar Supervisi Pengawas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THREE REQUIRED VISUAL SUMMARY STAT CARDS (ROLE-ADAPTIVE) */}
      {currentRole === 'orangtua' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Parent Card 1: Presensi Ananda */}
          <div
            onClick={() => onNavigate('ruang-ortu-guru')}
            className="p-5 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Presensi Ananda Hari Ini
                </span>
                <p className="text-xs text-slate-500">Tahun Ajaran {academicYear}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">Hadir Tepat Waktu</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                07.15 WIB
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-100/80 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Kehadiran Semester Ini:</span>
                <strong className="text-emerald-700">{studentPresentPct}%</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Klik untuk mengirim pesan izin sakit atau surat dokter ke guru.
              </div>
            </div>
          </div>

          {/* Parent Card 2: Portofolio & Capaian Fitrah */}
          <div
            onClick={() => onNavigate('tumbuh-kembang')}
            className="p-5 rounded-2xl bg-gradient-to-br from-white to-teal-50/50 border border-teal-200 shadow-sm hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                  Tumbuh Kembang Ananda
                </span>
                <p className="text-xs text-slate-500">Kurikulum Merdeka P2RA</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <Baby className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">7 Aspek Fitrah</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                Optimal
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-teal-100/80 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600">Nilai Agama & Budi Pekerti:</span>
                <span className="text-teal-800 font-bold">BSB (Sangat Baik)</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Klik untuk melihat lembar rapor digital dan foto karya ananda.
              </div>
            </div>
          </div>

          {/* Parent Card 3: Ruang Komunikasi Guru & Izin */}
          <div
            onClick={() => onNavigate('ruang-ortu-guru')}
            className="p-5 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 border border-amber-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                  Konsultasi Guru Kelas
                </span>
                <p className="text-xs text-slate-500">Kemitraan Madrasah & Ortu</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-950">{parentMessages.length}</span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Pesan Terhubung
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-100/80 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600">Guru Kelas:</span>
                <span className="text-amber-800 font-bold">Usth. Maryam & Zahra</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Klik untuk konsultasi langsung via obrolan atau ajukan izin.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Peserta Didik */}
          <div
            onClick={() => onNavigate('buku-induk')}
            className="p-5 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Total Peserta Didik
                </span>
                <p className="text-xs text-slate-500">Tahun Ajaran {academicYear}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{students.length}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Anak Aktif
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-100/80 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Laki-laki: <strong className="text-slate-800">{maleStudents}</strong></span>
                <span>Perempuan: <strong className="text-slate-800">{femaleStudents}</strong></span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Kelompok A (4-5 th): {groupAStudents}</span>
                <span>Kelompok B (5-6 th): {groupBStudents}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Sisa Saldo Kas & BOS */}
          <div
            onClick={() => onNavigate('keuangan-bos')}
            className="p-5 rounded-2xl bg-gradient-to-br from-white to-teal-50/50 border border-teal-200 shadow-sm hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                  Sisa Saldo Kas & BOS
                </span>
                <p className="text-xs text-slate-500">Buku Kas Terpadu</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900 truncate">
                Rp {currentBalance.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-teal-100/80 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-700">Masuk: Rp {totalCashIn.toLocaleString('id-ID')}</span>
                <span className="text-rose-600">Keluar: Rp {totalCashOut.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Serapan BOS: <strong className="text-slate-800">{bosAbsorptionPct}%</strong></span>
                <span className="text-teal-700 font-semibold">Siap SPJ Kemenag</span>
              </div>
            </div>
          </div>

          {/* Card 3: Daftar Tugas Supervisi Segera Jatuh Tempo */}
          <div
            onClick={() => onNavigate('supervisi-kepala')}
            className="p-5 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 border border-amber-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                  Supervisi Jatuh Tempo
                </span>
                <p className="text-xs text-slate-500">Tenggat Waktu 3 Hari</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-950">{pendingSupervisions.length}</span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Tugas Pending
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-100/80 text-xs text-slate-600">
              {urgentSupervisions.length > 0 ? (
                <div className="space-y-1">
                  {urgentSupervisions.slice(0, 2).map((s) => (
                    <div key={s.id} className="flex justify-between items-center text-[11px] truncate">
                      <span className="text-slate-700 font-medium truncate max-w-[170px]">
                        • {s.jenis}: {s.targetTeacherName?.split(',')[0] || 'Guru'}
                      </span>
                      <span className="text-amber-700 font-bold flex-shrink-0">Skor {s.skor}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Seluruh tugas supervisi telah tuntas memuaskan.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECHARTS SECTION: 1. BAR CHART (TREN PPDB BULANAN) & 2. AREA CHART (PERTUMBUHAN YoY) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bar Chart - Tren Pendaftaran Peserta Didik Baru per Bulan */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  Tren Pendaftaran Peserta Didik Baru per Bulan
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Jumlah peserta didik baru masuk berdasarkan Kelompok A dan B selama TA berjalan
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
              {academicYear}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} Anak`,
                    name === 'kelompokA' ? 'Kelompok A (4-5 th)' : name === 'kelompokB' ? 'Kelompok B (5-6 th)' : 'Total Siswa'
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                  formatter={(val) => (val === 'kelompokA' ? 'Kelompok A' : val === 'kelompokB' ? 'Kelompok B' : val)}
                />
                <Bar dataKey="kelompokA" fill="#059669" radius={[4, 4, 0, 0]} name="Kelompok A" />
                <Bar dataKey="kelompokB" fill="#0d9488" radius={[4, 4, 0, 0]} name="Kelompok B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Puncak Pendaftaran: <strong>Juli & Juni (Musim PPDB Utama)</strong></span>
            <button
              onClick={() => onNavigate('ppdb-kelas')}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Data PPDB <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Chart 2: Area Chart - Analisis Pertumbuhan Peserta Didik Bulanan (Tahun Ini vs Tahun Lalu) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  Analisis Pertumbuhan Peserta Didik (YoY)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan akumulasi peserta didik aktif tahun ini vs tahun sebelumnya
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+43.7% YoY</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTahunIni" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTahunLalu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} Peserta Didik`,
                    name === 'tahunIni' ? `Tahun Ini (${academicYear})` : 'Tahun Lalu'
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                  formatter={(val) => (val === 'tahunIni' ? `Tahun Berjalan (${academicYear})` : 'Tahun Sebelumnya')}
                />
                <Area
                  type="monotone"
                  dataKey="tahunIni"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTahunIni)"
                  name="tahunIni"
                />
                <Area
                  type="monotone"
                  dataKey="tahunLalu"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorTahunLalu)"
                  name="tahunLalu"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Tren Positif: <strong>Peningkatan kepercayaan masyarakat & yayasan</strong></span>
            <button
              onClick={() => onNavigate('buku-induk')}
              className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              Buku Induk <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: RPPH Activities, BOS Breakdown, and Supervisi Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Learning Activities & RPPH */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick RPPH & Active Journals */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Pembelajaran & Jurnal Mengajar Terkini</h3>
              </div>
              <button 
                onClick={() => onNavigate('smart-ai')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <span>AI RPPH Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {rpphList.slice(0, 2).map((rpph) => (
                <div key={rpph.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {rpph.kelompok}
                    </span>
                    <span className="text-slate-400 text-[11px]">{rpph.tanggal}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{rpph.tema} — {rpph.subtema}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {rpph.tujuan}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Nilai Islam: {rpph.nilaiIslam.slice(0, 45)}...</span>
                    <span className="text-emerald-700 font-medium bg-emerald-100/70 px-2 py-0.5 rounded-lg">
                      {rpph.status === 'disetujui' ? 'Disahkan Kepala RA' : 'Draf Guru'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Jurnal snapshot */}
            {journals.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Jurnal Guru Hari Ini:</span>
                  <span className="text-slate-400 font-normal">{journals[0].tanggal}</span>
                </div>
                <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs text-teal-950">
                  <div className="font-semibold text-teal-900">{journals[0].guruNama} ({journals[0].kelas})</div>
                  <p className="text-slate-700 mt-1 italic">
                    "{journals[0].catatanPelaksanaan}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* BOS Budget Progress Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Penyerapan Anggaran BOS Kemenag (RKARA)</h3>
                <p className="text-xs text-slate-500">Tahun Anggaran {academicYear.split('/')[0]} - Standar Akuntabilitas</p>
              </div>
              <button 
                onClick={() => onNavigate('keuangan-bos')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Kelola RKRA & Kuitansi BOS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {bosComponents.slice(0, 4).map((comp) => {
                const pct = Math.round((comp.realisasi / comp.anggaran) * 100);
                return (
                  <div key={comp.kode} className="text-xs">
                    <div className="flex justify-between font-medium text-slate-700 mb-1">
                      <span className="truncate pr-2">{comp.kode}. {comp.nama}</span>
                      <span className="font-semibold text-slate-900 whitespace-nowrap">
                        Rp {comp.realisasi.toLocaleString('id-ID')} / Rp {comp.anggaran.toLocaleString('id-ID')} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Supervisi, Pesan Ortu, Mutu Kelembagaan */}
        <div className="space-y-6">
          {/* Supervisi Kepala & Pengawas Status */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Supervisi & Tindak Lanjut</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {pendingSupervisions.length} Pending
              </span>
            </div>

            <div className="space-y-2.5">
              {supervisions.map((sup) => (
                <div key={sup.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">{sup.jenis}</span>
                    <span className="text-[10px] text-slate-500">{sup.tanggal}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Sasaran: <strong className="text-slate-800">{sup.targetTeacherName?.split(',')[0] || 'Guru Kelas'}</strong>
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">
                    Catatan: {sup.catatanObservasi}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-700">Skor: {sup.skor}/100</span>
                    <span className={`px-2 py-0.5 rounded-md font-medium ${
                      sup.statusTindakLanjut === 'Tuntas Memuaskan' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sup.statusTindakLanjut}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button 
                onClick={() => onNavigate('supervisi-kepala')}
                className="w-1/2 py-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-center transition"
              >
                Supervisi Kepala
              </button>
              <button 
                onClick={() => onNavigate('supervisi-pengawas')}
                className="w-1/2 py-2 text-[11px] font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-center transition"
              >
                Supervisi Pengawas
              </button>
            </div>
          </div>

          {/* Pesan & Komunikasi Ortu */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Pesan Orang Tua & Izin</h3>
              </div>
              {pendingMessages > 0 && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  {pendingMessages} Baru
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {parentMessages.slice(0, 2).map((msg) => (
                <div key={msg.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{msg.studentName}</span>
                    <span className="text-[10px] text-slate-400">{msg.tanggal.split(' ')[1] || msg.tanggal}</span>
                  </div>
                  <div className="text-[11px] font-medium text-emerald-800 mb-1">{msg.subject}</div>
                  <p className="text-slate-600 text-[11px] line-clamp-2 italic">
                    "{msg.message}"
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Dari: {msg.parentName}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold ${msg.status === 'Dibalas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('ruang-ortu-guru')}
              className="mt-3 w-full py-2 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition"
            >
              Lihat Seluruh Percakapan & Izin
            </button>
          </div>

          {/* Indikator 8 Standar Mutu RA / Layanan Terpadu Wali Murid */}
          {currentRole === 'orangtua' ? (
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Layanan Terpadu Wali Murid</span>
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">Madrasah Ramah Anak</div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Pantau capaian tahfidz surat pendek, hafalan hadits harian, nilai karakter Islami, serta stimulasi fitrah ananda melalui rapor berkala.
              </p>
              <button
                onClick={() => onNavigate('tumbuh-kembang')}
                className="mt-3 w-full py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl transition text-center shadow cursor-pointer"
              >
                Lihat Portofolio & Rapor Ananda
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Kesiapan Akreditasi BAN-PDM</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">Status: {profile.accreditation}</div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                8 Standar Nasional Pendidikan Kemenag (STPPA, Isi, Proses, Pendidik, Sarpras, Pengelolaan, Pembiayaan, Penilaian) lengkap dengan instrumen dan berkas bukti fisik siap cetak.
              </p>
              <button
                onClick={() => onNavigate('administrasi-mutu')}
                className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition text-center shadow cursor-pointer"
              >
                Cek Dokumen & Cetak Instrumen
              </button>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};
