import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, AlertCircle, Loader, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hostName, setHostName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(
            err.message.includes('Invalid login credentials')
              ? 'Email o password non corretti. Ricontrolla i tuoi dati.'
              : err.message
          );
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
      } else {
        if (password.length < 6) {
          setError('La password deve contenere almeno 6 caratteri.');
          setLoading(false);
          return;
        }

        const { error: err } = await signUp(email, password, hostName);
        if (err) {
          setError(
            err.message.includes('User already registered')
              ? 'Questa email è già registrata. Prova ad accedere.'
              : err.message
          );
        } else {
          setSuccessMsg('Account creato con successo! Puoi ora iniziare la tua prova gratuita.');
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 1200);
        }
      }
    } catch {
      setError('Si è verificato un errore imprevisto. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-amber-100 animate-in zoom-in-95 duration-200">
        {/* Header Decorativo */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 px-6 pt-7 pb-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-amber-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Piattaforma Gestione Host</span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Bentornato su GuestGuide' : 'Crea il tuo Account Host'}
          </h3>
          <p className="text-amber-100/90 text-sm mt-1">
            {mode === 'login'
              ? 'Accedi per gestire la tua guida e visualizzare le statistiche.'
              : 'Digitalizza la tua casa vacanze in pochi minuti con una guida elegante.'}
          </p>

          {/* Switcher Tab */}
          <div className="flex bg-amber-800/40 p-1 rounded-xl mt-5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              Accedi
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              Registrati
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {mode === 'register' && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-amber-800">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                🎁
              </div>
              <div className="text-xs">
                <span className="font-bold block text-amber-900">14 Giorni di Prova Gratuita</span>
                Accesso a tutte le funzionalità Pro. Nessuna carta di credito richiesta.
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 text-green-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Il tuo Nome o Nome Struttura
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="es. Marco Rossi"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Indirizzo Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tua@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>
              {mode === 'register' && (
                <span className="text-[11px] text-gray-400 mt-1 block">Minimo 6 caratteri</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Elaborazione in corso...</span>
                </>
              ) : mode === 'login' ? (
                'Accedi al Pannello Host'
              ) : (
                'Inizia Prova Gratuita'
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              {mode === 'login' ? 'Non hai ancora un account?' : 'Hai già un account?'}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                }}
                className="ml-1.5 text-amber-600 hover:text-amber-700 font-semibold underline-offset-2 hover:underline"
              >
                {mode === 'login' ? 'Registrati gratis' : 'Accedi'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
