import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Bell,
  Clock,
  Heart,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export const RuangOrtuGuruView: React.FC = () => {
  const { parentMessages, sendParentMessage, replyParentMessage, currentUser, students, profile } = useApp();

  const [activeTab, setActiveTab] = useState<'pesan' | 'pengumuman' | 'izin-online'>('pesan');
  const [selectedMessageId, setSelectedMessageId] = useState(parentMessages[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  // New message / permit form state
  const [isPermitFormOpen, setIsPermitFormOpen] = useState(false);
  const [permitForm, setPermitForm] = useState({
    studentId: students[0]?.id || 's1',
    subject: 'Surat Izin Tidak Masuk Sekolah',
    reason: 'Ananda sedang kurang sehat (demam/flu) dan butuh istirahat di rumah.',
  });

  const selectedMessage = parentMessages.find(m => m.id === selectedMessageId) || parentMessages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;
    replyParentMessage(selectedMessage.id, replyText);
    setReplyText('');
  };

  const handleSendPermit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === permitForm.studentId) || students[0];
    sendParentMessage({
      studentId: st.id,
      studentName: st.nama,
      parentName: currentUser.role === 'orangtua' ? currentUser.name : (st.namaIbu || 'Wali Murid'),
      teacherName: 'Guru Nurul Hidayah, S.Pd.I',
      kelas: st.kelas,
      subject: permitForm.subject,
      message: permitForm.reason,
      isPermit: true,
    });
    setIsPermitFormOpen(false);
    alert('Surat Izin Online telah dikirimkan ke Wali Kelas!');
  };

  // School announcements
  const announcements = [
    {
      id: 'ann1',
      tanggal: '02 November 2026',
      judul: 'Pemberitahuan Pelaksanaan Manasik Haji Cilik RA se-Kota Bandung',
      isi: 'Assalamu alaikum wr. wb. Diberitahukan kepada seluruh Ayah/Bunda wali murid bahwa pelaksanaan Manasik Haji Cilik akan diselenggarakan pada hari Kamis, 20 November 2026 bertempat di Asrama Haji. Pakaian ihram untuk putra dan gamis putih untuk putri.',
      penulis: 'Kepala RA Dra. Hj. Siti Fatimah, M.Pd.I',
    },
    {
      id: 'ann2',
      tanggal: '28 Oktober 2026',
      judul: 'Parenting Day & Pemeriksaan Kesehatan Gigi Anak Bersama Puskesmas',
      isi: 'Dalam rangka menjaga kesehatan tumbuh kembang peserta didik, RA Terpadu Al-Azhar Cendekia bekerjasama dengan tenaga medis Puskesmas akan mengadakan screening gigi dan penyuluhan gizi seimbang.',
      penulis: 'Koordinator UKS & Parenting',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Kemitraan Harmonis Madrasah & Keluarga</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Ruang Komunikasi Orang Tua & Guru</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saluran konsultasi privat tumbuh kembang anak, pengajuan izin sakit online, serta pengumuman resmi madrasah.
          </p>
        </div>

        <button
          onClick={() => setIsPermitFormOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md transition"
        >
          <FileText className="w-4 h-4" />
          <span>Kirim Pesan / Surat Izin</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('pesan')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'pesan'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Pesan & Konsultasi ({parentMessages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pengumuman')}
          className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'pengumuman'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pengumuman ({announcements.length})</span>
        </button>
      </div>

      {/* Tab 1: Pesan & Konsultasi */}
      {activeTab === 'pesan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-white rounded-b-2xl border border-t-0 border-slate-200 p-5">
          {/* Message List (5 cols) */}
          <div className="lg:col-span-5 border-r border-slate-100 pr-0 lg:pr-5 space-y-2">
            <div className="text-xs font-bold text-slate-800 mb-2">Percakapan Wali Murid & Guru</div>
            {parentMessages.map((msg) => {
              const isSelected = msg.id === selectedMessage?.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-3 rounded-xl cursor-pointer transition text-xs border ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{msg.studentName}</span>
                    <span className="text-[10px] text-slate-400">{msg.tanggal.split(' ')[1] || msg.tanggal}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-800 line-clamp-1">{msg.subject}</div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 italic">
                    "{msg.message}"
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Wali: {msg.parentName}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold ${msg.status === 'Dibalas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {msg.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversation Detail (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{selectedMessage.subject}</h3>
                    <div className="text-[11px] text-slate-500">
                      Peserta Didik: <strong>{selectedMessage.studentName}</strong> • {selectedMessage.kelas}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${selectedMessage.status === 'Dibalas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {selectedMessage.status}
                  </span>
                </div>

                {/* Message from Parent */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                    <span>{selectedMessage.parentName} (Wali Murid)</span>
                    <span className="text-slate-400 font-normal">{selectedMessage.tanggal}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{selectedMessage.message}"
                  </p>
                </div>

                {/* Reply from Teacher */}
                {selectedMessage.reply ? (
                  <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-emerald-900 text-[11px]">
                      <span>{selectedMessage.teacherName} (Wali Kelas)</span>
                      <span className="text-emerald-700 font-normal">Tanggapan Resmi</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">
                      "{selectedMessage.reply}"
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    Pesan ini belum dibalas oleh Guru Kelas.
                  </div>
                )}

                {/* Reply Box */}
                <form onSubmit={handleSendReply} className="pt-2 space-y-2">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Tuliskan tanggapan atau balasan konfirmasi kepada orang tua..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Balasan</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                Pilih salah satu pesan di sebelah kiri untuk melihat percakapan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Pengumuman Sekolah */}
      {activeTab === 'pengumuman' && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Papan Pengumuman Resmi RA Al-Azhar Cendekia</h3>
            <p className="text-xs text-slate-500">Informasi agenda kegiatan, libur, parenting, dan outing class.</p>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 text-sm">{ann.judul}</span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ann.tanggal}</span>
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {ann.isi}
                </p>
                <div className="text-[10px] text-slate-500 text-right">
                  Diumumkan oleh: <strong className="text-slate-700">{ann.penulis}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Ajukan Surat Izin / Pesan Baru */}
      {isPermitFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Kirim Pesan / Pengajuan Izin Tidak Masuk</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pesan akan diteruskan ke wali kelas dan dicatat di sistem presensi.</p>

            <form onSubmit={handleSendPermit} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Peserta Didik</label>
                <select
                  value={permitForm.studentId}
                  onChange={e => setPermitForm({ ...permitForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perihal / Alasan</label>
                <select
                  value={permitForm.subject}
                  onChange={e => setPermitForm({ ...permitForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Surat Izin Tidak Masuk Sekolah (Sakit)">Izin Tidak Masuk (Sakit)</option>
                  <option value="Surat Izin Tidak Masuk Sekolah (Keperluan Keluarga)">Izin Keperluan Keluarga</option>
                  <option value="Konsultasi Perkembangan / Perilaku Anak">Konsultasi Perkembangan Belajar</option>
                  <option value="Konfirmasi Penjemputan / Obat Khusus">Konfirmasi Penjemput / Titip Obat</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pesan Lengkap *</label>
                <textarea
                  required
                  rows={4}
                  value={permitForm.reason}
                  onChange={e => setPermitForm({ ...permitForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPermitFormOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  Kirim ke Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
