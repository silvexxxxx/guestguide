import { Phone, AlertTriangle, Stethoscope, Car, User } from 'lucide-react';
import { tr, type Lang } from '@/lib/i18n';
import type { Property } from '@/types';

interface Props { property: Property; lang: Lang; }

export function EmergencySection({ property, lang }: Props) {
  const numbers = [
    {
      label: tr('emergency112', lang),
      number: '112',
      icon: AlertTriangle,
      color: 'bg-red-500',
      text: 'text-white',
    },
    {
      label: tr('medicalGuard', lang),
      number: '118',
      icon: Stethoscope,
      color: 'bg-blue-500',
      text: 'text-white',
    },
    {
      label: tr('roadsideAssistance', lang),
      number: '116',
      icon: Car,
      color: 'bg-amber-500',
      text: 'text-white',
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden print:shadow-none print:border-gray-300">
      <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 text-white flex items-center gap-3">
        <Phone className="w-6 h-6" />
        <h2 className="text-xl font-bold">{tr('emergency', lang)}</h2>
      </div>
      <div className="p-6 space-y-3">
        {numbers.map(n => {
          const Icon = n.icon;
          return (
            <a
              key={n.number}
              href={`tel:${n.number}`}
              className={`flex items-center justify-between ${n.color} ${n.text} rounded-xl p-4 hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{n.label}</span>
              </div>
              <span className="font-bold text-xl">{n.number}</span>
            </a>
          );
        })}

        {property.hostPhone && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              {tr('callHost', lang)}
            </p>
            <div className="flex gap-2">
              <a
                href={`tel:${property.hostPhone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                {tr('callNow', lang)}
              </a>
              <a
                href={`https://wa.me/${property.hostPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors print:hidden"
              >
                {tr('whatsapp', lang)}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
