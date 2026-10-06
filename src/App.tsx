import { useState } from 'react';
import { Loader, Lock, X } from 'lucide-react';
import { GuestGuide } from '@/components/guest/GuestGuide';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { useProperty } from '@/hooks/useProperty';

type View = 'guest' | 'admin';


export default function App() {
  const [view, setView] = useState<View>('guest');
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const {
    property, houseRules, localPlaces, loading,
    saveProperty, addRule, updateRule, deleteRule,
    addPlace, updatePlace, deletePlace, reload,
  } = useProperty();

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
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-amber-600">
          <Loader className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium">Caricamento in corso...</p>
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
        onAdminClick={() => {
          setPinError(false);
          setEnteredPin('');
          setShowPinModal(true);
        }}
      />

      {/* Modal PIN Host */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-gray-800">Accesso Gestione Host</h3>
            <p className="text-xs text-center text-gray-500 mt-1 mb-4">
              Inserisci il PIN per accedere all'area proprietario
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
                  className={`w-full text-center text-xl tracking-widest py-3 px-4 border rounded-xl outline-none transition font-mono ${
                    pinError
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
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
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition shadow"
                >
                  Accedi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

