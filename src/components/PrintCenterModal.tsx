import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  X,
  FileText,
  Users,
  DollarSign,
  Award,
  CheckCircle2,
  Download
} from 'lucide-react';

interface PrintCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintCenterModal: React.FC<PrintCenterModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    students,
    employees,
    cashTransactions,
    bosComponents,
    supervisions,
    accreditationItems,
    pkkmList,
    academicYear,
    semester,
    currentRole,
  } = useApp();

  const [reportType, setReportType] = useState<
    'buku-induk' | 'buku-kas' | 'spj-bos' | 'supervisi-kepala' | '8-standar' | 'pkkm'
  >('buku-induk');

  if (!isOpen) return null;

  // RBAC Guard: Orang Tua / Wali Murid cannot access internal institutional print center
  if (currentRole === 'orangtua') {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Printer className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Cetak Rapor & Portofolio Ananda</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pusat cetak ini khusus untuk pembukuan dan akreditasi madrasah. Untuk mencetak Lembar Rapor Digital dan Portofolio Ananda, silakan buka menu <strong>Tumbuh Kembang & Rapor</strong> lalu klik tombol <em>Cetak Rapor Digital</em>.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        {/* Modal Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pusat Cetak & Arsip Laporan Multi Tahun</h3>
                <p className="text-[11px] text-slate-500">Pilih jenis berkas resmi untuk dipratinjau dan dicetak (Cetak PDF).</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Report Type Selector */}
          <div className="flex flex-wrap gap-2 my-4 no-print text-xs">
            <button
              onClick={() => setReportType('buku-induk')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                reportType === 'buku-induk' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Rekap Buku Induk Siswa
            </button>
            <button
              onClick={() => setReportType('buku-kas')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                reportType === 'buku-kas' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Laporan Buku Kas Umum (BKU)
            </button>
            <button
              onClick={() => setReportType('spj-bos')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                reportType === 'spj-bos' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              3. Realisasi Komponen BOS Kemenag
            </button>
            <button
              onClick={() => setReportType('supervisi-kepala')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                reportType === 'supervisi-kepala' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              4. Rekap Supervisi Guru RA
            </button>
            <button
              onClick={() => setReportType('8-standar')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                reportType === '8-standar' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              5. 8 Standar Akreditasi Kemenag
            </button>
            <button
              onClick={() => setReportType('pkkm')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                reportType === 'pkkm' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              6. Instrumen PKKM Kemenag
            </button>
          </div>

          {/* Printable Formal Document Sheet */}
          <div className="p-6 bg-white border border-slate-300 rounded-xl space-y-5 text-xs font-serif shadow-xs">
            {/* Kop Resmi RA with Logo */}
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
                  NSM: {profile.nsm} • NPSN: {profile.npsn} • Status Akreditasi: {profile.accreditation}
                </div>
                <div className="text-[9px] text-slate-500 font-sans">{profile.address} • Telp: {profile.phone}</div>
              </div>
              <div className="w-14 shrink-0" />
            </div>

            {/* Document Title */}
            <div className="text-center">
              <h4 className="font-bold text-xs uppercase underline">
                {reportType === 'buku-induk' && 'REKAPITULASI BUKU INDUK PESERTA DIDIK RA'}
                {reportType === 'buku-kas' && 'BUKU KAS UMUM (BKU) OPERASIONAL RA'}
                {reportType === 'spj-bos' && 'LAPORAN REALISASI ANGGARAN BOS KEMENAG (RKARA)'}
                {reportType === 'supervisi-kepala' && 'REKAPITULASI HASIL SUPERVISI AKADEMIK DAN MANAJERIAL GURU'}
                {reportType === '8-standar' && 'INSTRUMEN BUKTI KELENGKAPAN 8 STANDAR AKREDITASI RA KEMENAG RI'}
                {reportType === 'pkkm' && 'INSTRUMEN PENILAIAN KINERJA KEPALA RA (PKKM) KEMENAG RI'}
              </h4>
              <div className="text-[10px] text-slate-600 font-sans mt-0.5">
                Tahun Ajaran: {academicYear} • Semester: {semester}
              </div>
            </div>

            {/* Table Content: Buku Induk */}
            {reportType === 'buku-induk' && (
              <table className="w-full text-left font-sans text-[10px] border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300">No.</th>
                    <th className="p-2 border-r border-slate-300">NIS / NISN</th>
                    <th className="p-2 border-r border-slate-300">Nama Lengkap</th>
                    <th className="p-2 border-r border-slate-300">L/P</th>
                    <th className="p-2 border-r border-slate-300">Kelas / Rombel</th>
                    <th className="p-2 border-r border-slate-300">Nama Orang Tua</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((s, idx) => (
                    <tr key={s.id}>
                      <td className="p-2 border-r border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono">{s.nis} / {s.nisn}</td>
                      <td className="p-2 border-r border-slate-200 font-bold">{s.nama}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{s.jk}</td>
                      <td className="p-2 border-r border-slate-200">{s.kelas}</td>
                      <td className="p-2 border-r border-slate-200">{s.namaAyah || s.namaIbu}</td>
                      <td className="p-2 font-semibold uppercase">{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Table Content: Buku Kas */}
            {reportType === 'buku-kas' && (
              <table className="w-full text-left font-sans text-[10px] border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Tanggal</th>
                    <th className="p-2 border-r border-slate-300">No. Bukti</th>
                    <th className="p-2 border-r border-slate-300">Sumber Dana</th>
                    <th className="p-2 border-r border-slate-300">Uraian / Keterangan</th>
                    <th className="p-2 border-r border-slate-300 text-right">Penerimaan (Rp)</th>
                    <th className="p-2 text-right">Pengeluaran (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {cashTransactions.map((c) => (
                    <tr key={c.id}>
                      <td className="p-2 border-r border-slate-200">{c.tanggal}</td>
                      <td className="p-2 border-r border-slate-200 font-mono">{c.noBukti}</td>
                      <td className="p-2 border-r border-slate-200">{c.sumberDana}</td>
                      <td className="p-2 border-r border-slate-200">{c.kategori} - {c.keterangan}</td>
                      <td className="p-2 border-r border-slate-200 text-right">
                        {c.jenis === 'Masuk' ? c.nominal.toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="p-2 text-right">
                        {c.jenis === 'Keluar' ? c.nominal.toLocaleString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Table Content: BOS Components */}
            {reportType === 'spj-bos' && (
              <table className="w-full text-left font-sans text-[10px] border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Kode</th>
                    <th className="p-2 border-r border-slate-300">Komponen Penggunaan BOS Kemenag</th>
                    <th className="p-2 border-r border-slate-300 text-right">Anggaran (Rp)</th>
                    <th className="p-2 border-r border-slate-300 text-right">Realisasi (Rp)</th>
                    <th className="p-2 text-right">Persentase (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {bosComponents.map((comp) => {
                    const pct = Math.round((comp.realisasi / comp.anggaran) * 100);
                    return (
                      <tr key={comp.kode}>
                        <td className="p-2 border-r border-slate-200 font-mono text-center">{comp.kode}</td>
                        <td className="p-2 border-r border-slate-200 font-medium">{comp.nama}</td>
                        <td className="p-2 border-r border-slate-200 text-right">{comp.anggaran.toLocaleString('id-ID')}</td>
                        <td className="p-2 border-r border-slate-200 text-right font-bold">{comp.realisasi.toLocaleString('id-ID')}</td>
                        <td className="p-2 text-right font-bold text-emerald-800">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Table Content: Supervisi Kepala */}
            {reportType === 'supervisi-kepala' && (
              <table className="w-full text-left font-sans text-[10px] border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Tanggal</th>
                    <th className="p-2 border-r border-slate-300">Guru Sasaran</th>
                    <th className="p-2 border-r border-slate-300">Jenis Supervisi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Skor</th>
                    <th className="p-2 border-r border-slate-300">Catatan & Rekomendasi</th>
                    <th className="p-2">Status Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {supervisions.map((sup) => (
                    <tr key={sup.id}>
                      <td className="p-2 border-r border-slate-200">{sup.tanggal}</td>
                      <td className="p-2 border-r border-slate-200 font-bold">{sup.targetTeacherName || sup.targetRaName}</td>
                      <td className="p-2 border-r border-slate-200">{sup.jenis}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{sup.skor}</td>
                      <td className="p-2 border-r border-slate-200">{sup.catatanObservasi}</td>
                      <td className="p-2 font-semibold">{sup.statusTindakLanjut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Table Content: 8 Standar Akreditasi */}
            {reportType === '8-standar' && (
              <table className="w-full text-left font-sans text-[10px] border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-10 text-center">No</th>
                    <th className="p-2 border-r border-slate-300 w-48">Standar Akreditasi</th>
                    <th className="p-2 border-r border-slate-300">Indikator & Butir Mutu</th>
                    <th className="p-2 border-r border-slate-300">Dokumen Bukti Fisik</th>
                    <th className="p-2 border-r border-slate-300 text-center w-24">Kelengkapan</th>
                    <th className="p-2 text-center w-28">Penanggung Jawab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {accreditationItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-800">{item.standardName}</td>
                      <td className="p-2 border-r border-slate-200">{item.indikator}</td>
                      <td className="p-2 border-r border-slate-200">{item.berkasDisiapkan}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-semibold text-emerald-800">{item.statusKelengkapan}</td>
                      <td className="p-2 text-center text-slate-700">{item.penanggungJawab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Table Content: PKKM */}
            {reportType === 'pkkm' && (
              <table className="w-full text-left font-sans text-[10px] border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-10 text-center">No</th>
                    <th className="p-2 border-r border-slate-300 w-44">Komponen & Periode</th>
                    <th className="p-2 border-r border-slate-300">Kriteria Indikator</th>
                    <th className="p-2 border-r border-slate-300">Bukti Fisik Terverifikasi</th>
                    <th className="p-2 border-r border-slate-300 text-center w-20">Status</th>
                    <th className="p-2 text-center w-16">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pkkmList.map((p, idx) => (
                    <tr key={p.id}>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-800">
                        <div>{p.namaKomponen}</div>
                        <div className="text-[9px] text-emerald-700 font-semibold">{p.periode} (TP {p.tahun})</div>
                      </td>
                      <td className="p-2 border-r border-slate-200">{p.kriteriaIndikator}</td>
                      <td className="p-2 border-r border-slate-200">{p.buktiFisikDisiapkan}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-semibold text-emerald-800">{p.statusBukti}</td>
                      <td className="p-2 text-center font-extrabold text-emerald-900">{p.skor} / 4</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Signature Block (2 Parties: Kepala on LEFT, Bendahara/Staff on RIGHT) */}
            <div className="pt-8 flex justify-between font-sans text-[10px] text-slate-800">
              <div className="text-center">
                <div>Mengetahui & Mengesahkan,</div>
                <div className="font-bold">Kepala Raudlatul Athfal</div>
                <div className="mt-14 font-semibold underline">{profile.headmasterName}</div>
                <div>NIP: {profile.headmasterNip || '-'}</div>
              </div>

              <div className="text-center">
                <div>Bandung, {new Date().toLocaleDateString('id-ID')}</div>
                <div className="font-bold">Bendahara / Tim Administrasi</div>
                <div className="mt-14 font-semibold">({employees.find(e => e.jabatan === 'Bendahara')?.nama || 'Hj. Anisa Rahmawati, S.E'})</div>
                <div>NIP: -</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center no-print">
          <span className="text-xs text-slate-500">Smart RA Digital — Dokumen Sah Lembaga</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
