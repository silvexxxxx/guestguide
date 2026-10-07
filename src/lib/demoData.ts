import { db } from './db';
import type { Property, HouseRule, LocalPlace, Transaction } from '@/types';

export function getDefaultPropertyData(propertyId: string): Property {
  return {
    id: propertyId,
    name: 'Carloforte Bay - Dimora Marina',
    description: 'Un\'accogliente dimora tipica tabarchina a pochi passi dal lungomare e dai caratteristici caruggi, base perfetta per vivere il mare e la magia dell\'Isola di San Pietro.',
    hostName: 'Marco & Elena',
    hostPhone: '+393331234567',
    hostPhotoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    wifiName: 'CasaDelSole_Guest',
    wifiPassword: 'Benvenuto2024!',
    checkinTime: '15:00',
    checkoutTime: '10:00',
    checkinInstructions: {
      it: 'Troverete la cassetta delle chiavi vicino all\'ingresso principale (codice: 4821). Prendete la chiave con il portachiavi rosso. Una volta entrati, riponete la chiave nello stesso posto.',
      en: 'You will find the key box near the main entrance (code: 4821). Take the key with the red keychain. Once inside, put the key back in the same place.',
      fr: 'Vous trouverez la boîte à clés près de l\'entrée principale (code: 4821). Prenez la clé avec le porte-clés rouge. Une fois à l\'intérieur, remettez la clé au même endroit.',
      es: 'Encontraréis la caja de llaves cerca de la entrada principal (código: 4821). Tomad la llave con el llavero rojo. Una vez dentro, volved a poner la llave en el mismo lugar.',
      de: 'Sie finden den Schlüsselkasten neben dem Haupteingang (Code: 4821). Nehmen Sie den Schlüssel mit dem roten Schlüsselanhänger. Sobald Sie drinnen sind, legen Sie den Schlüssel wieder an denselben Ort.',
    },
    checkoutInstructions: {
      it: 'Prima di partire: svuotare il frigorifero, raccogliere la spazzatura differenziata, lasciare le chiavi nella cassetta e chiudere bene tutte le finestre.',
      en: 'Before leaving: empty the fridge, separate the garbage, leave keys in the box, and close all windows properly.',
      fr: 'Avant de partir: videz le réfrigérateur, triez les déchets, laissez les clés dans la boîte et fermez bien toutes les fenêtres.',
      es: 'Antes de salir: vaciad la nevera, separad la basura, dejad las llaves en la caja y cerrad bien todas las ventanas.',
      de: 'Vor der Abreise: Kühlschrank leeren, Müll trennen, Schlüssel in die Box legen und alle Fenster ordentlich schließen.',
    },
    welcomeText: {
      it: 'Benvenuti nella Casa del Sole! Siamo felici di avervi con noi. Questa guida contiene tutto ciò che dovete sapere per rendere il vostro soggiorno perfetto. Non esitate a contattarci per qualsiasi necessità.',
      en: 'Welcome to Casa del Sole! We are happy to have you with us. This guide contains everything you need to know to make your stay perfect. Don\'t hesitate to contact us for any need.',
      fr: 'Bienvenue à la Casa del Sole! Nous sommes heureux de vous accueillir. Ce guide contient tout ce que vous devez savoir pour rendre votre séjour parfait. N\'hésitez pas à nous contacter pour tout besoin.',
      es: '¡Bienvenidos a Casa del Sole! Estamos felices de teneros con nosotros. Esta guía contiene todo lo que necesitáis saber para que vuestra estancia sea perfecta. No dudéis en contactarnos para cualquier necesidad.',
      de: 'Willkommen in der Casa del Sole! Wir freuen uns, Sie bei uns zu haben. Dieser Leitfaden enthält alles, was Sie wissen müssen, um Ihren Aufenthalt perfekt zu gestalten. Zögern Sie nicht, uns bei Bedarf zu kontaktieren.',
    },
    address: 'Via Solferino 12',
    city: 'Carloforte (Sardegna)',
    adminPin: '1234',
    isPublic: true,
  };
}

export function getDefaultRulesData(propertyId: string): HouseRule[] {
  return [
    { id: crypto.randomUUID(), propertyId, icon: 'Volume2', label: { it: 'Silenzio dopo le 22:00 e prima delle 8:00', en: 'Quiet hours after 10pm and before 8am', fr: 'Silence après 22h et avant 8h', es: 'Silencio después de las 22:00 y antes de las 8:00', de: 'Ruhezeiten nach 22 Uhr und vor 8 Uhr' }, sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, icon: 'CigaretteOff', label: { it: 'Vietato fumare all\'interno', en: 'No smoking inside', fr: 'Il est interdit de fumer à l\'intérieur', es: 'No fumar en el interior', de: 'Rauchen im Inneren verboten' }, sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, icon: 'Recycle', label: { it: 'Raccolta differenziata obbligatoria', en: 'Separate waste collection required', fr: 'Tri sélectif obligatoire', es: 'Reciclaje obligatoire', de: 'Mülltrennung erforderlich' }, sortOrder: 2 },
    { id: crypto.randomUUID(), propertyId, icon: 'PawPrint', label: { it: 'Animali domestici non ammessi', en: 'No pets allowed', fr: 'Animaux de compagnie non admis', es: 'No se admiten mascotas', de: 'Haustiere nicht erlaubt' }, sortOrder: 3 },
    { id: crypto.randomUUID(), propertyId, icon: 'Users', label: { it: 'Massimo 4 ospiti', en: 'Maximum 4 guests', fr: 'Maximum 4 invités', es: 'Máximo 4 huéspedes', de: 'Maximal 4 Gäste' }, sortOrder: 4 },
    { id: crypto.randomUUID(), propertyId, icon: 'Waves', label: { it: 'Niente feste o eventi', en: 'No parties or events', fr: 'Pas de fêtes ou d\'événements', es: 'No fiestas ni eventos', de: 'Keine Partys oder Veranstaltungen' }, sortOrder: 5 },
  ];
}

export function getDefaultPlacesData(propertyId: string): LocalPlace[] {
  return [
    { id: crypto.randomUUID(), propertyId, category: 'restaurant', name: 'Trattoria da Nicolò', address: 'Corso Cavour 33, Carloforte', description: { it: 'Celebre per la pasta al tonno alla carlofortina e i piatti della tradizione tabarchina.', en: 'Famous for traditional tuna pasta and authentic local specialties.' }, mapsUrl: 'https://maps.google.com/?q=Trattoria+da+Nicolo+Carloforte', phone: '+390781854048', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'restaurant', name: 'Al Tonno di Corsa', address: 'Via Galileo Galilei 1, Carloforte', description: { it: 'Ristorante panoramico nel cuore del paese con ricette d\'eccellenza e tonno fresco locale.', en: 'Panoramic restaurant with exquisite fresh tuna recipes.' }, mapsUrl: 'https://maps.google.com/?q=Al+Tonno+di+Corsa+Carloforte', phone: '+390781855106', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'bar', name: 'Caffè della Repubblica', address: 'Piazza Repubblica, Carloforte', description: { it: 'Il ritrovo preferito per cappuccino e colazione con le tipiche cassatedde di ricotta.', en: 'The best spot for cappuccino and local ricotta pastries.' }, mapsUrl: 'https://maps.google.com/?q=Piazza+Repubblica+Carloforte', phone: '+390781854120', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'bar', name: 'Bar Pasticceria Pomata', address: 'Via Roma 45, Carloforte', description: { it: 'Pasticceria artigianale celebre per la focaccia tabarchina e i dolci di mandorla.', en: 'Artisanal pastry shop known for sweet focaccia and almond treats.' }, mapsUrl: 'https://maps.google.com/?q=Via+Roma+Carloforte', phone: '+390781854231', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'supermarket', name: 'Conad City Carloforte', address: 'Corso Battellieri, Carloforte', description: { it: 'Supermercato fornito vicino al porto, con banco gastronomia locale.', en: 'Well-stocked supermarket near the ferry port.' }, mapsUrl: 'https://maps.google.com/?q=Conad+City+Carloforte', phone: '+390781855000', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'supermarket', name: 'Alimentari Pescheria del Porto', address: 'Via Lungomare 14, Carloforte', description: { it: 'Piccolo alimentari di prossimità con pesce fresco di giornata e prodotti tipici.', en: 'Local grocery with fresh morning catch and island delicacies.' }, mapsUrl: 'https://maps.google.com/?q=Carloforte+Porto', phone: '', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'attraction', name: 'Capo Sandalo & Faro', address: 'Capo Sandalo, Isola di San Pietro', description: { it: 'La punta più occidentale dell\'isola: scogliere a picco e tramonti indimenticabili sul Mediterraneo.', en: 'The westernmost cliffside point with breathtaking Mediterranean sunsets.' }, mapsUrl: 'https://maps.google.com/?q=Capo+Sandalo+Carloforte', phone: '', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'attraction', name: 'Cala Fico & Oasi LIPU', address: 'Cala Fico, Carloforte', description: { it: 'Incantevole caletta rocciosa tra acque turchesi dove nidifica il raro Falco della Regina.', en: 'Gorgeous turquoise cove where the rare Eleonora\'s falcon nests.' }, mapsUrl: 'https://maps.google.com/?q=Cala+Fico+Carloforte', phone: '', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'pharmacy', name: 'Farmacia Del Corso', address: 'Via Roma 12, Carloforte', description: { it: 'Farmacia nel centro di Carloforte con servizio informazioni.', en: 'Downtown island pharmacy.' }, mapsUrl: 'https://maps.google.com/?q=Farmacia+Carloforte', phone: '+390781854010', sortOrder: 0 },
  ];
}

export function getDefaultTransactionsData(propertyId: string): Transaction[] {
  const now = new Date();
  const transactions: Transaction[] = [];
  for (let m = 0; m < 6; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const incomes = [
      { category: 'booking', desc: 'Prenotazione Airbnb', amount: 840 + Math.random() * 400 },
      { category: 'booking', desc: 'Prenotazione Booking.com', amount: 560 + Math.random() * 300 },
      { category: 'cleaning_fee', desc: 'Quota pulizie', amount: 80 },
    ];
    const expenses = [
      { category: 'utilities', desc: 'Bolletta luce + gas', amount: 95 + Math.random() * 40 },
      { category: 'platform_fee', desc: 'Commissione Airbnb', amount: 60 + Math.random() * 20 },
      { category: 'cleaning', desc: 'Servizio pulizie', amount: 120 },
    ];
    for (const inc of incomes) {
      transactions.push({ id: crypto.randomUUID(), propertyId, date: `${month}-${String(5 + Math.floor(Math.random() * 20)).padStart(2, '0')}`, type: 'income', category: inc.category, description: inc.desc, amount: Math.round(inc.amount * 100) / 100, notes: '' });
    }
    for (const exp of expenses) {
      transactions.push({ id: crypto.randomUUID(), propertyId, date: `${month}-${String(5 + Math.floor(Math.random() * 20)).padStart(2, '0')}`, type: 'expense', category: exp.category, description: exp.desc, amount: Math.round(exp.amount * 100) / 100, notes: '' });
    }
  }
  return transactions;
}

export async function loadDemoData(propertyId: string) {
  const property = getDefaultPropertyData(propertyId);
  await db.properties.put(property);

  await db.houseRules.where('propertyId').equals(propertyId).delete();
  const rules = getDefaultRulesData(propertyId);
  await db.houseRules.bulkAdd(rules);

  await db.localPlaces.where('propertyId').equals(propertyId).delete();
  const places = getDefaultPlacesData(propertyId);
  await db.localPlaces.bulkAdd(places);

  await db.transactions.where('propertyId').equals(propertyId).delete();
  const transactions = getDefaultTransactionsData(propertyId);
  await db.transactions.bulkAdd(transactions);
}
