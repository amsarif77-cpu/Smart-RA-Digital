import React, { createContext, useContext, useState, useEffect } from 'react';
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
  SupervisionRecord,
  CashTransaction,
  BOSComponent,
  ParentCommunication,
  LetterRecord,
  AssetRecord,
  ChildSecurityRecord,
  SchoolProgram,
  SchoolAchievement,
  BOSPlanItem,
  BOSRealizationItem,
  AccreditationStandardItem,
  ClassGroup,
  BOSReceipt,
  PPDBInquiry,
  User,
  UserRole,
  BackupData,
  LocalSnapshot,
  UserAccount,
  PKKMItem,
  AcademicCalendarEvent,
  PengawasRecord,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_VISION_GOALS,
  INITIAL_USERS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_STUDENTS,
  INITIAL_EMPLOYEES,
  INITIAL_PPDB,
  INITIAL_RPPH,
  INITIAL_JOURNALS,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_ASSESSMENTS,
  INITIAL_SUPERVISIONS,
  INITIAL_CASH_TRANSACTIONS,
  INITIAL_BOS_COMPONENTS,
  INITIAL_PARENT_MESSAGES,
  INITIAL_LETTERS,
  INITIAL_ASSETS,
  INITIAL_CHILD_SECURITY,
  INITIAL_PROGRAMS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_BOS_PLANS,
  INITIAL_BOS_REALIZATIONS,
  INITIAL_ACCREDITATION_ITEMS,
  INITIAL_CLASSES,
  INITIAL_RECEIPTS,
  INITIAL_INQUIRIES,
  INITIAL_PKKM_ITEMS,
  INITIAL_ACADEMIC_CALENDAR,
  INITIAL_PENGAWAS,
} from '../data/initialData';

// Pure Web Audio API chime utility (Works 100% offline, no audio assets needed)
export function playAttendanceChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // Tone 1: 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 1320Hz (E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.warn('Audio chime could not be played:', err);
  }
}

interface AppContextType {
  profile: SchoolProfile;
  updateProfile: (profile: SchoolProfile) => void;
  updateLogo: (logoUrl: string) => void;
  removeLogo: () => void;
  visionGoals: VisionGoal;
  updateVisionGoals: (vg: VisionGoal) => void;
  currentUser: User;
  setCurrentUser: (u: User) => void;
  users: User[];
  updateUserCredentials: (userId: string, updates: Partial<User>) => void;
  
  // User Accounts for disguised deploy footer
  userAccounts: UserAccount[];
  addUserAccount: (acc: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUserAccount: (acc: UserAccount) => void;
  deleteUserAccount: (id: string) => void;

  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  academicYear: string;
  setAcademicYear: (year: string) => void;
  availableYears: string[];
  addAcademicYear: (year: string) => void;
  semester: string;
  setSemester: (sem: string) => void;
  
  // Dynamic Rombel / Classes
  classes: ClassGroup[];
  addClass: (c: Omit<ClassGroup, 'id'>) => void;
  updateClass: (c: ClassGroup) => void;
  deleteClass: (id: string) => void;

  students: Student[];
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  markStudentAsAlumni: (studentId: string, graduationYear: string, noIjazah?: string, lanjutKe?: string) => void;

  employees: Employee[];
  addEmployee: (e: Omit<Employee, 'id'>) => void;
  updateEmployee: (e: Employee) => void;
  deleteEmployee: (id: string) => void;

  // PPDB Target Year & Applicants
  ppdbTargetYear: string;
  setPpdbTargetYear: (year: string) => void;
  ppdbList: PPDBApplicant[];
  addPPDB: (p: Omit<PPDBApplicant, 'id' | 'noPendaftaran' | 'status' | 'tanggalDaftar'>) => void;
  updatePPDB: (p: PPDBApplicant) => void;
  acceptApplicantToStudent: (pId: string, kelas: string) => void;

  ppdbInquiries: PPDBInquiry[];
  addPPDBInquiry: (inq: Omit<PPDBInquiry, 'id'> | (Omit<PPDBInquiry, 'id' | 'tanggal' | 'status'> & { tanggal?: string; status?: PPDBInquiry['status'] })) => void;
  updatePPDBInquiry: (inq: PPDBInquiry) => void;
  updatePPDBInquiryStatus: (id: string, status: PPDBInquiry['status']) => void;
  deletePPDBInquiry: (id: string) => void;
  playAttendanceChime: () => void;

  rpphList: RPPHItem[];
  addRPPH: (r: Omit<RPPHItem, 'id'>) => void;
  updateRPPH: (r: RPPHItem) => void;
  deleteRPPH: (id: string) => void;

  journals: TeachingJournal[];
  addJournal: (j: Omit<TeachingJournal, 'id'>) => void;

  studentAttendance: StudentAttendance[];
  saveStudentAttendance: (records: StudentAttendance[]) => void;

  staffAttendance: StaffAttendance[];
  addStaffAttendance: (sa: Omit<StaffAttendance, 'id'>) => void;
  approveStaffAttendance: (id: string) => void;

  assessments: ChildAssessment[];
  addAssessment: (a: Omit<ChildAssessment, 'id'>) => void;

  supervisions: SupervisionRecord[];
  addSupervision: (s: Omit<SupervisionRecord, 'id'>) => void;
  updateSupervision: (s: SupervisionRecord) => void;

  cashTransactions: CashTransaction[];
  addCashTransaction: (c: Omit<CashTransaction, 'id'>) => void;
  updateCashTransaction: (c: CashTransaction) => void;
  deleteCashTransaction: (id: string) => void;

  bosComponents: BOSComponent[];
  updateBOSComponents: (comps: BOSComponent[]) => void;

  // BOS Receipts / Kuitansi Standar Kemenag
  receipts: BOSReceipt[];
  addReceipt: (r: Omit<BOSReceipt, 'id'>) => void;
  updateReceipt: (r: BOSReceipt) => void;
  deleteReceipt: (id: string) => void;

  parentMessages: ParentCommunication[];
  sendParentMessage: (msg: Omit<ParentCommunication, 'id' | 'tanggal' | 'status'>) => void;
  replyParentMessage: (id: string, reply: string) => void;

  letters: LetterRecord[];
  addLetter: (l: Omit<LetterRecord, 'id'>) => void;
  updateLetter: (l: LetterRecord) => void;
  deleteLetter: (id: string) => void;

  assets: AssetRecord[];
  addAsset: (a: Omit<AssetRecord, 'id'>) => void;
  updateAsset: (a: AssetRecord) => void;
  deleteAsset: (id: string) => void;

  childSecurity: ChildSecurityRecord[];
  addChildSecurity: (sec: Omit<ChildSecurityRecord, 'id'>) => void;
  updateChildSecurity: (sec: ChildSecurityRecord) => void;
  deleteChildSecurity: (id: string) => void;
  updateChildSecurityStatus: (id: string, status: ChildSecurityRecord['statusHariIni'], catatan?: string) => void;

  programs: SchoolProgram[];
  addProgram: (p: Omit<SchoolProgram, 'id'>) => void;
  updateProgram: (p: SchoolProgram) => void;
  deleteProgram: (id: string) => void;

  achievements: SchoolAchievement[];
  addAchievement: (a: Omit<SchoolAchievement, 'id'>) => void;
  updateAchievement: (a: SchoolAchievement) => void;
  deleteAchievement: (id: string) => void;

  bosPlans: BOSPlanItem[];
  addBOSPlan: (bp: Omit<BOSPlanItem, 'id'>) => void;
  updateBOSPlan: (bp: BOSPlanItem) => void;
  deleteBOSPlan: (id: string) => void;

  bosRealizations: BOSRealizationItem[];
  addBOSRealization: (br: Omit<BOSRealizationItem, 'id'>) => void;
  updateBOSRealization: (br: BOSRealizationItem) => void;
  deleteBOSRealization: (id: string) => void;

  accreditationItems: AccreditationStandardItem[];
  addAccreditationItem: (item: Omit<AccreditationStandardItem, 'id'>) => void;
  updateAccreditationItem: (item: AccreditationStandardItem) => void;
  deleteAccreditationItem: (id: string) => void;

  pkkmList: PKKMItem[];
  addPKKMItem: (item: Omit<PKKMItem, 'id'>) => void;
  updatePKKMItem: (item: PKKMItem) => void;
  deletePKKMItem: (id: string) => void;

  calendarEvents: AcademicCalendarEvent[];
  addCalendarEvent: (e: Omit<AcademicCalendarEvent, 'id'>) => void;
  updateCalendarEvent: (e: AcademicCalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;

  pengawasList: PengawasRecord[];
  addPengawas: (p: Omit<PengawasRecord, 'id'>) => void;
  updatePengawas: (p: PengawasRecord) => void;
  deletePengawas: (id: string) => void;

  exportBackupData: () => BackupData;
  importBackupData: (backup: any, mode: 'replace' | 'merge') => { success: boolean; message: string; counts?: Record<string, number> };
  snapshots: LocalSnapshot[];
  createLocalSnapshot: (label?: string) => void;
  restoreFromSnapshot: (id: string) => boolean;
  deleteSnapshot: (id: string) => void;

  clearAllDemoData: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Error storing ${key} in localStorage:`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useStickyState<SchoolProfile>(INITIAL_PROFILE, 'smartra_profile');
  const [visionGoals, setVisionGoals] = useStickyState<VisionGoal>(INITIAL_VISION_GOALS, 'smartra_vision_goals');
  const [users, setUsers] = useStickyState<User[]>(INITIAL_USERS, 'smartra_users');
  const [currentUser, setCurrentUser] = useStickyState<User>(INITIAL_USERS[0], 'smartra_current_user');
  const [academicYear, setAcademicYear] = useStickyState<string>('2026/2027', 'smartra_academic_year');
  const [availableYears, setAvailableYears] = useStickyState<string[]>([
    '2024/2025',
    '2025/2026',
    '2026/2027',
    '2027/2028',
    '2028/2029',
  ], 'smartra_available_years');
  const [semester, setSemester] = useStickyState<string>('Semester 1 (Ganjil)', 'smartra_semester');

  // Dynamic Rombel / Classes
  const [classes, setClasses] = useStickyState<ClassGroup[]>(INITIAL_CLASSES, 'smartra_classes');

  const [students, setStudents] = useStickyState<Student[]>(INITIAL_STUDENTS, 'smartra_students');
  const [employees, setEmployees] = useStickyState<Employee[]>(INITIAL_EMPLOYEES, 'smartra_employees');
  const [ppdbList, setPPDBList] = useStickyState<PPDBApplicant[]>(INITIAL_PPDB, 'smartra_ppdb');
  const [ppdbInquiries, setPPDBInquiries] = useStickyState<PPDBInquiry[]>(INITIAL_INQUIRIES, 'smartra_ppdb_inquiries');
  const [rpphList, setRPPHList] = useStickyState<RPPHItem[]>(INITIAL_RPPH, 'smartra_rpph');
  const [journals, setJournals] = useStickyState<TeachingJournal[]>(INITIAL_JOURNALS, 'smartra_journals');
  const [studentAttendance, setStudentAttendance] = useStickyState<StudentAttendance[]>(INITIAL_STUDENT_ATTENDANCE, 'smartra_student_attendance');
  const [staffAttendance, setStaffAttendance] = useStickyState<StaffAttendance[]>(INITIAL_STAFF_ATTENDANCE, 'smartra_staff_attendance');
  const [assessments, setAssessments] = useStickyState<ChildAssessment[]>(INITIAL_ASSESSMENTS, 'smartra_assessments');
  const [supervisions, setSupervisions] = useStickyState<SupervisionRecord[]>(INITIAL_SUPERVISIONS, 'smartra_supervisions');
  const [cashTransactions, setCashTransactions] = useStickyState<CashTransaction[]>(INITIAL_CASH_TRANSACTIONS, 'smartra_cash');
  const [bosComponents, setBOSComponents] = useStickyState<BOSComponent[]>(INITIAL_BOS_COMPONENTS, 'smartra_bos_components');
  const [receipts, setReceipts] = useStickyState<BOSReceipt[]>(INITIAL_RECEIPTS, 'smartra_receipts');
  const [parentMessages, setParentMessages] = useStickyState<ParentCommunication[]>(INITIAL_PARENT_MESSAGES, 'smartra_parent_messages');
  const [letters, setLetters] = useStickyState<LetterRecord[]>(INITIAL_LETTERS, 'smartra_letters');
  const [assets, setAssets] = useStickyState<AssetRecord[]>(INITIAL_ASSETS, 'smartra_assets');
  const [childSecurity, setChildSecurity] = useStickyState<ChildSecurityRecord[]>(INITIAL_CHILD_SECURITY, 'smartra_child_security');
  const [programs, setPrograms] = useStickyState<SchoolProgram[]>(INITIAL_PROGRAMS, 'smartra_programs');
  const [achievements, setAchievements] = useStickyState<SchoolAchievement[]>(INITIAL_ACHIEVEMENTS, 'smartra_achievements');
  const [bosPlans, setBOSPlans] = useStickyState<BOSPlanItem[]>(INITIAL_BOS_PLANS, 'smartra_bos_plans');
  const [bosRealizations, setBOSRealizations] = useStickyState<BOSRealizationItem[]>(INITIAL_BOS_REALIZATIONS, 'smartra_bos_realizations');
  const [accreditationItems, setAccreditationItems] = useStickyState<AccreditationStandardItem[]>(INITIAL_ACCREDITATION_ITEMS, 'smartra_accreditation');
  const [pkkmList, setPkkmList] = useStickyState<PKKMItem[]>(INITIAL_PKKM_ITEMS, 'smartra_pkkm_items');
  const [calendarEvents, setCalendarEvents] = useStickyState<AcademicCalendarEvent[]>(INITIAL_ACADEMIC_CALENDAR, 'smartra_calendar_events');
  const [pengawasList, setPengawasList] = useStickyState<PengawasRecord[]>(INITIAL_PENGAWAS, 'smartra_pengawas_list');
  const [snapshots, setSnapshots] = useStickyState<LocalSnapshot[]>([], 'smartra_snapshots');
  const [userAccounts, setUserAccounts] = useStickyState<UserAccount[]>(INITIAL_USER_ACCOUNTS, 'smartra_user_accounts');
  const [ppdbTargetYear, setPpdbTargetYear] = useStickyState<string>('2027/2028', 'smartra_ppdb_target_year');

  const addUserAccount = (acc: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newAcc: UserAccount = {
      ...acc,
      id: `acc_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUserAccounts(prev => [...prev, newAcc]);
  };

  const updateUserAccount = (acc: UserAccount) => {
    setUserAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
  };

  const deleteUserAccount = (id: string) => {
    setUserAccounts(prev => prev.filter(a => a.id !== id));
  };

  const currentRole = currentUser.role;

  const switchRole = (role: UserRole) => {
    const matchedUser = users.find(u => u.role === role) || {
      id: `u_${role}`,
      name: `Pengguna ${role.toUpperCase()}`,
      role: role,
      email: `${role}@smartra.sch.id`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };
    setCurrentUser(matchedUser);
  };

  const updateUserCredentials = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const updateProfile = (newProfile: SchoolProfile) => {
    setProfile(newProfile);
  };

  const updateLogo = (logoUrl: string) => {
    setProfile(prev => ({ ...prev, logoUrl }));
  };

  const removeLogo = () => {
    setProfile(prev => ({ ...prev, logoUrl: '' }));
  };

  const updateVisionGoals = (vg: VisionGoal) => {
    setVisionGoals(vg);
  };

  const addAcademicYear = (newYear: string) => {
    if (!availableYears.includes(newYear)) {
      setAvailableYears(prev => [...prev, newYear]);
    }
    setAcademicYear(newYear);
  };

  // Dynamic Rombel / Classes CRUD
  const addClass = (c: Omit<ClassGroup, 'id'>) => {
    const newClass: ClassGroup = {
      ...c,
      id: `c_${Date.now()}`,
    };
    setClasses(prev => [...prev, newClass]);
    setProfile(prev => ({ ...prev, rombelCount: prev.rombelCount + 1 }));
  };

  const updateClass = (c: ClassGroup) => {
    setClasses(prev => prev.map(item => item.id === c.id ? c : item));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(item => item.id !== id));
    setProfile(prev => ({ ...prev, rombelCount: Math.max(1, prev.rombelCount - 1) }));
  };

  const addStudent = (s: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...s,
      id: `s_${Date.now()}`,
    };
    setStudents(prev => [newStudent, ...prev]);
    setProfile(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));
  };

  const updateStudent = (s: Student) => {
    setStudents(prev => prev.map(item => item.id === s.id ? s : item));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(item => item.id !== id));
    setProfile(prev => ({ ...prev, totalStudents: Math.max(0, prev.totalStudents - 1) }));
  };

  const markStudentAsAlumni = (studentId: string, graduationYear: string, noIjazah?: string, lanjutKe?: string) => {
    setStudents(prev => prev.map(item => {
      if (item.id === studentId) {
        return {
          ...item,
          status: 'alumni' as const,
          tahunLulus: graduationYear,
          noIjazah: noIjazah || item.noIjazah || `SKL/RA-${graduationYear.slice(0, 4)}/${item.nis}`,
          lanjutKe: lanjutKe || item.lanjutKe || 'MI / SD Terdekat',
        };
      }
      return item;
    }));
  };

  const addEmployee = (e: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...e,
      id: `e_${Date.now()}`,
    };
    setEmployees(prev => [newEmp, ...prev]);
    setProfile(prev => ({ ...prev, totalTeachers: prev.totalTeachers + 1 }));
  };

  const updateEmployee = (e: Employee) => {
    setEmployees(prev => prev.map(item => item.id === e.id ? e : item));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(item => item.id !== id));
    setProfile(prev => ({ ...prev, totalTeachers: Math.max(0, prev.totalTeachers - 1) }));
  };

  const addPPDB = (p: Omit<PPDBApplicant, 'id' | 'noPendaftaran' | 'status' | 'tanggalDaftar'>) => {
    const yearPrefix = new Date().getFullYear();
    const count = ppdbList.length + 1;
    const noPendaftaran = `PPDB-${yearPrefix}-${String(count).padStart(3, '0')}`;
    const newApplicant: PPDBApplicant = {
      ...p,
      id: `ppdb_${Date.now()}`,
      noPendaftaran,
      status: 'menunggu',
      tanggalDaftar: new Date().toISOString().split('T')[0],
    };
    setPPDBList(prev => [newApplicant, ...prev]);
  };

  const updatePPDB = (p: PPDBApplicant) => {
    setPPDBList(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const acceptApplicantToStudent = (pId: string, targetClass: string) => {
    const applicant = ppdbList.find(p => p.id === pId);
    if (!applicant) return;

    const groupLetter = applicant.kelompokPilihan.startsWith('A') ? 'A' : 'B';
    const currentYear = new Date().getFullYear();
    const currentCount = students.length + 1;
    const generatedNis = `${currentYear}${groupLetter === 'A' ? '01' : '02'}${String(currentCount).padStart(3, '0')}`;
    const generatedNisn = `3${String(Math.floor(100000000 + Math.random() * 900000000))}`;

    const newStudent: Student = {
      id: `s_${Date.now()}`,
      nis: generatedNis,
      nisn: generatedNisn,
      nama: applicant.namaAnak,
      jk: applicant.jk,
      tempatLahir: applicant.tempatTanggalLahir.split(',')[0]?.trim() || 'Bandung',
      tanggalLahir: applicant.tempatTanggalLahir.split(',')[1]?.trim() || '2021-01-01',
      namaAyah: applicant.namaAyah,
      namaIbu: applicant.namaIbu,
      alamat: applicant.alamat,
      noHpOrtu: applicant.noHpOrtu,
      tahunMasuk: `${currentYear}/${currentYear + 1}`,
      kelompok: groupLetter,
      kelas: targetClass,
      nik: applicant.nik || '3273...',
      noKk: '3273010101010001',
      catatanKesehatan: 'Sehat & Tumbuh Kembang Normal',
      status: 'aktif',
      foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    };

    setStudents(prev => [newStudent, ...prev]);
    setPPDBList(prev => prev.map(item => item.id === pId ? { ...item, status: 'diterima' } : item));
    setProfile(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));
  };

  // PPDB Inquiries / Konsultasi Cepat Website
  const addPPDBInquiry = (inq: any) => {
    const newInquiry: PPDBInquiry = {
      id: `inq_${Date.now()}`,
      tanggal: inq.tanggal || new Date().toISOString().split('T')[0],
      status: inq.status || 'Menunggu Follow-up',
      ...inq,
    };
    setPPDBInquiries(prev => [newInquiry, ...prev]);
  };

  const updatePPDBInquiry = (inq: PPDBInquiry) => {
    setPPDBInquiries(prev => prev.map(item => item.id === inq.id ? inq : item));
  };

  const updatePPDBInquiryStatus = (id: string, status: PPDBInquiry['status']) => {
    setPPDBInquiries(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const deletePPDBInquiry = (id: string) => {
    setPPDBInquiries(prev => prev.filter(item => item.id !== id));
  };

  const addRPPH = (r: Omit<RPPHItem, 'id'>) => {
    const newItem: RPPHItem = {
      ...r,
      id: `rpph_${Date.now()}`,
    };
    setRPPHList(prev => [newItem, ...prev]);
  };

  const updateRPPH = (r: RPPHItem) => {
    setRPPHList(prev => prev.map(item => item.id === r.id ? r : item));
  };

  const deleteRPPH = (id: string) => {
    setRPPHList(prev => prev.filter(item => item.id !== id));
  };

  const addJournal = (j: Omit<TeachingJournal, 'id'>) => {
    const newItem: TeachingJournal = {
      ...j,
      id: `j_${Date.now()}`,
    };
    setJournals(prev => [newItem, ...prev]);
  };

  const saveStudentAttendance = (records: StudentAttendance[]) => {
    setStudentAttendance(prev => {
      const keys = new Set(records.map(r => `${r.studentId}_${r.tanggal}`));
      const filtered = prev.filter(r => !keys.has(`${r.studentId}_${r.tanggal}`));
      return [...records, ...filtered];
    });
    // Trigger audio chime on successful attendance submission
    playAttendanceChime();
  };

  const addStaffAttendance = (sa: Omit<StaffAttendance, 'id'>) => {
    const newItem: StaffAttendance = {
      ...sa,
      id: `sta_${Date.now()}`,
    };
    setStaffAttendance(prev => [newItem, ...prev]);
    // Trigger audio chime
    playAttendanceChime();
  };

  const approveStaffAttendance = (id: string) => {
    setStaffAttendance(prev => prev.map(item => item.id === id ? { ...item, approvalKepala: 'Disetujui' } : item));
  };

  const addAssessment = (a: Omit<ChildAssessment, 'id'>) => {
    const newItem: ChildAssessment = {
      ...a,
      id: `asm_${Date.now()}`,
    };
    setAssessments(prev => [newItem, ...prev]);
  };

  const addSupervision = (s: Omit<SupervisionRecord, 'id'>) => {
    const newItem: SupervisionRecord = {
      ...s,
      id: `sup_${Date.now()}`,
    };
    setSupervisions(prev => [newItem, ...prev]);
  };

  const updateSupervision = (s: SupervisionRecord) => {
    setSupervisions(prev => prev.map(item => item.id === s.id ? s : item));
  };

  const addCashTransaction = (c: Omit<CashTransaction, 'id'>) => {
    const newItem: CashTransaction = {
      ...c,
      id: `trx_${Date.now()}`,
    };
    setCashTransactions(prev => [newItem, ...prev]);
  };

  const updateCashTransaction = (c: CashTransaction) => {
    setCashTransactions(prev => prev.map(item => item.id === c.id ? c : item));
  };

  const deleteCashTransaction = (id: string) => {
    setCashTransactions(prev => prev.filter(item => item.id !== id));
  };

  const updateBOSComponents = (comps: BOSComponent[]) => {
    setBOSComponents(comps);
  };

  // BOS Receipts
  const addReceipt = (r: Omit<BOSReceipt, 'id'>) => {
    const newReceipt: BOSReceipt = {
      ...r,
      id: `kwt_${Date.now()}`,
    };
    setReceipts(prev => [newReceipt, ...prev]);
  };

  const updateReceipt = (r: BOSReceipt) => {
    setReceipts(prev => prev.map(item => item.id === r.id ? r : item));
  };

  const deleteReceipt = (id: string) => {
    setReceipts(prev => prev.filter(item => item.id !== id));
  };

  const sendParentMessage = (msg: Omit<ParentCommunication, 'id' | 'tanggal' | 'status'>) => {
    const newMsg: ParentCommunication = {
      ...msg,
      id: `msg_${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'Menunggu Tanggapan',
    };
    setParentMessages(prev => [newMsg, ...prev]);
  };

  const replyParentMessage = (id: string, reply: string) => {
    setParentMessages(prev => prev.map(item => item.id === id ? { ...item, reply, status: 'Dibalas' } : item));
  };

  const addLetter = (l: Omit<LetterRecord, 'id'>) => {
    const newItem: LetterRecord = {
      ...l,
      id: `let_${Date.now()}`,
    };
    setLetters(prev => [newItem, ...prev]);
  };

  const updateLetter = (l: LetterRecord) => {
    setLetters(prev => prev.map(item => item.id === l.id ? l : item));
  };

  const deleteLetter = (id: string) => {
    setLetters(prev => prev.filter(item => item.id !== id));
  };

  const addAsset = (a: Omit<AssetRecord, 'id'>) => {
    const newItem: AssetRecord = {
      ...a,
      id: `ast_${Date.now()}`,
    };
    setAssets(prev => [newItem, ...prev]);
  };

  const updateAsset = (a: AssetRecord) => {
    setAssets(prev => prev.map(item => item.id === a.id ? a : item));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(item => item.id !== id));
  };

  const addChildSecurity = (sec: Omit<ChildSecurityRecord, 'id'>) => {
    const newItem: ChildSecurityRecord = {
      ...sec,
      id: `sec_${Date.now()}`,
    };
    setChildSecurity(prev => [newItem, ...prev]);
  };

  const updateChildSecurity = (sec: ChildSecurityRecord) => {
    setChildSecurity(prev => prev.map(item => item.id === sec.id ? sec : item));
  };

  const deleteChildSecurity = (id: string) => {
    setChildSecurity(prev => prev.filter(item => item.id !== id));
  };

  const updateChildSecurityStatus = (id: string, status: ChildSecurityRecord['statusHariIni'], catatan?: string) => {
    const now = new Date();
    const jamJemput = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    setChildSecurity(prev => prev.map(item => item.id === id ? {
      ...item,
      statusHariIni: status,
      jamJemput: status === 'Sudah Dijemput Aman' ? jamJemput : item.jamJemput,
      catatanPetugas: catatan || item.catatanPetugas,
    } : item));
  };

  // Program & Prestasi CRUD
  const addProgram = (p: Omit<SchoolProgram, 'id'>) => {
    const newProg: SchoolProgram = {
      ...p,
      id: `prog_${Date.now()}`,
    };
    setPrograms(prev => [...prev, newProg]);
  };

  const updateProgram = (p: SchoolProgram) => {
    setPrograms(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(item => item.id !== id));
  };

  const addAchievement = (a: Omit<SchoolAchievement, 'id'>) => {
    const newAch: SchoolAchievement = {
      ...a,
      id: `ach_${Date.now()}`,
    };
    setAchievements(prev => [newAch, ...prev]);
  };

  const updateAchievement = (a: SchoolAchievement) => {
    setAchievements(prev => prev.map(item => item.id === a.id ? a : item));
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(item => item.id !== id));
  };

  // BOS Plans CRUD
  const addBOSPlan = (bp: Omit<BOSPlanItem, 'id'>) => {
    const newItem: BOSPlanItem = {
      ...bp,
      id: `bp_${Date.now()}`,
    };
    setBOSPlans(prev => [newItem, ...prev]);
  };

  const updateBOSPlan = (bp: BOSPlanItem) => {
    setBOSPlans(prev => prev.map(item => item.id === bp.id ? bp : item));
  };

  const deleteBOSPlan = (id: string) => {
    setBOSPlans(prev => prev.filter(item => item.id !== id));
  };

  // BOS Realizations CRUD
  const addBOSRealization = (br: Omit<BOSRealizationItem, 'id'>) => {
    const newItem: BOSRealizationItem = {
      ...br,
      id: `br_${Date.now()}`,
    };
    setBOSRealizations(prev => [newItem, ...prev]);
  };

  const updateBOSRealization = (br: BOSRealizationItem) => {
    setBOSRealizations(prev => prev.map(item => item.id === br.id ? br : item));
  };

  const deleteBOSRealization = (id: string) => {
    setBOSRealizations(prev => prev.filter(item => item.id !== id));
  };

  // Accreditation Items CRUD
  const addAccreditationItem = (item: Omit<AccreditationStandardItem, 'id'>) => {
    const newItem: AccreditationStandardItem = {
      ...item,
      id: `acc_${Date.now()}`,
    };
    setAccreditationItems(prev => [newItem, ...prev]);
  };

  const updateAccreditationItem = (item: AccreditationStandardItem) => {
    setAccreditationItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteAccreditationItem = (id: string) => {
    setAccreditationItems(prev => prev.filter(i => i.id !== id));
  };

  // PKKM CRUD
  const addPKKMItem = (item: Omit<PKKMItem, 'id'>) => {
    const newItem: PKKMItem = {
      ...item,
      id: `pkkm_${Date.now()}`,
    };
    setPkkmList(prev => [newItem, ...prev]);
  };

  const updatePKKMItem = (item: PKKMItem) => {
    setPkkmList(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deletePKKMItem = (id: string) => {
    setPkkmList(prev => prev.filter(i => i.id !== id));
  };

  // Academic Calendar CRUD
  const addCalendarEvent = (e: Omit<AcademicCalendarEvent, 'id'>) => {
    const newEvent: AcademicCalendarEvent = {
      ...e,
      id: `cal_${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const updateCalendarEvent = (e: AcademicCalendarEvent) => {
    setCalendarEvents(prev => prev.map(item => item.id === e.id ? e : item));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(item => item.id !== id));
  };

  // Pengawas CRUD
  const addPengawas = (p: Omit<PengawasRecord, 'id'>) => {
    const newP: PengawasRecord = {
      ...p,
      id: `pgw_${Date.now()}`,
    };
    setPengawasList(prev => [...prev, newP]);
  };

  const updatePengawas = (p: PengawasRecord) => {
    setPengawasList(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const deletePengawas = (id: string) => {
    setPengawasList(prev => prev.filter(item => item.id !== id));
  };

  // Backup & Restore
  const exportBackupData = (): BackupData => {
    return {
      version: '1.2.0',
      timestamp: new Date().toISOString(),
      schoolName: profile.name,
      nsm: profile.nsm,
      npsn: profile.npsn,
      data: {
        profile,
        visionGoals,
        students,
        employees,
        ppdbList,
        rpphList,
        journals,
        studentAttendance,
        staffAttendance,
        assessments,
        supervisions,
        cashTransactions,
        bosComponents,
        parentMessages,
        letters,
        assets,
        childSecurity,
        programs,
        achievements,
        bosPlans,
        bosRealizations,
        accreditationItems,
        pkkmItems: pkkmList,
        classes,
        receipts,
        ppdbInquiries,
        calendarEvents,
        pengawasList,
        academicYear,
        semester,
      },
    };
  };

  const importBackupData = (backup: any, mode: 'replace' | 'merge') => {
    try {
      if (!backup || typeof backup !== 'object' || !backup.data) {
        return { success: false, message: 'Format berkas cadangan (JSON) tidak valid!' };
      }

      const { data } = backup;

      if (mode === 'replace') {
        if (data.profile) setProfile(data.profile);
        if (data.visionGoals) setVisionGoals(data.visionGoals);
        if (Array.isArray(data.students)) setStudents(data.students);
        if (Array.isArray(data.employees)) setEmployees(data.employees);
        if (Array.isArray(data.ppdbList)) setPPDBList(data.ppdbList);
        if (Array.isArray(data.rpphList)) setRPPHList(data.rpphList);
        if (Array.isArray(data.journals)) setJournals(data.journals);
        if (Array.isArray(data.studentAttendance)) setStudentAttendance(data.studentAttendance);
        if (Array.isArray(data.staffAttendance)) setStaffAttendance(data.staffAttendance);
        if (Array.isArray(data.assessments)) setAssessments(data.assessments);
        if (Array.isArray(data.supervisions)) setSupervisions(data.supervisions);
        if (Array.isArray(data.cashTransactions)) setCashTransactions(data.cashTransactions);
        if (Array.isArray(data.bosComponents)) setBOSComponents(data.bosComponents);
        if (Array.isArray(data.parentMessages)) setParentMessages(data.parentMessages);
        if (Array.isArray(data.letters)) setLetters(data.letters);
        if (Array.isArray(data.assets)) setAssets(data.assets);
        if (Array.isArray(data.childSecurity)) setChildSecurity(data.childSecurity);
        if (Array.isArray(data.programs)) setPrograms(data.programs);
        if (Array.isArray(data.achievements)) setAchievements(data.achievements);
        if (Array.isArray(data.bosPlans)) setBOSPlans(data.bosPlans);
        if (Array.isArray(data.bosRealizations)) setBOSRealizations(data.bosRealizations);
        if (Array.isArray(data.accreditationItems)) setAccreditationItems(data.accreditationItems);
        if (Array.isArray(data.pkkmItems)) setPkkmList(data.pkkmItems);
        if (Array.isArray(data.calendarEvents)) setCalendarEvents(data.calendarEvents);
        if (Array.isArray(data.pengawasList)) setPengawasList(data.pengawasList);
        if (Array.isArray(data.classes)) setClasses(data.classes);
        if (Array.isArray(data.receipts)) setReceipts(data.receipts);
        if (Array.isArray(data.ppdbInquiries)) setPPDBInquiries(data.ppdbInquiries);
        if (data.academicYear) setAcademicYear(data.academicYear);
        if (data.semester) setSemester(data.semester);

        return {
          success: true,
          message: 'Seluruh basis data berhasil dipulihkan (mode replace)!',
          counts: {
            students: data.students?.length || 0,
            employees: data.employees?.length || 0,
            cash: data.cashTransactions?.length || 0,
          },
        };
      } else {
        const mergeArr = (current: any[], incoming: any[]) => {
          const map = new Map<string, any>();
          current.forEach(item => item.id && map.set(item.id, item));
          incoming.forEach(item => item.id && map.set(item.id, item));
          return Array.from(map.values());
        };

        if (Array.isArray(data.students)) setStudents(prev => mergeArr(prev, data.students));
        if (Array.isArray(data.employees)) setEmployees(prev => mergeArr(prev, data.employees));
        if (Array.isArray(data.ppdbList)) setPPDBList(prev => mergeArr(prev, data.ppdbList));
        if (Array.isArray(data.rpphList)) setRPPHList(prev => mergeArr(prev, data.rpphList));
        if (Array.isArray(data.journals)) setJournals(prev => mergeArr(prev, data.journals));
        if (Array.isArray(data.studentAttendance)) setStudentAttendance(prev => mergeArr(prev, data.studentAttendance));
        if (Array.isArray(data.staffAttendance)) setStaffAttendance(prev => mergeArr(prev, data.staffAttendance));
        if (Array.isArray(data.assessments)) setAssessments(prev => mergeArr(prev, data.assessments));
        if (Array.isArray(data.supervisions)) setSupervisions(prev => mergeArr(prev, data.supervisions));
        if (Array.isArray(data.cashTransactions)) setCashTransactions(prev => mergeArr(prev, data.cashTransactions));
        if (Array.isArray(data.parentMessages)) setParentMessages(prev => mergeArr(prev, data.parentMessages));
        if (Array.isArray(data.letters)) setLetters(prev => mergeArr(prev, data.letters));
        if (Array.isArray(data.assets)) setAssets(prev => mergeArr(prev, data.assets));
        if (Array.isArray(data.childSecurity)) setChildSecurity(prev => mergeArr(prev, data.childSecurity));
        if (Array.isArray(data.programs)) setPrograms(prev => mergeArr(prev, data.programs));
        if (Array.isArray(data.achievements)) setAchievements(prev => mergeArr(prev, data.achievements));
        if (Array.isArray(data.bosPlans)) setBOSPlans(prev => mergeArr(prev, data.bosPlans));
        if (Array.isArray(data.bosRealizations)) setBOSRealizations(prev => mergeArr(prev, data.bosRealizations));
        if (Array.isArray(data.accreditationItems)) setAccreditationItems(prev => mergeArr(prev, data.accreditationItems));
        if (Array.isArray(data.pkkmItems)) setPkkmList(prev => mergeArr(prev, data.pkkmItems));
        if (Array.isArray(data.calendarEvents)) setCalendarEvents(prev => mergeArr(prev, data.calendarEvents));
        if (Array.isArray(data.pengawasList)) setPengawasList(prev => mergeArr(prev, data.pengawasList));
        if (Array.isArray(data.classes)) setClasses(prev => mergeArr(prev, data.classes));
        if (Array.isArray(data.receipts)) setReceipts(prev => mergeArr(prev, data.receipts));
        if (Array.isArray(data.ppdbInquiries)) setPPDBInquiries(prev => mergeArr(prev, data.ppdbInquiries));

        return {
          success: true,
          message: 'Data berhasil digabungkan (mode merge)!',
        };
      }
    } catch (err: any) {
      return { success: false, message: `Gagal memulihkan data: ${err.message}` };
    }
  };

  const createLocalSnapshot = (label?: string) => {
    const backup = exportBackupData();
    const str = JSON.stringify(backup);
    const sizeKb = Math.round((str.length / 1024) * 10) / 10;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newSnapshot: LocalSnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: timeStr,
      label: label || `Snapshot Otomatis ${timeStr}`,
      sizeKb,
      data: backup,
    };
    setSnapshots(prev => [newSnapshot, ...prev.slice(0, 9)]);
  };

  const restoreFromSnapshot = (id: string) => {
    const snap = snapshots.find(s => s.id === id);
    if (!snap) return false;
    importBackupData(snap.data, 'replace');
    return true;
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  };

  // Requirement: Kosongkan data awal untuk diisi data real saat dideploy di domain pengguna
  const clearAllDemoData = () => {
    setStudents([]);
    setStudentAttendance([]);
    setStaffAttendance([]);
    setJournals([]);
    setAssessments([]);
    setSupervisions([]);
    setCashTransactions([]);
    setPPDBList([]);
    setPPDBInquiries([]);
    setParentMessages([]);
    setLetters([]);
    setBOSPlans([]);
    setBOSRealizations([]);
    setReceipts([]);
    setProfile(prev => ({ ...prev, totalStudents: 0 }));
  };

  const resetToDefaultData = () => {
    setProfile(INITIAL_PROFILE);
    setVisionGoals(INITIAL_VISION_GOALS);
    setStudents(INITIAL_STUDENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setPPDBList(INITIAL_PPDB);
    setPPDBInquiries(INITIAL_INQUIRIES);
    setRPPHList(INITIAL_RPPH);
    setJournals(INITIAL_JOURNALS);
    setStudentAttendance(INITIAL_STUDENT_ATTENDANCE);
    setStaffAttendance(INITIAL_STAFF_ATTENDANCE);
    setAssessments(INITIAL_ASSESSMENTS);
    setSupervisions(INITIAL_SUPERVISIONS);
    setCashTransactions(INITIAL_CASH_TRANSACTIONS);
    setBOSComponents(INITIAL_BOS_COMPONENTS);
    setReceipts(INITIAL_RECEIPTS);
    setParentMessages(INITIAL_PARENT_MESSAGES);
    setLetters(INITIAL_LETTERS);
    setAssets(INITIAL_ASSETS);
    setChildSecurity(INITIAL_CHILD_SECURITY);
    setPrograms(INITIAL_PROGRAMS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setBOSPlans(INITIAL_BOS_PLANS);
    setBOSRealizations(INITIAL_BOS_REALIZATIONS);
    setAccreditationItems(INITIAL_ACCREDITATION_ITEMS);
    setPkkmList(INITIAL_PKKM_ITEMS);
    setCalendarEvents(INITIAL_ACADEMIC_CALENDAR);
    setPengawasList(INITIAL_PENGAWAS);
    setClasses(INITIAL_CLASSES);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        updateLogo,
        removeLogo,
        visionGoals,
        updateVisionGoals,
        currentUser,
        setCurrentUser,
        users,
        updateUserCredentials,
        userAccounts,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
        currentRole,
        switchRole,
        academicYear,
        setAcademicYear,
        availableYears,
        addAcademicYear,
        semester,
        setSemester,
        classes,
        addClass,
        updateClass,
        deleteClass,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        markStudentAsAlumni,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        ppdbTargetYear,
        setPpdbTargetYear,
        ppdbList,
        addPPDB,
        updatePPDB,
        acceptApplicantToStudent,
        ppdbInquiries,
        addPPDBInquiry,
        updatePPDBInquiry,
        updatePPDBInquiryStatus,
        deletePPDBInquiry,
        playAttendanceChime,
        rpphList,
        addRPPH,
        updateRPPH,
        deleteRPPH,
        journals,
        addJournal,
        studentAttendance,
        saveStudentAttendance,
        staffAttendance,
        addStaffAttendance,
        approveStaffAttendance,
        assessments,
        addAssessment,
        supervisions,
        addSupervision,
        updateSupervision,
        cashTransactions,
        addCashTransaction,
        updateCashTransaction,
        deleteCashTransaction,
        bosComponents,
        updateBOSComponents,
        receipts,
        addReceipt,
        updateReceipt,
        deleteReceipt,
        parentMessages,
        sendParentMessage,
        replyParentMessage,
        letters,
        addLetter,
        updateLetter,
        deleteLetter,
        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        childSecurity,
        addChildSecurity,
        updateChildSecurity,
        deleteChildSecurity,
        updateChildSecurityStatus,
        programs,
        addProgram,
        updateProgram,
        deleteProgram,
        achievements,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        bosPlans,
        addBOSPlan,
        updateBOSPlan,
        deleteBOSPlan,
        bosRealizations,
        addBOSRealization,
        updateBOSRealization,
        deleteBOSRealization,
        accreditationItems,
        addAccreditationItem,
        updateAccreditationItem,
        deleteAccreditationItem,
        pkkmList,
        addPKKMItem,
        updatePKKMItem,
        deletePKKMItem,
        calendarEvents,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        pengawasList,
        addPengawas,
        updatePengawas,
        deletePengawas,
        exportBackupData,
        importBackupData,
        snapshots,
        createLocalSnapshot,
        restoreFromSnapshot,
        deleteSnapshot,
        clearAllDemoData,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
