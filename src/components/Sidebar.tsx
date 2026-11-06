import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Sparkles,
  ClipboardCheck,
  HeartHandshake,
  DollarSign,
  MessageSquare,
  ShieldAlert,
  Award,
  Archive,
  Globe,
  Settings,
  Baby,
  FileSpreadsheet,
  Database
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'profil'
  | 'buku-induk'
  | 'ppdb-kelas'
  | 'akademik'
  | 'smart-ai'
  | 'jurnal-presensi'
  | 'tumbuh-kembang'
  | 'keuangan-bos'
  | 'ruang-ortu-guru'
  | 'supervisi-kepala'
  | 'supervisi-pengawas'
  | 'pkkm'
  | 'administrasi-mutu'
  | 'backup-restore'
  | 'website-publik'
  | 'pengaturan';

// RBAC Definition: Strict tab/menu permissions per UserRole
export const ROLE_ALLOWED_TABS: Record<string, ActiveTab[]> = {
  superadmin: [
    'dashboard',
    'profil',
    'buku-induk',
    'ppdb-kelas',
    'akademik',
    'smart-ai',
    'jurnal-presensi',
    'tumbuh-kembang',
    'keuangan-bos',
    'ruang-ortu-guru',
    'supervisi-kepala',
    'supervisi-pengawas',
    'pkkm',
    'administrasi-mutu',
    'backup-restore',
    'website-publik',
    'pengaturan',
  ],
  kepala: [
    'dashboard',
    'profil',
    'buku-induk',
    'ppdb-kelas',
    'akademik',
    'smart-ai',
    'jurnal-presensi',
    'tumbuh-kembang',
    'keuangan-bos',
    'ruang-ortu-guru',
    'supervisi-kepala',
    'supervisi-pengawas',
    'pkkm',
    'administrasi-mutu',
    'website-publik',
    'pengaturan',
  ],
  guru: [
    'dashboard',
    'akademik',
    'smart-ai',
    'jurnal-presensi',
    'tumbuh-kembang',
    'ruang-ortu-guru',
    'website-publik',
  ],
  bendahara: [
    'dashboard',
    'buku-induk',
    'keuangan-bos',
    'ruang-ortu-guru',
    'administrasi-mutu',
    'website-publik',
  ],
  pengawas: [
    'dashboard',
    'akademik',
    'tumbuh-kembang',
    'supervisi-pengawas',
    'pkkm',
    'administrasi-mutu',
    'website-publik',
  ],
  tu: [
    'dashboard',
    'profil',
    'buku-induk',
    'ppdb-kelas',
    'administrasi-mutu',
    'website-publik',
  ],
  yayasan: [
    'dashboard',
    'profil',
    'keuangan-bos',
    'pkkm',
    'administrasi-mutu',
    'website-publik',
  ],
  orangtua: [
    'dashboard',
    'tumbuh-kembang',
    'ruang-ortu-guru',
    'website-publik',
  ],
};

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onCloseMobile }) => {
  const { currentRole, profile } = useApp();

  const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || ROLE_ALLOWED_TABS.orangtua;

  const baseMenuSections = [
    {
      title: currentRole === 'orangtua' ? 'PORTAL WALI MURID' : 'UTAMA',
      items: [
        { id: 'dashboard', label: currentRole === 'orangtua' ? 'Dashboard Wali Murid' : 'Dashboard Digital RA', icon: LayoutDashboard, badge: null },
        { id: 'profil', label: 'Profil RA & Branding', icon: School, badge: 'Identitas' },
      ],
    },
    {
      title: 'PESERTA DIDIK & PTK',
      items: [
        { id: 'buku-induk', label: 'Buku Induk Digital', icon: Users, badge: 'Siswa & Guru' },
        { id: 'ppdb-kelas', label: 'PPDB & Rombel Kelas', icon: GraduationCap, badge: 'Baru' },
      ],
    },
    {
      title: currentRole === 'orangtua' ? 'PERKEMBANGAN ANANDA' : 'PEMBELAJARAN & AI',
      items: [
        { id: 'akademik', label: 'Akademik & Kurikulum', icon: BookOpen, badge: null },
        { id: 'smart-ai', label: 'Smart AI Pembelajaran', icon: Sparkles, badge: 'AI Cerdas', isAI: true },
        { id: 'jurnal-presensi', label: 'Jurnal & Presensi', icon: ClipboardCheck, badge: 'GPS / QR' },
        { id: 'tumbuh-kembang', label: currentRole === 'orangtua' ? 'Tumbuh Kembang & Rapor' : 'Tumbuh Kembang & Rapor', icon: Baby, badge: '7 Aspek' },
      ],
    },
    {
      title: currentRole === 'orangtua' ? 'KOMUNIKASI MADRASAH' : 'KEUANGAN & TATA KELOLA',
      items: [
        { id: 'keuangan-bos', label: 'Keuangan & BOS Kemenag', icon: DollarSign, badge: 'SPJ & AI' },
        { id: 'ruang-ortu-guru', label: currentRole === 'orangtua' ? 'Konsultasi Guru & Izin' : 'Ruang Ortu & Guru', icon: MessageSquare, badge: 'Pesan' },
        { id: 'supervisi-kepala', label: 'Supervisi Kepala RA', icon: Award, badge: '5 Alur' },
        { id: 'supervisi-pengawas', label: 'Supervisi Pengawas', icon: ShieldAlert, badge: 'Kemenag' },
        { id: 'pkkm', label: 'PKKM Tahunan & 4 Thn', icon: Award, badge: 'Kemenag' },
        { id: 'administrasi-mutu', label: 'Administrasi & Mutu', icon: Archive, badge: '8 Standar' },
      ],
    },
    {
      title: 'PUBLIKASI & SISTEM',
      items: [
        { id: 'website-publik', label: 'Website Publik RA', icon: Globe, badge: 'Portal' },
        { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings, badge: 'Profil & Data' },
      ],
    },
  ];

  // Strictly filter menu sections according to the active role
  const menuSections = baseMenuSections
    .map(sec => ({
      ...sec,
      items: sec.items.filter(item => allowedTabs.includes(item.id as ActiveTab)),
    }))
    .filter(sec => sec.items.length > 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 h-screen lg:h-[calc(100vh-61px)] w-64 bg-slate-900 text-slate-300 flex flex-col z-50 transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header Branding */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 lg:hidden bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
              RA
            </div>
            <div>
              <div className="font-bold text-sm text-white line-clamp-1">Smart RA Digital</div>
              <div className="text-[10px] text-emerald-400">Integrated Management</div>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
          {menuSections.map((sec, idx) => (
            <div key={idx}>
              <div className="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as ActiveTab);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-md shadow-emerald-900/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition ${
                          isActive 
                            ? 'text-white' 
                            : item.isAI 
                              ? 'text-amber-400 group-hover:text-amber-300' 
                              : 'text-slate-400 group-hover:text-emerald-400'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : item.isAI 
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                              : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px]">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex-1 truncate">
              <div className="text-[10px] text-slate-400">Lembaga Terhubung:</div>
              <div className="font-semibold text-white truncate text-[11px]">{profile.name}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
