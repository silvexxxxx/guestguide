import { useState } from 'react';
import { MapPin, Phone, ExternalLink, UtensilsCrossed, Coffee, ShoppingCart, Landmark, Cross, Map } from 'lucide-react';
import { tr, ml, type Lang } from '@/lib/i18n';
import type { LocalPlace, PlaceCategory } from '@/types';

const CATEGORY_CONFIG: Record<PlaceCategory, { icon: React.ElementType; color: string; bg: string; border: string; labelKey: string }> = {
  restaurant: { icon: UtensilsCrossed, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', labelKey: 'restaurants' },
  bar:        { icon: Coffee,          color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100',  labelKey: 'bars' },
  supermarket:{ icon: ShoppingCart,    color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-100',   labelKey: 'supermarkets' },
  attraction: { icon: Landmark,        color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', labelKey: 'attractions' },
  pharmacy:   { icon: Cross,           color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100',    labelKey: 'pharmacies' },
};

const CATEGORIES: PlaceCategory[] = ['restaurant', 'bar', 'supermarket', 'attraction', 'pharmacy'];

interface Props { places: LocalPlace[]; lang: Lang; }

export function LocalGuideSection({ places, lang }: Props) {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory>('restaurant');

  const filtered = places.filter(p => p.category === activeCategory);
  const cfg = CATEGORY_CONFIG[activeCategory];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden print:shadow-none print:border-gray-300">
      <div className="bg-gradient-to-r from-purple-600 to-violet-500 p-5 text-white flex items-center gap-3">
        <Map className="w-6 h-6" />
        <h2 className="text-xl font-bold">{tr('localGuide', lang)}</h2>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 p-3 bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide print:hidden">
        {CATEGORIES.map(cat => {
          const c = CATEGORY_CONFIG[cat];
          const Icon = c.icon;
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                isActive ? `${c.bg} ${c.color} ${c.border} border` : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tr(c.labelKey, lang)}
            </button>
          );
        })}
      </div>

      {/* Print: show all categories */}
      <div className="hidden print:block p-4 space-y-6">
        {CATEGORIES.map(cat => {
          const catPlaces = places.filter(p => p.category === cat);
          if (catPlaces.length === 0) return null;
          const c = CATEGORY_CONFIG[cat];
          const Icon = c.icon;
          return (
            <div key={cat}>
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" />
                {tr(c.labelKey, lang)}
              </h3>
              <PlaceList places={catPlaces} lang={lang} cfg={c} />
            </div>
          );
        })}
      </div>

      {/* Screen: show active category */}
      <div className="p-4 print:hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Nessun posto aggiunto in questa categoria.</p>
        ) : (
          <PlaceList places={filtered} lang={lang} cfg={cfg} />
        )}
      </div>
    </section>
  );
}

function PlaceList({ places, lang, cfg }: { places: LocalPlace[]; lang: Lang; cfg: (typeof CATEGORY_CONFIG)[PlaceCategory] }) {
  return (
    <div className="space-y-3">
      {places.map(place => (
        <div key={place.id} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm">{place.name}</h3>
              {place.address && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {place.address}
                </p>
              )}
              {ml(place.description, lang) && (
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{ml(place.description, lang)}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-3 print:hidden">
            {place.mapsUrl && (
              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-lg ${cfg.bg} ${cfg.color} border ${cfg.border} hover:opacity-80 transition-opacity`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {tr('openInMaps', lang)}
              </a>
            )}
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {tr('call', lang)}
              </a>
            )}
          </div>
          {place.phone && (
            <p className="hidden print:block text-xs text-gray-500 mt-1">{place.phone}</p>
          )}
        </div>
      ))}
    </div>
  );
}
