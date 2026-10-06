export type Lang = 'it' | 'en' | 'fr' | 'es' | 'de';

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export type MultiLang = Record<Lang, string>;

export const t: Record<string, MultiLang> = {
  // Navigation
  guestGuide: { it: 'Guida Ospiti', en: 'Guest Guide', fr: 'Guide Invités', es: 'Guía Huéspedes', de: 'Gästeguide' },
  adminPanel: { it: 'Gestione', en: 'Management', fr: 'Gestion', es: 'Gestión', de: 'Verwaltung' },
  printGuide: { it: 'Stampa Guida', en: 'Print Guide', fr: 'Imprimer Guide', es: 'Imprimir Guía', de: 'Anleitung drucken' },
  qrPoster: { it: 'Poster QR', en: 'QR Poster', fr: 'Affiche QR', es: 'Cartel QR', de: 'QR-Poster' },

  // Sections
  welcome: { it: 'Benvenuto', en: 'Welcome', fr: 'Bienvenue', es: 'Bienvenido', de: 'Willkommen' },
  wifi: { it: 'Wi-Fi', en: 'Wi-Fi', fr: 'Wi-Fi', es: 'Wi-Fi', de: 'WLAN' },
  checkinCheckout: { it: 'Check-in & Check-out', en: 'Check-in & Check-out', fr: 'Arrivée & Départ', es: 'Llegada & Salida', de: 'An- & Abreise' },
  houseRules: { it: 'Regole della Casa', en: 'House Rules', fr: 'Règles de la Maison', es: 'Normas del Hogar', de: 'Hausregeln' },
  localGuide: { it: 'Guida Locale', en: 'Local Guide', fr: 'Guide Local', es: 'Guía Local', de: 'Ortsführer' },
  emergency: { it: 'Numeri Utili', en: 'Useful Numbers', fr: 'Numéros Utiles', es: 'Números Útiles', de: 'Nützliche Nummern' },

  // WiFi
  networkName: { it: 'Nome Rete', en: 'Network Name', fr: 'Nom du réseau', es: 'Nombre de red', de: 'Netzwerkname' },
  password: { it: 'Password', en: 'Password', fr: 'Mot de passe', es: 'Contraseña', de: 'Passwort' },
  copyPassword: { it: 'Copia Password', en: 'Copy Password', fr: 'Copier le mot de passe', es: 'Copiar contraseña', de: 'Passwort kopieren' },
  copied: { it: 'Copiata!', en: 'Copied!', fr: 'Copié!', es: '¡Copiada!', de: 'Kopiert!' },
  scanQR: { it: 'Scansiona per connetterti', en: 'Scan to connect', fr: 'Scanner pour se connecter', es: 'Escanear para conectar', de: 'Zum Verbinden scannen' },

  // Check-in / out
  checkinTime: { it: 'Orario Check-in', en: 'Check-in Time', fr: 'Heure d\'arrivée', es: 'Hora de llegada', de: 'Check-in Zeit' },
  checkoutTime: { it: 'Orario Check-out', en: 'Check-out Time', fr: 'Heure de départ', es: 'Hora de salida', de: 'Check-out Zeit' },
  from: { it: 'Dalle', en: 'From', fr: 'À partir de', es: 'Desde las', de: 'Ab' },
  until: { it: 'Entro le', en: 'By', fr: 'Avant', es: 'Antes de las', de: 'Bis' },
  checkinInstructions: { it: 'Istruzioni per l\'arrivo', en: 'Arrival instructions', fr: 'Instructions d\'arrivée', es: 'Instrucciones de llegada', de: 'Anreiseanweisungen' },
  checkoutInstructions: { it: 'Istruzioni per la partenza', en: 'Departure instructions', fr: 'Instructions de départ', es: 'Instrucciones de salida', de: 'Abreiseanweisungen' },

  // Local guide categories
  restaurants: { it: 'Ristoranti', en: 'Restaurants', fr: 'Restaurants', es: 'Restaurantes', de: 'Restaurants' },
  bars: { it: 'Bar & Colazione', en: 'Bars & Breakfast', fr: 'Bars & Petit-déjeuner', es: 'Bares & Desayuno', de: 'Bars & Frühstück' },
  supermarkets: { it: 'Supermercati', en: 'Supermarkets', fr: 'Supermarchés', es: 'Supermercados', de: 'Supermärkte' },
  attractions: { it: 'Da Non Perdere', en: 'Must See', fr: 'À ne pas manquer', es: 'No te lo pierdas', de: 'Sehenswürdigkeiten' },
  pharmacies: { it: 'Emergenze & Farmacie', en: 'Emergencies & Pharmacies', fr: 'Urgences & Pharmacies', es: 'Emergencias & Farmacias', de: 'Notfall & Apotheken' },

  // Emergency
  emergency112: { it: 'Emergenze (112)', en: 'Emergency (112)', fr: 'Urgences (112)', es: 'Emergencias (112)', de: 'Notruf (112)' },
  medicalGuard: { it: 'Guardia Medica', en: 'Medical Guard', fr: 'Médecin de garde', es: 'Guardia Médica', de: 'Bereitschaftsarzt' },
  roadsideAssistance: { it: 'Soccorso Stradale', en: 'Roadside Assistance', fr: 'Assistance routière', es: 'Asistencia en carretera', de: 'Pannenhilfe' },
  callHost: { it: 'Chiama il Proprietario', en: 'Call the Host', fr: 'Appeler le propriétaire', es: 'Llamar al anfitrión', de: 'Gastgeber anrufen' },
  callNow: { it: 'Chiama ora', en: 'Call now', fr: 'Appeler maintenant', es: 'Llamar ahora', de: 'Jetzt anrufen' },
  whatsapp: { it: 'WhatsApp', en: 'WhatsApp', fr: 'WhatsApp', es: 'WhatsApp', de: 'WhatsApp' },

  // Actions
  openInMaps: { it: 'Apri su Maps', en: 'Open in Maps', fr: 'Ouvrir dans Maps', es: 'Abrir en Maps', de: 'In Maps öffnen' },
  call: { it: 'Chiama', en: 'Call', fr: 'Appeler', es: 'Llamar', de: 'Anrufen' },
  writeWhatsApp: { it: 'Scrivi su WhatsApp', en: 'Write on WhatsApp', fr: 'Écrire sur WhatsApp', es: 'Escribe en WhatsApp', de: 'WhatsApp schreiben' },

  // Admin
  dashboard: { it: 'Dashboard', en: 'Dashboard', fr: 'Tableau de bord', es: 'Panel', de: 'Dashboard' },
  propertySettings: { it: 'Impostazioni Proprietà', en: 'Property Settings', fr: 'Paramètres de la propriété', es: 'Ajustes de la propiedad', de: 'Einstellungen' },
  financials: { it: 'Entrate & Uscite', en: 'Income & Expenses', fr: 'Revenus & Dépenses', es: 'Ingresos & Gastos', de: 'Einnahmen & Ausgaben' },
  localPlaces: { it: 'Luoghi Consigliati', en: 'Recommended Places', fr: 'Lieux recommandés', es: 'Lugares recomendados', de: 'Empfohlene Orte' },
  houseRulesMgmt: { it: 'Regole della Casa', en: 'House Rules', fr: 'Règles', es: 'Normas', de: 'Hausregeln' },
  save: { it: 'Salva', en: 'Save', fr: 'Enregistrer', es: 'Guardar', de: 'Speichern' },
  saved: { it: 'Salvato!', en: 'Saved!', fr: 'Enregistré!', es: '¡Guardado!', de: 'Gespeichert!' },
  cancel: { it: 'Annulla', en: 'Cancel', fr: 'Annuler', es: 'Cancelar', de: 'Abbrechen' },
  add: { it: 'Aggiungi', en: 'Add', fr: 'Ajouter', es: 'Agregar', de: 'Hinzufügen' },
  edit: { it: 'Modifica', en: 'Edit', fr: 'Modifier', es: 'Editar', de: 'Bearbeiten' },
  delete: { it: 'Elimina', en: 'Delete', fr: 'Supprimer', es: 'Eliminar', de: 'Löschen' },
  loadDemo: { it: 'Carica Dati Demo', en: 'Load Demo Data', fr: 'Charger les données démo', es: 'Cargar datos demo', de: 'Demo-Daten laden' },
  totalIncome: { it: 'Entrate Totali', en: 'Total Income', fr: 'Revenus Totaux', es: 'Ingresos Totales', de: 'Gesamteinnahmen' },
  totalExpenses: { it: 'Spese Totali', en: 'Total Expenses', fr: 'Dépenses Totales', es: 'Gastos Totales', de: 'Gesamtausgaben' },
  netProfit: { it: 'Guadagno Netto', en: 'Net Profit', fr: 'Bénéfice Net', es: 'Ganancia Neta', de: 'Nettogewinn' },
  exportCSV: { it: 'Esporta CSV', en: 'Export CSV', fr: 'Exporter CSV', es: 'Exportar CSV', de: 'CSV exportieren' },
  addTransaction: { it: 'Aggiungi Transazione', en: 'Add Transaction', fr: 'Ajouter une transaction', es: 'Agregar transacción', de: 'Transaktion hinzufügen' },
  income: { it: 'Entrata', en: 'Income', fr: 'Revenu', es: 'Ingreso', de: 'Einnahme' },
  expense: { it: 'Uscita', en: 'Expense', fr: 'Dépense', es: 'Gasto', de: 'Ausgabe' },
  category: { it: 'Categoria', en: 'Category', fr: 'Catégorie', es: 'Categoría', de: 'Kategorie' },
  amount: { it: 'Importo (€)', en: 'Amount (€)', fr: 'Montant (€)', es: 'Importe (€)', de: 'Betrag (€)' },
  description: { it: 'Descrizione', en: 'Description', fr: 'Description', es: 'Descripción', de: 'Beschreibung' },
  date: { it: 'Data', en: 'Date', fr: 'Date', es: 'Fecha', de: 'Datum' },
  notes: { it: 'Note', en: 'Notes', fr: 'Notes', es: 'Notas', de: 'Notizen' },
  monthlyTrend: { it: 'Andamento Mensile', en: 'Monthly Trend', fr: 'Tendance Mensuelle', es: 'Tendencia Mensual', de: 'Monatlicher Trend' },
  noTransactions: { it: 'Nessuna transazione', en: 'No transactions', fr: 'Aucune transaction', es: 'Sin transacciones', de: 'Keine Transaktionen' },
  step: { it: 'Passo', en: 'Step', fr: 'Étape', es: 'Paso', de: 'Schritt' },
  scanToConnect: { it: 'Scansiona per connetterti al Wi-Fi', en: 'Scan to connect to Wi-Fi', fr: 'Scanner pour se connecter au Wi-Fi', es: 'Escanea para conectarte al Wi-Fi', de: 'Scannen zum Verbinden mit WLAN' },
  printPoster: { it: 'Stampa Poster', en: 'Print Poster', fr: 'Imprimer l\'affiche', es: 'Imprimir Cartel', de: 'Poster drucken' },
  yourGuideQR: { it: 'Scansiona per la guida della casa', en: 'Scan for the house guide', fr: 'Scannez pour le guide de la maison', es: 'Escanea para la guía de la casa', de: 'Für den Hausführer scannen' },
};

export function tr(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? t[key]?.['it'] ?? key;
}

export function ml(obj: Partial<MultiLang> | undefined, lang: Lang): string {
  if (!obj) return '';
  return obj[lang] ?? obj['it'] ?? obj['en'] ?? '';
}
