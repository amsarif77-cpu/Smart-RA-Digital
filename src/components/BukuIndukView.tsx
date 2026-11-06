import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, Employee } from '../types';
import { exportJsonToExcel } from '../utils/exportExcel';
import {
  Users,
  UserCheck,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  Printer,
  FileSpreadsheet,
  Heart,
  AlertTriangle,
  X,
  Save,
  GraduationCap,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const BukuIndukView: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    markStudentAsAlumni,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    profile,
    academicYear,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'siswa' | 'pegawai' | 'alumni'>('siswa');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Multi-Student Print Modal
  const [printAllStudentsOpen, setPrintAllStudentsOpen] = useState(false);

  // Graduation Confirmation Modal
  const [graduationModalOpen, setGraduationModalOpen] = useState(false);
  const [selectedForGraduation, setSelectedForGraduation] = useState<Student | null>(null);
  const [gradYear, setGradYear] = useState('2026/2027');
  const [gradSkl, setGradSkl] = useState('');
  const [gradNextSchool, setGradNextSchool] = useState('');

  // Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [viewingBioStudent, setViewingBioStudent] = useState<Student | null>(null);
  const [viewingBioEmployee, setViewingBioEmployee] = useState<Employee | null>(null);

  // Student Form Initial state
  const defaultStudentForm: Omit<Student, 'id'> = {
    nis: `2026${String(students.length + 1).padStart(4, '0')}`,
    nisn: `320${Date.now().toString().slice(-7)}`,
    nama: '',
    jk: 'L',
    tempatLahir: 'Bandung',
    tanggalLahir: '2021-01-01',
    namaAyah: '',
    namaIbu: '',
    namaWali: '',
    alamat: '',
    noHpOrtu: '',
    tahunMasuk: '2026',
    kelompok: 'A',
    kelas: 'Kelompok A1 (Khadijah)',
    nik: '',
    noKk: '',
    catatanKesehatan: 'Sehat prima, tidak ada alergi khusus',
    status: 'aktif',
    foto: 'https://images.unsplash.com/photo-1595454223600-91fb5799a9a3?w=150',
  };

  const [studentForm, setStudentForm] = useState(defaultStudentForm);

  // Employee Form Initial state
  const defaultEmployeeForm: Omit<Employee, 'id'> = {
    nip: '-',
    nuptk: '-',
    nama: '',
    jk: 'P',
    pendidikan: 'S1 PIAUD',
    statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
    jabatan: 'Guru Kelas',
    golRuang: 'III/a',
    sertifikasi: false,
    skTugas: 'SK.YAYASAN/2026/GTY',
    noHp: '',
    email: '',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    jadwalMengajar: 'Senin - Jumat 07.30 - 11.30 WIB',
  };

  const [employeeForm, setEmployeeForm] = useState(defaultEmployeeForm);

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      s.nisn.includes(searchTerm);
    const matchesKelas = filterKelas === 'Semua' || s.kelas.includes(filterKelas);
    const matchesStatus = filterStatus === 'Semua' || s.status === filterStatus;
    const isAlumni = activeTab === 'alumni' 
      ? (s.status === 'lulus' || s.status === 'alumni') 
      : (s.status !== 'lulus' && s.status !== 'alumni');
    return matchesSearch && matchesKelas && matchesStatus && isAlumni;
  });

  // Filtered Employees
  const filteredEmployees = employees.filter(e => {
    return e.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nip.includes(searchTerm);
  });

  // Graduation Handlers (Requirement 4: Multi-years, alumni tidak terhapus)
  const handleOpenGraduationModal = (student: Student) => {
    setSelectedForGraduation(student);
    setGradYear(academicYear || '2026/2027');
    setGradSkl(`SKL/RA-${(academicYear || '2026/2027').slice(0, 4)}/${student.nis}`);
    setGradNextSchool('Madrasah Ibtidaiyah (MI) / SD');
    setGraduationModalOpen(true);
  };

  const handleConfirmGraduation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForGraduation) return;
    markStudentAsAlumni(selectedForGraduation.id, gradYear, gradSkl, gradNextSchool);
    setGraduationModalOpen(false);
    setSelectedForGraduation(null);
  };

  const handleRestoreToActive = (student: Student) => {
    if (confirm(`Pulihkan status ${student.nama} kembali menjadi peserta didik aktif?`)) {
      updateStudent({ ...student, status: 'aktif' });
    }
  };

  // Handlers for Students
  const handleOpenStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm(student);
    } else {
      setEditingStudent(null);
      setStudentForm({
        ...defaultStudentForm,
        nis: `2026${String(students.length + 1).padStart(4, '0')}`,
      });
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent({ ...studentForm, id: editingStudent.id });
    } else {
      addStudent(studentForm);
    }
    setIsStudentModalOpen(false);
  };

  // Handlers for Employees
  const handleOpenEmployeeModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setEmployeeForm(emp);
    } else {
      setEditingEmployee(null);
      setEmployeeForm(defaultEmployeeForm);
    }
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateEmployee({ ...employeeForm, id: editingEmployee.id });
    } else {
      addEmployee(employeeForm);
    }
    setIsEmployeeModalOpen(false);
  };

  const handleStudentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setStudentForm(prev => ({ ...prev, foto: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmployeePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEmployeeForm(prev => ({ ...prev, foto: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Genuine Native Excel (.xlsx) Export
  const handleExportExcel = () => {
    if (activeTab === 'pegawai') {
      const dataToExport = employees.map((emp, i) => ({
        'No': i + 1,
        'Nama Pegawai': emp.nama,
        'NIP': emp.nip,
        'NUPTK': emp.nuptk || '-',
        'Jabatan': emp.jabatan,
        'Status Kepegawaian': emp.statusKepegawaian,
        'Pendidikan': emp.pendidikan,
        'Gol/Ruang': emp.golRuang || '-',
        'Sertifikasi': emp.sertifikasi ? 'Ya' : 'Belum',
        'No. HP/WA': emp.noHp,
        'Email': emp.email,
        'Jadwal Mengajar': emp.jadwalMengajar,
      }));
      exportJsonToExcel(dataToExport, `Buku_Induk_PTK_${profile.name.replace(/\s+/g, '_')}`, 'PTK');
    } else {
      const targetList = activeTab === 'alumni'
        ? students.filter(s => s.status === 'lulus' || s.status === 'alumni')
        : students.filter(s => s.status !== 'lulus' && s.status !== 'alumni');

      const dataToExport = targetList.map((s, i) => ({
        'No': i + 1,
        'NIS': s.nis,
        'NISN': s.nisn,
        'Nama Peserta Didik': s.nama,
        'L/P': s.jk,
        'Tempat Lahir': s.tempatLahir,
        'Tanggal Lahir': s.tanggalLahir,
        'Kelompok': s.kelompok,
        'Kelas': s.kelas,
        'Nama Ayah': s.namaAyah,
        'Nama Ibu': s.namaIbu,
        'No. HP/WA Ortu': s.noHpOrtu,
        'Alamat': s.alamat,
        'Status': s.status,
        'Tahun Masuk': s.tahunMasuk,
        'Tahun Lulus': s.tahunLulus || '-',
        'No. Ijazah/SKL': s.noIjazah || '-',
        'Lanjut Ke': s.lanjutKe || '-',
      }));
      const filename = activeTab === 'alumni'
        ? `Buku_Induk_Alumni_${profile.name.replace(/\s+/g, '_')}`
        : `Buku_Induk_Peserta_Didik_${profile.name.replace(/\s+/g, '_')}`;
      exportJsonToExcel(dataToExport, filename, 'Peserta Didik');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Basis Data Pokok Madrasah (Buku Induk)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Buku Induk Digital RA</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Database digital terintegrasi peserta didik, pendidik & tenaga kependidikan, riwayat mutasi, dan alumni multi-tahun.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Requirement 3: Buku Induk bisa cetak */}
          <button
            onClick={() => setPrintAllStudentsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-300 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Buku Induk (PDF)</span>
          </button>

          {/* Genuine Excel Export (.xlsx) */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Excel (.xlsx)</span>
          </button>

          {activeTab === 'siswa' && (
            <button
              onClick={() => handleOpenStudentModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa Baru</span>
            </button>
          )}

          {activeTab === 'pegawai' && (
            <button
              onClick={() => handleOpenEmployeeModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Guru / Pegawai</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-2xl">
        <button
          onClick={() => { setActiveTab('siswa'); setSearchTerm(''); }}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'siswa'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Peserta Didik Aktif ({students.filter(s => s.status !== 'lulus').length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('pegawai'); setSearchTerm(''); }}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'pegawai'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Pendidik & Tendik ({employees.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('alumni'); setSearchTerm(''); }}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-2 ${
            activeTab === 'alumni'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Alumni ({students.filter(s => s.status === 'lulus').length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-t-0 border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'pegawai' ? "Cari nama, NIP, jabatan..." : "Cari nama, NIS, NISN..."}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {activeTab !== 'pegawai' && (
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Kelas:</span>
              <select
                value={filterKelas}
                onChange={e => setFilterKelas(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Semua">Semua Kelompok</option>
                <option value="Kelompok A1">Kelompok A1</option>
                <option value="Kelompok A2">Kelompok A2</option>
                <option value="Kelompok B1">Kelompok B1</option>
                <option value="Kelompok B2">Kelompok B2</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Status:</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Semua">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="mutasi">Mutasi</option>
                <option value="keluar">Keluar</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content Table: Siswa */}
      {(activeTab === 'siswa' || activeTab === 'alumni') && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Siswa</th>
                  <th className="px-3 py-3">NIS / NISN</th>
                  <th className="px-3 py-3">Kelompok / Rombel</th>
                  <th className="px-3 py-3">Orang Tua / Kontak</th>
                  <th className="px-3 py-3">Catatan Kesehatan</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Tidak ada data siswa yang cocok dengan pencarian / filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.foto}
                            alt={s.nama}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{s.nama}</div>
                            <div className="text-[11px] text-slate-500">
                              {s.jk === 'L' ? 'Laki-laki' : 'Perempuan'} • {s.tempatLahir}, {s.tanggalLahir}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-700">
                        <div>{s.nis}</div>
                        <div className="text-[10px] text-slate-400">{s.nisn}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {s.kelas}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-800">Ayah: {s.namaAyah}</div>
                        <div className="text-slate-500">Ibu: {s.namaIbu}</div>
                        <div className="text-[10px] text-emerald-700">{s.noHpOrtu}</div>
                      </td>
                      <td className="px-3 py-3 max-w-xs">
                        <span className="text-[11px] text-slate-600 line-clamp-2">
                          {s.catatanKesehatan}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            s.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' :
                            s.status === 'lulus' || s.status === 'alumni' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {s.status === 'alumni' ? 'ALUMNI' : s.status.toUpperCase()}
                          </span>
                          {(s.status === 'alumni' || s.status === 'lulus') && s.tahunLulus && (
                            <span className="text-[9px] text-slate-500 font-mono">
                              Lulus: {s.tahunLulus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Konfirmasi Kelulusan (Jadikan Alumni) */}
                          {activeTab === 'siswa' && (s.status === 'aktif') && (
                            <button
                              onClick={() => handleOpenGraduationModal(s)}
                              className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                              title="Konfirmasi Kelulusan (Jadikan Alumni)"
                            >
                              <GraduationCap className="w-4 h-4" />
                            </button>
                          )}

                          {/* Pulihkan dari Alumni ke Siswa Aktif */}
                          {activeTab === 'alumni' && (
                            <button
                              onClick={() => handleRestoreToActive(s)}
                              className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                              title="Pulihkan Kembali ke Peserta Didik Aktif"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setViewingBioStudent(s)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Lihat & Cetak Lembar Biodata"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenStudentModal(s)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Data Siswa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data ${s.nama}?`)) {
                                deleteStudent(s.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Hapus Siswa"
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
      )}

      {/* Content Table: Pendidik & Pegawai */}
      {activeTab === 'pegawai' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Nama Pegawai</th>
                  <th className="px-3 py-3">NIP / NUPTK</th>
                  <th className="px-3 py-3">Jabatan & Tugas</th>
                  <th className="px-3 py-3">Status & Pendidikan</th>
                  <th className="px-3 py-3">Sertifikasi</th>
                  <th className="px-3 py-3">Kontak</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.foto}
                          alt={emp.nama}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{emp.nama}</div>
                          <div className="text-[11px] text-slate-500">Gol: {emp.golRuang || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-700">
                      <div>NIP: {emp.nip}</div>
                      <div className="text-[10px] text-slate-400">NUPTK: {emp.nuptk || '-'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-slate-800">{emp.jabatan}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{emp.jadwalMengajar}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-slate-700">{emp.statusKepegawaian}</span>
                      <div className="text-[10px] text-slate-500">{emp.pendidikan}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        emp.sertifikasi ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.sertifikasi ? 'Tersertifikasi (Serdik)' : 'Belum'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[11px]">
                      <div className="text-emerald-700 font-medium">{emp.noHp}</div>
                      <div className="text-slate-400">{emp.email}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingBioEmployee(emp)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          title="Cetak Biodata PTK"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEmployeeModal(emp)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Pegawai"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data ${emp.nama}?`)) {
                              deleteEmployee(emp.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah/Edit Siswa */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingStudent ? 'Edit Data Peserta Didik' : 'Pendaftaran Siswa Baru (Buku Induk)'}
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                  <img
                    src={studentForm.foto || 'https://images.unsplash.com/photo-1595454223600-91fb5799a9a3?w=150'}
                    alt="Foto Siswa"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-2xs"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="block font-semibold text-slate-800 text-xs">Foto Resmi Peserta Didik (Buku Induk)</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs">
                        <span>Pilih Foto dari Perangkat</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleStudentPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.nama}
                    onChange={e => setStudentForm({ ...studentForm, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={studentForm.jk}
                    onChange={e => setStudentForm({ ...studentForm, jk: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="L">Laki-laki (Putra)</option>
                    <option value="P">Perempuan (Putri)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS (Nomor Induk Siswa)</label>
                  <input
                    type="text"
                    value={studentForm.nis}
                    onChange={e => setStudentForm({ ...studentForm, nis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN (Kemdikbud/Kemenag)</label>
                  <input
                    type="text"
                    value={studentForm.nisn}
                    onChange={e => setStudentForm({ ...studentForm, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={studentForm.tempatLahir}
                    onChange={e => setStudentForm({ ...studentForm, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={studentForm.tanggalLahir}
                    onChange={e => setStudentForm({ ...studentForm, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelompok Usia</label>
                  <select
                    value={studentForm.kelompok}
                    onChange={e => setStudentForm({ 
                      ...studentForm, 
                      kelompok: e.target.value as 'A' | 'B',
                      kelas: e.target.value === 'A' ? 'Kelompok A1 (Khadijah)' : 'Kelompok B1 (Abu Bakar)'
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="A">Kelompok A (Usia 4 - 5 Tahun)</option>
                    <option value="B">Kelompok B (Usia 5 - 6 Tahun)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rombel / Kelas</label>
                  <select
                    value={studentForm.kelas}
                    onChange={e => setStudentForm({ ...studentForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kelompok A1 (Khadijah)">Kelompok A1 (Khadijah)</option>
                    <option value="Kelompok A2 (Fathimah Az-Zahra)">Kelompok A2 (Fathimah Az-Zahra)</option>
                    <option value="Kelompok B1 (Abu Bakar)">Kelompok B1 (Abu Bakar)</option>
                    <option value="Kelompok B2 (Umar bin Khattab)">Kelompok B2 (Umar bin Khattab)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ayah Kandung</label>
                  <input
                    type="text"
                    value={studentForm.namaAyah}
                    onChange={e => setStudentForm({ ...studentForm, namaAyah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    value={studentForm.namaIbu}
                    onChange={e => setStudentForm({ ...studentForm, namaIbu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Ortu</label>
                  <input
                    type="text"
                    value={studentForm.noHpOrtu}
                    onChange={e => setStudentForm({ ...studentForm, noHpOrtu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Keaktifan</label>
                  <select
                    value={studentForm.status}
                    onChange={e => setStudentForm({ ...studentForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="mutasi">Mutasi Masuk/Keluar</option>
                    <option value="lulus">Lulus (Alumni)</option>
                    <option value="keluar">Keluar</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={studentForm.alamat}
                    onChange={e => setStudentForm({ ...studentForm, alamat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Catatan Kesehatan / Alergi / Kebutuhan Khusus</label>
                  <input
                    type="text"
                    value={studentForm.catatanKesehatan}
                    onChange={e => setStudentForm({ ...studentForm, catatanKesehatan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Biodata Siswa Print View */}
      {viewingBioStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Lembar Biodata Peserta Didik (Buku Induk)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Biodata</span>
                </button>
                <button onClick={() => setViewingBioStudent(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Printable Sheet */}
            <div className="p-4 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
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
                  <div className="text-[9px] text-slate-600 font-sans">{profile.address} • Telp: {profile.phone}</div>
                </div>
              </div>

              <div className="text-center font-bold text-xs uppercase underline">
                LEMBAR BIODATA BUKU INDUK PESERTA DIDIK
              </div>

              <div className="flex gap-4 items-start">
                <img
                  src={viewingBioStudent.foto}
                  alt={viewingBioStudent.nama}
                  className="w-24 h-28 object-cover rounded border border-slate-300"
                />
                <table className="flex-1 font-sans text-[11px] leading-relaxed">
                  <tbody>
                    <tr><td className="w-28 font-semibold">Nama Lengkap</td><td>: <strong>{viewingBioStudent.nama}</strong></td></tr>
                    <tr><td className="font-semibold">NIS / NISN</td><td>: {viewingBioStudent.nis} / {viewingBioStudent.nisn}</td></tr>
                    <tr><td className="font-semibold">Jenis Kelamin</td><td>: {viewingBioStudent.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
                    <tr><td className="font-semibold">Tempat, Tgl Lahir</td><td>: {viewingBioStudent.tempatLahir}, {viewingBioStudent.tanggalLahir}</td></tr>
                    <tr><td className="font-semibold">Rombel / Kelas</td><td>: {viewingBioStudent.kelas}</td></tr>
                    <tr><td className="font-semibold">Nama Ayah</td><td>: {viewingBioStudent.namaAyah}</td></tr>
                    <tr><td className="font-semibold">Nama Ibu</td><td>: {viewingBioStudent.namaIbu}</td></tr>
                    <tr><td className="font-semibold">Alamat Rumah</td><td>: {viewingBioStudent.alamat}</td></tr>
                    <tr><td className="font-semibold">Kontak HP/WA</td><td>: {viewingBioStudent.noHpOrtu}</td></tr>
                    <tr><td className="font-semibold">Catatan Kesehatan</td><td>: {viewingBioStudent.catatanKesehatan}</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan 3 Pihak: Ortu Kiri, Kepala Tengah, Guru Kanan */}
              <div className="pt-4 grid grid-cols-3 gap-2 font-sans text-[10px] text-slate-700 text-center">
                <div>
                  <div>Mengetahui,</div>
                  <div className="font-bold">Orang Tua / Wali Murid</div>
                  <div className="mt-12 font-semibold">({viewingBioStudent.namaAyah || viewingBioStudent.namaIbu || '.........................'})</div>
                </div>
                <div>
                  <div>Menyetujui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div>
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Guru Kelas</div>
                  <div className="mt-12 font-semibold underline">Guru Nurul Hidayah, S.Pd.I</div>
                  <div>NUPTK: 9283746501928374</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah/Edit Pegawai */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingEmployee ? 'Edit Data Pendidik / Pegawai' : 'Tambah Tenaga Pendidik / Tendik'}
              </h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload Foto Pegawai */}
                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                  <img
                    src={employeeForm.foto || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'}
                    alt="Foto Pegawai"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-2xs"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="block font-semibold text-slate-800 text-xs">Foto Resmi Pendidik / Pegawai</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs">
                        <span>Pilih Foto dari Perangkat</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEmployeePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={employeeForm.nama}
                    onChange={e => setEmployeeForm({ ...employeeForm, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Jika PNS/PPPK)</label>
                  <input
                    type="text"
                    value={employeeForm.nip}
                    onChange={e => setEmployeeForm({ ...employeeForm, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={employeeForm.nuptk || ''}
                    onChange={e => setEmployeeForm({ ...employeeForm, nuptk: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan Utama</label>
                  <select
                    value={employeeForm.jabatan}
                    onChange={e => setEmployeeForm({ ...employeeForm, jabatan: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Guru Kelas">Guru Kelas</option>
                    <option value="Guru Pendamping">Guru Pendamping</option>
                    <option value="Kepala RA">Kepala RA</option>
                    <option value="Bendahara">Bendahara</option>
                    <option value="Tenaga Administrasi">Tenaga Administrasi (TU)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={employeeForm.statusKepegawaian}
                    onChange={e => setEmployeeForm({ ...employeeForm, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Guru Tetap Yayasan (GTY)">Guru Tetap Yayasan (GTY)</option>
                    <option value="PNS">PNS Kemenag</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Guru Tidak Tetap (GTT)">Guru Tidak Tetap (GTT)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={employeeForm.pendidikan}
                    onChange={e => setEmployeeForm({ ...employeeForm, pendidikan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sertifikasi Pendidik</label>
                  <select
                    value={employeeForm.sertifikasi ? 'ya' : 'tidak'}
                    onChange={e => setEmployeeForm({ ...employeeForm, sertifikasi: e.target.value === 'ya' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="ya">Sudah Sertifikasi</option>
                    <option value="tidak">Belum Sertifikasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={employeeForm.noHp}
                    onChange={e => setEmployeeForm({ ...employeeForm, noHp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={employeeForm.email}
                    onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Biodata Pendidik / Pegawai Print View */}
      {viewingBioEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Lembar Biodata Pendidik & Tenaga Kependidikan</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Biodata PTK</span>
                </button>
                <button onClick={() => setViewingBioEmployee(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Printable Sheet */}
            <div className="p-4 bg-white mt-2 space-y-4 text-xs font-serif border border-slate-200 rounded-xl">
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
                  <div className="text-[9px] text-slate-600 font-sans">{profile.address} • Telp: {profile.phone}</div>
                </div>
              </div>

              <div className="text-center font-bold text-xs uppercase underline">
                LEMBAR BIODATA PENDIDIK / TENAGA KEPENDIDIKAN
              </div>

              <div className="flex gap-4 items-start">
                <img
                  src={viewingBioEmployee.foto}
                  alt={viewingBioEmployee.nama}
                  className="w-24 h-28 object-cover rounded border border-slate-300"
                />
                <table className="flex-1 font-sans text-[11px] leading-relaxed">
                  <tbody>
                    <tr><td className="w-32 font-semibold">Nama Lengkap & Gelar</td><td>: <strong>{viewingBioEmployee.nama}</strong></td></tr>
                    <tr><td className="font-semibold">NIP / NUPTK</td><td>: {viewingBioEmployee.nip} / {viewingBioEmployee.nuptk || '-'}</td></tr>
                    <tr><td className="font-semibold">Jabatan Utama</td><td>: {viewingBioEmployee.jabatan}</td></tr>
                    <tr><td className="font-semibold">Status Kepegawaian</td><td>: {viewingBioEmployee.statusKepegawaian}</td></tr>
                    <tr><td className="font-semibold">Pendidikan Terakhir</td><td>: {viewingBioEmployee.pendidikan}</td></tr>
                    <tr><td className="font-semibold">Status Sertifikasi</td><td>: {viewingBioEmployee.sertifikasi ? 'Sudah Sertifikasi (Serdik)' : 'Belum Sertifikasi'}</td></tr>
                    <tr><td className="font-semibold">Nomor SK Penugasan</td><td>: {viewingBioEmployee.skTugas}</td></tr>
                    <tr><td className="font-semibold">Kontak WhatsApp</td><td>: {viewingBioEmployee.noHp}</td></tr>
                    <tr><td className="font-semibold">Email Resmi</td><td>: {viewingBioEmployee.email}</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan 2 Pihak: Kepala Sebelah Kiri, Guru/Pegawai Sebelah Kanan */}
              <div className="pt-4 flex justify-between font-sans text-[10px] text-slate-700">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div className="font-bold">Kepala RA</div>
                  <div className="mt-12 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
                <div className="text-center">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-bold">Pendidik / Tenaga Kependidikan</div>
                  <div className="mt-12 font-semibold underline">{viewingBioEmployee.nama}</div>
                  <div>NIP/NUPTK: {viewingBioEmployee.nip !== '-' ? viewingBioEmployee.nip : (viewingBioEmployee.nuptk || '-')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Kelulusan Siswa (Jadikan Alumni) */}
      {graduationModalOpen && selectedForGraduation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Konfirmasi Kelulusan Anak</h3>
                  <p className="text-[11px] text-slate-500">Data tetap tersimpan rapi sebagai Alumni</p>
                </div>
              </div>
              <button
                onClick={() => setGraduationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
              <div className="font-bold text-sm text-purple-950">{selectedForGraduation.nama}</div>
              <div className="font-mono text-[11px]">NIS: {selectedForGraduation.nis} &bull; Kelas: {selectedForGraduation.kelas}</div>
              <p className="text-[11px] text-purple-700 pt-1">
                Anak yang lulus akan dialihkan statusnya ke <strong>Alumni</strong> tanpa dihapus dari database. Seluruh riwayat portofolio, presensi, dan data induk tetap aman.
              </p>
            </div>

            <form onSubmit={handleConfirmGraduation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran Kelulusan:</label>
                <input
                  type="text"
                  required
                  value={gradYear}
                  onChange={e => setGradYear(e.target.value)}
                  placeholder="Misal: 2026/2027"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Ijazah / Surat Keterangan Lulus (SKL):</label>
                <input
                  type="text"
                  required
                  value={gradSkl}
                  onChange={e => setGradSkl(e.target.value)}
                  placeholder="Misal: SKL/RA-2026/088"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Melanjutkan Pendidikan Ke:</label>
                <input
                  type="text"
                  value={gradNextSchool}
                  onChange={e => setGradNextSchool(e.target.value)}
                  placeholder="Misal: MI Terpadu / SD Negeri 1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGraduationModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Konfirmasi Lulus & Jadi Alumni</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cetak Buku Induk Lengkap Seluruh Peserta Didik (Print View) */}
      {printAllStudentsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">Cetak Buku Induk Lengkap Peserta Didik</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Resmi (PDF)</span>
                </button>
                <button
                  onClick={() => setPrintAllStudentsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Container */}
            <div className="p-6 bg-white mt-3 space-y-5 text-xs border border-slate-200 rounded-xl print:border-0 print:p-0">
              {/* Kop Surat Resmi */}
              <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-3">
                {profile.logoUrl && (
                  <img
                    src={profile.logoUrl}
                    alt="Logo RA"
                    className="w-16 h-16 object-contain shrink-0"
                  />
                )}
                <div className="text-center flex-1">
                  <div className="text-xs uppercase font-bold tracking-widest text-slate-700">{profile.foundation}</div>
                  <div className="text-base font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[10px] text-slate-600 break-words mt-0.5">{profile.address} • Telp: {profile.phone}</div>
                  <div className="text-[10px] text-slate-500 font-mono">NSM: {profile.nsm} &bull; NPSN: {profile.npsn} &bull; Akreditasi: {profile.accreditation}</div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-bold text-sm uppercase underline tracking-wider">
                  BUKU INDUK PESERTA DIDIK RAUDLATUL ATHFAL
                </h4>
                <p className="text-[11px] text-slate-600">
                  Tahun Pelajaran: <strong>{academicYear}</strong> &bull; Total Terdaftar: <strong>{students.length} Peserta Didik</strong>
                </p>
              </div>

              {/* Table of Students */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead className="bg-slate-100 font-bold uppercase text-slate-800">
                    <tr>
                      <th className="border border-slate-300 px-2 py-1.5 text-center w-8">No</th>
                      <th className="border border-slate-300 px-2 py-1.5">NIS / NISN</th>
                      <th className="border border-slate-300 px-2 py-1.5">Nama Lengkap Peserta Didik</th>
                      <th className="border border-slate-300 px-2 py-1.5 text-center w-10">L/P</th>
                      <th className="border border-slate-300 px-2 py-1.5">Tempat, Tgl Lahir</th>
                      <th className="border border-slate-300 px-2 py-1.5">Kelompok / Rombel</th>
                      <th className="border border-slate-300 px-2 py-1.5">Nama Orang Tua</th>
                      <th className="border border-slate-300 px-2 py-1.5">Alamat Rumah & HP</th>
                      <th className="border border-slate-300 px-2 py-1.5 text-center w-16">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, idx) => (
                      <tr key={s.id} className="odd:bg-white even:bg-slate-50">
                        <td className="border border-slate-300 px-2 py-1 text-center font-semibold">{idx + 1}</td>
                        <td className="border border-slate-300 px-2 py-1 font-mono">{s.nis}<br/>{s.nisn}</td>
                        <td className="border border-slate-300 px-2 py-1 font-bold text-slate-900">{s.nama}</td>
                        <td className="border border-slate-300 px-2 py-1 text-center font-bold">{s.jk}</td>
                        <td className="border border-slate-300 px-2 py-1">{s.tempatLahir}, {s.tanggalLahir}</td>
                        <td className="border border-slate-300 px-2 py-1 font-medium">{s.kelas}</td>
                        <td className="border border-slate-300 px-2 py-1">Ayah: {s.namaAyah}<br/>Ibu: {s.namaIbu}</td>
                        <td className="border border-slate-300 px-2 py-1 leading-tight">{s.alamat}<br/><span className="text-emerald-800 font-medium">{s.noHpOrtu}</span></td>
                        <td className="border border-slate-300 px-2 py-1 text-center font-bold text-[9px]">
                          {s.status.toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Endorsement Section */}
              <div className="pt-6 flex justify-between text-[11px] text-slate-800 break-inside-avoid">
                <div className="text-center w-64">
                  <div>Mengetahui,</div>
                  <div className="font-bold">Ketua Komite RA</div>
                  <div className="mt-14 font-semibold underline">Drs. H. Mulyana, M.Ag</div>
                  <div>NIP: -</div>
                </div>

                <div className="text-center w-64">
                  <div>Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="font-bold">Kepala Raudlatul Athfal</div>
                  <div className="mt-14 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
