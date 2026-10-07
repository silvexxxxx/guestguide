import React, { useEffect, useState, useCallback } from 'react';
import {
  Crown, ShieldAlert, Sparkles, Gift, Clock, CheckCircle2,
  AlertTriangle, Search, RefreshCw, UserCheck, Plus, Home, FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { HostSubscription, AccessType } from '@/types';

export const SuperAdminPanel: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<HostSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AccessType>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAllSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('host_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Errore recupero hosts:', error);
      } else if (data) {
        setSubscriptions(
          data.map((item) => ({
            id: item.id,
            userId: item.user_id,
            email: item.email,
            role: item.role,
            accessType: item.access_type,
            validUntil: item.valid_until,
            maxProperties: item.max_properties,
            isActive: item.is_active,
            adminNotes: item.admin_notes || '',
            lsCustomerId: item.ls_customer_id,
            lsSubscriptionId: item.ls_subscription_id,
            createdAt: item.created_at,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSubscriptions();
  }, [fetchAllSubscriptions]);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Funzione: Regala 5 Anni
  const handleGrant5Years = async (sub: HostSubscription) => {
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);

    const { error } = await supabase
      .from('host_subscriptions')
      .update({
        access_type: 'manual_grant',
        valid_until: fiveYearsFromNow.toISOString(),
        is_active: true,
        admin_notes: sub.adminNotes
          ? `${sub.adminNotes} (Concesso 5 anni il ${new Date().toLocaleDateString('it-IT')})`
          : `Concesso 5 anni il ${new Date().toLocaleDateString('it-IT')}`,
      })
      .eq('id', sub.id);

    if (!error) {
      showNotification(`✨ Accesso di 5 Anni assegnato a ${sub.email}!`);
      fetchAllSubscriptions();
    } else {
      alert(`Errore: ${error.message}`);
    }
  };

  // Funzione: Regala a Vita (Lifetime)
  const handleGrantLifetime = async (sub: HostSubscription) => {
    const { error } = await supabase
      .from('host_subscriptions')
      .update({
        access_type: 'lifetime',
        valid_until: null,
        is_active: true,
        admin_notes: sub.adminNotes
          ? `${sub.adminNotes} (Licenza Lifetime concessa il ${new Date().toLocaleDateString('it-IT')})`
          : `Licenza Lifetime concessa il ${new Date().toLocaleDateString('it-IT')}`,
      })
      .eq('id', sub.id);

    if (!error) {
      showNotification(`👑 Licenza a Vita (Lifetime) assegnata a ${sub.email}!`);
      fetchAllSubscriptions();
    } else {
      alert(`Errore: ${error.message}`);
    }
  };

  // Funzione: Reimposta Prova 14 giorni
  const handleResetTrial = async (sub: HostSubscription) => {
    const fourteenDays = new Date();
    fourteenDays.setDate(fourteenDays.getDate() + 14);

    const { error } = await supabase
      .from('host_subscriptions')
      .update({
        access_type: 'free_trial',
        valid_until: fourteenDays.toISOString(),
        is_active: true,
      })
      .eq('id', sub.id);

    if (!error) {
      showNotification(`Prova di 14 giorni ripristinata per ${sub.email}`);
      fetchAllSubscriptions();
    }
  };

  // Funzione: Cambia max proprietà
  const handleSetMaxProperties = async (sub: HostSubscription, count: number) => {
    const { error } = await supabase
      .from('host_subscriptions')
      .update({ max_properties: count })
      .eq('id', sub.id);

    if (!error) {
      showNotification(`Limite impostato a ${count} case per ${sub.email}`);
      fetchAllSubscriptions();
    }
  };

  // Salva nota amministrativa
  const handleSaveNote = async (id: string) => {
    const { error } = await supabase
      .from('host_subscriptions')
      .update({ admin_notes: tempNote })
      .eq('id', id);

    if (!error) {
      setEditingNoteId(null);
      fetchAllSubscriptions();
    }
  };

  // Filtro
  const filtered = subscriptions.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.adminNotes && sub.adminNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = statusFilter === 'all' || sub.accessType === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const countTrial = subscriptions.filter((s) => s.accessType === 'free_trial').length;
  const countVIP = subscriptions.filter((s) => s.accessType === 'manual_grant' || s.accessType === 'lifetime').length;
  const countLS = subscriptions.filter((s) => s.accessType === 'lemonsqueezy').length;

  return (
    <div className="space-y-6">
      {/* Header Banner SuperAdmin */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-amber-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 backdrop-blur-sm border border-amber-400/30">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Modalità SuperAdmin Sviluppatore</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Gestione Globale Host & Licenze</h2>
            <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-xl">
              Da questo pannello hai il potere di scavalcare i pagamenti di Lemon Squeezy e regalare
              abbonamenti (5 anni o a vita) a colleghi, amici o partner.
            </p>
          </div>

          <button
            onClick={fetchAllSubscriptions}
            className="self-start sm:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Aggiorna Dati</span>
          </button>
        </div>

        {/* Notifica di successo */}
        {actionSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/30 border border-emerald-400/40 rounded-xl flex items-center gap-2 text-emerald-200 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Schede Statistiche */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Totale Host</span>
          <span className="text-2xl font-bold text-gray-900">{subscriptions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-amber-600 block mb-1">In Prova Gratuita</span>
          <span className="text-2xl font-bold text-amber-600">{countTrial}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-purple-600 block mb-1">VIP & Lifetime</span>
          <span className="text-2xl font-bold text-purple-600">{countVIP}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 block mb-1">Lemon Squeezy Pro</span>
          <span className="text-2xl font-bold text-emerald-600">{countLS}</span>
        </div>
      </div>

      {/* Barra di Ricerca e Filtri */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cerca per email o note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'free_trial', 'manual_grant', 'lifetime', 'lemonsqueezy'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                statusFilter === filter
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' && 'Tutti'}
              {filter === 'free_trial' && 'Prova'}
              {filter === 'manual_grant' && 'VIP (5 Anni)'}
              {filter === 'lifetime' && 'A Vita'}
              {filter === 'lemonsqueezy' && 'Lemon Squeezy'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista Host */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
            Caricamento lista Host...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            Nessun host trovato con i filtri correnti.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((sub) => {
              const isExpired = sub.validUntil && new Date(sub.validUntil) < new Date();
              const isLifetime = sub.accessType === 'lifetime';

              return (
                <div key={sub.id} className="p-5 hover:bg-gray-50/80 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Info Host */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{sub.email}</span>
                        {sub.role === 'superadmin' && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase">
                            Admin
                          </span>
                        )}

                        {/* Badge Tipo Accesso */}
                        {sub.accessType === 'lifetime' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold shadow-xs">
                            <Crown className="w-3 h-3" /> A Vita (Lifetime)
                          </span>
                        )}
                        {sub.accessType === 'manual_grant' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-semibold">
                            <Sparkles className="w-3 h-3 text-purple-600" /> Concesso Manualmente (VIP)
                          </span>
                        )}
                        {sub.accessType === 'free_trial' && (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isExpired ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <Clock className="w-3 h-3" /> {isExpired ? 'Prova Scaduta' : 'Prova Gratuita'}
                          </span>
                        )}
                        {sub.accessType === 'lemonsqueezy' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Lemon Squeezy Pro
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          📅 Scadenza:{' '}
                          <strong className="text-gray-700">
                            {isLifetime
                              ? 'Illimitata'
                              : sub.validUntil
                              ? new Date(sub.validUntil).toLocaleDateString('it-IT')
                              : 'Non definita'}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          🏠 Max Proprietà:{' '}
                          <strong className="text-gray-700">{sub.maxProperties}</strong>
                        </span>
                      </div>

                      {/* Note Interne SuperAdmin */}
                      <div className="pt-1">
                        {editingNoteId === sub.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder="Inserisci nota interna per questo host..."
                              className="text-xs px-2.5 py-1 border border-gray-300 rounded-lg outline-none w-72"
                            />
                            <button
                              onClick={() => handleSaveNote(sub.id)}
                              className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-lg"
                            >
                              Salva
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Annulla
                            </button>
                          </div>
                        ) : (
                          <p
                            onClick={() => {
                              setEditingNoteId(sub.id);
                              setTempNote(sub.adminNotes || '');
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            {sub.adminNotes ? (
                              <span className="italic text-gray-600 font-medium">"{sub.adminNotes}"</span>
                            ) : (
                              <span className="italic">Nessuna nota (clicca per aggiungere)</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Azioni con 1 clic */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        onClick={() => handleGrant5Years(sub)}
                        title="Regala 5 anni gratuiti scavalcando i pagamenti"
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Regala 5 Anni</span>
                      </button>

                      <button
                        onClick={() => handleGrantLifetime(sub)}
                        title="Concedi accesso illimitato per sempre"
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>Regala a Vita</span>
                      </button>

                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white text-xs">
                        <span className="px-2 py-1 text-gray-400 text-[11px] font-semibold">Case:</span>
                        {[1, 3, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleSetMaxProperties(sub, num)}
                            className={`px-2 py-1 hover:bg-gray-100 transition-colors ${
                              sub.maxProperties === num ? 'font-bold text-amber-600 bg-amber-50' : 'text-gray-600'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      {sub.accessType !== 'free_trial' && (
                        <button
                          onClick={() => handleResetTrial(sub)}
                          title="Reimposta la prova a 14 giorni"
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
