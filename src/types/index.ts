import type { Lang, MultiLang } from '@/lib/i18n';

export type { Lang, MultiLang };

export interface Property {
  id: string;
  name: string;
  description: string;
  hostName: string;
  hostPhone: string;
  hostPhotoUrl: string;
  wifiName: string;
  wifiPassword: string;
  checkinTime: string;
  checkoutTime: string;
  checkinInstructions: Partial<MultiLang>;
  checkoutInstructions: Partial<MultiLang>;
  welcomeText: Partial<MultiLang>;
  address: string;
  city: string;
  adminPin?: string;
}

export interface HouseRule {
  id: string;
  propertyId: string;
  icon: string;
  label: Partial<MultiLang>;
  sortOrder: number;
}

export type PlaceCategory = 'restaurant' | 'bar' | 'supermarket' | 'attraction' | 'pharmacy';

export interface LocalPlace {
  id: string;
  propertyId: string;
  category: PlaceCategory;
  name: string;
  address: string;
  description: Partial<MultiLang>;
  mapsUrl: string;
  phone: string;
  sortOrder: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  propertyId: string;
  date: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  notes: string;
}

export const INCOME_CATEGORIES = [
  'booking', 'extra', 'cleaning_fee', 'deposit', 'other_income',
] as const;

export const EXPENSE_CATEGORIES = [
  'utilities', 'maintenance', 'cleaning', 'platform_fee', 'linen', 'supplies', 'taxes', 'other_expense',
] as const;

export const INCOME_CATEGORY_LABELS: Record<string, Partial<MultiLang>> = {
  booking:       { it: 'Prenotazione', en: 'Booking', fr: 'Réservation', es: 'Reserva', de: 'Buchung' },
  extra:         { it: 'Extra', en: 'Extra', fr: 'Extra', es: 'Extra', de: 'Extra' },
  cleaning_fee:  { it: 'Quota Pulizie', en: 'Cleaning Fee', fr: 'Frais de ménage', es: 'Tarifa limpieza', de: 'Reinigungsgebühr' },
  deposit:       { it: 'Deposito Cauzionale', en: 'Security Deposit', fr: 'Dépôt de garantie', es: 'Depósito', de: 'Kaution' },
  other_income:  { it: 'Altro (Entrata)', en: 'Other (Income)', fr: 'Autre (Revenu)', es: 'Otro (Ingreso)', de: 'Sonstiges (Einnahme)' },
};

export const EXPENSE_CATEGORY_LABELS: Record<string, Partial<MultiLang>> = {
  utilities:     { it: 'Utenze', en: 'Utilities', fr: 'Charges', es: 'Suministros', de: 'Nebenkosten' },
  maintenance:   { it: 'Manutenzione', en: 'Maintenance', fr: 'Maintenance', es: 'Mantenimiento', de: 'Wartung' },
  cleaning:      { it: 'Pulizie', en: 'Cleaning', fr: 'Ménage', es: 'Limpieza', de: 'Reinigung' },
  platform_fee:  { it: 'Commissioni Portale', en: 'Platform Fee', fr: 'Commission portail', es: 'Comisión portal', de: 'Plattformgebühr' },
  linen:         { it: 'Biancheria', en: 'Linen', fr: 'Linge', es: 'Ropa de cama', de: 'Wäsche' },
  supplies:      { it: 'Forniture', en: 'Supplies', fr: 'Fournitures', es: 'Suministros', de: 'Zubehör' },
  taxes:         { it: 'Tasse & Imposte', en: 'Taxes', fr: 'Taxes', es: 'Impuestos', de: 'Steuern' },
  other_expense: { it: 'Altro (Uscita)', en: 'Other (Expense)', fr: 'Autre (Dépense)', es: 'Otro (Gasto)', de: 'Sonstiges (Ausgabe)' },
};

export const PLACE_CATEGORY_ICONS: Record<PlaceCategory, string> = {
  restaurant: 'UtensilsCrossed',
  bar: 'Coffee',
  supermarket: 'ShoppingCart',
  attraction: 'Landmark',
  pharmacy: 'Cross',
};
