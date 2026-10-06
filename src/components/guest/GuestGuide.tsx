import { useState } from 'react';
import { Printer, QrCode } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { WelcomeSection } from './WelcomeSection';
import { WifiSection } from './WifiSection';
import { CheckInSection } from './CheckInSection';
import { HouseRulesSection } from './HouseRulesSection';
import { LocalGuideSection } from './LocalGuideSection';
import { EmergencySection } from './EmergencySection';
import { QRPoster } from './QRPoster';
import { tr, type Lang } from '@/lib/i18n';
import type { Property, HouseRule, LocalPlace } from '@/types';

interface Props {
  property: Property;
  houseRules: HouseRule[];
  localPlaces: LocalPlace[];
  onAdminClick?: () => void;
}

export function GuestGuide({ property, houseRules, localPlaces, onAdminClick }: Props) {
  const [lang, setLang] = useState<Lang>('it');
  const [showQR, setShowQR] = useState(false);

  if (showQR) {
    return <QRPoster property={property} lang={lang} onBack={() => setShowQR(false)} />;
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-20 print:hidden">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-bold text-gray-800 text-sm sm:text-base leading-tight">{property.name}</h1>
              {property.city && <p className="text-xs text-gray-400">{property.city}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-1.5 text-xs text-amber-700 border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tr('qrPoster', lang)}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tr('printGuide', lang)}</span>
              </button>
              {onAdminClick && (
                <button
                  onClick={onAdminClick}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 transition-colors"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
          <LanguageSelector lang={lang} onChange={setLang} />
        </div>
      </header>

      {/* Print header */}
      <div className="hidden print:block p-6 border-b border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{property.name}</h1>
        {property.city && <p className="text-gray-500">{property.address}, {property.city}</p>}
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        <WelcomeSection property={property} lang={lang} />
        <WifiSection property={property} lang={lang} />
        <CheckInSection property={property} lang={lang} />
        <HouseRulesSection rules={houseRules} lang={lang} />
        <LocalGuideSection places={localPlaces} lang={lang} />
        <EmergencySection property={property} lang={lang} />
      </main>
    </div>
  );
}
