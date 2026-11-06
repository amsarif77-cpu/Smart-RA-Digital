import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PPDBApplicant, ClassGroup, PPDBInquiry } from '../types';
import {
  GraduationCap,
  UserPlus,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  Check,
  X,
  Plus,
  Edit3,
  Trash2,
  MessageCircle,
  Phone,
  FileSpreadsheet,
  Download,
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const PPDBKelasView: React.FC = () => {
  const {
    ppdbList,
    addPPDB,
    updatePPDB,
    acceptApplicantToStudent,
    students,
    employees,
    profile,
    classes,
    addClass,
    updateClass,
    deleteClass,
    ppdbInquiries,
    updatePPDBInquiry,
    deletePPDBInquiry,
    ppdbTargetYear,
    setPpdbTargetYear,
  } = useApp();

  type TabType = 'pendaftar' | 'konsultasi' | 'rombel' | 'formulir';
  const [activeTab, setActiveTab] = useState<TabType>('pendaftar');
  const [selectedApplicant, setSelectedApplicant] = useState<PPDBApplicant | null>(null);

  // New applicant form state
  const [newApplicant, setNewApplicant] = useState({
    namaAnak: '',
    jk: 'L' as 'L' | 'P',
    nik: '',
    tempatTanggalLahir: 'Bandung, 10 Januari 2021',
    namaAyah: '',
    pekerjaanAyah: '',
    namaIbu: '',
    noHpOrtu: '',
    alamat: '',
    kelompokPilihan: 'A (4-5 Tahun)' as 'A (4-5 Tahun)' | 'B (5-6 Tahun)',
    catatan: '',
  });

  const [conversionTargetClass, setConversionTargetClass] = useState(classes[0]?.name || 'Kelompok A1 (Khadijah)');
  const [convertModalApplicant, setConvertModalApplicant] = useState<PPDBApplicant | null>(null);

  // Dynamic Class/Rombel Modal State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);
  const [classForm, setClassForm] = useState<Omit<ClassGroup, 'id'>>({
    name: 'Kelompok A3 (Aisyah)',
    ageGroup: 'Usia 4-5 Tahun',
    teacher: employees[1]?.nama || 'Guru Nurul Hidayah, S.Pd.I',
    coTeacher: 'Guru Pendamping',
    quota: 18,
  });

  const handleRegisterPPDB = (e: React.FormEvent) => {
    e.preventDefault();
    addPPDB(newApplicant);
    alert('Pendaftaran PPDB Berhasil! Nomor Pendaftaran telah diterbitkan.');
    setActiveTab('pendaftar');
  };

  const handleConfirmConvert = () => {
    if (convertModalApplicant) {
      acceptApplicantToStudent(convertModalApplicant.id, conversionTargetClass);
      alert(`Ananda ${convertModalApplicant.namaAnak} berhasil dikonversi menjadi Peserta Didik Aktif di ${conversionTargetClass}! Data otomatis tersimpan di Buku Induk.`);
      setConvertModalApplicant(null);
    }
  };

  // Class / Rombel Save or Update
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateClass({
        ...classForm,
        id: editingClass.id,
      });
    } else {
      addClass(classForm);
    }
    setIsClassModalOpen(false);
    setEditingClass(null);
  };

  const handleOpenEditClass = (c: ClassGroup) => {
    setEditingClass(c);
    setClassForm({
      name: c.name,
      ageGroup: c.ageGroup,
      teacher: c.teacher,
      coTeacher: c.coTeacher || '',
      quota: c.quota,
    });
    setIsClassModalOpen(true);
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Rombel "${name}"? Pastikan tidak ada peserta didik yang tertinggal di rombel ini.`)) {
      deleteClass(id);
    }
  };

  // Convert Consultation Inquiry directly to PPDB Applicant
  const handleConvertInquiryToPPDB = (inquiry: PPDBInquiry) => {
    addPPDB({
      namaAnak: inquiry.namaAnak,
      jk: 'L',
      nik: '3273' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      tempatTanggalLahir: `Bandung, ${inquiry.usia.includes('4') ? '12 Maret 2021' : '15 Mei 2020'}`,
      namaAyah: inquiry.namaOrtu,
      pekerjaanAyah: 'Wiraswasta / Pegawai',
      namaIbu: 'Ibu ' + inquiry.namaOrtu.split(' ')[0],
      noHpOrtu: inquiry.noHp,
      alamat: 'Jl. Gegerkalong Hilir Bandung',
      kelompokPilihan: inquiry.usia.includes('4') ? 'A (4-5 Tahun)' : 'B (5-6 Tahun)',
      catatan: `Hasil konsultasi web: "${inquiry.pesan || '-'}"`,
    });
    updatePPDBInquiry({
      ...inquiry,
      status: 'Daftar Resmi PPDB',
    });
    alert(`Data ananda ${inquiry.namaAnak} berhasil dipindahkan ke Daftar Pendaftar Resmi PPDB!`);
    setActiveTab('pendaftar');
  };

  // Export CSV functions
  const downloadBlob = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPPDBListCsv = () => {
    const headers = 'NoPendaftaran,NamaAnak,JK,Kelompok,NamaOrtu,NoHP,Alamat,Status,TanggalDaftar\n';
    const rows = ppdbList.map(p =>
      `"${p.noPendaftaran}","${p.namaAnak}","${p.jk}","${p.kelompokPilihan}","${p.namaAyah} / ${p.namaIbu}","${p.noHpOrtu}","${p.alamat}","${p.status}","${p.tanggalDaftar}"`
    ).join('\n');
    downloadBlob(headers + rows, `Data_PPDB_${profile.name.replace(/\s+/g, '_')}.csv`);
  };

  const exportInquiriesCsv = () => {
    const headers = 'Tanggal,NamaOrtu,NamaAnak,Usia,NoWhatsApp,Pertanyaan,Status\n';
    const rows = ppdbInquiries.map(i =>
      `"${i.tanggal}","${i.namaOrtu}","${i.namaAnak}","${i.usia}","${i.noHp}","${i.pesan || '-'}","${i.status}"`
    ).join('\n');
    downloadBlob(headers + rows, `Konsultasi_PPDB_Web_${profile.name.replace(/\s+/g, '_')}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Penerimaan Peserta Didik Baru & Pengelolaan Rombel</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">PPDB Online, Konsultasi & Manajemen Kelas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registrasi calon peserta didik baru, pantau konsultasi masuk dari web publik, konversi ke buku induk, dan kelola rombel secara dinamis.
          </p>

          {/* Requirement 5: Pengaturan Tahun Pelajaran PPDB yang Dibuka (2027/2028) */}
          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-emerald-950">Tahun Penerimaan:</span>
              <select
                value={ppdbTargetYear}
                onChange={e => setPpdbTargetYear(e.target.value)}
                className="bg-white border border-emerald-300 text-emerald-900 font-bold text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2027/2028">2027/2028 (Tahun Ajaran Baru)</option>
                <option value="2028/2029">2028/2029</option>
                <option value="2029/2030">2029/2030</option>
              </select>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-700 text-white shadow-xs">
              PPDB {ppdbTargetYear} RESMI DIBUKA
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'pendaftar' && (
            <button
              onClick={exportPPDBListCsv}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel Pendaftar</span>
            </button>
          )}

          {activeTab === 'rombel' && (
            <button
              onClick={() => {
                setEditingClass(null);
                setClassForm({
                  name: `Kelompok B${classes.length + 1}`,
                  ageGroup: 'Usia 5-6 Tahun',
                  teacher: employees[1]?.nama || 'Guru Kelas',
                  coTeacher: 'Guru Pendamping',
                  quota: 20,
                });
                setIsClassModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Rombel Baru</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('formulir')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Formulir PPDB Baru</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-2xs gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pendaftar')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pendaftar'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>Data Calon Peserta Didik ({ppdbList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('konsultasi')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'konsultasi'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-amber-500" />
          <span>Konsultasi & Minat Calon Peserta Didik ({ppdbInquiries.length})</span>
          {ppdbInquiries.filter(i => i.status === 'Menunggu Follow-up').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('rombel')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'rombel'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Kelola Kelas & Rombel ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('formulir')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'formulir'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4 text-emerald-600" />
          <span>Formulir Pendaftaran Manual</span>
        </button>
      </div>

      {/* TAB 1: PENDAFTAR PPDB */}
      {activeTab === 'pendaftar' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Daftar Formulir Calon Peserta Didik Terdaftar</span>
            <span className="text-slate-500">{ppdbList.length} berkas terverifikasi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">No. Pendaftaran</th>
                  <th className="px-4 py-3">Calon Peserta Didik</th>
                  <th className="px-3 py-3">Pilihan Kelompok</th>
                  <th className="px-3 py-3">Orang Tua / Kontak</th>
                  <th className="px-3 py-3">Status Verifikasi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ppdbList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Belum ada pendaftaran PPDB.
                    </td>
                  </tr>
                ) : (
                  ppdbList.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                        {app.noPendaftaran}
                        <div className="text-[10px] text-slate-400 font-normal">{app.tanggalDaftar}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{app.namaAnak}</div>
                        <div className="text-slate-500 text-[11px]">
                          {app.jk === 'L' ? 'Laki-laki' : 'Perempuan'} &bull; {app.tempatTanggalLahir}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {app.kelompokPilihan}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-800">{app.namaAyah} / {app.namaIbu}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{app.noHpOrtu}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          app.status === 'diterima'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'terverifikasi'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status === 'diterima' ? 'Diterima di RA' : app.status === 'terverifikasi' ? 'Lulus Observasi' : 'Menunggu Observasi'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {app.status !== 'diterima' ? (
                            <button
                              onClick={() => {
                                setConvertModalApplicant(app);
                                setConversionTargetClass(classes[0]?.name || 'Kelompok A1 (Khadijah)');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition"
                            >
                              Terima & Masukkan Kelas
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                              <Check className="w-3.5 h-3.5" /> Sudah di Buku Induk
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: KONSULTASI & MINAT CALON PESERTA DIDIK (Jawab tuntas: "konsultasi ppdb iti tersimpan dimana?") */}
      {activeTab === 'konsultasi' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm">Penyimpanan & Manajemen Konsultasi PPDB Web Publik</h4>
              </div>
              <p className="text-xs text-teal-100 mt-1 max-w-2xl">
                Setiap orang tua yang mengisi formulir konsultasi cepat di Website Publik RA tersimpan secara aman di sini. Anda dapat langsung mengirim pesan WhatsApp, menandai tindak lanjut, atau memindahkannya ke pendaftar resmi PPDB hanya dengan 1 kali klik.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-teal-200">Total Minat Masuk:</span>
              <div className="text-2xl font-black text-amber-300">{ppdbInquiries.length} Calon</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Daftar Pertanyaan & Minat Calon Peserta Didik Baru</span>
              <span className="text-slate-500">{ppdbInquiries.length} data tersimpan</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Tanggal / Jam</th>
                    <th className="px-3 py-3">Orang Tua (Ayah / Bunda)</th>
                    <th className="px-3 py-3">Nama Calon Anak & Usia</th>
                    <th className="px-3 py-3">Pesan / Pertanyaan Konsultasi</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Tindak Lanjut & Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ppdbInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        Belum ada pertanyaan atau konsultasi masuk dari Website Publik.
                      </td>
                    </tr>
                  ) : (
                    ppdbInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                          {inquiry.tanggal}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-slate-900">{inquiry.namaOrtu}</div>
                          <a
                            href={`https://wa.me/${inquiry.noHp.replace(/^0/, '62').replace(/\D/g, '')}?text=Assalamu%20alaikum%20Ayah/Bunda%20${encodeURIComponent(inquiry.namaOrtu)},%20kami%20dari%20RA%20${encodeURIComponent(profile.name)}%20menindaklanjuti%20konsultasi%20PPDB%20untuk%20ananda%20${encodeURIComponent(inquiry.namaAnak)}.`}
                            target="_blank"
                            rel="noreferrer"
                            title="Klik untuk Chat WhatsApp (WA Web / WA on PC / HP)"
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-mono flex items-center gap-1 mt-0.5 underline cursor-pointer"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{inquiry.noHp}</span>
                          </a>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-semibold text-slate-800">{inquiry.namaAnak}</div>
                          <span className="px-1.5 py-0.2 bg-teal-50 text-teal-800 border border-teal-200 rounded text-[10px] font-medium">
                            {inquiry.usia}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-600 max-w-xs">
                          <p className="italic text-[11px]">"{inquiry.pesan || '-'}"</p>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inquiry.status === 'Daftar Resmi PPDB'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inquiry.status === 'Sudah Dihubungi via WA'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <a
                              href={`https://wa.me/${inquiry.noHp.replace(/^0/, '62').replace(/\D/g, '')}?text=Assalamu%20alaikum%20Ayah/Bunda%20${encodeURIComponent(inquiry.namaOrtu)},%20kami%20dari%20RA%20${encodeURIComponent(profile.name)}%20menindaklanjuti%20konsultasi%20PPDB%20untuk%20ananda%20${encodeURIComponent(inquiry.namaAnak)}.`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                updatePPDBInquiry({ ...inquiry, status: 'Sudah Dihubungi via WA' });
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
                              title="Kirim Pesan WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Hubungi WA</span>
                            </a>

                            {inquiry.status !== 'Daftar Resmi PPDB' && (
                              <button
                                onClick={() => handleConvertInquiryToPPDB(inquiry)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-lg text-[10px] transition"
                                title="Jadikan Pendaftar Resmi PPDB"
                              >
                                + PPDB
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (confirm('Hapus data konsultasi ini?')) {
                                  deletePPDBInquiry(inquiry.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                              title="Hapus"
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

      {/* TAB 3: KELOLA KELAS & ROMBEL (FULL CRUD: TAMBAH, EDIT, HAPUS) */}
      {activeTab === 'rombel' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => {
              const currentStudentsCount = students.filter(s => s.kelas.toLowerCase().includes(cls.name.toLowerCase()) || cls.name.toLowerCase().includes(s.kelas.toLowerCase())).length;
              const fillPct = Math.round((currentStudentsCount / cls.quota) * 100);

              return (
                <div key={cls.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <h3 className="font-bold text-slate-900 text-base">{cls.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cls.ageGroup}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditClass(cls)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Rombel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id, cls.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Rombel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Guru Utama (Wali Kelas):</span>
                      <strong className="text-slate-800">{cls.teacher}</strong>
                    </div>
                    {cls.coTeacher && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Guru Pendamping:</span>
                        <strong className="text-slate-800">{cls.coTeacher}</strong>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Kapasitas Peserta Didik:</span>
                      <span className="font-bold text-slate-900">
                        {currentStudentsCount} / {cls.quota} Anak ({fillPct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          fillPct >= 90 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(fillPct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: FORMULIR PENDAFTARAN MANUAL */}
      {activeTab === 'formulir' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="font-bold text-slate-900 text-base">Formulir Pendaftaran Calon Peserta Didik Baru (PPDB)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Input data calon peserta didik hasil pendaftaran offline atau formulir di kantor tata usaha.
            </p>
          </div>

          <form onSubmit={handleRegisterPPDB} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Anak</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Rayyan Al-Ghifari"
                  value={newApplicant.namaAnak}
                  onChange={e => setNewApplicant({ ...newApplicant, namaAnak: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  value={newApplicant.jk}
                  onChange={e => setNewApplicant({ ...newApplicant, jk: e.target.value as 'L' | 'P' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIK Calon Anak</label>
                <input
                  type="text"
                  required
                  placeholder="3273..."
                  value={newApplicant.nik}
                  onChange={e => setNewApplicant({ ...newApplicant, nik: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilihan Kelompok Belajar</label>
                <select
                  value={newApplicant.kelompokPilihan}
                  onChange={e => setNewApplicant({ ...newApplicant, kelompokPilihan: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="A (4-5 Tahun)">Kelompok A (Usia 4-5 Tahun)</option>
                  <option value="B (5-6 Tahun)">Kelompok B (Usia 5-6 Tahun)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Ayah Kandung</label>
                <input
                  type="text"
                  required
                  placeholder="Nama ayah"
                  value={newApplicant.namaAyah}
                  onChange={e => setNewApplicant({ ...newApplicant, namaAyah: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Ibu Kandung</label>
                <input
                  type="text"
                  required
                  placeholder="Nama ibu"
                  value={newApplicant.namaIbu}
                  onChange={e => setNewApplicant({ ...newApplicant, namaIbu: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Orang Tua</label>
                <input
                  type="text"
                  required
                  placeholder="0812..."
                  value={newApplicant.noHpOrtu}
                  onChange={e => setNewApplicant({ ...newApplicant, noHpOrtu: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili</label>
                <input
                  type="text"
                  required
                  placeholder="Alamat lengkap"
                  value={newApplicant.alamat}
                  onChange={e => setNewApplicant({ ...newApplicant, alamat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('pendaftar')}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
              >
                Daftarkan Calon Peserta Didik
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: KONVERSI DITERIMA KE KELAS (BUKU INDUK) */}
      {convertModalApplicant && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Terima & Tempatkan ke Rombel</h3>
            <p className="text-xs text-slate-600 mt-1">
              Calon peserta didik <strong>{convertModalApplicant.namaAnak}</strong> akan diterima resmi dan otomatis terdaftar di Buku Induk Peserta Didik.
            </p>

            <div className="my-4">
              <label className="block font-semibold text-slate-700 text-xs mb-1">Pilih Rombel / Kelas:</label>
              <select
                value={conversionTargetClass}
                onChange={e => setConversionTargetClass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.ageGroup}) - Wali: {c.teacher}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setConvertModalApplicant(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs rounded-xl hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmConvert}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
              >
                Konfirmasi Masuk Buku Induk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT ROMBEL KELAS */}
      {isClassModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingClass ? 'Edit Rombel / Kelas' : 'Tambah Rombel Kelas Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsClassModalOpen(false);
                  setEditingClass(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Rombel / Kelas</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kelompok A3 (Aisyah)"
                  value={classForm.name}
                  onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelompok Usia</label>
                <select
                  value={classForm.ageGroup}
                  onChange={e => setClassForm({ ...classForm, ageGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="Usia 4-5 Tahun">Usia 4-5 Tahun (Kelompok A)</option>
                  <option value="Usia 5-6 Tahun">Usia 5-6 Tahun (Kelompok B)</option>
                  <option value="Usia 3-4 Tahun">Usia 3-4 Tahun (Kelompok Bermain / Playgroup)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Kelas (Wali Kelas)</label>
                <input
                  type="text"
                  required
                  value={classForm.teacher}
                  onChange={e => setClassForm({ ...classForm, teacher: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Pendamping (Opsional)</label>
                <input
                  type="text"
                  value={classForm.coTeacher}
                  onChange={e => setClassForm({ ...classForm, coTeacher: e.target.value })}
                  placeholder="Misal: Guru Sarah, S.Pd"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kuota Maksimal (Anak)</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={40}
                  value={classForm.quota}
                  onChange={e => setClassForm({ ...classForm, quota: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsClassModalOpen(false);
                    setEditingClass(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                >
                  {editingClass ? 'Simpan Perubahan' : 'Tambah Rombel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
