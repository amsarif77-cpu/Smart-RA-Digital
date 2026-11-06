import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed and running standalone, do not display
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <div className="relative inline-flex items-center">
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg shadow-2xs transition transform active:scale-95"
          title="Pasang Smart RA Digital ke Perangkat (PWA)"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700 animate-bounce" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {installSuccess && (
          <div className="absolute top-full mt-2 right-0 z-50 flex items-center gap-2 bg-emerald-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Aplikasi berhasil diinstal!</span>
          </div>
        )}
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300 rounded-lg shadow-2xs transition"
          title="Pasang di iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Install di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-emerald-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    RA
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Install di iOS Safari</h3>
                    <p className="text-[11px] text-slate-500">Akses cepat seperti aplikasi native</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Tekan tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah ke atas) pada bilah navigasi Safari.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Gulir ke bawah dan pilih menu <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama).
                  </span>
                </div>
                <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Tekan <strong>Tambah (Add)</strong> di pojok kanan atas. Ikon Smart RA Digital siap dibuka kapan saja!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-800 transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback direct install helper button on desktop / other browsers
  return (
    <button
      onClick={() => {
        alert('Untuk memasang Smart RA Digital sebagai aplikasi desktop/ponsel:\n1. Buka menu browser (titik tiga di kanan atas)\n2. Pilih "Install Smart RA Digital" atau "Tambahkan ke Layar Utama".');
      }}
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
      title="Aplikasi PWA Siap Diinstal"
    >
      <Download className="w-3.5 h-3.5 text-emerald-600" />
      <span className="hidden lg:inline">Install PWA</span>
    </button>
  );
};
