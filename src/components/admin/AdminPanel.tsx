import { useState } from 'react';
import {
  Settings, MapPin, ShieldCheck, BarChart2, Eye, Sparkles, ChevronRight, Menu, X,
} from 'lucide-react';
import { PropertyEditor } from './PropertyEditor';
import { HouseRulesEditor } from './HouseRulesEditor';
import { LocalPlacesEditor } from './LocalPlacesEditor';
import { FinanceDashboard } from './FinanceDashboard';
import { loadDemoData } from '@/lib/demoData';
import { useTransactions } from '@/hooks/useProperty';
import type { Property, HouseRule, LocalPlace } from '@/types';

type Tab = 'property' | 'rules' | 'places' | 'finance';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'property', label: 'Proprietà', icon: Settings },
  { id: 'rules', label: 'Regole', icon: ShieldCheck },
  { id: 'places', label: 'Luoghi', icon: MapPin },
  { id: 'finance', label: 'Finanze', icon: BarChart2 },
];

interface Props {
  property: Property;
  houseRules: HouseRule[];
  localPlaces: LocalPlace[];
  onSaveProperty: (updates: Partial<Property>) => Promise<void>;
  onAddRule: (rule: Omit<HouseRule, 'id' | 'propertyId'>) => Promise<void>;
  onDeleteRule: (id: string) => Promise<void>;
  onAddPlace: (place: Omit<LocalPlace, 'id' | 'propertyId'>) => Promise<void>;
  onDeletePlace: (id: string) => Promise<void>;
  onReload: () => void;
  onGuestView: () => void;
}

export function AdminPanel({
  property, houseRules, localPlaces,
  onSaveProperty, onAddRule, onDeleteRule,
  onAddPlace, onDeletePlace, onReload, onGuestView,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('property');
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { transactions, addTransaction, deleteTransaction } = useTransactions(property.id);

  const handleLoadDemo = async () => {
    if (!confirm('Caricare i dati demo? Sovrascriverà i dati esistenti.')) return;
    setLoadingDemo(true);
    await loadDemoData(property.id);
    onReload();
    setLoadingDemo(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm leading-none">Pannello Host</h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">{property.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemo}
              disabled={loadingDemo}
              className="hidden sm:flex items-center gap-1.5 text-xs text-amber-700 border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loadingDemo ? 'Caricamento...' : 'Demo'}
            </button>
            <button
              onClick={onGuestView}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vista Ospite</span>
            </button>
            <button onClick={() => setMobileMenuOpen(v => !v)} className="sm:hidden p-1.5">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-56 bg-white border-r border-gray-100 min-h-[calc(100vh-57px)] p-3`}>
          <nav className="space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                  {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-100 sm:block hidden">
            <button
              onClick={handleLoadDemo}
              disabled={loadingDemo}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-amber-700 border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-xl px-3 py-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loadingDemo ? 'Caricamento...' : 'Carica Dati Demo'}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            {activeTab === 'property' && (
              <>
                <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2"><Settings className="w-4 h-4 text-amber-600" /> Impostazioni Proprietà</h2>
                <PropertyEditor property={property} onSave={onSaveProperty} />
              </>
            )}
            {activeTab === 'rules' && (
              <>
                <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-rose-500" /> Regole della Casa</h2>
                <HouseRulesEditor rules={houseRules} onAdd={onAddRule} onDelete={onDeleteRule} />
              </>
            )}
            {activeTab === 'places' && (
              <>
                <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-600" /> Luoghi Consigliati</h2>
                <LocalPlacesEditor places={localPlaces} onAdd={onAddPlace} onDelete={onDeletePlace} />
              </>
            )}
            {activeTab === 'finance' && (
              <>
                <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-green-600" /> Entrate & Uscite</h2>
                <FinanceDashboard transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
