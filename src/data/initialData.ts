import {
  SchoolProfile,
  VisionGoal,
  Student,
  Employee,
  PPDBApplicant,
  RPPHItem,
  TeachingJournal,
  StudentAttendance,
  StaffAttendance,
  ChildAssessment,
  ChildReport,
  SupervisionRecord,
  CashTransaction,
  BOSComponent,
  ParentCommunication,
  LetterRecord,
  AssetRecord,
  ChildSecurityRecord,
  User,
  SchoolProgram,
  SchoolAchievement,
  BOSPlanItem,
  BOSRealizationItem,
  AccreditationStandardItem,
  ClassGroup,
  BOSReceipt,
  PPDBInquiry,
  UserAccount,
  PKKMItem,
  AcademicCalendarEvent,
  PengawasRecord,
  WebsiteConfig,
} from '../types';

export const INITIAL_PROFILE: SchoolProfile = {
  name: 'RA Terpadu Al-Azhar Cendekia',
  nsm: '101232010088',
  npsn: '69982410',
  status: 'Swasta',
  foundation: 'Yayasan Pendidikan Islam Al-Azhar Cendekia',
  address: 'Jl. Masjid Raya No. 45, Kompleks Islamic Center, Kec. Cendekia, Kota Bandung, Jawa Barat 40123',
  googleMapsUrl: 'https://maps.google.com/?q=Bandung',
  phone: '(022) 7890-1234 / 0812-3456-7890',
  email: 'info@ra-alazharcendekia.sch.id',
  website: 'https://ra-alazharcendekia.sch.id',
  socialMedia: {
    instagram: '@ra_alazharcendekia',
    facebook: 'RA Al-Azhar Cendekia Official',
    youtube: 'RA Al-Azhar TV',
  },
  headmasterName: 'Dra. Hj. Siti Fatimah, M.Pd.I',
  headmasterNip: '19760512 200501 2 003',
  establishedYear: '2014',
  accreditation: 'A (Unggul)',
  motto: 'Membina Generasi Qurani, Cerdas, Mandiri, dan Berakhlak Mulia',
  history: 'Raudlatul Athfal (RA) Terpadu Al-Azhar Cendekia didirikan pada tahun 2014 di bawah naungan Yayasan Pendidikan Islam Al-Azhar Cendekia dengan komitmen menghadirkan pendidikan anak usia dini yang memadukan kurikulum nasional, nilai-nilai adab Nabawiyah, tahfidz juz 30, serta pendekatan bermain yang memerdekakan potensi fitrah anak.',
  logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  rombelCount: 4,
  totalTeachers: 8,
  totalStudents: 74,
};

export const INITIAL_VISION_GOALS: VisionGoal = {
  vision: 'Mewujudkan Raudlatul Athfal Digital yang Islami, Cerdas, Kreatif, Aman, Bermutu, dan Berorientasi pada Masa Depan Anak.',
  missions: [
    'Menanamkan aqidah yang kokoh dan pembiasaan akhlakul karimah sejak dini melalui keteladanan.',
    'Menyelenggarakan pembelajaran berbasis bermain bermakna yang menstimulasi 7 aspek tumbuh kembang anak secara seimbang.',
    'Memanfaatkan teknologi cerdas (Smart AI) untuk mempermudah administrasi guru, asesmen otentik, dan pelaporan yang transparan.',
    'Membangun sinergi harmonis antara RA, orang tua, pengawas madrasah, dan masyarakat dalam mengawal tumbuh kembang peserta didik.',
    'Mewujudkan tata kelola kelembagaan dan akuntabilitas keuangan BOS yang tertib, bersih, dan amanah.'
  ],
  goals: [
    'Digitalisasi 100% administrasi, rapor, presensi, dan layanan RA.',
    'Meningkatkan mutu pembelajaran dan kompetensi pedagogis guru berbasis Kurikulum Merdeka PAUD/RA.',
    'Tercapainya hafalan minimal 15 surat pendek juz 30, hadits harian, dan doa sehari-hari bagi lulusan.',
    'Mempermudah pemantauan tumbuh kembang peserta didik melalui portofolio dan asesmen digital.',
    'Mewujudkan pengelolaan keuangan dan BOS yang transparan serta akuntabel sesuai juknis Kemenag.',
    'Memperkuat komunikasi hangat dan kemitraan kolaboratif antara guru dan orang tua murid.',
    'Mengembangkan supervisi akademik dan manajerial secara digital bagi Kepala RA dan Pengawas Pembina.'
  ]
};

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Dra. Hj. Siti Fatimah, M.Pd.I', role: 'kepala', email: 'kepala@smartra.sch.id', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80', phone: '081234567890' },
  { id: 'u2', name: 'Guru Nurul Hidayah, S.Pd.I', role: 'guru', email: 'nurul@smartra.sch.id', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80', assignedClass: 'Kelompok B1 (Abu Bakar)', phone: '081345678901' },
  { id: 'u3', name: 'Guru Maryam Fauziyah, S.Pd', role: 'guru', email: 'maryam@smartra.sch.id', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', assignedClass: 'Kelompok A1 (Khadijah)', phone: '081456789012' },
  { id: 'u4', name: 'Hj. Anisa Rahmawati, S.E', role: 'bendahara', email: 'bendahara@smartra.sch.id', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80', phone: '081567890123' },
  { id: 'u5', name: 'Drs. H. Ahmad Fauzi, M.Ag', role: 'pengawas', email: 'pengawas@kemenag.go.id', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', phone: '081678901234' },
  { id: 'u6', name: 'Bunda Rina Wardani, S.Sos', role: 'orangtua', email: 'rina.wardani@gmail.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', phone: '081789012345' },
  { id: 'u7', name: 'Muhammad Ridwan, S.Kom', role: 'tu', email: 'tu@smartra.sch.id', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', phone: '081890123456' },
  { id: 'u8', name: 'KH. Dr. Abdullah Syakir, M.A', role: 'yayasan', email: 'yayasan@alazharcendekia.id', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', phone: '081901234567' },
  { id: 'u0', name: 'Super Administrator', role: 'superadmin', email: 'admin@smartra.sch.id', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80', phone: '081122334455' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    nis: '202501001',
    nisn: '3198745612',
    nama: 'Muhammad Rayyan Al-Ghifari',
    jk: 'L',
    tempatLahir: 'Bandung',
    tanggalLahir: '2020-04-15',
    namaAyah: 'dr. Hendra Setiawan, Sp.A',
    namaIbu: 'Rina Wardani, S.Sos',
    alamat: 'Jl. Dago Asri No. 12, Bandung',
    noHpOrtu: '081789012345',
    tahunMasuk: '2025',
    kelompok: 'B',
    kelas: 'Kelompok B1 (Abu Bakar)',
    nik: '3273011504200001',
    noKk: '3273011202150005',
    catatanKesehatan: 'Alergi dingin ringan, membawa inhaler darurat jika kambuh',
    status: 'aktif',
    foto: 'https://images.unsplash.com/photo-1595454223600-91fb5799a9a3?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's2',
    nis: '202501002',
    nisn: '3198745613',
    nama: 'Aisyah Humaira Azzahra',
    jk: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2020-08-22',
    namaAyah: 'Fahmi Zakariya, S.T',
    namaIbu: 'Dewi Lestari, S.Pd',
    alamat: 'Jl. Terusan Buah Batu No. 78, Bandung',
    noHpOrtu: '081234567891',
    tahunMasuk: '2025',
    kelompok: 'B',
    kelas: 'Kelompok B1 (Abu Bakar)',
    nik: '3273022208200002',
    noKk: '3273021903180003',
    catatanKesehatan: 'Sehat, imunisasi lengkap sesuai buku KIA',
    status: 'aktif',
    foto: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's3',
    nis: '202501003',
    nisn: '3198745614',
    nama: 'Fatih Khalid Al-Ayyubi',
    jk: 'L',
    tempatLahir: 'Cimahi',
    tanggalLahir: '2020-01-10',
    namaAyah: 'Agus Salim, M.Si',
    namaIbu: 'Farida Nur, S.E',
    alamat: 'Kompleks Permata Indah Blok C3 No. 9',
    noHpOrtu: '081321456780',
    tahunMasuk: '2025',
    kelompok: 'B',
    kelas: 'Kelompok B2 (Umar bin Khattab)',
    nik: '3273031001200003',
    noKk: '3273031002160007',
    catatanKesehatan: 'Tidak ada riwayat alergi makanan',
    status: 'aktif',
    foto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's4',
    nis: '202602001',
    nisn: '3208745615',
    nama: 'Maryam Sabira Khairunnisa',
    jk: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2021-03-05',
    namaAyah: 'Taufiq Hidayat, M.Kom',
    namaIbu: 'Khadijah Rahmi, S.Farm',
    alamat: 'Jl. Riau Indah No. 34, Bandung',
    noHpOrtu: '081298765432',
    tahunMasuk: '2026',
    kelompok: 'A',
    kelas: 'Kelompok A1 (Khadijah)',
    nik: '3273040503210004',
    noKk: '3273041405190002',
    catatanKesehatan: 'Alergi makanan laut (udang/kepiting)',
    status: 'aktif',
    foto: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's5',
    nis: '202602002',
    nisn: '3208745616',
    nama: 'Bilal Habasyi Prasetyo',
    jk: 'L',
    tempatLahir: 'Bandung',
    tanggalLahir: '2021-06-18',
    namaAyah: 'Budi Prasetyo, S.Sos',
    namaIbu: 'Nita Anggraeni, S.Psi',
    alamat: 'Jl. Gegerkalong Hilir No. 19',
    noHpOrtu: '081345671239',
    tahunMasuk: '2026',
    kelompok: 'A',
    kelas: 'Kelompok A2 (Fathimah Az-Zahra)',
    nik: '3273051806210005',
    noKk: '3273052007200001',
    catatanKesehatan: 'Sehat prima, sangat aktif bermain fisik',
    status: 'aktif',
    foto: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    nip: '19760512 200501 2 003',
    nuptk: '4534754656200023',
    nama: 'Dra. Hj. Siti Fatimah, M.Pd.I',
    jk: 'P',
    pendidikan: 'S2 Magister Pendidikan Islam (UIN SGD)',
    statusKepegawaian: 'PNS',
    jabatan: 'Kepala RA',
    golRuang: 'IV/a (Pembina)',
    sertifikasi: true,
    skTugas: 'SK.Kemenag/RA-01/2023',
    noHp: '081234567890',
    email: 'kepala@smartra.sch.id',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    jadwalMengajar: 'Manajerial & Penguatan Karakter Qurani (Senin 07.30 - 09.00)',
  },
  {
    id: 'e2',
    nip: '19850914 201101 2 008',
    nuptk: '6745763665210042',
    nama: 'Guru Nurul Hidayah, S.Pd.I',
    jk: 'P',
    pendidikan: 'S1 Pendidikan Islam Anak Usia Dini (PIAUD)',
    statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
    jabatan: 'Guru Kelas',
    golRuang: 'III/b',
    sertifikasi: true,
    skTugas: 'SK.YAYASAN/04/GTY/2024',
    noHp: '081345678901',
    email: 'nurul@smartra.sch.id',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    jadwalMengajar: 'Wali Kelas Kelompok B1 (Senin-Jumat 07.30 - 11.30)',
  },
  {
    id: 'e3',
    nip: '-',
    nuptk: '8839762664200011',
    nama: 'Guru Maryam Fauziyah, S.Pd',
    jk: 'P',
    pendidikan: 'S1 PG-PAUD (UPI Bandung)',
    statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
    jabatan: 'Guru Kelas',
    golRuang: 'III/a',
    sertifikasi: true,
    skTugas: 'SK.YAYASAN/05/GTY/2024',
    noHp: '081456789012',
    email: 'maryam@smartra.sch.id',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    jadwalMengajar: 'Wali Kelas Kelompok A1 (Senin-Jumat 07.30 - 11.00)',
  },
  {
    id: 'e4',
    nip: '-',
    nama: 'Hj. Anisa Rahmawati, S.E',
    jk: 'P',
    pendidikan: 'S1 Akuntansi Keuangan',
    statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
    jabatan: 'Bendahara',
    sertifikasi: false,
    skTugas: 'SK.YAYASAN/08/BND/2023',
    noHp: '081567890123',
    email: 'bendahara@smartra.sch.id',
    foto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    jadwalMengajar: 'Administrasi Keuangan & Kas BOS (Senin-Jumat)',
  },
  {
    id: 'e5',
    nip: '-',
    nama: 'Muhammad Ridwan, S.Kom',
    jk: 'L',
    pendidikan: 'S1 Sistem Informasi',
    statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
    jabatan: 'Tenaga Administrasi',
    sertifikasi: false,
    skTugas: 'SK.YAYASAN/10/TU/2023',
    noHp: '081890123456',
    email: 'tu@smartra.sch.id',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    jadwalMengajar: 'Administrasi Surat, Data EMIS & PPDB',
  },
];

export const INITIAL_PPDB: PPDBApplicant[] = [
  {
    id: 'p1',
    noPendaftaran: 'PPDB-RA-2026-001',
    namaAnak: 'Zafira Althafunnisa',
    jk: 'P',
    nik: '3273065502210001',
    tempatTanggalLahir: 'Bandung, 15 Februari 2021',
    namaAyah: 'Salman Al-Farisi',
    pekerjaanAyah: 'Wiraswasta',
    namaIbu: 'Laila Zahira',
    noHpOrtu: '081223344556',
    alamat: 'Jl. Sukajadi Atas No. 101, Bandung',
    kelompokPilihan: 'A (4-5 Tahun)',
    status: 'terverifikasi',
    tanggalDaftar: '2026-03-01',
    catatan: 'Berkas akta dan KK lengkap, siap wawancara observasi anak',
  },
  {
    id: 'p2',
    noPendaftaran: 'PPDB-RA-2026-002',
    namaAnak: 'Ibrahim Hanif Al-Ghazali',
    jk: 'L',
    nik: '3273071207200003',
    tempatTanggalLahir: 'Bandung, 12 Juli 2020',
    namaAyah: 'Ahmad Ghazali, M.Pd',
    pekerjaanAyah: 'Dosen',
    namaIbu: 'Siti Aminah, S.Ag',
    noHpOrtu: '081334455667',
    alamat: 'Jl. Tubagus Ismail Raya No. 45, Bandung',
    kelompokPilihan: 'B (5-6 Tahun)',
    status: 'diterima',
    tanggalDaftar: '2026-02-28',
    catatan: 'Lulus observasi kemandirian dan tahfidz juz amma',
  },
];

export const INITIAL_RPPH: RPPHItem[] = [
  {
    id: 'r1',
    tanggal: '2026-11-04',
    kelompok: 'B (5-6 Tahun)',
    tema: 'Aku Hamba Allah',
    subtema: 'Mengenal Panca Indera Karunia Allah',
    nilaiIslam: 'Membaca basmalah, menjaga kesehatan mata dan telinga, bersyukur kepada Allah sang Maha Pencipta (Al-Khaliq)',
    tujuan: 'Anak mampu menyebutkan 5 panca indera, fungsinya, merawat ciptaan Allah, serta mengelompokkan benda berdasarkan bau dan rasa.',
    kegiatanPembukaan: 'Ikrar bersama di halaman, doa belajar, hafalan surat Al-Fatihah & An-Naas, gerak lagu "Dua Mata Saya".',
    kegiatanInti: 'Ragam 1: Eksplorasi botol sensori aroma (kopi, vanila, daun jeruk). Ragam 2: Melukis wajah dengan loose parts biji-bijian. Ragam 3: Menyusun kartu kata bergambar panca indera.',
    istirahatMakan: 'Antre cuci tangan dengan sabun, adab makan duduk dan doa makan bersama, berbagi bekal sehat.',
    kegiatanPenutup: 'Tanya jawab recalling kegiatan main, apresiasi karya anak, pesan moral menjaga mata dari tontonan baik, doa kafaratul majelis.',
    pertanyaanPemantik: 'Bagaimana rasanya jika kita menutup mata sejenak? Siapa yang menciptakan mata kita? Bagaimana cara bersyukur kepada Allah?',
    alatBahan: 'Cermin kecil, botol sensori aroma, biji-bijian alam, kertas gambar, kartu huruf panca indera.',
    asesmen: 'Ceklis capaian kognitif & catatan anekdot keterlibatan anak saat ragam main.',
    status: 'disetujui',
  },
  {
    id: 'r2',
    tanggal: '2026-11-05',
    kelompok: 'A (4-5 Tahun)',
    tema: 'Lingkunganku Ciptaan Allah',
    subtema: 'Tanaman Bunga di Taman Sekolah',
    nilaiIslam: 'Menyayangi sesama makhluk ciptaan Allah, tidak memetik bunga sembarangan, mengucapkan Subhanallah saat melihat keindahan.',
    tujuan: 'Anak mengenal macam-macam bunga, bagian bunga (kelopak, batang, daun), serta melatih motorik halus merawat tanaman.',
    kegiatanPembukaan: 'Senam ceria anak muslim, doa pembuka, bernyanyi lagu "Lihat Kebunku", pengamatan langsung ke taman sekolah.',
    kegiatanInti: 'Ragam 1: Menyiram tanaman dengan gembor mini. Ragam 2: Kolase kelopak bunga gugur pada pola vas bunga. Ragam 3: Menghitung daun kering 1-5.',
    istirahatMakan: 'Cuci tangan 6 langkah, doa makan, makan bersama buah segar.',
    kegiatanPenutup: 'Recalling bunga yang paling disukai, tepuk tanaman, doa penutup.',
    pertanyaanPemantik: 'Warna apa saja bunga yang tadi kalian lihat? Siapa yang membuat bunga harum dan mekar indah?',
    alatBahan: 'Tanaman bunga asli, gembor mini air, lem fox, kertas pola vas, daun dan kelopak bunga gugur.',
    asesmen: 'Hasil karya kolase anak dan foto observasi rasa peduli lingkungan.',
    status: 'disetujui',
  }
];

export const INITIAL_JOURNALS: TeachingJournal[] = [
  {
    id: 'j1',
    tanggal: '2026-11-04',
    guruNama: 'Guru Nurul Hidayah, S.Pd.I',
    kelas: 'Kelompok B1 (Abu Bakar)',
    tema: 'Mengenal Panca Indera Karunia Allah',
    rpphId: 'r1',
    materiKegiatan: 'Eksplorasi botol sensori aroma, kolase wajah dengan biji-bijian, dan permainan tebak rasa.',
    jumlahHadir: 18,
    jumlahTotal: 18,
    catatanPelaksanaan: 'Anak-anak sangat antusias terutama saat menebak aroma kopi dan vanila dengan mata tertutup. Rayyan dan Aisyah mampu menjelaskan dengan runtut sensasi aromanya.',
    refleksi: 'Pembelajaran berbasis sensori sangat efektif menstimulasi bahasa ekspresif anak. Semua anak aktif berpartisipasi.',
    kendalaDanTindakLanjut: 'Perlu menambahkan variasi bahan alam dengan tekstur berbeda (kasar, halus) untuk pertemuan selanjutnya.',
    fotoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_STUDENT_ATTENDANCE: StudentAttendance[] = [
  { id: 'sa1', tanggal: '2026-11-04', kelas: 'Kelompok B1 (Abu Bakar)', studentId: 's1', studentName: 'Muhammad Rayyan Al-Ghifari', status: 'Hadir', jamMasuk: '07.25' },
  { id: 'sa2', tanggal: '2026-11-04', kelas: 'Kelompok B1 (Abu Bakar)', studentId: 's2', studentName: 'Aisyah Humaira Azzahra', status: 'Hadir', jamMasuk: '07.20' },
  { id: 'sa3', tanggal: '2026-11-04', kelas: 'Kelompok B2 (Umar bin Khattab)', studentId: 's3', studentName: 'Fatih Khalid Al-Ayyubi', status: 'Hadir', jamMasuk: '07.30' },
  { id: 'sa4', tanggal: '2026-11-04', kelas: 'Kelompok A1 (Khadijah)', studentId: 's4', studentName: 'Maryam Sabira Khairunnisa', status: 'Sakit', jamMasuk: '-', keterangan: 'Demam flu, istirahat di rumah didampingi ibunda' },
  { id: 'sa5', tanggal: '2026-11-04', kelas: 'Kelompok A2 (Fathimah Az-Zahra)', studentId: 's5', studentName: 'Bilal Habasyi Prasetyo', status: 'Hadir', jamMasuk: '07.15' },
];

export const INITIAL_STAFF_ATTENDANCE: StaffAttendance[] = [
  { id: 'sta1', tanggal: '2026-11-04', employeeId: 'e1', employeeName: 'Dra. Hj. Siti Fatimah, M.Pd.I', jabatan: 'Kepala RA', jamMasuk: '07.05', jamPulang: '14.30', status: 'Hadir', lokasiGps: '-6.9175, 107.6191 (Area Sekolah)', approvalKepala: 'Disetujui' },
  { id: 'sta2', tanggal: '2026-11-04', employeeId: 'e2', employeeName: 'Guru Nurul Hidayah, S.Pd.I', jabatan: 'Guru Kelas', jamMasuk: '07.10', jamPulang: '14.00', status: 'Hadir', lokasiGps: '-6.9174, 107.6190 (Area Sekolah)', approvalKepala: 'Disetujui' },
  { id: 'sta3', tanggal: '2026-11-04', employeeId: 'e3', employeeName: 'Guru Maryam Fauziyah, S.Pd', jabatan: 'Guru Kelas', jamMasuk: '07.12', jamPulang: '14.00', status: 'Hadir', lokasiGps: '-6.9175, 107.6192 (Area Sekolah)', approvalKepala: 'Disetujui' },
  { id: 'sta4', tanggal: '2026-11-04', employeeId: 'e4', employeeName: 'Hj. Anisa Rahmawati, S.E', jabatan: 'Bendahara', jamMasuk: '07.25', jamPulang: '14.30', status: 'Hadir', lokasiGps: '-6.9176, 107.6193 (Area Sekolah)', approvalKepala: 'Disetujui' },
  { id: 'sta5', tanggal: '2026-11-04', employeeId: 'e5', employeeName: 'Muhammad Ridwan, S.Kom', jabatan: 'Tenaga Administrasi', jamMasuk: '07.15', jamPulang: '14.30', status: 'Hadir', lokasiGps: '-6.9175, 107.6191 (Area Sekolah)', approvalKepala: 'Disetujui' },
];

export const INITIAL_ASSESSMENTS: ChildAssessment[] = [
  {
    id: 'as1',
    studentId: 's1',
    studentName: 'Muhammad Rayyan Al-Ghifari',
    tanggal: '2026-11-04',
    aspek: 'Nilai Agama & Moral',
    jenis: 'Ceklis Observasi',
    deskripsi: 'Rayyan mampu melafalkan doa sebelum dan sesudah makan dengan tartil tanpa perlu diingatkan guru.',
    capaian: 'BSB (Berkembang Sangat Baik)',
  },
  {
    id: 'as2',
    studentId: 's1',
    studentName: 'Muhammad Rayyan Al-Ghifari',
    tanggal: '2026-11-04',
    aspek: 'Jati Diri & Sosem',
    jenis: 'Catatan Anekdot',
    deskripsi: 'Saat Fatih menjatuhkan kotak krayon, Rayyan spontan menghampiri dan membantu memungut krayon sambil berkata: "Sini aku bantu biar cepat selesai".',
    capaian: 'BSB (Berkembang Sangat Baik)',
  },
  {
    id: 'as3',
    studentId: 's2',
    studentName: 'Aisyah Humaira Azzahra',
    tanggal: '2026-11-04',
    aspek: 'Seni & Kreativitas',
    jenis: 'Hasil Karya',
    deskripsi: 'Aisyah membuat karya kolase masjid dengan memadukan biji jagung, kuaci, dan daun kering. Garis tepinya rapi dan penataan warnanya estetis.',
    capaian: 'BSB (Berkembang Sangat Baik)',
    fotoKarya: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_SUPERVISIONS: SupervisionRecord[] = [
  {
    id: 'sup1',
    tanggal: '2026-10-28',
    supervisorRole: 'kepala',
    supervisorName: 'Dra. Hj. Siti Fatimah, M.Pd.I',
    targetTeacherName: 'Guru Nurul Hidayah, S.Pd.I',
    jenis: 'Supervisi Akademik',
    aspek: ['Perencanaan RPPH', 'Pelaksanaan Pembelajaran Berbasis Bermain', 'Penggunaan Loose Parts', 'Interaksi Positif dengan Anak'],
    skor: 94,
    catatanObservasi: 'Penguasaan kelas sangat prima, transisi kegiatan pembukaan ke inti berjalan mulus dan bernuansa kasih sayang. Penguatan adab islami mengalir alami sepanjang pembelajaran.',
    rekomendasi: 'Pertahankan praktik baik penggunaan loose parts alam; perlu eksplorasi tambahan media audio visual interaktif untuk sains.',
    statusTindakLanjut: 'Tuntas Memuaskan',
    tandaTangan: true,
  },
  {
    id: 'sup2',
    tanggal: '2026-10-15',
    supervisorRole: 'pengawas',
    supervisorName: 'Drs. H. Ahmad Fauzi, M.Ag',
    targetRaName: 'RA Terpadu Al-Azhar Cendekia',
    jenis: 'Supervisi Manajerial',
    aspek: ['Kelengkapan Dokumen Kurikulum Operasional RA (KORA)', 'Pengelolaan Administrasi Guru & Siswa', 'Transparansi Realisasi BOS', 'Kesiapan Akreditasi BAN-PDM'],
    skor: 96,
    catatanObservasi: 'RA Al-Azhar Cendekia menunjukkan tata kelola kelembagaan digital yang sangat maju. Dokumen Kurikulum Merdeka RA tersusun sistematis dengan integrasi nilai P2RA.',
    rekomendasi: 'Lanjutkan pengimbasan best practice digitalisasi manajemen RA ke lembaga-lembaga binaan lain di KKG RA Kecamatan.',
    statusTindakLanjut: 'Tuntas Memuaskan',
    tandaTangan: true,
  }
];

export const INITIAL_CASH_TRANSACTIONS: CashTransaction[] = [
  { id: 'c1', tanggal: '2026-10-01', noBukti: 'BOS-IN-2026/01', jenis: 'Masuk', sumberDana: 'BOS Kemenag', kategori: 'Penyaluran Dana BOS Tahap II', nominal: 37000000, penerimaPembayar: 'Bendahara Kemenag Kota', keterangan: 'Pencairan Dana BOS Tahap II (74 Siswa x Rp 500.000)', hasKwitansi: true },
  { id: 'c2', tanggal: '2026-10-05', noBukti: 'BOS-OUT-2026/02', jenis: 'Keluar', sumberDana: 'BOS Kemenag', kategori: 'Honorarium Guru & Tenaga Kependidikan', nominal: 14500000, penerimaPembayar: 'Guru & Pegawai RA', keterangan: 'Honorarium mengajar bulan Oktober 2026 untuk 5 guru non-sertifikasi', hasKwitansi: true },
  { id: 'c3', tanggal: '2026-10-10', noBukti: 'BOS-OUT-2026/03', jenis: 'Keluar', sumberDana: 'BOS Kemenag', kategori: 'Bahan Ajar & Alat Permainan Edukatif (APE)', nominal: 6850000, penerimaPembayar: 'CV Media Ceria Edukasi', keterangan: 'Pengadaan paket loose parts kayu alam, pasir kinetik, dan buku cerita bergambar', hasKwitansi: true },
  { id: 'c4', tanggal: '2026-10-15', noBukti: 'SPP-IN-2026/10', jenis: 'Masuk', sumberDana: 'SPP Siswa', kategori: 'Penerimaan Iuran SPP Bulanan', nominal: 22200000, penerimaPembayar: 'Wali Murid RA (74 Siswa)', keterangan: 'Pembayaran SPP bulan Oktober 2026 via transfer virtual account', hasKwitansi: true },
  { id: 'c5', tanggal: '2026-10-20', noBukti: 'KOM-OUT-2026/04', jenis: 'Keluar', sumberDana: 'Dana Komite / Yayasan', kategori: 'Pemeliharaan Sarana & Prasarana', nominal: 3200000, penerimaPembayar: 'Toko Bangunan Berkah Abadi', keterangan: 'Pengecatan ulang area bermain outdoor dan perbaikan kanopi halaman', hasKwitansi: true },
  { id: 'c6', tanggal: '2026-10-25', noBukti: 'INF-IN-2026/01', jenis: 'Masuk', sumberDana: 'Infaq & Donasi', kategori: 'Infaq Jumat Berkah Siswa & Ortu', nominal: 1850000, penerimaPembayar: 'Kotak Infaq RA', keterangan: 'Penyaluran infaq untuk santunan anak yatim binaan RA', hasKwitansi: true }
];

export const INITIAL_BOS_COMPONENTS: BOSComponent[] = [
  { kode: '01', nama: 'Penerimaan Peserta Didik Baru (PPDB)', anggaran: 3000000, realisasi: 2800000 },
  { kode: '02', nama: 'Pengembangan Perpustakaan & Pojok Baca Digital', anggaran: 6000000, realisasi: 5400000 },
  { kode: '03', nama: 'Kegiatan Pembelajaran & Ekstrakurikuler Bermain', anggaran: 18000000, realisasi: 16200000 },
  { kode: '04', nama: 'Kegiatan Evaluasi & Asesmen Pembelajaran', anggaran: 4000000, realisasi: 3750000 },
  { kode: '05', nama: 'Pengelolaan & Administrasi Madrasah/RA', anggaran: 5000000, realisasi: 4600000 },
  { kode: '06', nama: 'Pengembangan Profesi Guru & Tenaga Kependidikan', anggaran: 6000000, realisasi: 5500000 },
  { kode: '07', nama: 'Langganan Daya, Jasa, dan Internet Sekolah', anggaran: 4000000, realisasi: 3800000 },
  { kode: '08', nama: 'Pemeliharaan Sarana dan Prasarana RA', anggaran: 8000000, realisasi: 7100000 },
  { kode: '09', nama: 'Pembayaran Honor Guru Non-Sertifikasi', anggaran: 20000000, realisasi: 19500000 },
];

export const INITIAL_PARENT_MESSAGES: ParentCommunication[] = [
  {
    id: 'pm1',
    studentId: 's1',
    studentName: 'Muhammad Rayyan Al-Ghifari',
    parentName: 'Bunda Rina Wardani, S.Sos',
    teacherName: 'Guru Nurul Hidayah, S.Pd.I',
    kelas: 'Kelompok B1 (Abu Bakar)',
    subject: 'Konfirmasi Obat Alergi Rayyan',
    message: 'Assalamu alaikum Bu Guru Nurul, tadi pagi Rayyan saya bawakan inhaler di saku tasnya karena semalam agak batuk dingin. Mohon bantuannya dipantau jika napasnya terdengar berat ya Bu Guru. Jazakillahu khairan.',
    reply: 'Wa alaikumussalam warahmatullah Bunda Rina. Baik Bunda, inhaler sudah kami amankan di kotak P3K kelas dan Rayyan hari ini ceria sekali bermain sensori. Kami pantau terus ya Bunda.',
    tanggal: '2026-11-04 07.40',
    status: 'Dibalas',
    isPermit: false,
  },
  {
    id: 'pm2',
    studentId: 's4',
    studentName: 'Maryam Sabira Khairunnisa',
    parentName: 'Ibunda Khadijah Rahmi',
    teacherName: 'Guru Maryam Fauziyah, S.Pd',
    kelas: 'Kelompok A1 (Khadijah)',
    subject: 'Surat Izin Tidak Masuk Sekolah (Sakit)',
    message: 'Assalamu alaikum Bu Guru Maryam, ananda Maryam hari ini izin tidak masuk sekolah dikarenakan demam tinggi sejak tadi malam dan sedang istirahat. Mohon doanya agar lekas sehat.',
    reply: 'Wa alaikumussalam warahmatullah Bunda Khadijah. Syafakillah untuk ananda Maryam shalihah. Semoga lekas sembuh dan bisa ceria belajar kembali bersama teman-teman.',
    tanggal: '2026-11-04 06.50',
    status: 'Dibalas',
    isPermit: true,
  }
];

export const INITIAL_LETTERS: LetterRecord[] = [
  { id: 'l1', jenis: 'Surat Masuk', noSurat: 'B-142/Kk.10.19/2/PP.00/10/2026', tanggal: '2026-10-20', perihal: 'Undangan Workshop Kurikulum Merdeka RA Tingkat Kemenag', pengirimPenerima: 'Kantor Kementerian Agama Kota Bandung', keterangan: 'Dihadiri oleh Kepala RA dan 1 orang guru', status: 'Diproses' },
  { id: 'l2', jenis: 'Surat Keluar', noSurat: '045/RA-AC/SRT/XI/2026', tanggal: '2026-11-01', perihal: 'Pemberitahuan Kegiatan Manasik Haji Cilik dan Parenting', pengirimPenerima: 'Seluruh Orang Tua / Wali Murid RA', keterangan: 'Pelaksanaan di Asrama Haji tanggal 20 November 2026', status: 'Terkirim' },
  { id: 'l3', jenis: 'Surat Keluar', noSurat: '046/RA-AC/KET/XI/2026', tanggal: '2026-11-02', perihal: 'Surat Keterangan Siswa Aktif Belajar (Rayyan Al-Ghifari)', pengirimPenerima: 'Wali Murid untuk Pengurusan Tunjangan Anak', keterangan: 'Dicetak resmi bertandatangan digital Kepala RA', status: 'Arsip' }
];

export const INITIAL_ASSETS: AssetRecord[] = [
  { id: 'ast1', kode: 'AST-OUT-001', nama: 'Paket Ayunan Kombinasi & Perosotan Anak', kategori: 'APE Luar (Outdoor)', jumlah: 2, kondisi: 'Baik', lokasi: 'Halaman Bermain Luar' },
  { id: 'ast2', kode: 'AST-OUT-002', nama: 'Jungkat-Jungkit Besi Standar Keamanan PAUD', kategori: 'APE Luar (Outdoor)', jumlah: 2, kondisi: 'Baik', lokasi: 'Taman Bermain Outdoor' },
  { id: 'ast3', kode: 'AST-IND-001', nama: 'Balok Kayu Edukatif Aneka Bentuk (Loose Parts)', kategori: 'APE Dalam (Indoor)', jumlah: 6, kondisi: 'Baik', lokasi: 'Sentra Rancang Bangun' },
  { id: 'ast4', kode: 'AST-IND-002', nama: 'Puzzle Kayu Huruf Hijaiyah & Angka Arab', kategori: 'APE Dalam (Indoor)', jumlah: 12, kondisi: 'Baik', lokasi: 'Pojok Baca & Literasi' },
  { id: 'ast5', kode: 'AST-MED-001', nama: 'Smart Interactive TV 55 Inch untuk Media Ajar', kategori: 'Media Audio-Visual', jumlah: 2, kondisi: 'Baik', lokasi: 'Ruang Aula & Sentra Digital' },
];

export const INITIAL_CHILD_SECURITY: ChildSecurityRecord[] = [
  { id: 'sec1', studentId: 's1', studentName: 'Muhammad Rayyan Al-Ghifari', kelas: 'Kelompok B1', namaPenjemput: 'Ibu Rina Wardani (Ibu Kandung)', hubungan: 'Orang Tua Kandung', noHpPenjemput: '081789012345', statusHariIni: 'Belum Dijemput', catatanPetugas: 'Penjemputan reguler pukul 11.30' },
  { id: 'sec2', studentId: 's2', studentName: 'Aisyah Humaira Azzahra', kelas: 'Kelompok B1', namaPenjemput: 'Bapak Fahmi Zakariya (Ayah Kandung)', hubungan: 'Orang Tua Kandung', noHpPenjemput: '081234567891', statusHariIni: 'Belum Dijemput', catatanPetugas: 'Aman' },
  { id: 'sec3', studentId: 's3', studentName: 'Fatih Khalid Al-Ayyubi', kelas: 'Kelompok B2', namaPenjemput: 'Ibu Farida Nur', hubungan: 'Orang Tua Kandung', noHpPenjemput: '081321456780', statusHariIni: 'Belum Dijemput' },
  { id: 'sec4', studentId: 's5', studentName: 'Bilal Habasyi Prasetyo', kelas: 'Kelompok A2', namaPenjemput: 'Kakek Drs. H. Subagyo', hubungan: 'Kakek (Izin Terdaftar)', noHpPenjemput: '081345671239', statusHariIni: 'Belum Dijemput', catatanPetugas: 'Sudah diverifikasi di data penjemput resmi' },
];

export const INITIAL_PROGRAMS: SchoolProgram[] = [
  {
    id: 'prg1',
    nomor: 1,
    judul: 'Tahfidz Al-Qur\'an Juz 30 & Doa Harian',
    deskripsi: 'Metode Talaqqi ceria dengan target hafalan 15 surat pendek juz 30, hadits harian tentang akhlak mulia, dan pembiasaan adab nabawiyah.',
    target: 'Seluruh peserta didik Kelompok A & B',
  },
  {
    id: 'prg2',
    nomor: 2,
    judul: 'Smart Digital & Loose Parts Discovery',
    deskripsi: 'Eksplorasi sensorik dan sains bahan alam lingkungan sekitar (biji, pasir, ranting, kayu) dipadukan dengan media interaktif ramah anak.',
    target: 'Sentra Bahan Alam & Rancang Bangun',
  },
  {
    id: 'prg3',
    nomor: 3,
    judul: 'Adab Nabawiyah & Karakter Rahmatan lil \'Alamin',
    deskripsi: 'Pembiasaan sholat dhuha berjamaah, adab makan minum Islami, berbicara santun, serta latihan empati sosial dan berbagi sedekah sejak dini.',
    target: 'Pembiasaan harian seluruh peserta didik',
  },
];

export const INITIAL_ACHIEVEMENTS: SchoolAchievement[] = [
  {
    id: 'ach1',
    judul: 'Juara 1 Lomba Tahfidz RA Tingkat Kota',
    kategori: 'Keagamaan & Tahfidz',
    tahun: '2026',
    peserta: 'Ananda Muhammad Rayyan Al-Ghifari',
    penyelenggara: 'Porseni IGRA Kota Bandung',
  },
  {
    id: 'ach2',
    judul: 'RA Berprestasi Tata Kelola Digital & Penyerapan BOS',
    kategori: 'Manajemen Kelembagaan',
    tahun: '2026',
    peserta: 'RA Terpadu Al-Azhar Cendekia',
    penyelenggara: 'Kantor Kementerian Agama Kota Bandung',
  },
  {
    id: 'ach3',
    judul: 'Juara 2 Kreativitas Kolase Bahan Alam Anak Usia Dini',
    kategori: 'Seni & Motorik Halus',
    tahun: '2025',
    peserta: 'Ananda Aisyah Humaira Azzahra',
    penyelenggara: 'Gebyar PAUD Se-Kecamatan',
  },
];

export const INITIAL_BOS_PLANS: BOSPlanItem[] = [
  {
    id: 'bp1',
    kodeKomponen: '01',
    namaKomponen: 'Penerimaan Peserta Didik Baru (PPDB)',
    uraianKegiatan: 'Penggandaan formulir, brosur informasi, dan map berkas pendaftaran peserta didik baru',
    volume: 100,
    satuan: 'Paket',
    hargaSatuan: 30000,
    totalAnggaran: 3000000,
    tahap: 'Tahap 1',
  },
  {
    id: 'bp2',
    kodeKomponen: '02',
    namaKomponen: 'Pengembangan Perpustakaan & Pojok Baca Digital',
    uraianKegiatan: 'Pengadaan paket buku cerita bergambar Islami, ensiklopedia anak, dan rak display',
    volume: 1,
    satuan: 'Paket',
    hargaSatuan: 6000000,
    totalAnggaran: 6000000,
    tahap: 'Tahap 1',
  },
  {
    id: 'bp3',
    kodeKomponen: '03',
    namaKomponen: 'Kegiatan Pembelajaran & Alat Permainan Edukatif (APE)',
    uraianKegiatan: 'Pembelian loose parts kayu alam, pasir kinetik, plastisin non-toxic, dan kertas kreasi',
    volume: 4,
    satuan: 'Kelas',
    hargaSatuan: 4500000,
    totalAnggaran: 18000000,
    tahap: 'Tahap 1',
  },
  {
    id: 'bp4',
    kodeKomponen: '09',
    namaKomponen: 'Pembayaran Honor Guru Non-Sertifikasi',
    uraianKegiatan: 'Honorarium mengajar guru tetap yayasan non-sertifikasi (5 orang x 4 bulan)',
    volume: 20,
    satuan: 'OB',
    hargaSatuan: 1000000,
    totalAnggaran: 20000000,
    tahap: 'Tahap 2',
  },
];

export const INITIAL_BOS_REALIZATIONS: BOSRealizationItem[] = [
  {
    id: 'br1',
    tanggal: '2026-10-05',
    noKwitansi: 'KW-BOS/2026/10/001',
    kodeKomponen: '09',
    namaKomponen: 'Honor Guru Non-Sertifikasi',
    uraianBelanja: 'Pembayaran honorarium 5 guru non-sertifikasi bulan Oktober 2026',
    penerima: 'Guru & Pegawai RA (Ustdz Maryam dkk)',
    nominal: 5000000,
    noFakturNota: 'SK-HONOR/X/2026',
    pph: 0,
    ppn: 0,
    statusSPJ: 'Lengkap',
    keterangan: 'Dilengkapi daftar tanda terima honorarium, SK penetapan, dan bukti transfer',
  },
  {
    id: 'br2',
    tanggal: '2026-10-12',
    noKwitansi: 'KW-BOS/2026/10/002',
    kodeKomponen: '03',
    namaKomponen: 'Alat Permainan Edukatif (APE)',
    uraianBelanja: 'Pengadaan paket loose parts balok kayu edukasi dan pasir kinetik aman',
    penerima: 'CV Media Ceria Edukasi',
    nominal: 4500000,
    noFakturNota: 'INV/MCE/2026/104',
    pph: 67500,
    ppn: 0,
    statusSPJ: 'Lengkap',
    keterangan: 'Faktur toko stempel basah, kuitansi bermaterai 10.000, berita acara serah terima barang',
  },
  {
    id: 'br3',
    tanggal: '2026-10-18',
    noKwitansi: 'KW-BOS/2026/10/003',
    kodeKomponen: '02',
    namaKomponen: 'Pojok Baca & Buku Cerita',
    uraianBelanja: 'Pembelian 25 judul buku cerita fabel Islami dan ensiklopedia sains anak',
    penerima: 'Toko Buku Berkah Ilmu',
    nominal: 2400000,
    noFakturNota: 'NOTA-TBI/882',
    pph: 0,
    ppn: 0,
    statusSPJ: 'Lengkap',
    keterangan: 'Kuitansi bermaterai, nota toko rincian judul buku, dan foto buku diterima',
  },
  {
    id: 'br4',
    tanggal: '2026-10-25',
    noKwitansi: 'KW-BOS/2026/10/004',
    kodeKomponen: '08',
    namaKomponen: 'Pemeliharaan Sarana RA',
    uraianBelanja: 'Pengecatan ulang ayunan bermain outdoor dan penggantian rantai pengaman',
    penerima: 'Bengkel Las & Cat Putra Mandiri',
    nominal: 1850000,
    noFakturNota: 'KW-PM/10/26',
    pph: 0,
    ppn: 0,
    statusSPJ: 'Lengkap',
    keterangan: 'Kwitansi bermaterai, nota pembelian cat & rantai, foto pengerjaan',
  },
];

export const INITIAL_ACCREDITATION_ITEMS: AccreditationStandardItem[] = [
  {
    id: 'acc1',
    standardNo: 1,
    standardName: 'Standar Tingkat Pencapaian Perkembangan Anak (STPPA)',
    indikator: 'Dokumen rekam capaian 7 aspek perkembangan anak usia dini terintegrasi nilai P2RA',
    berkasDisiapkan: 'Buku rekap portofolio, catatan anekdot semester, dan hasil karya anak',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Guru Nurul Hidayah, S.Pd.I',
    catatan: 'Tersedia di map portofolio kelas dan sistem digital Smart RA',
    judulBlangko: 'BLANGKO INSTRUMEN REKAPITULASI PENCAPAIAN PERKEMBANGAN ANAK (STPPA RA)',
    isiBlangko: `INSTRUMEN EVALUASI PENCAPAIAN PERKEMBANGAN ANAK USIA DINI (STPPA)
Raudlatul Athfal Berbasis Kurikulum Merdeka & Penguatan Profil Pelajar Rahmatan Lil Alamin (P5-PPRA)

I. NILAI AGAMA DAN MORAL / BUDI PEKERTI:
1. Mengenal dan meneladani Asmaul Husna, rukun iman, dan rukun Islam dalam keseharian.
2. Membiasakan adab berdoa sebelum dan sesudah beraktivitas secara khusyuk.
3. Melaksanakan gerakan dan bacaan shalat fardhu secara terbimbing.
4. Menghafal minimal 15 surat pendek Juz 30, 10 hadits adab terpuji, dan 15 doa harian.
5. Menyayangi ciptaan Allah (tumbuhan, hewan, dan sesama teman).

II. JATI DIRI DAN SOSIAL EMOSIONAL:
1. Memiliki sikap percaya diri, mandiri dalam mengurus diri sendiri (toilet training, memakai sepatu).
2. Mengenal emosi diri dan mampu mengendalikan emosi secara wajar.
3. Menunjukkan sikap toleransi, peduli, dan berbagi dengan teman sebaya.
4. Menghargai keberagaman dan bangga sebagai anak Indonesia yang berakhlakul karimah.

III. DASAR-DASAR LITERASI, MATEMATIKA, SAINS, TEKNOLOGI, REKAYASA & SENI (STEAM):
1. Mengungkapkan ide, perasaan, dan pertanyaan secara lisan dan gambar.
2. Mengenal bunyi huruf hijaiyah dan abjad latin, serta keaksaraan awal.
3. Mengenal konsep bilangan, pola, bentuk geometri, perbandingan ukuran melalui media loose parts.
4. Melakukan eksplorasi sains sederhana (pencampuran warna, benda terapung/tenggelam, menanam biji).
5. Mengekspresikan diri melalui karya seni rupa, musik, drama, dan gerak lagu Islami.

IV. FISIK MOTORIK:
1. Motorik Kasar: Berlari, melompat, melempar, menangkap bola, dan menjaga keseimbangan tubuh.
2. Motorik Halus: Menggunting pola, meronce, melipat kertas (origami), dan memegang alat tulis dengan benar.`
  },
  {
    id: 'acc2',
    standardNo: 2,
    standardName: 'Standar Isi (Kurikulum Operasional RA)',
    indikator: 'Dokumen Kurikulum Operasional RA (KORA), Alur Tujuan Pembelajaran, Program Tahunan & Semester',
    berkasDisiapkan: 'Dokumen KORA disahkan Kemenag, SK Tim Pengembang Kurikulum, Kalender Pendidikan',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Kepala RA Dra. Hj. Siti Fatimah, M.Pd.I',
    catatan: 'Dokumen KORA Tahun 2026/2027 telah diverifikasi Pengawas',
    judulBlangko: 'BLANGKO DOKUMEN PENGESAHAN DAN STRUKTUR KURIKULUM OPERASIONAL RA (KORA)',
    isiBlangko: `DOKUMEN KURIKULUM OPERASIONAL RAUDLATUL ATHFAL (KORA)
TAHUN PELAJARAN 2026/2027

A. KARAKTERISTIK SATUAN PENDIDIKAN RA:
Lembaga Raudlatul Athfal menyelenggarakan pendidikan anak usia dini berbasis nilai-nilai Islam Ahlussunnah wal Jama'ah yang mengintegrasikan kecakapan abad 21, literasi dasar, dan cinta lingkungan hidup.

B. STRUKTUR KURIKULUM INTRAKURIKULER & ALOKASI WAKTU:
1. Pembelajaran Intrakurikuler:
   - Alokasi waktu mingguan: 900 menit per minggu (150 menit per hari x 6 hari).
   - Meliputi 3 elemen capaian: Nilai Agama & Budi Pekerti, Jati Diri, Dasar Literasi & STEAM.
2. Projek Penguatan Profil Pelajar Pancasila & Rahmatan Lil Alamin (P5-PPRA):
   - Alokasi waktu: 20-30% dari total jam per tahun (2 projek tematik per tahun ajaran).
   - Tema 1: "Aku Sayang Bumi" (Subtema: Apotek Hidup Madrasah & Daur Ulang Sampah).
   - Tema 2: "Aku Cinta Indonesia" (Subtema: Budaya Lokal Sunda & Festival Nusantara Cilik).

C. PENGORGANISASIAN PEMBELAJARAN:
- Semester 1 (Ganjil): 17 Pekan Efektif (Juli - Desember).
- Semester 2 (Genap): 17 Pekan Efektif (Januari - Juni).
- Program Ekstrakurikuler: Tahfidz Juz Amma, Seni Hadroh/Rebana Cilik, Melukis Kreatif, dan Dokter Cilik (UKS).`
  },
  {
    id: 'acc3',
    standardNo: 3,
    standardName: 'Standar Proses Pembelajaran',
    indikator: 'Ketersediaan Modul Ajar/RPPH berbasis bermain bermakna, pemanfaatan APE dan loose parts',
    berkasDisiapkan: 'Arsip RPPH harian seluruh rombel, jurnal mengajar, dokumentasi foto sentra',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Guru Maryam Fauziyah, S.Pd',
    catatan: 'Tersimpan rapi di sistem Smart AI Pembelajaran',
    judulBlangko: 'BLANGKO SOP PROSES PEMBELAJARAN & RENCANA PELAKSANAAN HARIAN (RPPH)',
    isiBlangko: `STANDAR OPERASIONAL PROSEDUR (SOP) PROSES PEMBELAJARAN
DAN BLANGKO RENCANA PELAKSANAAN PEMBELAJARAN HARIAN (RPPH)

A. PROSEDUR PENYAMBUTAN & KEGIATAN AWAL (07.15 - 07.45):
1. Guru menyambut peserta didik di gerbang dengan senyum, salam, sapa, sopan, dan santun (5S).
2. Memeriksa kebersihan kuku, tangan, dan suhu tubuh anak.
3. Ikrar pagi bersama di halaman, senam ceria, dan doa pembuka belajar.

B. KEGIATAN PEMBUKAAN (07.45 - 08.15):
1. Muraja'ah hafalan surat pendek, hadits harian, dan doa sehari-hari.
2. Apersepsi melalui cerita buku bergambar atau pertanyaan pemantik terkait tema hari ini.
3. Diskusi aturan bermain dan mengenalkan ragam main bermakna (minimal 4 sentra main).

C. KEGIATAN INTI BERMAIN BERMAKNA (08.15 - 09.30):
1. Anak mengeksplorasi media alam (batu, ranting, kerang) dan loose parts sesuai minatnya.
2. Guru berperan sebagai fasilitator, mengobservasi, dan memberikan scaffolding (pijakan belajar).
3. Guru mendokumentasikan proses belajar dengan foto berseri dan catatan anekdot harian.

D. ISTIRAHAT, MAKAN BERSAMA & ADAB ISLAMI (09.30 - 10.00):
1. Cuci tangan dengan sabun air mengalir, doa makan bersama, dan makan bekal sehat bergizi.
2. Merapikan wadah makan sendiri (pendidikan kemandirian dan tanggung jawab).

E. KEGIATAN PENUTUP & REFLEKSI (10.00 - 10.30):
1. Recalling (anak menceritakan kembali pengalaman bermain dan hasil karyanya).
2. Refleksi perasaan anak hari ini dan penyampaian rencana kegiatan esok hari.
3. Doa penutup majelis, doa keluar madrasah, dan penjemputan teratur.`
  },
  {
    id: 'acc4',
    standardNo: 4,
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    indikator: 'Kualifikasi akademik pendidik minimal S1 PAUD/PIAUD dan memiliki sertifikasi pendidik',
    berkasDisiapkan: 'Ijazah legalisir S1, sertifikat pendidik, SK pembagian tugas, sertifikat diklat',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Muhammad Ridwan, S.Kom (Tata Usaha)',
    catatan: '6 dari 8 guru telah bersertifikasi pendidik (Serdik)',
    judulBlangko: 'BLANGKO BUKU INDUK PENDIDIK & TENAGA KEPENDIDIKAN (PTK) RA LENGKAP',
    isiBlangko: `BUKU INDUK KEPEGAWAIAN PENDIDIK DAN TENAGA KEPENDIDIKAN
RAUDLATUL ATHFAL KEMENTERIAN AGAMA REPUBLIK INDONESIA

A. REKAPITULASI KUALIFIKASI AKADEMIK GURU:
- Guru Berpendidikan S1 PG-PAUD / PIAUD / Tarbiyah: 7 Orang (87.5%)
- Guru Berpendidikan S2 Magister Pendidikan Islam: 1 Orang (12.5%)
- Guru Bersertifikasi Pendidik Profesional (Kemenag): 6 Orang (75%)
- Rasio Guru dan Peserta Didik: 1 : 9 (Sangat Ideal sesuai Standar BAN PAUD-PDM)

B. DOKUMEN WAJIB YANG DILAMPIRKAN DALAM PORTOFOLIO GURU:
1. Salinan Ijazah S1/S2 dan Transkrip Nilai yang telah dilegalisir basah.
2. Salinan Sertifikat Pendidik (bagi yang telah lulus PPG/Serdik).
3. Salinan Surat Keputusan (SK) Pengangkatan Guru Tetap Yayasan (GTY) / ASN Kemenag.
4. Salinan SK Pembagian Tugas Mengajar Semester Ganjil dan Genap Tahun Berjalan.
5. Sertifikat Diklat Berkelanjutan (PKB Guru RA, Diklat Kurikulum Merdeka, Pelatihan Bimbingan Konseling Anak Usia Dini).
6. Kartu NUPTK / PegID Simpatika Kemenag aktif.`
  },
  {
    id: 'acc5',
    standardNo: 5,
    standardName: 'Standar Sarana & Prasarana',
    indikator: 'Ketersediaan lahan aman, ruang kelas ramah anak, toilet sanitasi anak, APE indoor/outdoor',
    berkasDisiapkan: 'Buku inventaris sarpras, denah tata ruang, bukti sertifikat tanah/gedung yayasan',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Hj. Anisa Rahmawati, S.E',
    catatan: 'APE indoor dan outdoor dalam kondisi baik dan aman',
    judulBlangko: 'BLANGKO BUKU INVENTARIS SARANA PRASARANA & APE STANDAR KEMENAG',
    isiBlangko: `BUKU INDUK INVENTARIS SARANA PRASARANA DAN MEDIA PEMBELAJARAN
RAUDLATUL ATHFAL KEMENTERIAN AGAMA

I. DAFTAR RUANGAN DAN FASILITAS FISIK:
1. Ruang Kelas Rombel A1, A2, B1, B2 (Luas standar 48 m2 per rombel, ventilasi dan cahaya sangat memadai).
2. Ruang Kepala RA & Tenaga Administrasi (Dilengkapi lemari arsip terkunci dan sistem komputer).
3. Ruang Unit Kesehatan Sekolah (UKS) & Pojok Laktasi (Lengkap dipan periksa, kotak P3K darurat, dan timbangan digital).
4. Toilet Sanitasi Khusus Anak Usia Dini (Kloset anak, kran air rendah, lantai keramik anti slip, sabun cuci tangan).
5. Area Bermain Luar Ruang (Halaman bermain beralas rumput sintetis dan paving block aman).

II. DAFTAR ALAT PERMAINAN EDUKATIF (APE) OUTDOOR:
- Ayunan Lingkaran Pengaman: 2 Unit (Kondisi Baik/Terawat)
- Prosotan Luncur Fiber Ramah Anak: 2 Unit (Kondisi Sangat Baik)
- Jembatan Titian Keseimbangan Kayu: 2 Unit (Kondisi Baik)
- Mandi Bola & Terowongan Ulat: 1 Set (Kondisi Sangat Baik)
- Panjat Dinding Cilik (Climbing Wall): 1 Unit (Kondisi Aman/Berpelindung)

III. DAFTAR APE INDOOR & MEDIA LOOSE PARTS:
- Balok Kayu Geometri Aneka Warna: 10 Kotak
- Puzzle Hijaiyah, Abjad, dan Angka Arab: 20 Set
- Boneka Tangan Profesi & Panggung Cerita Boneka: 2 Set
- Wadah Eksplorasi Loose Parts (Batu, Biji Mahoni, Kerang, Kancing, Ranting): 12 Kontainer
- Alat Musik Perkusi Rebana Cilik: 15 Buah`
  },
  {
    id: 'acc6',
    standardNo: 6,
    standardName: 'Standar Pengelolaan Kelembagaan',
    indikator: 'Visi, misi, tujuan terpublikasi, struktur organisasi, SOP pelayanan, supervisi internal',
    berkasDisiapkan: 'Banner visi misi, buku SOP perlindungan anak, berita acara supervisi kepala RA',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Dra. Hj. Siti Fatimah, M.Pd.I',
    catatan: 'Tersedia dokumen supervisi akademik & manajerial',
    judulBlangko: 'BLANGKO DOKUMEN RENCANA KERJA TAHUNAN (RKT) & TATA TERTIB MADRASAH',
    isiBlangko: `DOKUMEN RENCANA KERJA TAHUNAN (RKT) DAN TATA KELOLA
RAUDLATUL ATHFAL TAHUN PELAJARAN 2026/2027

A. BIDANG KURIKULUM & PEMBELAJARAN:
1. Melaksanakan workshop internal pengembangan modul ajar berdiferensiasi setiap awal semester.
2. Melaksanakan penilaian otentik terpadu dan pembagian rapor narasi digital setiap semester.
3. Menyelenggarakan kegiatan outing class edukatif dan manasik haji cilik tahunan.

B. BIDANG KESISWAAN DAN PERLINDUNGAN ANAK:
1. Menerapkan Satuan Tugas Pencegahan dan Penanganan Kekerasan di Satuan Pendidikan (PPKSP RA).
2. SOP Penjemputan Aman: Anak hanya diserahkan kepada orang tua/wali yang terdaftar di kartu penjemput.
3. Layanan konsultasi tumbuh kembang anak gratis bekerjasama dengan psikolog anak dan puskesmas.

C. BIDANG KEMITRAAN DENGAN ORANG TUA / KOMITE:
1. Pertemuan bulanan Parenting Class (edukasi gizi, stimulasi bicara, dan parenting Islami).
2. Keterlibatan orang tua dalam kegiatan "Guru Tamu" (orang tua berbagi profesi di depan kelas).
3. Laporan pertanggungjawaban keuangan komite terbuka dan transparan.`
  },
  {
    id: 'acc7',
    standardNo: 7,
    standardName: 'Standar Pembiayaan (BOS & Komite)',
    indikator: 'Rencana Kerja & Anggaran RA (RKARA), Buku Kas Umum, kelengkapan SPJ dan pelaporan BOS',
    berkasDisiapkan: 'Buku kas umum (BKU), berkas kuitansi bermaterai, bukti setor pajak PPh/PPN',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Hj. Anisa Rahmawati, S.E (Bendahara)',
    catatan: 'Laporan realisasi BOS Tahap I & II terverifikasi Kemenag',
    judulBlangko: 'BLANGKO RENCANA KERJA & ANGGARAN RA (RKARA) & BUKU KAS BOS KEMENAG',
    isiBlangko: `RENCANA KERJA DAN ANGGARAN RAUDLATUL ATHFAL (RKARA)
DANA BANTUAN OPERASIONAL SEKOLAH (BOS) TAHUN ANGGARAN 2026

I. REKAPITULASI RENCANA PENERIMAAN:
1. Alokasi Dana BOS Kemenag (76 Siswa x Rp 600.000): Rp 45.600.000,-
2. Dana Sumbangan Pengembangan Komite / Infaq: Rp 28.500.000,-
3. Total Rencana Penerimaan Anggaran: Rp 74.100.000,-

II. RENCANA PENGELUARAN 8 STANDAR PENGGUNAAN BOS RA:
- Komponen 1: Pengembangan Perpustakaan, Buku Cerita Anak & APE (Minimal 15%)
- Komponen 2: Kegiatan Pembelajaran Inti & Pembelian Bahan Habis Pakai (Maksimal 30%)
- Komponen 3: Kegiatan Ekstrakurikuler Keagamaan & Kesiswaan (10%)
- Komponen 4: Pembelian Bahan Habis Pakai & ATK Administrasi Kantor (10%)
- Komponen 5: Langganan Daya dan Jasa (Listrik, Air Bersih, Internet Cepat) (10%)
- Komponen 6: Pemeliharaan Sarana Gedung & Sanitasi Ramah Anak (15%)
- Komponen 7: Peningkatan Mutu & Pelatihan Guru/Tenaga Kependidikan (10%)

III. BLANGKO KELENGKAPAN SPJ KEMENAG:
1. Lembar Kuitansi Pengeluaran bermaterai cukup ditandatangani 3 pihak (Kepala RA, Bendahara, Toko Rekanan).
2. Faktur Pembelian / Nota Asli bercap basah toko rekanan.
3. Bukti setor pajak (SSP) PPh Pasal 22 / PPh 21 / PPN jika transaksi kena pajak.
4. Foto dokumentasi barang yang dibeli atau kegiatan yang telah terselenggara.`
  },
  {
    id: 'acc8',
    standardNo: 8,
    standardName: 'Standar Penilaian Pendidikan',
    indikator: 'Instrumen penilaian otentik (ceklis, catatan anekdot, hasil karya) dan laporan rapor berkala',
    berkasDisiapkan: 'Panduan asesmen, lembar observasi harian anak, format rapor resmi Kemenag',
    statusKelengkapan: 'Lengkap',
    penanggungJawab: 'Seluruh Guru Kelas',
    catatan: 'Rapor digital dicetak dan dibagikan berkala ke orang tua',
    judulBlangko: 'BLANGKO INSTRUMEN PENILAIAN OTENTIK & FORMAT RAPOR PERKEMBANGAN ANAK',
    isiBlangko: `INSTRUMEN PENILAIAN OTENTIK ANAK USIA DINI
DAN BLANGKO RAPOR LAPORAN HASIL BELAJAR (LHB) RAUDLATUL ATHFAL

I. BLANGKO CATATAN ANEKDOT (ANECDOTAL RECORD):
- Tanggal & Waktu Observasi: .......................................
- Nama Peserta Didik: ....................................... Kelas: ............
- Tempat Kejadian: (Sentra Bahan Alam / Halaman Bermain / Ruang Makan)
- Peristiwa / Perilaku Teramati: (Catat peristiwa spesifik faktual tanpa opini penilai)
- Analisis Capaian Perkembangan: (Nilai Agama / Jati Diri / Dasar STEAM)
- Tindak Lanjut Guru: (Penguatan apresiasi positif dan bimbingan)

II. BLANGKO PENILAIAN HASIL KARYA (WORK SAMPLE):
- Nama Anak & Tanggal Pembuatan Karya: .......................................
- Foto Karya Anak: (Ditempel foto lukisan / susunan balok / karya meronce / plastisin)
- Celoteh Anak saat Menceritakan Karyanya: ("Ini mobil pemadam kebakaran yang menolong kucing di atas pohon")
- Aspek Perkembangan yang Muncul: (Kreativitas seni, motorik halus, bahasa ekspresif)

III. BLANGKO RAPOR NARASI CAPAIAN PEMBELAJARAN SEMESTER:
1. Narasi Capaian Elemen Nilai Agama dan Budi Pekerti:
   (Menjelaskan kemajuan hafalan surat pendek, adab berdoa, dan kepedulian terhadap sesama).
2. Narasi Capaian Elemen Jati Diri & Sosial Emosional:
   (Menjelaskan kemandirian, pengelolaan emosi, dan kemampuan beradaptasi dalam kelompok).
3. Narasi Capaian Elemen Dasar-Dasar Literasi dan STEAM:
   (Menjelaskan rasa ingin tahu sains, pemecahan masalah dengan loose parts, dan ketertarikan pada buku).`
  },
];

export const INITIAL_CLASSES: ClassGroup[] = [
  { id: 'c1', name: 'Kelompok A1 (Khadijah)', ageGroup: 'Usia 4-5 Tahun', teacher: 'Guru Maryam Fauziyah, S.Pd', coTeacher: 'Guru Sarah, S.Pd', quota: 18 },
  { id: 'c2', name: 'Kelompok A2 (Fathimah Az-Zahra)', ageGroup: 'Usia 4-5 Tahun', teacher: 'Guru Aisyah, S.Pd.I', coTeacher: 'Guru Rina', quota: 18 },
  { id: 'c3', name: 'Kelompok B1 (Abu Bakar)', ageGroup: 'Usia 5-6 Tahun', teacher: 'Guru Nurul Hidayah, S.Pd.I', coTeacher: 'Guru Dewi', quota: 20 },
  { id: 'c4', name: 'Kelompok B2 (Umar bin Khattab)', ageGroup: 'Usia 5-6 Tahun', teacher: 'Guru Fatimah Azzahra, S.Pd', coTeacher: 'Guru Laila', quota: 20 },
];

export const INITIAL_RECEIPTS: BOSReceipt[] = [
  {
    id: 'kwt-1',
    noKwitansi: 'KWT/BOS-RA/2026/001',
    tahunAnggaran: '2026/2027',
    tanggal: '2026-08-10',
    sudahTerimaDari: 'Bendahara BOS RA Terpadu Al-Azhar Cendekia',
    jumlahUang: 4500000,
    terbilang: 'Empat Juta Lima Ratus Ribu Rupiah',
    untukPembayaran: 'Pembelian Buku Cerita Islami Anak Usia Dini & Media Bahan Alam Loose Parts',
    kodeKomponen: '01',
    namaKomponen: 'Pengembangan Perpustakaan & APE',
    namaPenerima: 'Toko Buku & Mainan Edukatif Cendekia',
    alamatPenerima: 'Jl. Ahmad Yani No. 112, Bandung',
    npwpPenerima: '71.234.567.8-428.000',
    ppn: 0,
    pph: 0,
    statusLunas: 'Lunas',
    sumberDana: 'BOS Kemenag',
  },
  {
    id: 'kwt-2',
    noKwitansi: 'KWT/BOS-RA/2026/002',
    tahunAnggaran: '2026/2027',
    tanggal: '2026-08-25',
    sudahTerimaDari: 'Bendahara BOS RA Terpadu Al-Azhar Cendekia',
    jumlahUang: 1850000,
    terbilang: 'Satu Juta Delapan Ratus Lima Puluh Ribu Rupiah',
    untukPembayaran: 'Pembelian Alat Tulis Kantor (ATK), Kertas Gambar, & Cat Warna Non-Toxic',
    kodeKomponen: '02',
    namaKomponen: 'Kegiatan Pembelajaran & Bahan Habis Pakai',
    namaPenerima: 'CV. Mandiri Stationery Bersama',
    alamatPenerima: 'Jl. Cihampelas No. 54, Bandung',
    npwpPenerima: '82.345.678.9-421.000',
    ppn: 0,
    pph: 0,
    statusLunas: 'Lunas',
    sumberDana: 'BOS Kemenag',
  },
];

export const INITIAL_INQUIRIES: PPDBInquiry[] = [
  {
    id: 'inq-1',
    namaAnak: 'Alula Farzana Putri',
    usia: '4 Tahun (Kelompok A)',
    namaOrtu: 'Bunda Sarah Meilani',
    noHp: '081299887766',
    pesan: 'Mohon info biaya pendaftaran dan apakah ada program penjemputan anak?',
    tanggal: '2026-11-03',
    status: 'Sudah Dihubungi via WA',
  },
  {
    id: 'inq-2',
    namaAnak: 'Zayyan Bilal Al-Fatih',
    usia: '5 Tahun (Kelompok B)',
    namaOrtu: 'Ayah Dimas Prasetyo',
    noHp: '081388776655',
    pesan: 'Ingin pindahan dari RA luar kota ke Kelompok B semester genap, apakah kuota masih tersedia?',
    tanggal: '2026-11-04',
    status: 'Menunggu Follow-up',
  },
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  { id: 'acc_1', username: 'kepala@smartra.sch.id', password: 'kepala123', name: 'Dra. Hj. Siti Fatimah, M.Pd.I', role: 'kepala', isActive: true, createdAt: '2026-01-01' },
  { id: 'acc_2', username: 'guru@smartra.sch.id', password: 'guru123', name: 'Guru Nurul Hidayah, S.Pd.I', role: 'guru', isActive: true, createdAt: '2026-01-01' },
  { id: 'acc_3', username: 'bendahara@smartra.sch.id', password: 'bendahara123', name: 'Hj. Anisa Rahmawati, S.E', role: 'bendahara', isActive: true, createdAt: '2026-01-01' },
  { id: 'acc_4', username: 'pengawas@smartra.sch.id', password: 'pengawas123', name: 'Drs. H. Ahmad Fauzi, M.Ag', role: 'pengawas', isActive: true, createdAt: '2026-01-01' },
  { id: 'acc_5', username: 'ortu@smartra.sch.id', password: 'ortu123', name: 'Bunda Rina Wardani, S.Sos', role: 'orangtua', isActive: true, createdAt: '2026-01-01' },
  { id: 'acc_6', username: 'admin@smartra.sch.id', password: 'admin123', name: 'Muhammad Ridwan, S.Kom', role: 'tu', isActive: true, createdAt: '2026-01-01' },
  { id: 'acc_7', username: 'yayasan@alazharcendekia.id', password: 'yayasan123', name: 'KH. Dr. Abdullah Syakir, M.A', role: 'yayasan', isActive: true, createdAt: '2026-01-01' },
  { id: 'acc_8', username: 'superadmin@smartra.sch.id', password: 'superadmin123', name: 'Super Administrator', role: 'superadmin', isActive: true, createdAt: '2026-01-01' },
];

export const INITIAL_PKKM_ITEMS: PKKMItem[] = [
  // KOMPONEN 1: Usaha Pengembangan Madrasah / RA (Tahunan & 4 Tahunan)
  {
    id: 'pkkm-1',
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 1,
    namaKomponen: 'Komponen 1: Usaha Pengembangan Madrasah/RA',
    kriteriaIndikator: '1.1 Mampu mengembangkan struktur organisasi madrasah/RA yang sesuai dengan kebutuhan program dan tata kelola kelembagaan.',
    subIndikator: 'Ketersediaan bagan struktur organisasi terpublikasi, SK pembagian tugas, dan uraian tupoksi masing-masing personil.',
    buktiFisikDisiapkan: 'Bagan struktur organisasi terpajang, SK Pembagian Tugas PTK Tahun Berjalan disahkan Kepala RA & Yayasan, uraian tupoksi lengkap guru & tendik.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Struktur organisasi tersusun rapi, tupoksi sangat jelas, dan seluruh personil memahami uraian tugas masing-masing.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM: KOMPONEN 1 - USAHA PENGEMBANGAN STRUKTUR ORGANISASI RA',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH (PKKM) KEMENAG RI
KOMPONEN 1: USAHA PENGEMBANGAN MADRASAH / RA

A. KRITERIA INDIKATOR 1.1:
Kepala RA mampu menyusun struktur organisasi yang efektif dan efisien guna mewujudkan visi, misi, dan tujuan RA.

B. BUKTI FISIK YANG DISEDIAKAN & DIPERIKSA:
1. Dokumen SK Penetapan Struktur Organisasi RA Tahun Pelajaran 2026/2027.
2. Bagan Organisasi Resmi yang dipajang di ruang administrasi dan terunggah di portal website RA.
3. Dokumen rincian uraian tugas dan tanggung jawab (Job Description) bagi:
   - Kepala RA
   - Bendahara RA
   - Tenaga Administrasi / Tata Usaha
   - Guru Kelas & Guru Pendamping
   - Petugas UKS dan Layanan Keamanan Anak.
4. Notula rapat pleno penyusunan dan sosialisasi struktur organisasi bersama komite dan yayasan.

C. KESIMPULAN PENILAIAN:
Skor Capaian: 4 (Amat Baik / Sangat Memenuhi Standar Nasional Kemenag).`
  },
  {
    id: 'pkkm-2',
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 1,
    namaKomponen: 'Komponen 1: Usaha Pengembangan Madrasah/RA',
    kriteriaIndikator: '1.2 Mampu mengelola perubahan dan pengembangan RA menuju organisasi pembelajar yang efektif.',
    subIndikator: 'Program digitalisasi madrasah, keterlibatan guru dalam forum PKB/KKG RA, dan inovasi kurikulum ramah anak.',
    buktiFisikDisiapkan: 'Implementasi aplikasi Smart RA Digital, sertifikat keikutsertaan workshop guru, program inovasi loose parts alam.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Digitalisasi administrasi dan proses pembelajaran berbasis bahan alam loose parts terlaksana prima.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM: KOMPONEN 1 - PENGELOLAAN INOVASI DAN ORGANISASI PEMBELAJAR',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH (PKKM) KEMENAG RI
KOMPONEN 1: PENGELOLAAN INOVASI ORGANISASI PEMBELAJAR

A. KRITERIA INDIKATOR 1.2:
Kepala RA menginisiasi dan mengawal perubahan positif, inovasi digital, serta iklim kolaboratif guru dan tenaga kependidikan.

B. BUKTI FISIK YANG DIVERIFIKASI:
1. Dokumen SOP Transformasi Digital Madrasah & Presensi Berbasis GPS.
2. Portofolio keikutsertaan guru pada Workshop Kurikulum Merdeka PAUD/RA dan pelatihan P2RA.
3. Dokumentasi foto ragam sentra belajar inovatif berbasis bahan alam.
4. Laporan refleksi berkala bulanan guru dalam forum KKG internal RA.

C. CATATAN TIM PENILAI:
Inovasi digitalisasi berjalan menyeluruh dari PPDB, buku induk, keuangan BOS, hingga rapor digital anak.`
  },

  // KOMPONEN 2: Pelaksanaan Tugas Manajerial (Tahunan & 4 Tahunan)
  {
    id: 'pkkm-3',
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 2,
    namaKomponen: 'Komponen 2: Pelaksanaan Tugas Manajerial',
    kriteriaIndikator: '2.1 Mampu menyusun Kurikulum Operasional RA (KORA) yang selaras dengan Kurikulum Merdeka PAUD dan nilai P2RA.',
    subIndikator: 'Dokumen KORA disahkan Kemenag, SK Tim Pengembang Kurikulum, Alur Tujuan Pembelajaran (ATP), dan Kalender Pendidikan.',
    buktiFisikDisiapkan: 'Buku Dokumen 1 KORA yang telah disahkan Kantor Kemenag Kota, SK TPK RA, silabus pemetaan tema semester, modul ajar.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Dokumen KORA sangat lengkap, terintegrasi Profil Pelajar Rahmatan Lil Alamin dan muatan lokal keagamaan.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM: KOMPONEN 2 - PENGELOLAAN KURIKULUM OPERASIONAL RA (KORA)',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH (PKKM) KEMENAG RI
KOMPONEN 2: PELAKSANAAN TUGAS MANAJERIAL KURIKULUM

A. KRITERIA INDIKATOR 2.1:
Kepala RA memimpin penyusunan, pengesahan, implementasi, dan evaluasi Kurikulum Operasional RA (KORA).

B. BUKTI FISIK YANG DIPERIKSA:
1. Dokumen KORA Tahun Berjalan yang ditandatangani Kepala RA, Komite, dan disahkan Pengawas / Kasi Pendis Kemenag.
2. SK Tim Pengembang Kurikulum (TPK) disertai berita acara dan daftar hadir rapat penyusunan.
3. Kalender Pendidikan RA yang memuat pekan efektif belajar dan agenda PHBI/PHBN.
4. Arsip Modul Ajar / RPPH terpadu untuk rombel Kelompok A dan Kelompok B.

C. HASIL VERIFIKASI:
Skor 4 (Amat Baik). Seluruh instrumen manajerial kurikulum terpenuhi secara otentik.`
  },
  {
    id: 'pkkm-4',
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 2,
    namaKomponen: 'Komponen 2: Pelaksanaan Tugas Manajerial',
    kriteriaIndikator: '2.2 Mampu mengelola dan mendayagunakan sarana prasarana serta media belajar APE secara optimal.',
    subIndikator: 'Ketersediaan Buku Induk Inventaris, pemeliharaan berkala APE luar/dalam, dan SOP keamanan lingkungan bermain.',
    buktiFisikDisiapkan: 'Buku Induk Inventaris Sarpras, kartu inventaris ruangan (KIR), foto fasilitas sanitasi anak dan APE aman ber-SNI.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Sarpras sangat terawat, area bermain ramah anak dan dilengkapi perlindungan keselamatan terstandar.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM: KOMPONEN 2 - PENGELOLAAN SARPRAS & MEDIA APE RAMAH ANAK',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH (PKKM) KEMENAG RI
KOMPONEN 2: PENGELOLAAN SARANA PRASARANA & APE

A. KRITERIA INDIKATOR 2.2:
Kepala RA mengelola sarana, prasarana gedung, dan alat permainan edukatif (APE) demi kenyamanan dan keselamatan peserta didik.

B. BUKTI FISIK YANG DIVERIFIKASI:
1. Buku Induk Inventaris Sarana dan Prasarana RA (Aset Fisik & APE).
2. Kartu Inventaris Ruangan (KIR) di setiap sentra kelas A1, A2, B1, B2.
3. Berita acara pemeliharaan berkala sarana ayunan luar ruang, perosotan, dan sanitasi toilet anak.
4. Sertifikat kelaikan keamanan mainan (non-toxic material) untuk anak usia dini.

C. KESIMPULAN:
Skor 4. Sarana dan prasarana memenuhi standar BAN PAUD-PDM dan Kemenag RI.`
  },
  {
    id: 'pkkm-5',
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 2,
    namaKomponen: 'Komponen 2: Pelaksanaan Tugas Manajerial',
    kriteriaIndikator: '2.3 Mampu mengelola pembiayaan RA secara transparan, akuntabel, dan sesuai juknis BOS Kemenag.',
    subIndikator: 'Rencana Kerja & Anggaran RA (RKARA), Buku Kas Umum (BKU), kuitansi SPJ bermaterai, dan laporan pajak.',
    buktiFisikDisiapkan: 'Dokumen RKARA BOS disahkan Kemenag, printout BKU BOS & Kas Umum, kuitansi bukti bayar sah, laporan realisasi berkala.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Laporan keuangan dan SPJ BOS tersusun tertib, transparan, dan tidak ada temuan administratif.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM: KOMPONEN 2 - AKUNTABILITAS PENGELOLAAN KEUANGAN & BOS',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH (PKKM) KEMENAG RI
KOMPONEN 2: AKUNTABILITAS KEUANGAN & ANGGARAN BOS

A. KRITERIA INDIKATOR 2.3:
Kepala RA mengawal penyusunan RKARA, pengelolaan Buku Kas Umum, verifikasi kuitansi belanja, dan pelaporan tepat waktu ke Kemenag.

B. BUKTI FISIK YANG DIPERIKSA:
1. Dokumen RKARA yang disetujui Komite dan Kepala Seksi Pendis Kemenag.
2. Buku Kas Umum (BKU), Buku Pembantu Kas, dan Buku Pembantu Bank.
3. Berkas kuitansi pengeluaran bermaterai cukup dengan tanda tangan 3 pihak (Kepala, Bendahara, Rekanan).
4. Bukti setor pajak PPh dan PPN transaksi kena pajak.

C. SKOR PENILAIAN:
Skor 4 (Amat Baik). Tertib administrasi keuangan telah terverifikasi sistem audit digital.`
  },

  // KOMPONEN 3: Pengembangan Kewirausahaan (Tahunan & 4 Tahunan)
  {
    id: 'pkkm-6',
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 3,
    namaKomponen: 'Komponen 3: Pengembangan Kewirausahaan',
    kriteriaIndikator: '3.1 Mampu menciptakan inovasi yang bermanfaat bagi pengembangan RA dan kemandirian kelembagaan.',
    subIndikator: 'Pengembangan unit usaha/kemitraan produktif, program parenting berbayar/infaq mandiri, dan kegiatan pentas seni amal.',
    buktiFisikDisiapkan: 'Laporan kemitraan komite RA, galeri karya anak untuk bazar amal, dokumentasi kegiatan wirausaha cilik (Market Day).',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Program Market Day Cilik dan pelibatan orang tua dalam bazar amal mengasah jiwa wirausaha sejak dini.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM: KOMPONEN 3 - INOVASI KEWIRAUSAHAAN & KEMITRAAN EDUKATIF',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH (PKKM) KEMENAG RI
KOMPONEN 3: PENGEMBANGAN KEWIRAUSAHAAN RA

A. KRITERIA INDIKATOR 3.1:
Kepala RA menumbuhkan jiwa inovasi, kerja keras, dan kemandirian melalui program edukatif dan kemitraan strategis.

B. BUKTI FISIK YANG DIVERIFIKASI:
1. Program tahunan "Market Day Cilik" yang mengenalkan adab jual beli Islami dan mata uang kepada anak.
2. Kemitraan dengan UMKM lokal penyedia bahan alam loose parts dan seragam madrasah.
3. Pengelolaan dana infaq Jumat berkah untuk santunan dhuafa dan pengembangan pojok baca RA.
4. Laporan transparansi hasil kegiatan kemitraan kepada komite dan yayasan.

C. SKOR:
Skor 4 (Amat Baik). Nilai-nilai kemandirian dan kewirausahaan tertanam kuat.`
  },

  // KOMPONEN 4: Supervisi Guru & Tenaga Kependidikan (Tahunan & 4 Tahunan)
  {
    id: 'pkkm-7',
    tahun: '2026/2027',
    periode: 'Tahunan',
    komponenNo: 4,
    namaKomponen: 'Komponen 4: Supervisi kepada Guru dan Tendik',
    kriteriaIndikator: '4.1 Mampu merencanakan dan melaksanakan supervisi akademik terhadap seluruh guru kelas secara berkelanjutan.',
    subIndikator: 'Program kerja tahunan supervisi, jadwal observasi kelas, instrumen telaah RPPH, dan rekap skor penilaian guru.',
    buktiFisikDisiapkan: 'Buku Program Supervisi Kepala RA, instrumen observasi kelas terisi, lembar telaah RPPH, berita acara supervisi.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Alur 5 tahap supervisi akademik kepala RA berjalan sistematis dan tuntas hingga monitoring tindak lanjut.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM: KOMPONEN 4 - SUPERVISI AKADEMIK & PEMBINAAN PEDAGOGIS GURU',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH (PKKM) KEMENAG RI
KOMPONEN 4: SUPERVISI GURU DAN TENAGA KEPENDIDIKAN

A. KRITERIA INDIKATOR 4.1:
Kepala RA melaksanakan supervisi akademik, evaluasi pelaksanaan proses belajar, serta pembinaan kompetensi pedagogis guru.

B. BUKTI FISIK YANG DIPERIKSA:
1. Dokumen Rencana Program Supervisi Guru Semester Ganjil dan Genap.
2. Instrumen observasi proses bermain belajar di kelas/sentra untuk seluruh guru kelas.
3. Lembar umpan balik dan dialog pasca-observasi antara Kepala RA dan guru yang disupervisi.
4. Laporan tindak lanjut bimbingan profesional guru dan peningkatan media loose parts.

C. HASIL EVALUASI PENILAI:
Skor 4 (Amat Baik). Pembinaan guru konsisten dan berdampak nyata pada kualitas pembelajaran.`
  },

  // KOMPONEN 5: Hasil Kinerja Madrasah / RA (Khusus PKKM 4 Tahunan)
  {
    id: 'pkkm-8',
    tahun: '2026/2027',
    periode: '4 Tahunan',
    komponenNo: 5,
    namaKomponen: 'Komponen 5: Hasil Kinerja Madrasah/RA',
    kriteriaIndikator: '5.1 Prestasi Kelembagaan RA dan Akreditasi Unggul.',
    subIndikator: 'Pencapaian status Akreditasi A (Unggul) dari BAN PAUD-PDM, penghargaan tata kelola digital, dan tertib kepatuhan regulasi Kemenag.',
    buktiFisikDisiapkan: 'Sertifikat Akreditasi A (Unggul) BAN-PDM, Piagam Penghargaan RA Digital Terbaik Kemenag Kota Bandung, rekap indeks kepuasan orang tua.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Lembaga memiliki reputasi unggul, akreditasi A dengan nilai sangat tinggi, dan menjadi rujukan RA percontohan.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM 4 TAHUNAN: KOMPONEN 5 - PRESTASI KELEMBAGAAN & AKREDITASI',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH 4 TAHUNAN (PKKM 4 TAHUNAN)
KOMPONEN 5: HASIL KINERJA KELEMBAGAAN MADRASAH / RA

A. KRITERIA INDIKATOR 5.1:
Hasil kinerja kelembagaan madrasah/RA selama masa jabatan 4 tahun kepemimpinan Kepala RA.

B. BUKTI FISIK 4 TAHUNAN YANG DIPERIKSA:
1. Sertifikat Akreditasi Peringkat "A (Unggul)" dari BAN-PDM yang masih berlaku.
2. Piagam dan Trofi Penghargaan RA Berprestasi Tingkat Kota/Provinsi.
3. Rekapitulasi serapan dana BOS 100% tepat sasaran dan berstatus WTP (Wajar Tanpa Pengecualian).
4. Survei indeks kepuasan layanan orang tua / komite madrasah dengan rerata kepuasan 98.4%.

C. KESIMPULAN PENILAIAN 4 TAHUNAN:
Skor 4 (Amat Baik). Kinerja kepemimpinan 4 tahunan terbukti sukses mengantarkan RA ke tingkat mutu tertinggi.`
  },
  {
    id: 'pkkm-9',
    tahun: '2026/2027',
    periode: '4 Tahunan',
    komponenNo: 5,
    namaKomponen: 'Komponen 5: Hasil Kinerja Madrasah/RA',
    kriteriaIndikator: '5.2 Prestasi Peserta Didik dan Daya Serap Lulusan.',
    subIndikator: 'Prestasi lomba tahfidz, kolase, pildacil anak usia dini, dan 100% alumni terserap di madrasah ibtidaiyah/SD favorit.',
    buktiFisikDisiapkan: 'Piagam juara lomba tahfidz anak, sertifikat gebyar porseni IGRA, rekap data alumni yang melanjutkan ke MI/SD.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Prestasi anak sangat membanggakan di bidang keagamaan dan seni, data penelusuran alumni terdokumentasi akurat.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM 4 TAHUNAN: KOMPONEN 5 - PRESTASI ANAK & TRACER ALUMNI',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH 4 TAHUNAN (PKKM 4 TAHUNAN)
KOMPONEN 5: PRESTASI PESERTA DIDIK DAN TRACER ALUMNI

A. KRITERIA INDIKATOR 5.2:
Capaian prestasi peserta didik dan keberhasilan lulusan dalam melanjutkan ke jenjang pendidikan dasar Islam.

B. BUKTI FISIK YANG DIPERIKSA:
1. Daftar perolehan trofi kejuaraan peserta didik tingkat kecamatan, kota, dan provinsi (Tahfidz, Mewarnai, Hadroh Cilik).
2. Buku Rekap Data Alumni Lulusan RA selama 4 tahun terakhir.
3. Bukti konfirmasi kelulusan dan surat tanda terima di MI / SD Islam Favorit (Daya Serap 100%).
4. Portofolio karya anak dan testimoni apresiasi kepala sekolah lanjutan.

C. SKOR:
Skor 4 (Amat Baik).`
  },
  {
    id: 'pkkm-10',
    tahun: '2026/2027',
    periode: '4 Tahunan',
    komponenNo: 5,
    namaKomponen: 'Komponen 5: Hasil Kinerja Madrasah/RA',
    kriteriaIndikator: '5.3 Peningkatan Kualifikasi Akademik & Kompetensi PTK.',
    subIndikator: 'Kenaikan persentase guru berkualifikasi S1, kepemilikan sertifikat pendidik (Serdik), dan keikutsertaan diklat profesi.',
    buktiFisikDisiapkan: 'Rekap ijazah S1 guru (87.5%), sertifikat pendidik Kemenag (75%), sertifikat diklat Kurikulum Merdeka seluruh guru.',
    statusBukti: 'Lengkap',
    skor: 4,
    catatanPenilai: 'Peningkatan profesionalisme guru sangat signifikan berkat dorongan berkelanjutan Kepala RA.',
    judulBlangko: 'BLANGKO INSTRUMEN PKKM 4 TAHUNAN: KOMPONEN 5 - PENINGKATAN MUTU DAN SERTIFIKASI PTK',
    isiBlangko: `INSTRUMEN PENILAIAN KINERJA KEPALA MADRASAH 4 TAHUNAN (PKKM 4 TAHUNAN)
KOMPONEN 5: PENINGKATAN PROFESIONALITAS PENDIDIK & TENAGA KEPENDIDIKAN

A. KRITERIA INDIKATOR 5.3:
Peningkatan kualifikasi akademik, sertifikasi pendidik, dan kompetensi berkelanjutan guru dan staf RA selama 4 tahun.

B. BUKTI FISIK 4 TAHUNAN:
1. Data Buku Induk Kepegawaian PTK: 7 dari 8 guru telah berpendidikan S1/S2 Linier.
2. Salinan Sertifikat Pendidik (PPG Daljab Kemenag) milik 6 orang guru aktif.
3. Kumpulan sertifikat diklat Pengembangan Keprofesian Berkelanjutan (PKB) guru.
4. Laporan peningkatan kesejahteraan dan pemberian honorarium tepat waktu melalui dana BOS dan yayasan.

C. KESIMPULAN AKHIR:
Skor 4 (Amat Baik).`
  }
];

export const INITIAL_ACADEMIC_CALENDAR: AcademicCalendarEvent[] = [
  {
    id: 'cal-1',
    tanggal: '15 Juli 2026',
    tanggalMulai: '2026-07-15',
    tanggalSelesai: '2026-07-18',
    agenda: 'Hari Pertama Masuk Sekolah & Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah Anak',
    kategori: 'Akademik',
    semester: 'Semester Ganjil',
    tahunAjaran: '2026/2027',
    keterangan: 'Penyambutan peserta didik baru bersama orang tua dan pengenalan guru kelas.',
  },
  {
    id: 'cal-2',
    tanggal: '17 Agustus 2026',
    tanggalMulai: '2026-08-17',
    tanggalSelesai: '2026-08-17',
    agenda: 'Upacara HUT Kemerdekaan RI ke-81 & Karnaval Pakaian Adat Nusantara',
    kategori: 'Nasional',
    semester: 'Semester Ganjil',
    tahunAjaran: '2026/2027',
    keterangan: 'Karnaval keliling kompleks dan lomba ketangkasan ceria anak.',
  },
  {
    id: 'cal-3',
    tanggal: '05 September 2026',
    tanggalMulai: '2026-09-05',
    tanggalSelesai: '2026-09-05',
    agenda: 'Peringatan Maulid Nabi Muhammad SAW 1448 H & Pentas Seni Islami Berbagi',
    kategori: 'PHBI',
    semester: 'Semester Ganjil',
    tahunAjaran: '2026/2027',
    keterangan: 'Santunan dhuafa cilik dan kisah teladan Nabi Muhammad SAW.',
  },
  {
    id: 'cal-4',
    tanggal: '15 Oktober 2026',
    tanggalMulai: '2026-10-15',
    tanggalSelesai: '2026-10-15',
    agenda: 'Praktek Simulasi Manasik Haji Cilik se-Kota Bandung (Asrama Haji)',
    kategori: 'Program Unggulan',
    semester: 'Semester Ganjil',
    tahunAjaran: '2026/2027',
    keterangan: 'Memakai kain ihram, thawaf mengelilingi replika Ka\'bah, sa\'i, dan tahallul.',
  },
  {
    id: 'cal-5',
    tanggal: '10 November 2026',
    tanggalMulai: '2026-11-10',
    tanggalSelesai: '2026-11-12',
    agenda: 'Pekan Gebyar Porseni IGRA RA & Lomba Kreativitas Seni Anak Usia Dini',
    kategori: 'Kompetisi',
    semester: 'Semester Ganjil',
    tahunAjaran: '2026/2027',
    keterangan: 'Lomba tahfidz surat pendek, pildacil, kolase bahan alam, dan hadroh cilik.',
  },
  {
    id: 'cal-6',
    tanggal: '15-18 Desember 2026',
    tanggalMulai: '2026-12-15',
    tanggalSelesai: '2026-12-18',
    agenda: 'Pameran Karya Portofolio & Pembagian Rapor Perkembangan Semester Ganjil',
    kategori: 'Evaluasi',
    semester: 'Semester Ganjil',
    tahunAjaran: '2026/2027',
    keterangan: 'Konsultasi laporan perkembangan anak bersama orang tua murid.',
  },
  {
    id: 'cal-7',
    tanggal: '05 Januari 2027',
    tanggalMulai: '2027-01-05',
    tanggalSelesai: '2027-01-05',
    agenda: 'Awal Masuk Belajar Efektif Semester Genap TP 2026/2027',
    kategori: 'Akademik',
    semester: 'Semester Genap',
    tahunAjaran: '2026/2027',
    keterangan: 'Memulai tema pembelajaran sentra dan proyek penguatan P2RA.',
  },
  {
    id: 'cal-8',
    tanggal: '20 Maret 2027',
    tanggalMulai: '2027-03-20',
    tanggalSelesai: '2027-03-25',
    agenda: 'Pesantren Kilat Ramadhan Cilik, Pengumpulan Zakat & Buka Puasa Bersama',
    kategori: 'Keagamaan',
    semester: 'Semester Genap',
    tahunAjaran: '2026/2027',
    keterangan: 'Praktik sholat dhuha berjamaah, hafalan doa harian, dan berbagi takjil.',
  },
  {
    id: 'cal-9',
    tanggal: '18-20 Juni 2027',
    tanggalMulai: '2027-06-18',
    tanggalSelesai: '2027-06-20',
    agenda: 'Haflah Akhirussanah, Pentas Seni Akbar & Wisuda Kelulusan Kelompok B',
    kategori: 'Kelulusan',
    semester: 'Semester Genap',
    tahunAjaran: '2026/2027',
    keterangan: 'Pelepasan lulusan dan penyerahan surat keterangan kelulusan / alumni.',
  },
];

export const INITIAL_PENGAWAS: PengawasRecord[] = [
  {
    id: 'pgw-1',
    nama: 'Dra. Hj. Siti Rohmah, M.M.Pd.',
    nip: '19700315 199503 2 002',
    pangkatGolongan: 'Pembina Tk. I / IV-b',
    jabatan: 'Pengawas Madrasah Madya Kemenag Kota Bandung',
    wilayahBinaan: 'Wilayah Binaan RA Kec. Cendekia & Sekitarnya',
    noHp: '081223456789',
    email: 'siti.rohmah@kemenag.go.id',
    skPenugasan: 'SK-KEMENAG/BDG/KP.07/2026',
    tanggalMulaiTugas: '2024-01-02',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    catatan: 'Pengawas Pembina utama bidang kurikulum merdeka dan akreditasi BAN-PDM.',
  },
  {
    id: 'pgw-2',
    nama: 'Drs. H. Ahmad Fauzi, M.Ag',
    nip: '19680315 199403 1 002',
    pangkatGolongan: 'Pembina Utama Muda / IV-c',
    jabatan: 'Pengawas Madrasah / RA Ahli Madya Kemenag RI',
    wilayahBinaan: 'Pokjawas Madrasah Kota Bandung',
    noHp: '081678901234',
    email: 'ahmad.fauzi@kemenag.go.id',
    skPenugasan: 'SK-DIRJEN-PENDIS/084/2025',
    tanggalMulaiTugas: '2023-07-01',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    catatan: 'Spesialis audit manajerial, kepatuhan BOS, dan evaluasi kinerja kepala madrasah (PKKM).',
  },
];

export const INITIAL_WEBSITE_CONFIG: WebsiteConfig = {
  theme: 'emerald',
  heroLayout: 'gradient-glow',
  showRunningAnnouncement: true,
  runningAnnouncementText: '✨ Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Telah Dibuka! Dapatkan Diskon Infaq Formulir untuk 25 Pendaftar Pertama ✨',

  // Hero Section
  heroBadge: 'Pendidikan Anak Usia Dini Berbasis Karakter Qurani & Kurikulum Merdeka',
  heroTitle: 'Membina Generasi Muslim Cerdas, Mandiri, Kreatif, dan Berakhlak Mulia',
  heroSubtitle: 'Menghadirkan lingkungan belajar yang aman, menyenangkan, stimulatif, dan sarat dengan nilai-nilai adab Nabawiyah.',
  heroPrimaryBtnText: 'Daftar PPDB Online 2026/2027',
  heroSecondaryBtnText: 'Konsultasi Program & Fasilitas',
  heroImageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',

  // Sections Visibility
  showHeadmasterGreeting: true,
  showStats: true,
  showPrograms: true,
  showFacilities: true,
  showTeachers: true,
  showTestimonials: true,
  showAnnouncements: true,
  showQuickPPDB: true,
  showContactLocation: true,

  // Headmaster Greeting
  headmasterGreetingTitle: 'Menyambut Generasi Rabbani di Era Keemasan Anak',
  headmasterGreetingText: 'Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di Raudlatul Athfal Terpadu Al-Azhar Cendekia. Usia dini adalah masa keemasan (golden age) yang tidak akan terulang. Kami berkomitmen mendampingi ananda menumbuhkan fitrah keimanan, kecintaan kepada Al-Qur’an, adab mulia, dan kecerdasan jamak melalui pendekatan bermain yang bermakna.',
  headmasterGreetingPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',

  // Custom Programs
  programs: [
    {
      id: 'prog-1',
      order: 1,
      title: 'Tahfidz Cilik Juz 30 & Adab',
      category: 'Keagamaan',
      description: 'Metode Talaqqi interaktif dengan hafalan minimal 15 surat pendek juz 30, doa sehari-hari, dan hadits akhlak mulia.',
      iconName: 'BookOpen',
    },
    {
      id: 'prog-2',
      order: 2,
      title: 'Bermain Bermakna (Loose Parts)',
      category: 'Kurikulum Merdeka',
      description: 'Eksplorasi sensorik bahan alam ramah lingkungan, menstimulasi daya kritis, sains sederhana, dan kebebasan berekspresi.',
      iconName: 'Sparkles',
    },
    {
      id: 'prog-3',
      order: 3,
      title: 'Smart RA Digital & Transparan',
      category: 'Inovasi Layanan',
      description: 'Orang tua mendapatkan akses aplikasi Smart RA Digital untuk memantau presensi harian, foto kegiatan peserta didik, dan rapor resmi.',
      iconName: 'Award',
    },
    {
      id: 'prog-4',
      order: 4,
      title: 'English & Arabic Daily Fun',
      category: 'Bahasa',
      description: 'Pengenalan kosakata bahasa Arab & Inggris lewat nyanyian, percakapan ringan, dan permainan peran menyenangkan.',
      iconName: 'Sun',
    },
    {
      id: 'prog-5',
      order: 5,
      title: 'Outing Class & Manasik Haji Cilik',
      category: 'Pentas & Praktek',
      description: 'Praktik langsung manasik haji anak usia dini, kunjungan edukatif ke pemadam kebakaran, berkebun, dan market day.',
      iconName: 'Target',
    },
  ],

  // Facilities & Gallery
  facilities: [
    {
      id: 'fac-1',
      title: 'Ruang Kelas Tematik Ber-AC & Nyaman',
      category: 'Fasilitas Belajar',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
      description: 'Dilengkapi pojok baca mini, display karya anak, meja kursi ergonomis ramah anak.',
    },
    {
      id: 'fac-2',
      title: 'Taman Bermain Outdoor & Sensory Path',
      category: 'Arena Bermain',
      imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600&auto=format&fit=crop&q=80',
      description: 'Ayunan, seluncuran aman, mandi bola, dan jalur sensorik alam untuk stimulasi motorik kasar.',
    },
    {
      id: 'fac-3',
      title: 'Musholla Cilik & Sudut Shalat Dhuha',
      category: 'Ibadah',
      imageUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=600&auto=format&fit=crop&q=80',
      description: 'Tempat pembiasaan shalat Dhuha berjamaah dan wudhu mandiri bernuansa sejuk.',
    },
    {
      id: 'fac-4',
      title: 'Area Loose Parts & Eksperimen Sains',
      category: 'Eksplorasi',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      description: 'Ribuan media loose parts dari kayu, biji-bijian, batu halus, dan kerang untuk kreasi mandiri.',
    },
  ],

  // Testimonials
  testimonials: [
    {
      id: 'testi-1',
      parentName: 'Bunda Sarah Maharani, S.Farm',
      childInfo: 'Wali dari Althaf (Kelompok B)',
      rating: 5,
      message: 'Alhamdulillah, baru 6 bulan sekolah di RA Al-Azhar Cendekia, Althaf sudah hafal 10 surat juz 30 dan selalu antusias shalat subuh tanpa disuruh. Aplikasi digitalnya juga sangat mempermudah kami yang bekerja!',
    },
    {
      id: 'testi-2',
      parentName: 'Ayah Hendra Pratama, S.T.',
      childInfo: 'Wali dari Aisyah (Kelompok A)',
      rating: 5,
      message: 'Guru-gurunya luar biasa sabar dan penuh kasih sayang. Aisyah yang tadinya pemalu sekarang jadi sangat ceria, mandiri, dan suka bercerita tentang aktivitas bermain di sekolah.',
    },
    {
      id: 'testi-3',
      parentName: 'Bunda Dr. Nurul Hidayati',
      childInfo: 'Wali dari Kenzo (Kelompok B)',
      rating: 5,
      message: 'Metode loose parts dan kurikulum merdekanya benar-benar mengasah logika anak. Sangat merekomendasikan RA ini untuk para orang tua yang mencari pondasi adab dan sains seimbang.',
    },
  ],

  // Announcements
  announcements: [
    {
      id: 'ann-1',
      title: 'Penerimaan Peserta Didik Baru (PPDB) 2026/2027 Gelombang I Dibuka',
      date: '01 Nov 2026',
      badge: 'PPDB',
      summary: 'Kuota terbatas untuk 40 calon peserta didik Kelompok A dan 30 Kelompok B. Formulir online dapat diisi melalui laman ini.',
      isActive: true,
    },
    {
      id: 'ann-2',
      title: 'Parenting Akbar & Peluncuran Rapor Portofolio Digital',
      date: '15 Des 2026',
      badge: 'Parenting',
      summary: 'Menghadirkan pakar psikologi anak bertema "Mendidik Adab Anak di Era Gadget". Terbuka untuk seluruh orang tua murid.',
      isActive: true,
    },
  ],

  // Quick PPDB Section Text
  ppdbFormTitle: 'Ingin Mengetahui Lebih Dekat Layanan RA Kami?',
  ppdbFormSubtitle: 'Tinggalkan kontak Anda, tim administrasi kami akan segera menghubungi Ayah/Bunda via WhatsApp untuk konsultasi kuota & program.',

  // Contact & Footer Customization
  hotlineWhatsapp: '081234567890',
  operatingHours: 'Senin – Jumat: 07.30 – 14.30 WIB • Sabtu: 08.00 – 12.00 WIB',
  footerNote: 'Raudlatul Athfal Terpadu dengan Tata Kelola Digital Cerdas & Berkelanjutan',
};




