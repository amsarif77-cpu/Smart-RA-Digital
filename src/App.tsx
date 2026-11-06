import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab, ROLE_ALLOWED_TABS } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProfileBrandingView } from './components/ProfileBrandingView';
import { BukuIndukView } from './components/BukuIndukView';
import { PPDBKelasView } from './components/PPDBKelasView';
import { AkademikKurikulumView } from './components/AkademikKurikulumView';
import { SmartAIPembelajaranView } from './components/SmartAIPembelajaranView';
import { JurnalPresensiView } from './components/JurnalPresensiView';
import { TumbuhKembangRaporView } from './components/TumbuhKembangRaporView';
import { KeuanganBOSView } from './components/KeuanganBOSView';
import { RuangOrtuGuruView } from './components/RuangOrtuGuruView';
import { SupervisiKepalaView } from './components/SupervisiKepalaView';
import { SupervisiPengawasView } from './components/SupervisiPengawasView';
import { PKKMView } from './components/PKKMView';
import { AdministrasiMutuView } from './components/AdministrasiMutuView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { WebsitePublikView } from './components/WebsitePublikView';
import { PrintCenterModal } from './components/PrintCenterModal';
import { SecretDeployModal } from './components/SecretDeployModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [printCenterOpen, setPrintCenterOpen] = useState(false);
  const { currentRole, profile } = useApp();

  // Strict RBAC: Check if current tab is permitted for the active role
  const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || ROLE_ALLOWED_TABS.orangtua;
  const isTabPermitted = allowedTabs.includes(activeTab);

  // Automatically reset to dashboard if activeTab is not permitted for the newly switched role
  React.useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [currentRole, allowedTabs, activeTab]);

  // If viewing website publik directly
  if (activeTab === 'website-publik') {
    return (
      <WebsitePublikView
        onBackToApp={() => setActiveTab('dashboard')}
        onOpenPPDB={() => {
          if (allowedTabs.includes('ppdb-kelas')) {
            setActiveTab('ppdb-kelas');
          } else {
            setActiveTab('dashboard');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenPublicSite={() => setActiveTab('website-publik')}
        onOpenPrintCenter={() => setPrintCenterOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Strict RBAC Guard: If role is not allowed to view the tab, render security guard */}
            {!isTabPermitted ? (
              <div className="bg-white rounded-3xl p-8 border border-rose-200 text-center max-w-lg mx-auto my-12 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Akses Menu Dibatasi (RBAC)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Peran Anda saat ini (<span className="font-semibold text-rose-700 capitalize">{currentRole}</span>) tidak memiliki izin untuk membuka modul ini.
                  </p>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left leading-relaxed">
                  {currentRole === 'orangtua' ? (
                    <span>
                      Akun <strong>Orang Tua / Wali Murid</strong> memiliki akses khusus yang aman dan terfokus pada:
                      <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-slate-700">
                        <li>Dashboard Wali Murid & status presensi ananda</li>
                        <li>Portofolio Tumbuh Kembang & Lembar Rapor Digital</li>
                        <li>Ruang Konsultasi Guru & Pengajuan Izin Sakit</li>
                      </ul>
                    </span>
                  ) : (
                    <span>Modul ini hanya dapat diakses oleh peran pengelola madrasah yang berwenang.</span>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Dashboard Utama</span>
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
                {activeTab === 'profil' && <ProfileBrandingView />}
                {activeTab === 'buku-induk' && <BukuIndukView />}
                {activeTab === 'ppdb-kelas' && <PPDBKelasView />}
                {activeTab === 'akademik' && <AkademikKurikulumView />}
                {activeTab === 'smart-ai' && <SmartAIPembelajaranView />}
                {activeTab === 'jurnal-presensi' && <JurnalPresensiView />}
                {activeTab === 'tumbuh-kembang' && <TumbuhKembangRaporView />}
                {activeTab === 'keuangan-bos' && <KeuanganBOSView onBack={() => setActiveTab('dashboard')} />}
                {activeTab === 'ruang-ortu-guru' && <RuangOrtuGuruView />}
                {activeTab === 'supervisi-kepala' && <SupervisiKepalaView />}
                {activeTab === 'supervisi-pengawas' && <SupervisiPengawasView />}
                {activeTab === 'pkkm' && <PKKMView />}
                {activeTab === 'administrasi-mutu' && <AdministrasiMutuView />}
                {activeTab === 'backup-restore' && <BackupRestoreView />}
                {activeTab === 'pengaturan' && <ProfileBrandingView />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Print Center Modal */}
      <PrintCenterModal
        isOpen={printCenterOpen}
        onClose={() => setPrintCenterOpen(false)}
      />

      {/* Secret Disguised Tool in Footer Bottom-Right (No Text, 1-Click ZIP & Credentials) */}
      <SecretDeployModal />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
