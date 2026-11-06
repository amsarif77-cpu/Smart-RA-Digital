import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, UserAccount } from '../types';
import JSZip from 'jszip';
import {
  KeyRound,
  Download,
  Copy,
  Check,
  Server,
  FileArchive,
  ArrowRight,
  UserCheck,
  Shield,
  X,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Eye,
  EyeOff,
  UserPlus,
  Save,
  RotateCcw
} from 'lucide-react';

export const SecretDeployModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'kredensial' | 'deploy'>('kredensial');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPackaging, setIsPackaging] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Account Modal / Form State (Tambah & Edit)
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('guru');

  // Clear demo data confirmation
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const {
    switchRole,
    currentRole,
    profile,
    userAccounts,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    clearAllDemoData,
    resetToDefaultData,
  } = useApp();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddModal = () => {
    setEditingAccount(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('guru');
    setAccountModalOpen(true);
  };

  const handleOpenEditModal = (acc: UserAccount) => {
    setEditingAccount(acc);
    setFormName(acc.name);
    setFormUsername(acc.username);
    setFormPassword(acc.password || '');
    setFormRole(acc.role);
    setAccountModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formName.trim()) {
      alert('Nama dan Username/Email wajib diisi.');
      return;
    }

    if (editingAccount) {
      updateUserAccount({
        ...editingAccount,
        name: formName.trim(),
        username: formUsername.trim(),
        password: formPassword.trim() || editingAccount.password,
        role: formRole,
      });
    } else {
      addUserAccount({
        name: formName.trim(),
        username: formUsername.trim(),
        password: formPassword.trim() || 'ra123456',
        role: formRole,
        isActive: true,
      });
    }
    setAccountModalOpen(false);
  };

  const handleDeleteAccount = (acc: UserAccount) => {
    if (confirm(`Yakin ingin menghapus akun ${acc.name} (${acc.username})?`)) {
      deleteUserAccount(acc.id);
    }
  };

  const handleExecuteClearData = () => {
    clearAllDemoData();
    setShowClearConfirm(false);
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 4000);
  };

  const handleDownloadZipPackage = async () => {
    setIsPackaging(true);
    setDownloadSuccess(false);

    try {
      // 1. Try genuine server-side full source package bundling (includes all code files, runnable via npm start)
      let downloadedViaApi = false;
      try {
        const response = await fetch('/api/deploy/full-source-zip');
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `smart-ra-digital-full-package-${Date.now().toString().slice(-6)}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          downloadedViaApi = true;
        }
      } catch (fetchErr) {
        console.warn('API zip packaging fallback to client:', fetchErr);
      }

      // 2. Client fallback in case of direct static deployment
      if (!downloadedViaApi) {
        const zip = new JSZip();

        // README DEPLOYMENT
        const readmeDeploy = `# PANDUAN DEPLOY MANDIRI 1 FILE ZIP - SMART RA DIGITAL
Lembaga: ${profile.name} (NSM: ${profile.nsm} / NPSN: ${profile.npsn})
Versi Sistem: 2.5.0 Production Ready

=======================================================
METODE 1: UPLOAD & EKSTRAK DI CPANEL / SHARED HOSTING (NODE.JS SELECTOR)
=======================================================
1. Login ke cPanel hosting Anda.
2. Buka menu 'File Manager' lalu arahkan ke folder web (misal: public_html atau subfolder/subdomain).
3. Upload file ZIP ini dan klik kanan -> 'Extract'.
4. Masuk ke cPanel menu 'Setup Node.js App':
   - Node.js Version: 18.x, 20.x, atau 22.x
   - Application Mode: Production
   - Application Root: path folder ekstraksi
   - Application URL: domain/subdomain Anda
   - Application Startup File: server.ts atau server.js
5. Klik 'Run NPM Install'.
6. Klik 'Run JS Script' -> pilih 'build'.
7. Klik tombol 'Restart App'.
8. Aplikasi Smart RA Digital langsung online!

=======================================================
METODE 2: VPS UBUNTU / DEBIAN (NGINX + PM2)
=======================================================
1. Ekstrak zip ke /var/www/smartra
2. Jalankan:
   cd /var/www/smartra
   npm install --omit=dev
   npm run build
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
3. Nginx reverse proxy siap diarahkan ke port 3000.
`;

        const ecosystemConfig = `module.exports = {
  apps: [{
    name: "smart-ra-digital",
    script: "tsx",
    args: "server.ts",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
`;

        const envExample = `PORT=3000
NODE_ENV=production
DISABLE_HMR=true
`;

        const nginxConfig = `server {
    listen 80;
    server_name yourdomain.sch.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

        const deployInfoJson = JSON.stringify({
          appName: "Smart RA Digital",
          schoolName: profile.name,
          nsm: profile.nsm,
          npsn: profile.npsn,
          generatedAt: new Date().toISOString(),
          version: "2.5.0",
          deploymentType: "One-Click Zip Package",
          accounts: userAccounts.map(c => ({
            role: c.role,
            username: c.username,
            defaultPassword: c.password,
            name: c.name,
          }))
        }, null, 2);

        zip.file('README-DEPLOY.md', readmeDeploy);
        zip.file('ecosystem.config.cjs', ecosystemConfig);
        zip.file('.env.example', envExample);
        zip.file('nginx.conf', nginxConfig);
        zip.file('smartra-deploy-manifest.json', deployInfoJson);

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smart-ra-digital-deploy-package-${Date.now().toString().slice(-6)}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Error generating deploy zip:', err);
      alert('Gagal mendownload berkas deploy. Silakan coba lagi.');
    } finally {
      setIsPackaging(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'kepala': return { label: 'Kepala RA', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'guru': return { label: 'Guru Kelas', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'bendahara': return { label: 'Bendahara BOS', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'pengawas': return { label: 'Pengawas Kemenag', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'orangtua': return { label: 'Wali Murid', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'tu': return { label: 'Admin TU', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'yayasan': return { label: 'Ketua Yayasan', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'superadmin': return { label: 'Super Admin', color: 'bg-slate-800 text-white border-slate-700' };
      default: return { label: role, color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  // RBAC Protection: Orang Tua / Wali Murid tidak diizinkan mengakses modal pengaturan sistem / kredensial
  if (currentRole === 'orangtua') {
    return null;
  }

  return (
    <>
      {/* 
        TOMBOL TERSAMAR (DISGUISED BUTTON)
        Tanpa tulisan apapun, letak di footer sebelah kanan bawah
      */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="System Settings & Deploy"
        title=""
        className="fixed bottom-2.5 right-2.5 z-40 p-2 rounded-full text-slate-400/30 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all duration-200 cursor-pointer backdrop-blur-xs focus:outline-none"
      >
        <KeyRound className="w-4 h-4 opacity-30 hover:opacity-100 transition-opacity" />
      </button>

      {/* MODAL PENGATURAN KREDENSIAL, AKUN & DEPLOY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Pusat Akun, Kredensial & Deploy 1-File ZIP
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Smart RA Digital &bull; Kelola Pengguna, Sandi, & Siapkan Go-Live Domain
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 pt-2">
              <button
                onClick={() => setActiveTab('kredensial')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                  activeTab === 'kredensial'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Pengaturan Akun & Sandi ({userAccounts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('deploy')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                  activeTab === 'deploy'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <FileArchive className="w-4 h-4" />
                <span>Deploy 1 File ZIP & Bersihkan Data Real</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'kredensial' ? (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                    <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed max-w-xl">
                      Kelola daftar seluruh akun pengelola RA. Anda dapat <strong>menambah akun baru</strong>, <strong>mengubah username & kata sandi</strong>, <strong>menghapus akun</strong>, atau <strong>beralih peran uji coba</strong> secara instan.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Tambah Akun Baru</span>
                    </button>
                  </div>

                  {/* Account Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {userAccounts.map((acc) => {
                      const isCurrent = currentRole === acc.role;
                      const badge = getRoleBadge(acc.role);
                      const isPasswordShown = showPasswordMap[acc.id] || false;

                      return (
                        <div
                          key={acc.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${badge.color}`}>
                              {badge.label}
                            </span>
                            <div className="flex items-center gap-1">
                              {isCurrent && (
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mr-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  Sedang Digunakan
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(acc)}
                                title="Edit Akun"
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAccount(acc)}
                                title="Hapus Akun"
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-2">
                            {acc.name}
                          </h4>

                          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1.5 mb-3">
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                              <span>Username/Email:</span>
                              <span className="text-slate-900 dark:text-white font-semibold">{acc.username}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                              <span>Sandi:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                                  {isPasswordShown ? acc.password || '••••••••' : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(acc.id)}
                                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                  title={isPasswordShown ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
                                >
                                  {isPasswordShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                switchRole(acc.role);
                                setIsOpen(false);
                              }}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 cursor-default'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              }`}
                            >
                              {isCurrent ? 'Peran Aktif' : 'Masuk Sekarang'}
                              {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(`Username: ${acc.username}\nPassword: ${acc.password || ''}`, acc.id)}
                              title="Salin Kredensial"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              {copiedId === acc.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                    <Server className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                        Sistem Siap Deploy Mandiri ke cPanel, VPS, atau Cloud
                      </h4>
                      <p className="text-xs text-emerald-900/80 dark:text-emerald-300 leading-relaxed">
                        Anda dapat mengunduh paket deploy lengkap dalam 1 file ZIP. Cukup upload ke hosting cPanel, DirectAdmin, atau VPS, ekstrak di folder tujuan, dan sistem langsung dapat diakses online tanpa instalasi rumit.
                      </p>
                    </div>
                  </div>

                  {/* Clear Demo Data for Go-Live Box */}
                  <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/60 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                          Persiapan Go-Live: Kosongkan Data Awal / Contoh
                        </h5>
                        <p className="text-xs text-amber-800 dark:text-amber-400 mt-0.5 leading-relaxed">
                          Saat Anda telah mendeploy aplikasi ini di domain resmi RA Anda, Anda dapat menghapus seluruh data contoh (peserta didik demo, transaksi demo, presensi demo) agar siap diinput dengan data nyata dari awal. Akun pengguna dan profil madrasah akan tetap aman tersimpan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      {!showClearConfirm ? (
                        <button
                          type="button"
                          onClick={() => setShowClearConfirm(true)}
                          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Semua Data Awal / Demo</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-rose-300">
                          <span className="text-xs font-bold text-rose-700">Yakin kosongkan semua data demo?</span>
                          <button
                            type="button"
                            onClick={handleExecuteClearData}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Ya, Hapus Sekarang
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowClearConfirm(false)}
                            className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      )}

                      {clearSuccess && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-600" />
                          Data awal berhasil dikosongkan! Database siap diisi data real.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3 Step Deployment Guide */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      3 Langkah Deploy Cepat (cPanel & Shared Hosting):
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                          1
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                          Upload 1 File ZIP
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Buka cPanel File Manager, upload file ZIP ke folder <code>public_html</code> atau subdomain Anda.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                          2
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                          Ekstrak File
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Klik kanan pada file ZIP di File Manager cPanel, pilih opsi <strong>Extract</strong>.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                          3
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                          Aktifkan Node.js App
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Buka menu 'Setup Node.js App' di cPanel, klik 'Run NPM Install' & 'Run Build'. Selesai!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Download Action Box */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          Unduh Paket Deploy 1-File ZIP
                        </h4>
                        <p className="text-xs text-emerald-100 mt-0.5">
                          Termasuk konfigurasi PM2, Nginx reverse proxy, dan panduan lengkap.
                        </p>
                      </div>
                      <FileArchive className="w-10 h-10 text-emerald-200 opacity-80" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleDownloadZipPackage}
                        disabled={isPackaging}
                        className="py-2.5 px-5 rounded-xl bg-white text-emerald-800 font-bold text-xs flex items-center gap-2 hover:bg-emerald-50 active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-60"
                      >
                        {isPackaging ? (
                          <>
                            <span className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></span>
                            Sedang Mengompres Paket ZIP...
                          </>
                        ) : downloadSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-700" />
                            File ZIP Berhasil Diunduh!
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Unduh 1 File ZIP Deploy Sekarang
                          </>
                        )}
                      </button>

                      <span className="text-[11px] text-emerald-100">
                        Format: .ZIP siap ekstrak &bull; Ukuran ringan &bull; 100% Mandiri
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Smart RA Digital v2.5.0 &bull; Single-File Deploy Ready</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT AKUN */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {editingAccount ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
              </h4>
              <button
                type="button"
                onClick={() => setAccountModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Pemilik Akun:
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Misal: Dra. Hj. Siti Fatimah, M.Pd.I"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username / Email Login:
                </label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={e => setFormUsername(e.target.value)}
                  placeholder="kepala@smartra.sch.id atau sitifatimah"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi:
                </label>
                <input
                  type="text"
                  required={!editingAccount}
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  placeholder={editingAccount ? 'Biarkan kosong jika tidak diubah' : 'Minimal 6 karakter'}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Peran & Hak Akses:
                </label>
                <select
                  value={formRole}
                  onChange={e => setFormRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="kepala">Kepala RA (Pimpinan & Supervisi)</option>
                  <option value="guru">Guru Kelas (RPPH, Jurnal, Presensi, Asesmen)</option>
                  <option value="bendahara">Bendahara (Buku Kas, RKRA & BOS Kemenag)</option>
                  <option value="pengawas">Pengawas Kemenag (Supervisi & Mutu)</option>
                  <option value="orangtua">Orang Tua / Wali Murid (Rapor & Jemput)</option>
                  <option value="tu">Admin TU / Tata Usaha (Buku Induk, PPDB & Sarpras)</option>
                  <option value="yayasan">Ketua Yayasan (Monitoring & Aset)</option>
                  <option value="superadmin">Super Administrator (Akses Penuh)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Akun</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
