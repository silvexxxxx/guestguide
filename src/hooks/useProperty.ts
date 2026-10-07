import { useState, useEffect, useCallback } from 'react';
import { db, getOrCreateProperty } from '@/lib/db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { mapSupabaseToProperty, mapPropertyToSupabase, seedInitialPropertyForUser } from '@/lib/supabaseService';
import type { Property, HouseRule, LocalPlace, Transaction } from '@/types';

export function useProperty() {
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [houseRules, setHouseRules] = useState<HouseRule[]>([]);
  const [localPlaces, setLocalPlaces] = useState<LocalPlace[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    // 1. Se l'utente è loggato con Supabase, carichiamo i dati dal Cloud
    if (user && isSupabaseConfigured) {
      try {
        // Cerca proprietà dell'host
        const { data: propRows, error: propErr } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        let currentProp: Property | null = null;

        if (!propErr && propRows && propRows.length > 0) {
          currentProp = mapSupabaseToProperty(propRows[0]);
        } else {
          // Se non ha ancora una proprietà su Supabase, creiamo la prima con i dati guida Carloforte
          currentProp = await seedInitialPropertyForUser(user.id);
        }

        if (currentProp) {
          setProperty(currentProp);
          // Aggiorna anche Dexie per cache offline
          await db.properties.put(currentProp);

          // Carica Regole dal Cloud
          const { data: rulesData } = await supabase
            .from('house_rules')
            .select('*')
            .eq('property_id', currentProp.id)
            .order('sort_order', { ascending: true });

          if (rulesData) {
            const mappedRules: HouseRule[] = rulesData.map((r) => ({
              id: r.id,
              propertyId: r.property_id,
              icon: r.icon,
              label: r.label || {},
              sortOrder: r.sort_order ?? 0,
            }));
            setHouseRules(mappedRules);
            // Salva in Dexie
            await db.houseRules.bulkPut(mappedRules);
          }

          // Carica Luoghi dal Cloud
          const { data: placesData } = await supabase
            .from('local_places')
            .select('*')
            .eq('property_id', currentProp.id)
            .order('sort_order', { ascending: true });

          if (placesData) {
            const mappedPlaces: LocalPlace[] = placesData.map((p) => ({
              id: p.id,
              propertyId: p.property_id,
              category: p.category,
              name: p.name,
              address: p.address || '',
              description: p.description || {},
              mapsUrl: p.maps_url || '',
              phone: p.phone || '',
              sortOrder: p.sort_order ?? 0,
            }));
            setLocalPlaces(mappedPlaces);
            // Salva in Dexie
            await db.localPlaces.bulkPut(mappedPlaces);
          }

          setLoading(false);
          return;
        }
      } catch (cloudErr) {
        console.warn('Errore connessione Supabase, fallback su cache locale:', cloudErr);
      }
    }

    // 2. Fallback su Dexie IndexedDB (modalità Guest o offline)
    try {
      const p = await getOrCreateProperty();
      setProperty(p);
      const rules = await db.houseRules.where('propertyId').equals(p.id).sortBy('sortOrder');
      setHouseRules(rules);
      const places = await db.localPlaces.where('propertyId').equals(p.id).sortBy('sortOrder');
      setLocalPlaces(places);
    } catch (dbErr) {
      console.error('Errore caricamento Dexie:', dbErr);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const saveProperty = useCallback(
    async (updates: Partial<Property>) => {
      if (!property) return;
      const updated = { ...property, ...updates };

      // Se autenticato su Supabase, aggiorna cloud
      if (user && isSupabaseConfigured) {
        try {
          const payload = mapPropertyToSupabase(updates);
          await supabase.from('properties').update(payload).eq('id', property.id);
        } catch (err) {
          console.error('Errore salvataggio proprietà su Supabase:', err);
        }
      }

      // Aggiorna sempre anche Dexie
      await db.properties.put(updated);
      setProperty(updated);
    },
    [property, user]
  );

  const addRule = useCallback(
    async (rule: Omit<HouseRule, 'id' | 'propertyId'>) => {
      if (!property) return;
      const newRule: HouseRule = { ...rule, id: crypto.randomUUID(), propertyId: property.id };

      if (user && isSupabaseConfigured) {
        try {
          await supabase.from('house_rules').insert({
            id: newRule.id,
            property_id: property.id,
            icon: newRule.icon,
            label: newRule.label,
            sort_order: newRule.sortOrder,
          });
        } catch (err) {
          console.error('Errore inserimento regola su Supabase:', err);
        }
      }

      await db.houseRules.add(newRule);
      setHouseRules((prev) => [...prev, newRule].sort((a, b) => a.sortOrder - b.sortOrder));
    },
    [property, user]
  );

  const updateRule = useCallback(
    async (id: string, updates: Partial<HouseRule>) => {
      if (user && isSupabaseConfigured) {
        try {
          const payload: any = {};
          if (updates.icon) payload.icon = updates.icon;
          if (updates.label) payload.label = updates.label;
          if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;
          await supabase.from('house_rules').update(payload).eq('id', id);
        } catch (err) {
          console.error('Errore aggiornamento regola su Supabase:', err);
        }
      }

      await db.houseRules.update(id, updates);
      setHouseRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    },
    [user]
  );

  const deleteRule = useCallback(
    async (id: string) => {
      if (user && isSupabaseConfigured) {
        try {
          await supabase.from('house_rules').delete().eq('id', id);
        } catch (err) {
          console.error('Errore cancellazione regola su Supabase:', err);
        }
      }

      await db.houseRules.delete(id);
      setHouseRules((prev) => prev.filter((r) => r.id !== id));
    },
    [user]
  );

  const addPlace = useCallback(
    async (place: Omit<LocalPlace, 'id' | 'propertyId'>) => {
      if (!property) return;
      const newPlace: LocalPlace = { ...place, id: crypto.randomUUID(), propertyId: property.id };

      if (user && isSupabaseConfigured) {
        try {
          await supabase.from('local_places').insert({
            id: newPlace.id,
            property_id: property.id,
            category: newPlace.category,
            name: newPlace.name,
            address: newPlace.address,
            description: newPlace.description,
            maps_url: newPlace.mapsUrl,
            phone: newPlace.phone,
            sort_order: newPlace.sortOrder,
          });
        } catch (err) {
          console.error('Errore inserimento luogo su Supabase:', err);
        }
      }

      await db.localPlaces.add(newPlace);
      setLocalPlaces((prev) => [...prev, newPlace]);
    },
    [property, user]
  );

  const updatePlace = useCallback(
    async (id: string, updates: Partial<LocalPlace>) => {
      if (user && isSupabaseConfigured) {
        try {
          const payload: any = {};
          if (updates.category) payload.category = updates.category;
          if (updates.name) payload.name = updates.name;
          if (updates.address) payload.address = updates.address;
          if (updates.description) payload.description = updates.description;
          if (updates.mapsUrl) payload.maps_url = updates.mapsUrl;
          if (updates.phone) payload.phone = updates.phone;
          if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;
          await supabase.from('local_places').update(payload).eq('id', id);
        } catch (err) {
          console.error('Errore aggiornamento luogo su Supabase:', err);
        }
      }

      await db.localPlaces.update(id, updates);
      setLocalPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    },
    [user]
  );

  const deletePlace = useCallback(
    async (id: string) => {
      if (user && isSupabaseConfigured) {
        try {
          await supabase.from('local_places').delete().eq('id', id);
        } catch (err) {
          console.error('Errore cancellazione luogo su Supabase:', err);
        }
      }

      await db.localPlaces.delete(id);
      setLocalPlaces((prev) => prev.filter((p) => p.id !== id));
    },
    [user]
  );

  return {
    property,
    houseRules,
    localPlaces,
    loading,
    saveProperty,
    addRule,
    updateRule,
    deleteRule,
    addPlace,
    updatePlace,
    deletePlace,
    reload: load,
  };
}

export function useTransactions(propertyId: string | undefined) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);

    if (user && isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('property_id', propertyId)
          .order('date', { ascending: false });

        if (data) {
          const mapped: Transaction[] = data.map((t) => ({
            id: t.id,
            propertyId: t.property_id,
            date: t.date,
            type: t.type,
            category: t.category,
            description: t.description,
            amount: Number(t.amount),
            notes: t.notes || '',
          }));
          setTransactions(mapped);
          await db.transactions.bulkPut(mapped);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Errore transazioni Supabase:', err);
      }
    }

    const txs = await db.transactions.where('propertyId').equals(propertyId).reverse().sortBy('date');
    setTransactions(txs);
    setLoading(false);
  }, [propertyId, user]);

  useEffect(() => {
    load();
  }, [load]);

  const addTransaction = useCallback(
    async (tx: Omit<Transaction, 'id' | 'propertyId'>) => {
      if (!propertyId) return;
      const newTx: Transaction = { ...tx, id: crypto.randomUUID(), propertyId };

      if (user && isSupabaseConfigured) {
        try {
          await supabase.from('transactions').insert({
            id: newTx.id,
            property_id: propertyId,
            date: newTx.date,
            type: newTx.type,
            category: newTx.category,
            description: newTx.description,
            amount: newTx.amount,
            notes: newTx.notes,
          });
        } catch (err) {
          console.error('Errore inserimento transazione Supabase:', err);
        }
      }

      await db.transactions.add(newTx);
      setTransactions((prev) => [newTx, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    },
    [propertyId, user]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (user && isSupabaseConfigured) {
        try {
          await supabase.from('transactions').delete().eq('id', id);
        } catch (err) {
          console.error('Errore eliminazione transazione Supabase:', err);
        }
      }

      await db.transactions.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
    [user]
  );

  return { transactions, loading, addTransaction, deleteTransaction, reload: load };
}
