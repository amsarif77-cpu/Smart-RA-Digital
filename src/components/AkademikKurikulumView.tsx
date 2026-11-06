import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AcademicCalendarEvent } from '../types';
import { exportJsonToExcel } from '../utils/exportExcel';
import {
  BookOpen,
  Calendar,
  Sparkles,
  Layers,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Clock,
  Printer,
  ChevronDown,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  FileSpreadsheet,
  X,
  Search,
  Filter
} from 'lucide-react';

export const AkademikKurikulumView: React.FC = () => {
  const {
    profile,
    academicYear,
    semester,
    setSemester,
    employees,
    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
  } = useApp();
  const [activeTab, setActiveTab] = useState<'cp' | 'tema' | 'kalender'>('tema');
  const [selectedKelompok, setSelectedKelompok] = useState<'TK A' | 'TK B'>('TK A');
  const [printDocOpen, setPrintDocOpen] = useState(false);

  // Kalender Pendidikan States
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AcademicCalendarEvent | null>(null);
  const [printCalendarOpen, setPrintCalendarOpen] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState<'Semua' | 'Semester Ganjil' | 'Semester Genap'>('Semua');
  const [calendarSearch, setCalendarSearch] = useState('');
  const [calendarForm, setCalendarForm] = useState<Omit<AcademicCalendarEvent, 'id'>>({
    tanggal: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    agenda: '',
    kategori: 'Akademik',
    semester: 'Semester Ganjil',
    tahunAjaran: academicYear,
    keterangan: '',
  });

  // Capaian Pembelajaran RA Kemenag (Kurikulum Merdeka PAUD/RA)
  const learningOutcomes = [
    {
      title: '1. Nilai Agama & Budi Pekerti',
      description: 'Mengenal rukun Islam dan rukun iman, terbiasa mempraktikkan doa harian, hafalan surat pendek juz 30, ibadah sholat dhuha, adab bersuci/wudhu, serta menyayangi sesama makhluk ciptaan Allah SWT.',
      indicators: [
        'Mengenal Allah SWT melalui asmaul husna dan ciptaan-Nya',
        'Mempraktikkan gerakan wudhu dan sholat secara tertib',
        'Hafalan surat pendek juz 30 (Al-Fatihah, An-Naas, Al-Falaq, Al-Ikhlas, Al-Kafirun, dsb.)',
        'Menerapkan adab makan, minum, dan berbicara santun',
      ],
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-950',
    },
    {
      title: '2. Jati Diri & Sosial Emosional',
      description: 'Mengenali identitas diri sebagai muslim yang sholeh/sholehah, mengelola emosi secara sehat, bersikap mandiri, peduli dan mampu berinteraksi positif dengan teman sebaya.',
      indicators: [
        'Mengekspresikan dan mengendalikan emosi secara wajar',
        'Memiliki rasa percaya diri saat tampil atau memimpin doa',
        'Mampu berbagi mainan dan bergantian (antre)',
        'Mengenal budaya bangsa dan rasa cinta tanah air Indonesia',
      ],
      color: 'border-blue-200 bg-blue-50/40 text-blue-950',
    },
    {
      title: '3. Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni (STEAM)',
      description: 'Membangun rasa ingin tahu anak melalui bermain eksploratif, mengenali simbol keaksaraan dan huruf hijaiyah, konsep bilangan, pemecahan masalah sederhana, serta ekspresi seni anak.',
      indicators: [
        'Menyimak dan menceritakan kembali cerita islami yang didengar',
        'Mengenal bentuk huruf abjad latin dan huruf hijaiyah',
        'Menghitung dan mengelompokkan benda berdasarkan ukuran dan warna',
        'Eksplorasi loose parts bahan alam dan kreasi seni kolase/menggambar',
      ],
      color: 'border-amber-200 bg-amber-50/40 text-amber-950',
    },
  ];

  // Tema & Topik Pembelajaran Semester Ganjil & Genap untuk TK A dan TK B
  const themesData: Record<string, Record<'TK A' | 'TK B', Array<{ bulan: string; tema: string; subtema: string; durasi: string }>>> = {
    'Semester Ganjil': {
      'TK A': [
        { bulan: 'Juli - Agustus', tema: 'Aku Hamba Allah', subtema: 'Diriku yang Unik, Panca Indera Karunia Allah, Makanan Halal & Sehat', durasi: '4 Minggu' },
        { bulan: 'September', tema: 'Keluargaku Sakinah', subtema: 'Ayah & Ibu Pembimbingku, Rumahku Surgaku (Baiti Jannati), Menyayangi Saudara', durasi: '4 Minggu' },
        { bulan: 'Oktober', tema: 'Lingkunganku yang Bersih', subtema: 'Masjidku Tempat Ibadah, RA-ku yang Ramah, Adab Menjaga Kebersihan', durasi: '4 Minggu' },
        { bulan: 'November', tema: 'Binatang Ciptaan Allah', subtema: 'Binatang Peliharaan Jinak, Binatang Air Tawar, Menyayangi Ciptaan Allah', durasi: '4 Minggu' },
        { bulan: 'Desember', tema: 'Tanaman Karunia Allah', subtema: 'Bunga Indah Berwarna-warni, Pohon Buah Manis, Bersyukur atas Alam', durasi: '3 Minggu' },
      ],
      'TK B': [
        { bulan: 'Juli - Agustus', tema: 'Aku Hamba Allah & Panca Indera', subtema: 'Fungsi Organ Tubuhku, Menjaga Kebersihan Diri Islami, Makanan Thayyib Bergizi', durasi: '4 Minggu' },
        { bulan: 'September', tema: 'Keluargaku Sakinah & Adab Birrul Walidain', subtema: 'Peran Ayah & Ibu, Adab Membantu di Rumah, Silaturahmi Sanak Kerabat', durasi: '4 Minggu' },
        { bulan: 'Oktober', tema: 'Lingkunganku Asri & Ramah Anak', subtema: 'Masjid & Sarana Umum, Madrasah Kebanggaan, Mengolah Sampah Sederhana', durasi: '4 Minggu' },
        { bulan: 'November', tema: 'Keanekaragaman Fauna Ciptaan Allah', subtema: 'Binatang Ternak Bermanfaat, Hewan Liar Dilindungi, Siklus Hidup Kupu-kupu', durasi: '4 Minggu' },
        { bulan: 'Desember', tema: 'Apotek Hidup & Tanaman Pangan', subtema: 'Tanaman Obat Keluarga (Toga), Sayuran Hijau Segar, Bercocok Tanam Loose Parts', durasi: '3 Minggu' },
      ],
    },
    'Semester Genap': {
      'TK A': [
        { bulan: 'Januari', tema: 'Kendaraan Transportasi', subtema: 'Kendaraan Darat (Mobil, Bus, Kereta Api), Adab Naik Kendaraan & Doa Safar', durasi: '4 Minggu' },
        { bulan: 'Februari', tema: 'Profesi & Pekerjaan Mulia', subtema: 'Petani Rajin, Pedagang Halal, Dokter Sahabat Anak', durasi: '4 Minggu' },
        { bulan: 'Maret', tema: 'Bulan Ramadhan Penuh Berkah', subtema: 'Adab Berpuasa Ceria, Senang Sholat Tarawih, Indahnya Berbagi Infaq', durasi: '4 Minggu' },
        { bulan: 'April', tema: 'Alam Semesta & Keindahan Langit', subtema: 'Matahari Siang Hari, Bulan & Bintang Malam, Terjadinya Hujan Rahmat', durasi: '4 Minggu' },
        { bulan: 'Mei - Juni', tema: 'Negaraku Indonesia Tercinta', subtema: 'Benderaku Merah Putih, Lagu Kebangsaan, Kebudayaan Sunda Nusantara', durasi: '3 Minggu' },
      ],
      'TK B': [
        { bulan: 'Januari', tema: 'Teknologi & Transportasi Modern', subtema: 'Kendaraan Air (Kapal), Kendaraan Udara (Pesawat), Rambu Lalu Lintas', durasi: '4 Minggu' },
        { bulan: 'Februari', tema: 'Cita-Citaku Pengabdi Umat', subtema: 'Guru Pembina Karakter, Dokter & Nakes, Insinyur Muslim, Pemimpin Berakhlak', durasi: '4 Minggu' },
        { bulan: 'Maret', tema: 'Gemerlap Ramadhan & Idul Fitri', subtema: 'Keutamaan Lailatul Qadar, Zakat Fitrah, Silaturahmi Hari Kemenangan Idul Fitri', durasi: '4 Minggu' },
        { bulan: 'April', tema: 'Tata Surya & Gejala Alam', subtema: 'Bumi & Planet Ciptaan Allah, Siklus Air & Pelangi, Mitigasi Bencana Sederhana', durasi: '4 Minggu' },
        { bulan: 'Mei - Juni', tema: 'Tanah Airku Indonesia & Harmoni P2RA', subtema: 'Lambang Garuda Pancasila, Bhinneka Tunggal Ika, Toleransi & Adab Musyawarah', durasi: '3 Minggu' },
      ],
    },
  };

  const currentThemes = themesData[semester]?.[selectedKelompok] || themesData['Semester Ganjil']['TK A'];

  const filteredCalendarEvents = useMemo(() => {
    return (calendarEvents || []).filter(e => {
      if (calendarFilter !== 'Semua' && e.semester !== calendarFilter) return false;
      if (calendarSearch.trim()) {
        const q = calendarSearch.toLowerCase();
        const match =
          e.agenda.toLowerCase().includes(q) ||
          e.tanggal.toLowerCase().includes(q) ||
          e.kategori.toLowerCase().includes(q) ||
          (e.keterangan && e.keterangan.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [calendarEvents, calendarFilter, calendarSearch]);

  const handleOpenAddCalendar = () => {
    setEditingEvent(null);
    setCalendarForm({
      tanggal: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      agenda: '',
      kategori: 'Akademik',
      semester: (semester === 'Semester 2 (Genap)' ? 'Semester Genap' : 'Semester Ganjil'),
      tahunAjaran: academicYear,
      keterangan: '',
    });
    setCalendarModalOpen(true);
  };

  const handleOpenEditCalendar = (event: AcademicCalendarEvent) => {
    setEditingEvent(event);
    setCalendarForm({
      tanggal: event.tanggal,
      tanggalMulai: event.tanggalMulai || '',
      tanggalSelesai: event.tanggalSelesai || '',
      agenda: event.agenda,
      kategori: event.kategori,
      semester: event.semester,
      tahunAjaran: event.tahunAjaran,
      keterangan: event.keterangan || '',
    });
    setCalendarModalOpen(true);
  };

  const handleSaveCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarForm.agenda.trim() || !calendarForm.tanggal.trim()) {
      alert('Tanggal dan Nama Agenda wajib diisi!');
      return;
    }

    if (editingEvent) {
      updateCalendarEvent({
        ...calendarForm,
        id: editingEvent.id,
      });
    } else {
      addCalendarEvent(calendarForm);
    }
    setCalendarModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteCalendar = (id: string, agenda: string) => {
    if (confirm(`Yakin ingin menghapus agenda kalender "${agenda}"?`)) {
      deleteCalendarEvent(id);
    }
  };

  const handleExportCalendarExcel = () => {
    const data = filteredCalendarEvents.map((e, idx) => ({
      No: idx + 1,
      Tanggal: e.tanggal,
      'Tanggal Mulai': e.tanggalMulai || '-',
      'Tanggal Selesai': e.tanggalSelesai || '-',
      'Nama Agenda / Kegiatan': e.agenda,
      Kategori: e.kategori,
      Semester: e.semester,
      'Tahun Ajaran': e.tahunAjaran,
      Keterangan: e.keterangan || '-',
    }));
    exportJsonToExcel(data, `Kalender_Pendidikan_RA_${profile.name.replace(/\s+/g, '_')}_${academicYear.replace('/', '-')}`, 'Kalender Pendidikan');
  };

  const wakaKurikulum = employees.find(e => e.jabatan.toLowerCase().includes('kurikulum')) || employees[1] || employees[0];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Kurikulum Merdeka Raudlatul Athfal (Kemenag RI)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Akademik & Kurikulum RA</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pedoman Capaian Pembelajaran, P2RA, pemetaan tema semester (Ganjil & Genap), rombel TK A / TK B, dan kalender pendidikan.
          </p>
        </div>

        <button
          onClick={() => setPrintDocOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Dokumen Kurikulum Resmi</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('tema')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition ${
            activeTab === 'tema'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pemetaan Tema (TK A & TK B)
        </button>
        <button
          onClick={() => setActiveTab('cp')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition ${
            activeTab === 'cp'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Capaian Pembelajaran (CP) & P2RA
        </button>
        <button
          onClick={() => setActiveTab('kalender')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition ${
            activeTab === 'kalender'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kalender Pendidikan RA
        </button>
      </div>

      {/* Tab 1: Tema & Subtema dengan Pengaturan Semester Ganjil/Genap dan TK A / TK B */}
      {activeTab === 'tema' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6 space-y-5">
          {/* Controls: Semester & Kelompok */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Pilih Semester:
                </label>
                <div className="inline-flex rounded-xl bg-white p-1 border border-slate-300">
                  <button
                    onClick={() => setSemester('Semester Ganjil')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      semester === 'Semester Ganjil'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semester Ganjil
                  </button>
                  <button
                    onClick={() => setSemester('Semester Genap')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      semester === 'Semester Genap'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semester Genap
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Jenjang / Rombel:
                </label>
                <div className="inline-flex rounded-xl bg-white p-1 border border-slate-300">
                  <button
                    onClick={() => setSelectedKelompok('TK A')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedKelompok === 'TK A'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    TK A (Kelompok A, Usia 4-5 Thn)
                  </button>
                  <button
                    onClick={() => setSelectedKelompok('TK B')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedKelompok === 'TK B'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    TK B (Kelompok B, Usia 5-6 Thn)
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-500 block">Tahun Ajaran Aktif:</span>
              <span className="font-bold text-emerald-800 text-sm">{academicYear}</span>
            </div>
          </div>

          {/* Table Tema */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-950">
                Silabus Tema & Subtema: {semester} • {selectedKelompok === 'TK A' ? 'TK A (Kelompok A, Usia 4-5 Thn)' : 'TK B (Kelompok B, Usia 5-6 Thn)'}
              </span>
              <span className="text-[11px] text-emerald-800 font-medium">Model Bermain Belajar Sentra & Loose Parts</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Waktu / Alokasi</th>
                    <th className="px-4 py-3">Tema Pokok</th>
                    <th className="px-4 py-3">Subtema & Topik Eksplorasi</th>
                    <th className="px-4 py-3">Durasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentThemes.map((th, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-medium text-slate-900">{th.bulan}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          {th.tema}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 leading-relaxed">{th.subtema}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{th.durasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CP & P2RA */}
      {activeTab === 'cp' && (
        <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200 space-y-6">
          {/* P2RA Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Penguatan Karakter Khas Madrasah</span>
              </div>
              <h3 className="font-bold text-base text-white mt-1">
                Profil Pelajar Rahmatan lil 'Alamin (P2RA)
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Nilai keteladanan: Berkeadaban (Ta'addub), Keteladanan (Qudwah), Kewarganegaraan & Kebangsaan (Muwatanah), Mengambil Jalan Tengah (Tawassut), Berimbang (Tawazun), dan Toleransi (Tasamuh).
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-lg whitespace-nowrap shadow-xs">
              Kemenag RI Certified
            </span>
          </div>

          <div className="space-y-4">
            {learningOutcomes.map((cp, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border ${cp.color}`}>
                <h4 className="font-bold text-sm mb-1">{cp.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">{cp.description}</p>
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1.5">
                    Indikator Stimulasi Perkembangan:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {cp.indicators.map((ind, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Kalender Pendidikan RA (Edit, Tambah, Hapus, Cetak, Export Excel) */}
      {activeTab === 'kalender' && (
        <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200 space-y-5">
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Kalender Pendidikan & Agenda RA {academicYear}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {filteredCalendarEvents.length} Agenda
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kementerian Agama RI &bull; Hari Efektif Belajar & Program Unggulan
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCalendarExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setPrintCalendarOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cetak Kalender (PDF)</span>
              </button>
              <button
                onClick={handleOpenAddCalendar}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Agenda</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5">
              {(['Semua', 'Semester Ganjil', 'Semester Genap'] as const).map(sem => (
                <button
                  key={sem}
                  onClick={() => setCalendarFilter(sem)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    calendarFilter === sem
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari agenda kegiatan..."
                value={calendarSearch}
                onChange={e => setCalendarSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Calendar List */}
          <div className="space-y-3">
            {filteredCalendarEvents.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                Tidak ada agenda kegiatan yang cocok dengan filter. Klik "+ Tambah Agenda" untuk menambahkan.
              </div>
            ) : (
              filteredCalendarEvents.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition"
                >
                  {/* Date Badge */}
                  <div className="w-32 text-center shrink-0 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                    <div className="font-extrabold text-xs text-emerald-900 leading-tight">
                      {item.tanggal}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                      {item.semester}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {item.kategori}
                      </span>
                      {item.tanggalMulai && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.tanggalMulai} {item.tanggalSelesai ? `s/d ${item.tanggalSelesai}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 text-xs leading-snug">
                      {item.agenda}
                    </div>
                    {item.keterangan && (
                      <div className="text-[11px] text-slate-500 mt-1 italic">
                        {item.keterangan}
                      </div>
                    )}
                  </div>

                  {/* Actions (Edit & Hapus) */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleOpenEditCalendar(item)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                      title="Edit Agenda"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCalendar(item.id, item.agenda)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Hapus Agenda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL INPUT / EDIT AGENDA KALENDER PENDIDIKAN */}
      {calendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingEvent ? 'Edit Agenda Kalender Pendidikan' : 'Tambah Agenda Kalender Pendidikan'}
                </h3>
              </div>
              <button
                onClick={() => setCalendarModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCalendar} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Agenda / Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={calendarForm.agenda}
                  onChange={e => setCalendarForm({ ...calendarForm, agenda: e.target.value })}
                  placeholder="Contoh: Manasik Haji Cilik se-Kota Bandung"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teks Tanggal Agenda (Tampilan) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={calendarForm.tanggal}
                  onChange={e => setCalendarForm({ ...calendarForm, tanggal: e.target.value })}
                  placeholder="Contoh: 15 Oktober 2026 atau 15-18 Desember 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={calendarForm.tanggalMulai || ''}
                    onChange={e => setCalendarForm({ ...calendarForm, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={calendarForm.tanggalSelesai || ''}
                    onChange={e => setCalendarForm({ ...calendarForm, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Agenda</label>
                  <select
                    value={calendarForm.kategori}
                    onChange={e => setCalendarForm({ ...calendarForm, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Nasional">Nasional / Upacara</option>
                    <option value="PHBI">PHBI / Hari Besar Islam</option>
                    <option value="Program Unggulan">Program Unggulan RA</option>
                    <option value="Kompetisi">Porseni / Lomba</option>
                    <option value="Evaluasi">Evaluasi / Rapor</option>
                    <option value="Keagamaan">Pesantren / Ibadah</option>
                    <option value="Kelulusan">Wisuda / Akhirussanah</option>
                    <option value="Libur">Libur Semester / Nasional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={calendarForm.semester}
                    onChange={e => setCalendarForm({ ...calendarForm, semester: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Semester Ganjil">Semester Ganjil</option>
                    <option value="Semester Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Keterangan Tambahan / Catatan Khusus</label>
                <textarea
                  rows={2}
                  value={calendarForm.keterangan || ''}
                  onChange={e => setCalendarForm({ ...calendarForm, keterangan: e.target.value })}
                  placeholder="Catatan perlengkapan, pelibatan orang tua, lokasi, dsb."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCalendarModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer font-semibold"
                >
                  Batal / Kembali
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  {editingEvent ? 'Simpan Perubahan' : 'Tambahkan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CETAK KALENDER PENDIDIKAN RESMI RA */}
      {printCalendarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Pratinjau Cetak: Kalender Pendidikan Resmi {profile.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Tahun Ajaran {academicYear} &bull; Siap dicetak atau disimpan ke PDF
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  onClick={() => setPrintCalendarOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Tutup / Kembali
                </button>
              </div>
            </div>

            {/* Printable Sheet */}
            <div className="p-6 bg-white border border-slate-300 rounded-xl space-y-5 font-serif text-xs printable-area">
              {/* Kop Surat Resmi */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 gap-4">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="Logo RA"
                    className="w-16 h-16 object-contain shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center text-xl border-2 border-amber-400">
                    RA
                  </div>
                )}
                <div className="flex-1 text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-base font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[10px] text-slate-600 font-sans">
                    NSM: {profile.nsm} &bull; NPSN: {profile.npsn} &bull; Status Akreditasi: {profile.accreditation}
                  </div>
                  <div className="text-[9px] text-slate-500 font-sans">{profile.address} &bull; Telp: {profile.phone}</div>
                </div>
                <div className="w-16 shrink-0" />
              </div>

              <div className="text-center space-y-1">
                <div className="font-bold text-xs uppercase underline">
                  KALENDER PENDIDIKAN DAN JADWAL KEGIATAN TAHUNAN RAUDLATUL ATHFAL
                </div>
                <div className="text-[11px] font-sans text-slate-700">
                  Tahun Ajaran: {academicYear} &bull; Status: Kurikulum Merdeka PAUD/RA
                </div>
              </div>

              {/* Table of Events */}
              <div className="font-sans text-[11px]">
                <table className="w-full text-left border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="p-2 border-r border-slate-300 text-center w-10">No.</th>
                      <th className="p-2 border-r border-slate-300 w-36">Waktu / Tanggal</th>
                      <th className="p-2 border-r border-slate-300 w-28">Kategori</th>
                      <th className="p-2 border-r border-slate-300">Nama Agenda / Kegiatan</th>
                      <th className="p-2 w-28 text-center">Semester</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCalendarEvents.map((item, i) => (
                      <tr key={item.id}>
                        <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-500">{i + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-800">{item.tanggal}</td>
                        <td className="p-2 border-r border-slate-200 font-medium text-emerald-800">{item.kategori}</td>
                        <td className="p-2 border-r border-slate-200 font-semibold text-slate-900">
                          {item.agenda}
                          {item.keterangan && (
                            <div className="text-[10px] text-slate-500 font-normal italic mt-0.5">
                              {item.keterangan}
                            </div>
                          )}
                        </td>
                        <td className="p-2 text-center text-slate-700">{item.semester}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature Block (Kepala on LEFT, Waka Kurikulum on RIGHT) */}
              <div className="pt-8 flex justify-between font-sans text-[11px] text-slate-800">
                <div className="text-center">
                  <div>Mengetahui & Mengesahkan,</div>
                  <div className="font-bold">Kepala Raudlatul Athfal</div>
                  <div className="mt-14 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>

                <div className="text-center">
                  <div>Bandung, 15 Juli 2026</div>
                  <div className="font-bold">Guru / Waka Bidang Kurikulum</div>
                  <div className="mt-14 font-semibold underline">{wakaKurikulum.nama}</div>
                  <div>NIP: {wakaKurikulum.nip || '-'}</div>
                </div>
              </div>
            </div>

            {/* Bottom Back Button */}
            <div className="flex justify-end pt-3 border-t border-slate-200 no-print">
              <button
                onClick={() => setPrintCalendarOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                ← Kembali ke Menu Kalender
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cetak Dokumen Kurikulum Lengkap */}
      {printDocOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dokumen Kurikulum Operasional Madrasah (KOM) RA</h3>
                <p className="text-xs text-slate-500">Silabus tema, capaian pembelajaran, dan pengesahan kurikulum RA.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Cetak / PDF
                </button>
                <button
                  onClick={() => setPrintDocOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Printable Document Sheet with Official Kop & Logo */}
            <div className="p-6 bg-white border border-slate-300 rounded-xl space-y-5 font-serif text-xs">
              {/* Kop with Logo */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 gap-4">
                <img
                  src={profile.logoUrl}
                  alt="Logo RA"
                  className="w-14 h-14 object-contain shrink-0"
                />
                <div className="flex-1 text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider">{profile.foundation}</div>
                  <div className="text-base font-extrabold uppercase text-slate-900">{profile.name}</div>
                  <div className="text-[10px] text-slate-600 font-sans">
                    NSM: {profile.nsm} • NPSN: {profile.npsn} • Status: {profile.accreditation}
                  </div>
                  <div className="text-[9px] text-slate-500 font-sans">{profile.address} • Telp: {profile.phone}</div>
                </div>
                <div className="w-14 shrink-0" />
              </div>

              <div className="text-center font-bold text-xs uppercase underline">
                PENGESAHAN STRUKTUR KURIKULUM DAN PEMETAAN TEMA RAUDLATUL ATHFAL
              </div>
              <div className="text-center text-[11px] font-sans text-slate-600">
                Tahun Ajaran: {academicYear} • {semester} • {selectedKelompok}
              </div>

              {/* Table of Themes */}
              <div className="font-sans text-[11px]">
                <div className="font-bold mb-2">A. Pemetaan Tema & Subtema Pembelajaran:</div>
                <table className="w-full text-left border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="p-2 border-r border-slate-300">No.</th>
                      <th className="p-2 border-r border-slate-300">Waktu</th>
                      <th className="p-2 border-r border-slate-300">Tema</th>
                      <th className="p-2 border-r border-slate-300">Subtema</th>
                      <th className="p-2">Durasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentThemes.map((th, i) => (
                      <tr key={i}>
                        <td className="p-2 border-r border-slate-200 text-center">{i + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-semibold">{th.bulan}</td>
                        <td className="p-2 border-r border-slate-200">{th.tema}</td>
                        <td className="p-2 border-r border-slate-200">{th.subtema}</td>
                        <td className="p-2">{th.durasi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature Block (2 Parties: Kepala on LEFT, Guru/Waka Kurikulum on RIGHT) */}
              <div className="pt-8 flex justify-between font-sans text-[11px] text-slate-800">
                <div className="text-center">
                  <div>Mengetahui & Mengesahkan,</div>
                  <div className="font-bold">Kepala Raudlatul Athfal</div>
                  <div className="mt-14 font-semibold underline">{profile.headmasterName}</div>
                  <div>NIP: {profile.headmasterNip || '-'}</div>
                </div>

                <div className="text-center">
                  <div>Bandung, 15 Juli 2026</div>
                  <div className="font-bold">Guru / Waka Bidang Kurikulum</div>
                  <div className="mt-14 font-semibold underline">{wakaKurikulum.nama}</div>
                  <div>NIP: {wakaKurikulum.nip || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
