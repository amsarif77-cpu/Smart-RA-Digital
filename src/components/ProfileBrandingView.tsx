import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolProfile, VisionGoal, SchoolProgram, SchoolAchievement } from '../types';
import {
  School,
  Upload,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Sparkles,
  Image as ImageIcon,
  Database,
  Edit3,
  X
} from 'lucide-react';
import { BackupRestoreView } from './BackupRestoreView';

export const ProfileBrandingView: React.FC = () => {
  const {
    profile,
    updateProfile,
    visionGoals,
    updateVisionGoals,
    updateLogo,
    removeLogo,
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    users,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profil' | 'logo' | 'visi-misi' | 'program-prestasi' | 'backup-restore'>('profil');
  const [formData, setFormData] = useState<SchoolProfile>(profile);
  const [vgData, setVgData] = useState<VisionGoal>(visionGoals);
  const [savedNotification, setSavedNotification] = useState(false);
  const [logoUrlInput, setLogoUrlInput] = useState(profile.logoUrl || '');

  // Program Modal State
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<SchoolProgram | null>(null);
  const [pJudul, setPJudul] = useState('');
  const [pDeskripsi, setPDeskripsi] = useState('');
  const [pTarget, setPTarget] = useState('');

  // Achievement Modal State
  const [achModalOpen, setAchModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<SchoolAchievement | null>(null);
  const [aJudul, setAJudul] = useState('');
  const [aKategori, setAKategori] = useState('');
  const [aTahun, setATahun] = useState('2026');
  const [aPeserta, setAPeserta] = useState('');
  const [aPenyelenggara, setAPenyelenggara] = useState('');

  // Logo upload simulation / FileReader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateLogo(reader.result);
          setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
          triggerSaved();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSaved = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    triggerSaved();
  };

  const handleSaveVisionGoals = () => {
    updateVisionGoals(vgData);
    triggerSaved();
  };

  // Missions helper
  const addMission = () => {
    setVgData(prev => ({
      ...prev,
      missions: [...prev.missions, 'Misi baru penguatan karakter islami dan mutu RA.'],
    }));
  };

  const updateMission = (index: number, val: string) => {
    const updated = [...vgData.missions];
    updated[index] = val;
    setVgData(prev => ({ ...prev, missions: updated }));
  };

  const removeMission = (index: number) => {
    setVgData(prev => ({
      ...prev,
      missions: prev.missions.filter((_, i) => i !== index),
    }));
  };

  // Goals helper
  const addGoal = () => {
    setVgData(prev => ({
      ...prev,
      goals: [...prev.goals, 'Tujuan baru penyelenggaraan layanan RA bermutu.'],
    }));
  };

  const updateGoal = (index: number, val: string) => {
    const updated = [...vgData.goals];
    updated[index] = val;
    setVgData(prev => ({ ...prev, goals: updated }));
  };

  const removeGoal = (index: number) => {
    setVgData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <School className="w-4 h-4" />
            <span>Identitas Kelembagaan & Branding</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Profil RA & Branding Aplikasi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil resmi lembaga, upload logo, visi misi, program unggulan, dan prestasi RA Anda.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('profil')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition ${
            activeTab === 'profil'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Identitas Profil RA
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'logo'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Logo RA</span>
        </button>
        <button
          onClick={() => setActiveTab('visi-misi')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition ${
            activeTab === 'visi-misi'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Visi, Misi dan Tujuan
        </button>
        <button
          onClick={() => setActiveTab('program-prestasi')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition ${
            activeTab === 'program-prestasi'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Program Unggulan & Prestasi
        </button>
        <button
          onClick={() => setActiveTab('backup-restore')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'backup-restore'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Backup & Restore Data</span>
        </button>
      </div>

      {/* Tab 1: Identitas Profil RA */}
      {activeTab === 'profil' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap RA *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Yayasan / Penyelenggara *</label>
              <input
                type="text"
                value={formData.foundation}
                onChange={e => setFormData({ ...formData, foundation: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NSM (Nomor Statistik Madrasah) *</label>
              <input
                type="text"
                value={formData.nsm}
                onChange={e => setFormData({ ...formData, nsm: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN (Nomor Pokok Sekolah Nasional) *</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Kelembagaan</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Swasta">Swasta</option>
                <option value="Negeri">Negeri</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Akreditasi BAN-PDM / Kemenag</label>
              <select
                value={formData.accreditation}
                onChange={e => setFormData({ ...formData, accreditation: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="A (Unggul)">A (Unggul)</option>
                <option value="B (Baik)">B (Baik)</option>
                <option value="C">C</option>
                <option value="Proses Akreditasi">Proses Akreditasi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala RA *</label>
              <input
                type="text"
                value={formData.headmasterName}
                onChange={e => setFormData({ ...formData, headmasterName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala RA (Jika Ada)</label>
              <input
                type="text"
                value={formData.headmasterNip || ''}
                onChange={e => setFormData({ ...formData, headmasterNip: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Berdiri</label>
              <input
                type="text"
                value={formData.establishedYear}
                onChange={e => setFormData({ ...formData, establishedYear: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motto RA</label>
              <input
                type="text"
                value={formData.motto}
                onChange={e => setFormData({ ...formData, motto: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden italic"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <textarea
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sejarah Singkat RA</label>
              <textarea
                value={formData.history}
                onChange={e => setFormData({ ...formData, history: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Lembaga</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Upload Logo RA */}
      {activeTab === 'logo' && (
        <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200 space-y-6">
          <div className="max-w-2xl space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Upload Logo Resmi Raudlatul Athfal</h3>
              <p className="text-xs text-slate-500 mt-1">
                Logo resmi RA yang Anda unggah akan secara otomatis menjadi identitas visual utama Smart RA Digital. Logo tampil di navbar, halaman login, kop surat, rapor siswa, berita acara supervisi, dan kartu bukti pendaftaran PPDB.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center sm:text-left">
              <div className="w-28 h-28 rounded-2xl bg-white p-2 shadow-sm border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo RA"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 stroke-1" />
                    <span className="text-[10px]">Tanpa Logo</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 flex-1 w-full">
                <div>
                  <div className="font-semibold text-xs text-slate-800">Kelola Berkas Logo Resmi RA</div>
                  <div className="text-[11px] text-slate-500">Mendukung format PNG transparan, JPG, atau WebP (Disarankan rasio 1:1, maks 2MB).</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition">
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo dari Galeri</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin MENGHAPUS LOGO KOP? Kop surat dan rapor akan menggunakan kop teks standar.')) {
                          removeLogo();
                          setFormData(prev => ({ ...prev, logoUrl: '' }));
                          setLogoUrlInput('');
                          triggerSaved();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs rounded-xl transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>Hapus Logo Kop</span>
                    </button>
                  )}
                </div>

                {/* Direct URL alternative */}
                <div className="pt-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Atau masukkan tautan / URL logo langsung:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={logoUrlInput}
                      onChange={e => setLogoUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (logoUrlInput.trim()) {
                          updateLogo(logoUrlInput.trim());
                          setFormData(prev => ({ ...prev, logoUrl: logoUrlInput.trim() }));
                          triggerSaved();
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                    >
                      Terapkan URL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview across contexts */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-3">Pratinjau Tampilan Logo & Kemasan Alamat Panjang di Kop Surat:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Navbar mockup */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">1. Header Aplikasi & Navbar</div>
                  <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="logo" className="w-7 h-7 object-contain rounded" />
                    ) : (
                      <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">RA</div>
                    )}
                    <div>
                      <div className="font-bold text-xs text-slate-800">{formData.name}</div>
                      <div className="text-[9px] text-slate-500">NSM: {formData.nsm}</div>
                    </div>
                  </div>
                </div>

                {/* Kop Surat mockup with line wrapping for long addresses */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">2. Kop Surat & Rapor Digital (Auto Kemas ke Bawah)</div>
                  <div className="flex items-center gap-3 p-3 border-b-2 border-slate-800 bg-slate-50/50 rounded-lg">
                    {formData.logoUrl && (
                      <img src={formData.logoUrl} alt="logo" className="w-10 h-10 object-contain shrink-0" />
                    )}
                    <div className="text-center flex-1 min-w-0">
                      <div className="font-bold text-[10px] text-slate-900 uppercase leading-snug">{formData.foundation}</div>
                      <div className="font-extrabold text-xs text-emerald-950 uppercase leading-snug">{formData.name}</div>
                      {/* Responsive wrapping when location address is long */}
                      <div className="text-[9px] text-slate-600 font-sans leading-tight break-words whitespace-normal max-w-xs mx-auto mt-0.5">
                        {formData.address} • Telp: {formData.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Visi Misi dan Tujuan */}
      {activeTab === 'visi-misi' && (
        <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200 space-y-6">
          {/* Visi */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Visi Raudlatul Athfal</span>
            </label>
            <textarea
              value={vgData.vision}
              onChange={e => setVgData({ ...vgData, vision: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-800"
            />
          </div>

          {/* Misi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Misi Raudlatul Athfal ({vgData.missions.length} Poin)</span>
              </label>
              <button
                type="button"
                onClick={addMission}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Misi</span>
              </button>
            </div>

            <div className="space-y-2">
              {vgData.missions.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-6 h-8 flex items-center justify-center font-bold text-xs text-slate-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={m}
                    onChange={e => updateMission(idx, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => removeMission(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                    title="Hapus Misi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tujuan */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Tujuan Utama Penyelenggaraan RA ({vgData.goals.length} Poin)</span>
              </label>
              <button
                type="button"
                onClick={addGoal}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tujuan</span>
              </button>
            </div>

            <div className="space-y-2">
              {vgData.goals.map((g, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-6 h-8 flex items-center justify-center font-bold text-xs text-slate-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={g}
                    onChange={e => updateGoal(idx, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => removeGoal(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                    title="Hapus Tujuan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleSaveVisionGoals}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Visi, Misi dan Tujuan</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Program Unggulan & Prestasi (CRUD Lengkap: Tambah, Edit, Hapus) */}
      {activeTab === 'program-prestasi' && (
        <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200 space-y-8">
          
          {/* Section 1: Program Unggulan */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Program Unggulan RA
                </h3>
                <p className="text-xs text-slate-500">Program distingtif yang menjadi keunggulan kompetitif madrasah (dapat ditambah, diedit, atau dihapus).</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProgram(null);
                  setPJudul('');
                  setPDeskripsi('');
                  setPTarget('');
                  setProgramModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Program Unggulan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {programs.map((prg, index) => (
                <div
                  key={prg.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/60 hover:bg-white transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProgram(prg);
                            setPJudul(prg.judul);
                            setPDeskripsi(prg.deskripsi);
                            setPTarget(prg.target || '');
                            setProgramModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded hover:bg-emerald-50 transition cursor-pointer"
                          title="Edit Program"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus program "${prg.judul}"?`)) {
                              deleteProgram(prg.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition cursor-pointer"
                          title="Hapus Program"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1.5">{prg.judul}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">{prg.deskripsi}</p>
                  </div>
                  {prg.target && (
                    <div className="pt-2 border-t border-slate-200/80 text-[10px] text-emerald-800 font-medium">
                      Sasaran: {prg.target}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Prestasi Madrasah */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Dokumentasi Prestasi Terkini
                </h3>
                <p className="text-xs text-slate-500">Capaian kejuaraan peserta didik dan madrasah (dapat ditambah, diedit, atau dihapus).</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingAch(null);
                  setAJudul('');
                  setAKategori('Keagamaan & Tahfidz');
                  setATahun(new Date().getFullYear().toString());
                  setAPeserta('');
                  setAPenyelenggara('');
                  setAchModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Prestasi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-white transition-all flex items-start justify-between gap-3 group shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {ach.tahun}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {ach.kategori}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{ach.judul}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {ach.peserta} &bull; <span className="text-slate-500">{ach.penyelenggara}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAch(ach);
                        setAJudul(ach.judul);
                        setAKategori(ach.kategori);
                        setATahun(ach.tahun);
                        setAPeserta(ach.peserta);
                        setAPenyelenggara(ach.penyelenggara);
                        setAchModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-700 rounded hover:bg-amber-50 transition cursor-pointer"
                      title="Edit Prestasi"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus prestasi "${ach.judul}"?`)) {
                          deleteAchievement(ach.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition cursor-pointer"
                      title="Hapus Prestasi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Form Tambah/Edit Program Unggulan */}
          {programModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {editingProgram ? 'Edit Program Unggulan' : 'Tambah Program Unggulan Baru'}
                  </h4>
                  <button
                    onClick={() => setProgramModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Judul Program</label>
                    <input
                      type="text"
                      value={pJudul}
                      onChange={e => setPJudul(e.target.value)}
                      placeholder="Contoh: Tahfidz Ceria Juz 30"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kegiatan</label>
                    <textarea
                      rows={3}
                      value={pDeskripsi}
                      onChange={e => setPDeskripsi(e.target.value)}
                      placeholder="Uraian metode, keunggulan, dan aktivitas program..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sasaran Peserta Didik / Sentra</label>
                    <input
                      type="text"
                      value={pTarget}
                      onChange={e => setPTarget(e.target.value)}
                      placeholder="Contoh: Seluruh peserta didik Kelompok A & B"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProgramModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!pJudul.trim()) {
                        alert('Harap isi judul program');
                        return;
                      }
                      if (editingProgram) {
                        updateProgram({
                          ...editingProgram,
                          judul: pJudul,
                          deskripsi: pDeskripsi,
                          target: pTarget,
                        });
                      } else {
                        addProgram({
                          nomor: programs.length + 1,
                          judul: pJudul,
                          deskripsi: pDeskripsi,
                          target: pTarget,
                        });
                      }
                      setProgramModalOpen(false);
                      triggerSaved();
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm cursor-pointer"
                  >
                    Simpan Program
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Form Tambah/Edit Prestasi */}
          {achModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {editingAch ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
                  </h4>
                  <button
                    onClick={() => setAchModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Prestasi / Juara</label>
                    <input
                      type="text"
                      value={aJudul}
                      onChange={e => setAJudul(e.target.value)}
                      placeholder="Contoh: Juara 1 Tahfidz Qur'an Juz 30"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                      <input
                        type="text"
                        value={aKategori}
                        onChange={e => setAKategori(e.target.value)}
                        placeholder="Contoh: Keagamaan & Tahfidz"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tahun</label>
                      <input
                        type="text"
                        value={aTahun}
                        onChange={e => setATahun(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Penerima / Peserta Didik / Lembaga</label>
                    <input
                      type="text"
                      value={aPeserta}
                      onChange={e => setAPeserta(e.target.value)}
                      placeholder="Contoh: Ananda Muhammad Rayyan / RA Al-Azhar"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Penyelenggara Lomba / Apresiasi</label>
                    <input
                      type="text"
                      value={aPenyelenggara}
                      onChange={e => setAPenyelenggara(e.target.value)}
                      placeholder="Contoh: Porseni IGRA / Kemenag Kota"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAchModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!aJudul.trim()) {
                        alert('Harap isi nama prestasi');
                        return;
                      }
                      if (editingAch) {
                        updateAchievement({
                          ...editingAch,
                          judul: aJudul,
                          kategori: aKategori,
                          tahun: aTahun,
                          peserta: aPeserta,
                          penyelenggara: aPenyelenggara,
                        });
                      } else {
                        addAchievement({
                          judul: aJudul,
                          kategori: aKategori,
                          tahun: aTahun,
                          peserta: aPeserta,
                          penyelenggara: aPenyelenggara,
                        });
                      }
                      setAchModalOpen(false);
                      triggerSaved();
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm cursor-pointer"
                  >
                    Simpan Prestasi
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 5: Backup & Restore */}
      {activeTab === 'backup-restore' && (
        <div className="pt-2">
          <BackupRestoreView />
        </div>
      )}
    </div>
  );
};
