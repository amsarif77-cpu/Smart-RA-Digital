import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  School,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Send,
  Globe
} from 'lucide-react';

interface WebsitePublikViewProps {
  onBackToApp: () => void;
  onOpenPPDB: () => void;
}

export const WebsitePublikView: React.FC<WebsitePublikViewProps> = ({ onBackToApp, onOpenPPDB }) => {
  const { profile, visionGoals, employees, students, addPPDBInquiry } = useApp();

  const [ppdbSuccess, setPpdbSuccess] = useState(false);
  const [fastPPDB, setFastPPDB] = useState({
    namaAnak: '',
    usia: '4 Tahun (Kelompok A)',
    namaOrtu: '',
    noHp: '',
    pesan: '',
  });

  const handleFastPPDB = (e: React.FormEvent) => {
    e.preventDefault();
    addPPDBInquiry({
      namaAnak: fastPPDB.namaAnak,
      usia: fastPPDB.usia,
      namaOrtu: fastPPDB.namaOrtu,
      noHp: fastPPDB.noHp,
      pesan: fastPPDB.pesan || 'Menanyakan informasi kurikulum & kuota pendaftaran',
      tanggal: new Date().toISOString().split('T')[0],
      status: 'Menunggu Follow-up',
    });
    setPpdbSuccess(true);
    setTimeout(() => {
      setPpdbSuccess(false);
      setFastPPDB({ namaAnak: '', usia: '4 Tahun (Kelompok A)', namaOrtu: '', noHp: '', pesan: '' });
    }, 4000);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Top Banner Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-emerald-900">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {profile.phone}</span>
          <span className="hidden md:flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {profile.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-amber-300">Akreditasi: {profile.accreditation}</span>
          <button
            onClick={onBackToApp}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] transition"
          >
            Masuk Aplikasi Manajemen RA →
          </button>
        </div>
      </div>

      {/* Main Public Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src={profile.logoUrl}
            alt={profile.name}
            className="w-10 h-10 object-contain rounded-xl bg-white border border-slate-200 p-0.5"
          />
          <div>
            <h1 className="font-extrabold text-sm md:text-base text-slate-950 leading-tight">
              {profile.name}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              {profile.foundation} • NSM: {profile.nsm}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPPDB}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-md transition transform active:scale-95"
          >
            Pendaftaran Peserta Didik Baru (PPDB)
          </button>
          <button
            onClick={onBackToApp}
            className="hidden sm:inline-flex px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            Portal Guru & Admin
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Pendidikan Anak Usia Dini Berbasis Karakter Qurani & Kurikulum Merdeka</span>
          </div>

          <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Membina Generasi Muslim Cerdas, Mandiri, Kreatif, dan Berakhlak Mulia
          </h2>

          <p className="text-emerald-100/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {profile.motto}. Menghadirkan lingkungan belajar yang aman, menyenangkan, stimulatif, dan sarat dengan nilai-nilai Nabawiyah.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onOpenPPDB}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-sm rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-2"
            >
              <span>Daftar PPDB Online 2026/2027</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToApp}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-xs transition"
            >
              Masuk Sistem Smart RA Digital
            </button>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 md:px-8 shadow-xs">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-emerald-800">{students.length}+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Peserta Didik Aktif</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-800">{employees.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Guru Tersertifikasi</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-800">4 Rombel</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Kelompok A & Kelompok B</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-800">{profile.accreditation.split(' ')[0]}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Akreditasi BAN-PDM & Kemenag</div>
          </div>
        </div>
      </section>

      {/* Visi & Program Unggulan */}
      <section className="py-14 px-4 md:px-8 max-w-5xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Visi & Program</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">Mengapa Memilih {profile.name}?</h3>
          <p className="text-xs text-slate-600 mt-2 italic">
            "{visionGoals.vision}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Tahfidz Cilik Juz 30</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Metode Talaqqi interaktif dengan hafalan minimal 15 surat pendek juz 30, doa sehari-hari, dan hadits akhlak mulia.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Bermain Bermakna (Loose Parts)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eksplorasi sensorik bahan alam ramah lingkungan, menstimulasi daya kritis, sains sederhana, dan kebebasan berekspresi.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Smart Digital & Transparan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Orang tua mendapatkan akses aplikasi Smart RA Digital untuk memantau presensi harian, foto kegiatan peserta didik, dan rapor resmi.
            </p>
          </div>
        </div>
      </section>

      {/* Profil Guru Pendidik */}
      <section className="bg-white py-14 px-4 md:px-8 border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tenaga Pendidik</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Guru & Tenaga Pendidik Berdedikasi</h3>
            <p className="text-xs text-slate-500 mt-1">
              Guru berpengalaman lulusan S1/S2 Pendidikan Islam Anak Usia Dini yang penuh kasih sayang.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {employees.slice(0, 4).map((emp) => (
              <div key={emp.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-center space-y-2">
                <img
                  src={emp.foto}
                  alt={emp.nama}
                  className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-emerald-400"
                />
                <div className="font-bold text-slate-900 text-xs line-clamp-1">{emp.nama}</div>
                <div className="text-[10px] text-emerald-800 font-semibold">{emp.jabatan}</div>
                <div className="text-[10px] text-slate-400">{emp.pendidikan}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fast PPDB Inquiry Form */}
      <section className="py-14 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 shadow-xl">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Konsultasi & Pendaftaran Cepat</span>
            <h3 className="text-2xl font-bold text-white">Ingin Mengetahui Lebih Dekat Layanan RA Kami?</h3>
            <p className="text-xs text-slate-200">
              Tinggalkan kontak Anda, tim administrasi kami akan segera menghubungi Ayah/Bunda via WhatsApp.
            </p>
          </div>

          {ppdbSuccess ? (
            <div className="p-4 bg-emerald-800 text-white rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>Jazakumullahu khairan! Data pertanyaan Anda telah diterima dan akan segera dihubungi tim RA.</span>
            </div>
          ) : (
            <form onSubmit={handleFastPPDB} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-900">
              <input
                type="text"
                required
                placeholder="Nama Calon Peserta Didik"
                value={fastPPDB.namaAnak}
                onChange={e => setFastPPDB({ ...fastPPDB, namaAnak: e.target.value })}
                className="px-3.5 py-2.5 bg-white rounded-xl focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                required
                placeholder="Nama Ayah / Bunda"
                value={fastPPDB.namaOrtu}
                onChange={e => setFastPPDB({ ...fastPPDB, namaOrtu: e.target.value })}
                className="px-3.5 py-2.5 bg-white rounded-xl focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                required
                placeholder="Nomor WhatsApp (Contoh: 0812...)"
                value={fastPPDB.noHp}
                onChange={e => setFastPPDB({ ...fastPPDB, noHp: e.target.value })}
                className="px-3.5 py-2.5 bg-white rounded-xl focus:ring-2 focus:ring-amber-400"
              />
              <select
                value={fastPPDB.usia}
                onChange={e => setFastPPDB({ ...fastPPDB, usia: e.target.value })}
                className="px-3.5 py-2.5 bg-white rounded-xl focus:ring-2 focus:ring-amber-400"
              >
                <option value="4 Tahun (Kelompok A)">Usia 4 Tahun (Kelompok A)</option>
                <option value="5 Tahun (Kelompok B)">Usia 5 Tahun (Kelompok B)</option>
              </select>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Catatan atau pertanyaan khusus (opsional)"
                  value={fastPPDB.pesan}
                  onChange={e => setFastPPDB({ ...fastPPDB, pesan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="sm:col-span-2 pt-2 text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95"
                >
                  Kirim Data Konsultasi PPDB
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 md:px-8 text-xs border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-bold text-sm text-white">{profile.name}</div>
            <p className="text-[11px] text-slate-400">{profile.address}</p>
            <p className="text-[10px] text-slate-500">NSM: {profile.nsm} • NPSN: {profile.npsn}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[11px]">
            <button onClick={onBackToApp} className="text-emerald-400 hover:underline">
              Akses Sistem Manajemen RA
            </button>
            <span className="text-slate-600">•</span>
            <span>Didukung oleh Smart RA Digital Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
