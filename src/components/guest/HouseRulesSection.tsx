import { ShieldCheck, Volume2, CigaretteOff, Recycle, PawPrint, Users, Waves, Info, Home, Sun, Moon, Car, Utensils, Music } from 'lucide-react';
import { tr, ml, type Lang } from '@/lib/i18n';
import type { HouseRule } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  Volume2, CigaretteOff, Recycle, PawPrint, Users, Waves, Info, Home, Sun, Moon, Car, Utensils, Music, ShieldCheck,
};

interface Props { rules: HouseRule[]; lang: Lang; }

export function HouseRulesSection({ rules, lang }: Props) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden print:shadow-none print:border-gray-300">
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 text-white flex items-center gap-3">
        <ShieldCheck className="w-6 h-6" />
        <h2 className="text-xl font-bold">{tr('houseRules', lang)}</h2>
      </div>
      <div className="p-6">
        {rules.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Nessuna regola impostata.</p>
        ) : (
          <ul className="space-y-3">
            {rules.map(rule => {
              const Icon = ICON_MAP[rule.icon] ?? Info;
              return (
                <li key={rule.id} className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center mt-0.5">
                    <Icon className="w-4 h-4 text-rose-600" />
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed pt-1">{ml(rule.label, lang)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
