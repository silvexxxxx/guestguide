import { LANGUAGES, type Lang } from '@/lib/i18n';

interface Props {
  lang: Lang;
  onChange: (l: Lang) => void;
}

export function LanguageSelector({ lang, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
            lang === l.code
              ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
              : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-700'
          }`}
        >
          <span className="text-base">{l.flag}</span>
          <span className="hidden sm:inline">{l.label}</span>
          <span className="sm:hidden">{l.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
