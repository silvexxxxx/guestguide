import { db } from './db';
import type { Property, HouseRule, LocalPlace, Transaction } from '@/types';

export async function loadDemoData(propertyId: string) {
  const property: Property = {
    id: propertyId,
    name: 'Casa del Sole - Appartamento nel Centro Storico',
    description: 'Un appartamento luminoso e accogliente nel cuore del centro storico, a pochi passi dai principali monumenti.',
    hostName: 'Marco Rossi',
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
    address: 'Via Roma 42',
    city: 'Firenze',
  };

  await db.properties.put(property);

  await db.houseRules.where('propertyId').equals(propertyId).delete();
  const rules: HouseRule[] = [
    { id: crypto.randomUUID(), propertyId, icon: 'Volume2', label: { it: 'Silenzio dopo le 22:00 e prima delle 8:00', en: 'Quiet hours after 10pm and before 8am', fr: 'Silence après 22h et avant 8h', es: 'Silencio después de las 22:00 y antes de las 8:00', de: 'Ruhezeiten nach 22 Uhr und vor 8 Uhr' }, sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, icon: 'CigaretteOff', label: { it: 'Vietato fumare all\'interno', en: 'No smoking inside', fr: 'Il est interdit de fumer à l\'intérieur', es: 'No fumar en el interior', de: 'Rauchen im Inneren verboten' }, sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, icon: 'Recycle', label: { it: 'Raccolta differenziata obbligatoria', en: 'Separate waste collection required', fr: 'Tri sélectif obligatoire', es: 'Reciclaje obligatorio', de: 'Mülltrennung erforderlich' }, sortOrder: 2 },
    { id: crypto.randomUUID(), propertyId, icon: 'PawPrint', label: { it: 'Animali domestici non ammessi', en: 'No pets allowed', fr: 'Animaux de compagnie non admis', es: 'No se admiten mascotas', de: 'Haustiere nicht erlaubt' }, sortOrder: 3 },
    { id: crypto.randomUUID(), propertyId, icon: 'Users', label: { it: 'Massimo 4 ospiti', en: 'Maximum 4 guests', fr: 'Maximum 4 invités', es: 'Máximo 4 huéspedes', de: 'Maximal 4 Gäste' }, sortOrder: 4 },
    { id: crypto.randomUUID(), propertyId, icon: 'Waves', label: { it: 'Niente feste o eventi', en: 'No parties or events', fr: 'Pas de fêtes ou d\'événements', es: 'No fiestas ni eventos', de: 'Keine Partys oder Veranstaltungen' }, sortOrder: 5 },
  ];
  await db.houseRules.bulkAdd(rules);

  await db.localPlaces.where('propertyId').equals(propertyId).delete();
  const places: LocalPlace[] = [
    { id: crypto.randomUUID(), propertyId, category: 'restaurant', name: 'Trattoria da Mario', address: 'Via Rosina 12, Firenze', description: { it: 'Cucina toscana autentica, ottimi bistecchi alla fiorentina.', en: 'Authentic Tuscan cuisine, great Florentine steaks.' }, mapsUrl: 'https://maps.google.com/?q=Trattoria+da+Mario+Firenze', phone: '+39055123456', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'restaurant', name: 'Osteria dell\'Enoteca', address: 'Via Romana 70, Firenze', description: { it: 'Ristorante elegante con vasta carta dei vini e menu stagionale.', en: 'Elegant restaurant with extensive wine list and seasonal menu.' }, mapsUrl: 'https://maps.google.com/?q=Osteria+Enoteca+Firenze', phone: '+39055654321', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'bar', name: 'Caffè Rivoire', address: 'Piazza della Signoria 5, Firenze', description: { it: 'Storico bar in piazza, famoso per la cioccolata calda e i cornetti.', en: 'Historic bar in the square, famous for hot chocolate and croissants.' }, mapsUrl: 'https://maps.google.com/?q=Caffe+Rivoire+Firenze', phone: '+39055214412', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'bar', name: 'Pasticceria Marino', address: 'Via della Vigna Nuova 22, Firenze', description: { it: 'Colazione deliziosa con paste fresche e caffè eccellente.', en: 'Delicious breakfast with fresh pastries and excellent coffee.' }, mapsUrl: 'https://maps.google.com/?q=Pasticceria+Marino+Firenze', phone: '', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'supermarket', name: 'Esselunga', address: 'Via Pisana 130, Firenze', description: { it: 'Grande supermercato con ampia scelta di prodotti freschi.', en: 'Large supermarket with wide selection of fresh products.' }, mapsUrl: 'https://maps.google.com/?q=Esselunga+Firenze+Via+Pisana', phone: '', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'supermarket', name: 'Carrefour Express', address: 'Via del Corso 8, Firenze', description: { it: 'Supermercato di prossimità nel centro storico, aperto fino alle 21.', en: 'Neighborhood supermarket in the historic center, open until 9pm.' }, mapsUrl: 'https://maps.google.com/?q=Carrefour+Express+Firenze+Via+del+Corso', phone: '', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'attraction', name: 'Galleria degli Uffizi', address: 'Piazzale degli Uffizi, Firenze', description: { it: 'Uno dei musei più importanti del mondo, imperdibile. Prenotare online.', en: 'One of the world\'s most important museums, a must-see. Book online.' }, mapsUrl: 'https://maps.google.com/?q=Galleria+degli+Uffizi+Firenze', phone: '', sortOrder: 0 },
    { id: crypto.randomUUID(), propertyId, category: 'attraction', name: 'Ponte Vecchio', address: 'Ponte Vecchio, Firenze', description: { it: 'Il celebre ponte medievale con le botteghe degli orafi, romantico al tramonto.', en: 'The famous medieval bridge with goldsmiths\' shops, romantic at sunset.' }, mapsUrl: 'https://maps.google.com/?q=Ponte+Vecchio+Firenze', phone: '', sortOrder: 1 },
    { id: crypto.randomUUID(), propertyId, category: 'pharmacy', name: 'Farmacia Molteni', address: 'Via dei Calzaiuoli 7r, Firenze', description: { it: 'Farmacia storica aperta 24h/24.', en: '24-hour historic pharmacy.' }, mapsUrl: 'https://maps.google.com/?q=Farmacia+Molteni+Firenze', phone: '+39055215472', sortOrder: 0 },
  ];
  await db.localPlaces.bulkAdd(places);

  await db.transactions.where('propertyId').equals(propertyId).delete();
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
  await db.transactions.bulkAdd(transactions);
}
