import { useState } from 'react';
import { Plus, Trash2, MapPin, Phone, ExternalLink } from 'lucide-react';
import type { LocalPlace, PlaceCategory } from '@/types';
import type { Lang } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/i18n';

const CATEGORIES: { value: PlaceCategory; label: string }[] = [
  { value: 'restaurant', label: '🍽 Ristoranti' },
  { value: 'bar', label: '☕ Bar & Colazione' },
  { value: 'supermarket', label: '🛒 Supermercati' },
  { value: 'attraction', label: '🏛 Da Non Perdere' },
  { value: 'pharmacy', label: '💊 Emergenze & Farmacie' },
];

const emptyPlace = (): Omit<LocalPlace, 'id' | 'propertyId'> => ({
  category: 'restaurant',
  name: '',
  address: '',
  description: {},
  mapsUrl: '',
  phone: '',
  sortOrder: 0,
});

interface Props {
  places: LocalPlace[];
  onAdd: (place: Omit<LocalPlace, 'id' | 'propertyId'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function LocalPlacesEditor({ places, onAdd, onDelete }: Props) {
  const [form, setForm] = useState(emptyPlace());
  const [editLang, setEditLang] = useState<Lang>('it');
  const [activeCategory, setActiveCategory] = useState<PlaceCategory>('restaurant');

  const handleAdd = async () => {
    if (!form.name) return;
    await onAdd({ ...form, category: activeCategory, sortOrder: places.filter(p => p.category === activeCategory).length });
    setForm(emptyPlace());
  };

  const filtered = places.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeCategory === cat.value ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Places list */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filtered.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nessun posto in questa categoria.</p>}
        {filtered.map(place => (
          <div key={place.id} className="flex items-start gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{place.name}</p>
              {place.address && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{place.address}
                </p>
              )}
              <div className="flex gap-2 mt-1">
                {place.mapsUrl && <ExternalLink className="w-3 h-3 text-blue-400" />}
                {place.phone && <Phone className="w-3 h-3 text-green-400" />}
              </div>
            </div>
            <button onClick={() => onDelete(place.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add form */}
      <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aggiungi nuovo posto</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nome *</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Indirizzo</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">URL Google Maps</label>
            <input type="url" placeholder="https://maps.google.com/?q=..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.mapsUrl} onChange={e => setForm(f => ({ ...f, mapsUrl: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Telefono</label>
            <input type="tel" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
        </div>
        {/* Description multilang */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="text-xs text-gray-500">Descrizione</label>
            <div className="flex gap-1 ml-2">
              {LANGUAGES.map(l => (
                <button key={l.code} type="button" onClick={() => setEditLang(l.code)} className={`text-xs px-1.5 py-0.5 rounded ${editLang === l.code ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{l.code.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition resize-none"
            rows={2}
            value={(form.description as Record<Lang, string>)[editLang] ?? ''}
            onChange={e => setForm(f => ({ ...f, description: { ...f.description, [editLang]: e.target.value } }))}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!form.name}
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-xl transition-colors text-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Aggiungi Posto
        </button>
      </div>
    </div>
  );
}
