import { ArrowLeft, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { tr, type Lang } from '@/lib/i18n';
import type { Property } from '@/types';

interface Props {
  property: Property;
  lang: Lang;
  onBack: () => void;
}

export function QRPoster({ property, lang, onBack }: Props) {
  const guideUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Indietro
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" />
          {tr('printPoster', lang)}
        </button>
      </div>

      {/* Poster */}
      <div className="max-w-md mx-auto mt-8 px-4 print:mt-0 print:px-0">
        <div
          id="qr-poster"
          className="bg-white rounded-3xl shadow-xl overflow-hidden print:rounded-none print:shadow-none"
          style={{ aspectRatio: '1/1.41' }}
        >
          <div className="h-full flex flex-col items-center justify-center p-8 gap-6"
            style={{ background: 'linear-gradient(135deg, #fffbf0 0%, #fff8e1 50%, #fef3c7 100%)' }}>
            {/* Top decoration */}
            <div className="text-center">
              <div className="w-16 h-1.5 bg-amber-500 rounded-full mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 text-center leading-tight">
                {property.name}
              </h1>
              {property.city && (
                <p className="text-gray-500 text-sm mt-1">{property.city}</p>
              )}
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border-4 border-amber-200">
              <QRCodeSVG
                value={guideUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#1c1c1e"
                level="M"
              />
            </div>

            {/* CTA text */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-amber-700">
                {tr('yourGuideQR', lang)}
              </p>
              <p className="text-xs text-gray-400 font-mono break-all max-w-xs">
                {guideUrl}
              </p>
            </div>

            {/* Host info */}
            {property.hostName && (
              <div className="text-center border-t border-amber-200 pt-4 w-full">
                <p className="text-xs text-gray-500">Host: <span className="font-medium text-gray-700">{property.hostName}</span></p>
                {property.hostPhone && <p className="text-xs text-gray-500">{property.hostPhone}</p>}
              </div>
            )}

            <div className="w-16 h-1.5 bg-amber-500 rounded-full" />
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4 print:hidden">
          Stampa e incornicia questo poster da appendere in casa
        </p>
      </div>
    </div>
  );
}
