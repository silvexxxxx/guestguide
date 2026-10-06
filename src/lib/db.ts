import Dexie, { type Table } from 'dexie';
import type { Property, HouseRule, LocalPlace, Transaction } from '@/types';
import { loadDemoData } from './demoData';

class AppDatabase extends Dexie {
  properties!: Table<Property, string>;
  houseRules!: Table<HouseRule, string>;
  localPlaces!: Table<LocalPlace, string>;
  transactions!: Table<Transaction, string>;

  constructor() {
    super('VacationRentalApp');
    this.version(1).stores({
      properties:   'id',
      houseRules:   'id, propertyId',
      localPlaces:  'id, propertyId, category',
      transactions: 'id, propertyId, date, type',
    });
  }
}

export const db = new AppDatabase();

export async function getOrCreateProperty(): Promise<Property> {
  const all = await db.properties.toArray();
  if (all.length > 0) return all[0];
  const defaultId = crypto.randomUUID();
  await loadDemoData(defaultId);
  const created = await db.properties.get(defaultId);
  if (created) return created;
  const fallbackProperty: Property = {
    id: defaultId,
    name: 'Casa del Sole',
    description: '',
    hostName: '',
    hostPhone: '',
    hostPhotoUrl: '',
    wifiName: '',
    wifiPassword: '',
    checkinTime: '15:00',
    checkoutTime: '10:00',
    checkinInstructions: {},
    checkoutInstructions: {},
    welcomeText: {},
    address: '',
    city: '',
  };
  await db.properties.add(fallbackProperty);
  return fallbackProperty;
}

