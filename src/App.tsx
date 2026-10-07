import { useState } from 'react';
import { Loader, Lock, X, KeyRound, Sparkles } from 'lucide-react';
import { GuestGuide } from '@/components/guest/GuestGuide';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AuthModal } from '@/components/auth/AuthModal';
import { useProperty } from '@/hooks/useProperty';
import { useAuth } from '@/contexts/AuthContext';

type View = 'guest' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('guest');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const { user } = useAuth();

  const {
    property, houseRules, localPlaces, loading,
    saveProperty, addRule, updateRule, deleteRule,
    addPlace, updatePlace, deletePlace, reload,
  } = useProperty();

  // Quando si clicca "Admin" dalla vista ospite:
  const handleAdminTrigger = () => {
    if (user) {
      // Se già loggato con l'account Host, entra diretto
      setView('admin');
    } else {
      // Se non è loggato, apre direttamente il Login Host (Email/Password)
      setShowAuthModal(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = property?.adminPin || '1234';
    if (enteredPin === currentPin) {
      setPinError(false);
      setEnteredPin('');
      setShowPinModal(false);
      setView('admin');
    } else {
      setPinError(true);
    }
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-sky-700">
          <Loader className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium">Caricamento guida in corso...</p>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <AdminPanel
        property={property}
        houseRules={houseRules}
        localPlaces={localPlaces}
        onSaveProperty={saveProperty}
        onAddRule={addRule}
        onDeleteRule={deleteRule}
        onAddPlace={addPlace}
        onDeletePlace={deletePlace}
        onReload={reload}
        onGuestView={() => setView('guest')}
      />
    );
  }

  return (
    <>
      <GuestGuide
        property={property}
        houseRules={houseRules}
        localPlaces={localPlaces}
        onAdminClick={handleAdminTrigger}
      />

      {/* Modal Autenticazione Host Cloud (Predefinito al clic su Admin) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setView('admin');
        }}
        onUsePin={() => {
          setShowAuthModal(false);
          setShowPinModal(true);
        }}
      />

      {/* Modal PIN Rapido (Opzionale di emergenza) */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-amber-100 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-gray-800">Sblocco Rapido PIN</h3>
            <p className="text-xs text-center text-gray-500 mt-1 mb-5">
              Inserisci il PIN della casa vacanze
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  placeholder="Inserisci il PIN"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  className={`w-full text-center text-xl tracking-widest py-3 px-4 border rounded-2xl outline-none transition font-mono ${
                    pinError
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-gray-50'
                  }`}
                />
                {pinError && (
                  <p className="text-xs text-red-500 text-center mt-1.5 font-medium">
                    PIN errato. Riprova.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition shadow-xs cursor-pointer"
                >
                  Sblocca
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setShowAuthModal(true);
                }}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
              >
                ← Torna all'accesso con Email e Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
