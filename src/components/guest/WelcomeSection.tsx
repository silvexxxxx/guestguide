import { Phone, MessageCircle, User } from 'lucide-react';
import { tr, ml, type Lang } from '@/lib/i18n';
import type { Property } from '@/types';

interface Props { property: Property; lang: Lang; }

export function WelcomeSection({ property, lang }: Props) {
  const welcomeText = ml(property.welcomeText, lang);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden print:shadow-none print:border-gray-300">
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-6 text-white">
        <h2 className="text-2xl font-bold">{tr('welcome', lang)}</h2>
        <p className="text-amber-100 text-sm mt-1">{property.name}</p>
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-shrink-0">
            {property.hostPhotoUrl ? (
              <img
                src={property.hostPhotoUrl}
                alt={property.hostName}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-100 shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center">
                <User className="w-10 h-10 text-amber-400" />
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <p className="font-semibold text-gray-800 text-lg">{property.hostName || 'Host'}</p>
            {property.city && <p className="text-gray-500 text-sm">{property.address}{property.city ? `, ${property.city}` : ''}</p>}
          </div>
        </div>

        {welcomeText && (
          <p className="mt-5 text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">{welcomeText}</p>
        )}

        {property.hostPhone && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${property.hostPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-5 rounded-xl transition-colors duration-200 print:hidden"
            >
              <MessageCircle className="w-5 h-5" />
              {tr('writeWhatsApp', lang)}
            </a>
            <a
              href={`tel:${property.hostPhone}`}
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-5 rounded-xl transition-colors duration-200"
            >
              <Phone className="w-5 h-5" />
              {tr('call', lang)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
