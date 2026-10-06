import { Clock, LogIn, LogOut } from 'lucide-react';
import { tr, ml, type Lang } from '@/lib/i18n';
import type { Property } from '@/types';

interface Props { property: Property; lang: Lang; }

function InstructionSteps({ text }: { text: string }) {
  const lines = text.split(/\n|\.(?=\s)/).map(s => s.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return <p className="text-gray-600 text-sm leading-relaxed">{text}</p>;
  }
  return (
    <ol className="space-y-3">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-gray-600 text-sm leading-relaxed">{line}</span>
        </li>
      ))}
    </ol>
  );
}

export function CheckInSection({ property, lang }: Props) {
  const checkinText = ml(property.checkinInstructions, lang);
  const checkoutText = ml(property.checkoutInstructions, lang);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden print:shadow-none print:border-gray-300">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white flex items-center gap-3">
        <Clock className="w-6 h-6" />
        <h2 className="text-xl font-bold">{tr('checkinCheckout', lang)}</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <LogIn className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500 uppercase tracking-wide">{tr('checkinTime', lang)}</p>
            <p className="text-2xl font-bold text-green-700">{tr('from', lang)} {property.checkinTime}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
            <LogOut className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500 uppercase tracking-wide">{tr('checkoutTime', lang)}</p>
            <p className="text-2xl font-bold text-orange-700">{tr('until', lang)} {property.checkoutTime}</p>
          </div>
        </div>

        {checkinText && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <LogIn className="w-4 h-4 text-green-600" />
              {tr('checkinInstructions', lang)}
            </h3>
            <InstructionSteps text={checkinText} />
          </div>
        )}

        {checkoutText && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-orange-600" />
              {tr('checkoutInstructions', lang)}
            </h3>
            <InstructionSteps text={checkoutText} />
          </div>
        )}
      </div>
    </section>
  );
}
