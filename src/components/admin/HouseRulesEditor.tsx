import { useState } from 'react';
import { Plus, Trash2, GripVertical, Volume2, CigaretteOff, Recycle, PawPrint, Users, Waves, Info, Home, Sun, Moon, Car, Utensils, Music } from 'lucide-react';
import type { HouseRule } from '@/types';
import type { Lang } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/i18n';

const ICONS = ['Volume2', 'CigaretteOff', 'Recycle', 'PawPrint', 'Users', 'Waves', 'Info', 'Home', 'Sun', 'Moon', 'Car', 'Utensils', 'Music'];
const ICON_MAP: Record<string, React.ElementType> = {
  Volume2, CigaretteOff, Recycle, PawPrint, Users, Waves, Info, Home, Sun, Moon, Car, Utensils, Music,
};

interface Props {
  rules: HouseRule[];
  onAdd: (rule: Omit<HouseRule, 'id' | 'propertyId'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function HouseRulesEditor({ rules, onAdd, onDelete }: Props) {
  const [newIcon, setNewIcon] = useState('Info');
  const [newLabels, setNewLabels] = useState<Partial<Record<Lang, string>>>({ it: '' });
  const [editLang, setEditLang] = useState<Lang>('it');

  const handleAdd = async () => {
    if (!newLabels.it && !newLabels.en) return;
    await onAdd({ icon: newIcon, label: newLabels, sortOrder: rules.length });
    setNewLabels({ it: '' });
  };

  return (
    <div className="space-y-4">
      {/* Existing rules */}
      <div className="space-y-2">
        {rules.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">Nessuna regola. Aggiungine una sotto.</p>
        )}
        {rules.map(rule => {
          const Icon = ICON_MAP[rule.icon] ?? Info;
          return (
            <div key={rule.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
              <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
              <Icon className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{rule.label.it ?? rule.label.en ?? Object.values(rule.label)[0] ?? ''}</span>
              <button
                onClick={() => onDelete(rule.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add new rule */}
      <div className="border-t border-dashed border-gray-200 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Aggiungi nuova regola</p>

        {/* Icon picker */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {ICONS.map(name => {
            const Icon = ICON_MAP[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => setNewIcon(name)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  newIcon === name ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title={name}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Lang tabs */}
        <div className="flex gap-1 mb-2">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => setEditLang(l.code)}
              className={`text-xs px-2 py-0.5 rounded ${editLang === l.code ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {l.flag} {l.code.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
            placeholder="Testo della regola..."
            value={newLabels[editLang] ?? ''}
            onChange={e => setNewLabels(prev => ({ ...prev, [editLang]: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-medium px-3 py-2 rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  );
}
