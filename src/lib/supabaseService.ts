import { supabase, isSupabaseConfigured } from './supabase';
import type { Property, HouseRule, LocalPlace } from '@/types';
import { getDefaultPropertyData, getDefaultRulesData, getDefaultPlacesData } from './demoData';

// Mappa riga Supabase in oggetto Property
export function mapSupabaseToProperty(row: any): Property {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    name: row.name || 'La Mia Casa Vacanze',
    description: row.description || '',
    hostName: row.host_name || '',
    hostPhone: row.host_phone || '',
    hostPhotoUrl: row.host_photo_url || '',
    wifiName: row.wifi_name || '',
    wifiPassword: row.wifi_password || '',
    checkinTime: row.checkin_time || '15:00',
    checkoutTime: row.checkout_time || '10:00',
    checkinInstructions: row.checkin_instructions || {},
    checkoutInstructions: row.checkout_instructions || {},
    welcomeText: row.welcome_text || {},
    address: row.address || '',
    city: row.city || '',
    adminPin: row.admin_pin || '1234',
    isPublic: row.is_public ?? true,
  };
}

// Mappa oggetto Property per inserimento in Supabase
export function mapPropertyToSupabase(prop: Partial<Property>, userId?: string) {
  const payload: any = {};
  if (prop.name !== undefined) payload.name = prop.name;
  if (prop.description !== undefined) payload.description = prop.description;
  if (prop.hostName !== undefined) payload.host_name = prop.hostName;
  if (prop.hostPhone !== undefined) payload.host_phone = prop.hostPhone;
  if (prop.hostPhotoUrl !== undefined) payload.host_photo_url = prop.hostPhotoUrl;
  if (prop.wifiName !== undefined) payload.wifi_name = prop.wifiName;
  if (prop.wifiPassword !== undefined) payload.wifi_password = prop.wifiPassword;
  if (prop.checkinTime !== undefined) payload.checkin_time = prop.checkinTime;
  if (prop.checkoutTime !== undefined) payload.checkout_time = prop.checkoutTime;
  if (prop.checkinInstructions !== undefined) payload.checkin_instructions = prop.checkinInstructions;
  if (prop.checkoutInstructions !== undefined) payload.checkout_instructions = prop.checkoutInstructions;
  if (prop.welcomeText !== undefined) payload.welcome_text = prop.welcomeText;
  if (prop.address !== undefined) payload.address = prop.address;
  if (prop.city !== undefined) payload.city = prop.city;
  if (prop.adminPin !== undefined) payload.admin_pin = prop.adminPin;
  if (prop.isPublic !== undefined) payload.is_public = prop.isPublic;
  if (userId) payload.user_id = userId;
  payload.updated_at = new Date().toISOString();
  return payload;
}

// Genera uno slug pulito
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${base}-${Math.random().toString(36).substring(2, 7)}`;
}

// Inizializza prima proprietà su Supabase per un nuovo Host
export async function seedInitialPropertyForUser(userId: string): Promise<Property | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const propertyId = crypto.randomUUID();
    const defaultData = getDefaultPropertyData(propertyId);
    const slug = generateSlug(defaultData.name);

    const { data: propRow, error: propErr } = await supabase
      .from('properties')
      .insert({
        id: propertyId,
        user_id: userId,
        slug: slug,
        name: defaultData.name,
        description: defaultData.description,
        host_name: defaultData.hostName,
        host_phone: defaultData.hostPhone,
        host_photo_url: defaultData.hostPhotoUrl,
        wifi_name: defaultData.wifiName,
        wifi_password: defaultData.wifiPassword,
        checkin_time: defaultData.checkinTime,
        checkout_time: defaultData.checkoutTime,
        checkin_instructions: defaultData.checkinInstructions,
        checkout_instructions: defaultData.checkoutInstructions,
        welcome_text: defaultData.welcomeText,
        address: defaultData.address,
        city: defaultData.city,
        admin_pin: defaultData.adminPin || '1234',
        is_public: true,
      })
      .select()
      .single();

    if (propErr || !propRow) {
      console.error('Errore seed proprietà:', propErr);
      return null;
    }

    // Inserisci regole demo
    const defaultRules = getDefaultRulesData(propertyId);
    const rulesToInsert = defaultRules.map((rule: HouseRule, idx: number) => ({
      id: crypto.randomUUID(),
      property_id: propertyId,
      icon: rule.icon,
      label: rule.label,
      sort_order: idx,
    }));
    await supabase.from('house_rules').insert(rulesToInsert);

    // Inserisci luoghi demo
    const defaultPlaces = getDefaultPlacesData(propertyId);
    const placesToInsert = defaultPlaces.map((place: LocalPlace, idx: number) => ({
      id: crypto.randomUUID(),
      property_id: propertyId,
      category: place.category,
      name: place.name,
      address: place.address,
      description: place.description,
      maps_url: place.mapsUrl,
      phone: place.phone,
      sort_order: idx,
    }));
    await supabase.from('local_places').insert(placesToInsert);

    return mapSupabaseToProperty(propRow);
  } catch (err) {
    console.error('Eccezione durante seed proprietà:', err);
    return null;
  }
}
