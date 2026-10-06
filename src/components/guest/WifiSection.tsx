import { useState } from 'react';
import { Wifi, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { tr, type Lang } from '@/lib/i18n';
import type { Property } from '@/types';

interface Props { property: Property; lang: Lang; }

export function WifiSection({ property, lang }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!property.wifiPassword) return;
    try {
      await navigator.clipboard.writeText(property.wifiPassword);
    } catch {
      const el = document.createElement('textarea');
      el.value = property.wifiPassword;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wifiQR = `WIFI:T:WPA;S:${property.wifiName};P:${property.wifiPassword};;`;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden print:shadow-none print:border-gray-300">
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-5 text-white flex items-center gap-3">
        <Wifi className="w-6 h-6" />
        <h2 className="text-xl font-bold">{tr('wifi', lang)}</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{tr('networkName', lang)}</p>
            <p className="font-bold text-gray-800 text-lg break-all">{property.wifiName || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{tr('password', lang)}</p>
            <p className="font-bold text-gray-800 text-lg break-all font-mono">{property.wifiPassword || '—'}</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          disabled={!property.wifiPassword}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-xl transition-all duration-200 print:hidden ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? tr('copied', lang) : tr('copyPassword', lang)}
        </button>

        {property.wifiName && property.wifiPassword && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500">{tr('scanQR', lang)}</p>
            <div className="p-3 bg-white border-2 border-blue-100 rounded-2xl shadow-sm">
              <QRCodeSVG value={wifiQR} size={160} bgColor="#ffffff" fgColor="#1e3a5f" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
