import { useState } from 'react';
import { Save, Check, Loader } from 'lucide-react';
import type { Property } from '@/types';
import type { Lang } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/i18n';

interface Props {
  property: Property;
  onSave: (updates: Partial<Property>) => Promise<void>;
}

function MLTextarea({ label, value, onChange }: { label: string; value: Partial<Record<Lang, string>>; onChange: (v: Partial<Record<Lang, string>>) => void }) {
  const [activeLang, setActiveLang] = useState<Lang>('it');
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex gap-1 mb-1">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code)}
            className={`text-xs px-2 py-0.5 rounded ${activeLang === l.code ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {l.flag} {l.code.toUpperCase()}
          </button>
        ))}
      </div>
      <textarea
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none transition"
        rows={3}
        value={value[activeLang] ?? ''}
        onChange={e => onChange({ ...value, [activeLang]: e.target.value })}
      />
    </div>
  );
}

export function PropertyEditor({ property, onSave }: Props) {
  const [form, setForm] = useState<Property>(property);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (key: keyof Property, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Nome Proprietà</label>
          <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nome Host</label>
          <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.hostName} onChange={e => set('hostName', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Telefono / WhatsApp</label>
          <input type="tel" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.hostPhone} onChange={e => set('hostPhone', e.target.value)} placeholder="+39 333 1234567" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">URL Foto Host</label>
          <input type="url" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.hostPhotoUrl} onChange={e => set('hostPhotoUrl', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Indirizzo</label>
          <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.address} onChange={e => set('address', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Città</label>
          <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Wi-Fi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome Rete (SSID)</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition font-mono" value={form.wifiName} onChange={e => set('wifiName', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password Wi-Fi</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition font-mono" value={form.wifiPassword} onChange={e => set('wifiPassword', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Orari</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Check-in (dalle)</label>
            <input type="time" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.checkinTime} onChange={e => set('checkinTime', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Check-out (entro le)</label>
            <input type="time" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition" value={form.checkoutTime} onChange={e => set('checkoutTime', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Testi (multilingua)</h3>
        <MLTextarea label="Messaggio di Benvenuto" value={form.welcomeText as Record<Lang, string>} onChange={v => set('welcomeText', v)} />
        <MLTextarea label="Istruzioni Check-in" value={form.checkinInstructions as Record<Lang, string>} onChange={v => set('checkinInstructions', v)} />
        <MLTextarea label="Istruzioni Check-out" value={form.checkoutInstructions as Record<Lang, string>} onChange={v => set('checkoutInstructions', v)} />
      </div>

      <button
        type="submit"
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all duration-200 ${
          saved ? 'bg-green-500 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
        } disabled:opacity-60`}
      >
        {saving ? <Loader className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Salvato!' : saving ? 'Salvataggio...' : 'Salva Impostazioni'}
      </button>
    </form>
  );
}
