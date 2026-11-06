export type UserRole = 
  | 'superadmin' 
  | 'kepala' 
  | 'tu' 
  | 'guru' 
  | 'bendahara' 
  | 'pengawas' 
  | 'orangtua' 
  | 'yayasan';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  assignedClass?: string;
  phone?: string;
}

export interface SchoolProfile {
  name: string;
  nsm: string;
  npsn: string;
  status: 'Swasta' | 'Negeri';
  foundation: string;
  address: string;
  googleMapsUrl?: string;
  phone: string;
  email: string;
  website: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  headmasterName: string;
  headmasterNip?: string;
  establishedYear: string;
  accreditation: 'A (Unggul)' | 'B (Baik)' | 'C' | 'Proses Akreditasi';
  motto: string;
  history: string;
  logoUrl: string;
  rombelCount: number;
  totalTeachers: number;
  totalStudents: number;
}

export interface VisionGoal {
  vision: string;
  missions: string[];
  goals: string[];
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  jk: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  namaAyah: string;
  namaIbu: string;
  namaWali?: string;
  alamat: string;
  noHpOrtu: string;
  tahunMasuk: string;
  kelompok: 'A' | 'B';
  kelas: string;
  nik: string;
  noKk: string;
  status: 'aktif' | 'mutasi' | 'lulus' | 'keluar' | 'alumni';
  foto: string;
  catatanKesehatan?: string;
  tahunLulus?: string;
  noIjazah?: string;
  lanjutKe?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  nip: string;
  nuptk?: string;
  nama: string;
  jk: 'L' | 'P';
  pendidikan: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'Guru Tetap Yayasan (GTY)' | 'Guru Tidak Tetap (GTT)';
  jabatan: 'Kepala RA' | 'Guru Kelas' | 'Guru Pendamping' | 'Bendahara' | 'Tenaga Administrasi';
  golRuang?: string;
  sertifikasi: boolean;
  skTugas: string;
  noHp: string;
  email: string;
  foto: string;
  jadwalMengajar: string;
}

export interface PPDBApplicant {
  id: string;
  noPendaftaran: string;
  namaAnak: string;
  jk: 'L' | 'P';
  nik: string;
  tempatTanggalLahir: string;
  namaAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  noHpOrtu: string;
  alamat: string;
  kelompokPilihan: 'A (4-5 Tahun)' | 'B (5-6 Tahun)';
  status: 'menunggu' | 'terverifikasi' | 'diterima' | 'ditolak';
  tanggalDaftar: string;
  catatan?: string;
}

export interface RPPHItem {
  id: string;
  tanggal: string;
  kelompok: 'A (4-5 Tahun)' | 'B (5-6 Tahun)';
  tema: string;
  subtema: string;
  nilaiIslam: string;
  tujuan: string;
  kegiatanPembukaan: string;
  kegiatanInti: string;
  istirahatMakan: string;
  kegiatanPenutup: string;
  pertanyaanPemantik: string;
  alatBahan: string;
  asesmen: string;
  status: 'draft' | 'disetujui';
}

export interface TeachingJournal {
  id: string;
  tanggal: string;
  guruNama: string;
  kelas: string;
  tema: string;
  rpphId?: string;
  materiKegiatan: string;
  jumlahHadir: number;
  jumlahTotal: number;
  catatanPelaksanaan: string;
  refleksi: string;
  kendalaDanTindakLanjut: string;
  fotoUrl?: string;
}

export interface StudentAttendance {
  id: string;
  tanggal: string;
  kelas: string;
  studentId: string;
  studentName: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
  jamMasuk: string;
  keterangan?: string;
  suratIzinUrl?: string;
  suratDokterUrl?: string;
  jenisIzin?: 'Sakit dengan Surat Dokter' | 'Izin Tertulis Orang Tua' | 'Izin Khusus' | 'Tanpa Keterangan';
}

export interface StaffAttendance {
  id: string;
  tanggal: string;
  employeeId: string;
  employeeName: string;
  jabatan: string;
  jamMasuk: string;
  jamPulang: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Cuti' | 'Dinas Luar';
  lokasiGps: string;
  approvalKepala: 'Disetujui' | 'Menunggu' | 'Ditolak';
}

export interface ChildAssessment {
  id: string;
  studentId: string;
  studentName: string;
  tanggal: string;
  aspek: 'Nilai Agama & Moral' | 'Jati Diri & Sosem' | 'Literasi & Komunikasi' | 'STEAM & Kognitif' | 'Fisik Motorik' | 'Seni & Kreativitas';
  jenis: 'Catatan Anekdot' | 'Hasil Karya' | 'Ceklis Observasi';
  deskripsi: string;
  capaian: 'BB (Belum Berkembang)' | 'MB (Mulai Berkembang)' | 'BSH (Berkembang Sesuai Harapan)' | 'BSB (Berkembang Sangat Baik)';
  fotoKarya?: string;
}

export interface ChildReport {
  id: string;
  studentId: string;
  studentName: string;
  kelompok: string;
  semester: 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)';
  tahunAjaran: string;
  narasiAgama: string;
  narasiJatidiri: string;
  narasiLiterasiSteam: string;
  tinggiBadan: number;
  beratBadan: number;
  lingkarKepala: number;
  kehadiranHadir: number;
  kehadiranSakit: number;
  kehadiranIzin: number;
  kehadiranAlpa: number;
  catatanWaliKelas: string;
}

export interface SchoolProgram {
  id: string;
  nomor: number;
  judul: string;
  deskripsi: string;
  target: string;
}

export interface SchoolAchievement {
  id: string;
  judul: string;
  kategori: string;
  tahun: string;
  peserta: string;
  penyelenggara: string;
}

export interface BOSPlanItem {
  id: string;
  kodeKomponen: string;
  namaKomponen: string;
  uraianKegiatan: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  totalAnggaran: number;
  tahap: 'Tahap 1' | 'Tahap 2';
}

export interface BOSRealizationItem {
  id: string;
  tanggal: string;
  noKwitansi: string;
  kodeKomponen: string;
  namaKomponen: string;
  uraianBelanja: string;
  penerima: string;
  nominal: number;
  noFakturNota: string;
  pph: number;
  ppn: number;
  statusSPJ: 'Lengkap' | 'Belum Lengkap';
  keterangan: string;
}

export interface AccreditationStandardItem {
  id: string;
  standardNo: number; // 1 to 8
  standardName: string;
  indikator: string;
  berkasDisiapkan: string;
  statusKelengkapan: 'Lengkap' | 'Sebagian' | 'Belum Ada';
  penanggungJawab: string;
  catatan?: string;
  judulBlangko?: string;
  isiBlangko?: string;
}

export interface AcademicCalendarEvent {
  id: string;
  tanggal: string; // e.g. '15 Juli 2026' or '2026-07-15'
  tanggalMulai?: string;
  tanggalSelesai?: string;
  agenda: string;
  kategori: 'Akademik' | 'Nasional' | 'PHBI' | 'Program Unggulan' | 'Kompetisi' | 'Evaluasi' | 'Keagamaan' | 'Kelulusan' | 'Libur';
  semester: 'Semester Ganjil' | 'Semester Genap';
  tahunAjaran: string;
  keterangan?: string;
}

export interface PengawasRecord {
  id: string;
  nama: string;
  nip: string;
  pangkatGolongan: string;
  jabatan: string;
  wilayahBinaan: string;
  noHp: string;
  email?: string;
  skPenugasan?: string;
  tanggalMulaiTugas?: string;
  foto?: string;
  catatan?: string;
}

export interface PKKMItem {
  id: string;
  tahun: string;
  periode: 'Tahunan' | '4 Tahunan';
  komponenNo: number; // 1 to 5
  namaKomponen: string;
  kriteriaIndikator: string;
  subIndikator?: string;
  buktiFisikDisiapkan: string;
  statusBukti: 'Lengkap' | 'Sebagian' | 'Belum Ada' | 'Belum Lengkap';
  skor: number; // 1, 2, 3, 4 (Kemenag standard)
  catatanPenilai?: string;
  judulBlangko?: string;
  isiBlangko?: string;
}

export interface SupervisionRecord {
  id: string;
  tanggal: string;
  supervisorRole: 'kepala' | 'pengawas';
  supervisorName: string;
  supervisorNip?: string;
  targetTeacherName?: string;
  targetTeacherNip?: string;
  targetRaName?: string;
  jenis: 'Supervisi Akademik' | 'Supervisi Manajerial';
  aspek: string[];
  skor: number; // 0 - 100
  skorRpph?: number;
  skorProses?: number;
  skorAsesmen?: number;
  catatanObservasi: string;
  rekomendasi: string;
  statusTindakLanjut: 'Perlu Perbaikan' | 'Sedang Ditindaklanjuti' | 'Tuntas Memuaskan';
  tindakLanjutMadrasah?: string;
  buktiTindakLanjut?: string;
  tandaTangan: boolean;
}

export interface CashTransaction {
  id: string;
  tanggal: string;
  noBukti: string;
  jenis: 'Masuk' | 'Keluar';
  sumberDana: 'BOS Kemenag' | 'Dana Komite / Yayasan' | 'SPP Siswa' | 'Infaq & Donasi';
  kategori: string;
  nominal: number;
  penerimaPembayar: string;
  keterangan: string;
  hasKwitansi: boolean;
}

export interface BOSComponent {
  kode: string;
  nama: string;
  anggaran: number;
  realisasi: number;
}

export interface ParentCommunication {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  teacherName: string;
  kelas: string;
  subject: string;
  message: string;
  reply?: string;
  tanggal: string;
  status: 'Dibalas' | 'Menunggu Tanggapan';
  isPermit?: boolean; // Izin tidak masuk
}

export interface LetterRecord {
  id: string;
  jenis: 'Surat Masuk' | 'Surat Keluar';
  noSurat: string;
  tanggal: string;
  perihal: string;
  pengirimPenerima: string;
  keterangan: string;
  status: 'Arsip' | 'Terkirim' | 'Diproses';
}

export interface AssetRecord {
  id: string;
  kode: string;
  nama: string;
  kategori: 'APE Luar (Outdoor)' | 'APE Dalam (Indoor)' | 'Media Audio-Visual' | 'Perabot Kelas' | 'Perlengkapan UKS';
  jumlah: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  lokasi: string;
}

export interface ChildSecurityRecord {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  namaPenjemput: string;
  hubungan: string;
  noHpPenjemput: string;
  statusHariIni: 'Belum Dijemput' | 'Sudah Dijemput Aman' | 'Izin Penjemput Baru';
  jamJemput?: string;
  catatanPetugas?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  ageGroup: string;
  teacher: string;
  coTeacher?: string;
  quota: number;
}

export interface BOSReceipt {
  id: string;
  noKwitansi: string;
  tahunAnggaran: string;
  tanggal: string;
  sudahTerimaDari: string;
  jumlahUang: number;
  terbilang: string;
  untukPembayaran: string;
  kodeKomponen: string;
  namaKomponen: string;
  namaPenerima: string;
  alamatPenerima: string;
  npwpPenerima?: string;
  ppn: number;
  pph: number;
  statusLunas: 'Lunas' | 'Menunggu Verifikasi';
  sumberDana: 'BOS Kemenag' | 'Dana Komite / Yayasan' | 'SPP Siswa' | 'Infaq & Donasi';
}

export interface PPDBInquiry {
  id: string;
  namaAnak: string;
  usia: string;
  namaOrtu: string;
  noHp: string;
  pesan?: string;
  tanggal: string;
  status: 'Menunggu Follow-up' | 'Sudah Dihubungi via WA' | 'Daftar Resmi PPDB';
}

export interface BackupData {
  version: string;
  timestamp: string;
  schoolName: string;
  nsm: string;
  npsn: string;
  data: {
    profile: SchoolProfile;
    visionGoals: VisionGoal;
    students: Student[];
    employees: Employee[];
    ppdbList: PPDBApplicant[];
    rpphList: RPPHItem[];
    journals: TeachingJournal[];
    studentAttendance: StudentAttendance[];
    staffAttendance: StaffAttendance[];
    assessments: ChildAssessment[];
    supervisions: SupervisionRecord[];
    cashTransactions: CashTransaction[];
    bosComponents: BOSComponent[];
    parentMessages: ParentCommunication[];
    letters: LetterRecord[];
    assets: AssetRecord[];
    childSecurity: ChildSecurityRecord[];
    programs?: SchoolProgram[];
    achievements?: SchoolAchievement[];
    bosPlans?: BOSPlanItem[];
    bosRealizations?: BOSRealizationItem[];
    accreditationItems?: AccreditationStandardItem[];
    pkkmItems?: PKKMItem[];
    classes?: ClassGroup[];
    receipts?: BOSReceipt[];
    ppdbInquiries?: PPDBInquiry[];
    calendarEvents?: AcademicCalendarEvent[];
    pengawasList?: PengawasRecord[];
    websiteConfig?: WebsiteConfig;
    academicYear: string;
    semester: string;
  };
}

export interface LocalSnapshot {
  id: string;
  timestamp: string;
  label: string;
  sizeKb: number;
  data: BackupData;
}

export type WebsiteColorTheme = 
  | 'emerald'
  | 'teal'
  | 'blue'
  | 'indigo'
  | 'warm'
  | 'dark';

export type WebsiteHeroLayout = 'gradient-glow' | 'card-split' | 'centered-minimal';

export interface WebsiteProgramItem {
  id: string;
  order: number;
  title: string;
  category: string;
  description: string;
  iconName?: string;
}

export interface WebsiteFacilityItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface WebsiteTestimonialItem {
  id: string;
  parentName: string;
  childInfo: string;
  avatarUrl?: string;
  rating: number;
  message: string;
}

export interface WebsiteAnnouncementItem {
  id: string;
  title: string;
  date: string;
  badge: string;
  summary: string;
  linkText?: string;
  isActive: boolean;
}

export interface WebsiteConfig {
  theme: WebsiteColorTheme;
  heroLayout: WebsiteHeroLayout;
  showRunningAnnouncement: boolean;
  runningAnnouncementText: string;
  
  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  heroImageUrl?: string;
  
  // Sections Visibility
  showHeadmasterGreeting: boolean;
  showStats: boolean;
  showPrograms: boolean;
  showFacilities: boolean;
  showTeachers: boolean;
  showTestimonials: boolean;
  showAnnouncements: boolean;
  showQuickPPDB: boolean;
  showContactLocation: boolean;

  // Headmaster Greeting
  headmasterGreetingTitle: string;
  headmasterGreetingText: string;
  headmasterGreetingPhotoUrl?: string;

  // Custom Content Lists
  programs: WebsiteProgramItem[];
  facilities: WebsiteFacilityItem[];
  testimonials: WebsiteTestimonialItem[];
  announcements: WebsiteAnnouncementItem[];

  // Quick PPDB Section Text
  ppdbFormTitle: string;
  ppdbFormSubtitle: string;
  
  // Contact & Footer Customization
  hotlineWhatsapp: string;
  operatingHours: string;
  footerNote: string;
}

