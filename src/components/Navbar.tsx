import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Building2, 
  ChevronDown, 
  Globe, 
  Printer, 
  RefreshCw, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Menu
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenPublicSite: () => void;
  onOpenPrintCenter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenPublicSite, onOpenPrintCenter }) => {
  const { 
    profile, 
    currentUser, 
    users, 
    switchRole, 
    academicYear, 
    setAcademicYear, 
    semester, 
    setSemester,
    resetToDefaultData
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);

  const roles: { role: UserRole; title: string; desc: string; badgeColor: string }[] = [
    { role: 'superadmin', title: 'Super Administrator', desc: 'Akses penuh seluruh konfigurasi sistem', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
    { role: 'kepala', title: 'Kepala RA', desc: 'Manajerial, supervisi internal, persetujuan & laporan', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { role: 'guru', title: 'Guru Kelas / Pendidik', desc: 'RPPH, jurnal kelas, presensi, dan asesmen rapor', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
    { role: 'bendahara', title: 'Bendahara RA', desc: 'Buku kas, BOS Kemenag, SPJ, dan keuangan', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
    { role: 'pengawas', title: 'Pengawas Madrasah / RA', desc: 'Supervisi manajerial & akademik RA binaan', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    { role: 'tu', title: 'Admin / Tata Usaha', desc: 'Buku induk, surat menyurat, berkas digital', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
    { role: 'orangtua', title: 'Orang Tua / Wali Murid', desc: 'Portal perkembangan anak, komunikasi, izin', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' },
    { role: 'yayasan', title: 'Yayasan Penyelenggara', desc: 'Monitoring dashboard mutu dan kelembagaan', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300' },
  ];

  const currentRoleInfo = roles.find(r => r.role === currentUser.role) || roles[0];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-emerald-100 shadow-xs">
      <div className="flex items-center justify-between px-3 md:px-6 py-2.5">
        {/* Left: Mobile hamburger + School Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-lg lg:hidden"
            title="Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-sm overflow-hidden flex-shrink-0">
              <img
                src={profile.logoUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-[10px] bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm md:text-base text-emerald-950 tracking-tight leading-tight line-clamp-1">
                  {profile.name}
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                  {profile.accreditation}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>NSM: <strong className="text-slate-700 font-medium">{profile.nsm}</strong></span>
                <span className="text-slate-300">•</span>
                <span>NPSN: <strong className="text-slate-700 font-medium">{profile.npsn}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Academic Year, Switch Role, Tools, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Academic Year & Semester Selector */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setAcademicDropdownOpen(!academicDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>TA {academicYear} - {semester}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {academicDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 text-xs z-50">
                <div className="px-2 py-1 font-semibold text-slate-500 text-[10px] uppercase tracking-wider">
                  Pilih Tahun Ajaran
                </div>
                {['2025/2026', '2026/2027', '2027/2028'].map(year => (
                  <button
                    key={year}
                    onClick={() => { setAcademicYear(year); setAcademicDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${academicYear === year ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>Tahun {year}</span>
                    {academicYear === year && <span className="text-emerald-600">✓</span>}
                  </button>
                ))}
                <div className="border-t border-slate-100 my-1 pt-1">
                  <div className="px-2 py-1 font-semibold text-slate-500 text-[10px] uppercase tracking-wider">
                    Pilih Semester
                  </div>
                  {['Semester 1 (Ganjil)', 'Semester 2 (Genap)'].map(sem => (
                    <button
                      key={sem}
                      onClick={() => { setSemester(sem); setAcademicDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${semester === sem ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span>{sem}</span>
                      {semester === sem && <span className="text-emerald-600">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PWA Install App Button */}
          <PWAInstallButton />

          {/* Quick Button: Website Publik */}
          <button
            onClick={onOpenPublicSite}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
            title="Buka Website Publik RA"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Publik</span>
          </button>

          {/* Quick Button: Cetak & Laporan (Khusus Pengelola / Pendidik) */}
          {currentUser.role !== 'orangtua' && (
            <button
              onClick={onOpenPrintCenter}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
              title="Cetak & Arsip Laporan"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          )}

          {/* RBAC Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-lg text-xs transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-emerald-300"
              />
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-slate-800 text-[11px] leading-tight flex items-center gap-1">
                  <span>{currentUser.name.split(',')[0]}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-medium ${currentRoleInfo.badgeColor}`}>
                    {currentRoleInfo.title.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Klik untuk ganti hak akses (RBAC)</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 text-xs z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900 text-sm flex items-center justify-between">
                    <span>Simulasi Hak Akses (RBAC)</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pilih peran untuk menguji tampilan dashboard dan modul sesuai hak akses.
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
                  {roles.map((item) => {
                    const isActive = currentUser.role === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchRole(item.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition ${
                          isActive
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="mt-0.5">
                          <UserCheck className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${isActive ? 'text-emerald-900' : 'text-slate-800'}`}>
                              {item.title}
                            </span>
                            {isActive && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Smart RA Digital v2.4</span>
                  <button
                    onClick={() => {
                      if (confirm('Kembalikan semua data ke setelan awal demo?')) {
                        resetToDefaultData();
                        setRoleDropdownOpen(false);
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
