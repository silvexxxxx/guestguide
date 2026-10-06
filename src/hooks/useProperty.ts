import { useState, useEffect, useCallback } from 'react';
import { db, getOrCreateProperty } from '@/lib/db';
import type { Property, HouseRule, LocalPlace, Transaction } from '@/types';

export function useProperty() {
  const [property, setProperty] = useState<Property | null>(null);
  const [houseRules, setHouseRules] = useState<HouseRule[]>([]);
  const [localPlaces, setLocalPlaces] = useState<LocalPlace[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const p = await getOrCreateProperty();
    setProperty(p);
    const rules = await db.houseRules.where('propertyId').equals(p.id).sortBy('sortOrder');
    setHouseRules(rules);
    const places = await db.localPlaces.where('propertyId').equals(p.id).sortBy('sortOrder');
    setLocalPlaces(places);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveProperty = useCallback(async (updates: Partial<Property>) => {
    if (!property) return;
    const updated = { ...property, ...updates };
    await db.properties.put(updated);
    setProperty(updated);
  }, [property]);

  const addRule = useCallback(async (rule: Omit<HouseRule, 'id' | 'propertyId'>) => {
    if (!property) return;
    const newRule: HouseRule = { ...rule, id: crypto.randomUUID(), propertyId: property.id };
    await db.houseRules.add(newRule);
    setHouseRules(prev => [...prev, newRule].sort((a, b) => a.sortOrder - b.sortOrder));
  }, [property]);

  const updateRule = useCallback(async (id: string, updates: Partial<HouseRule>) => {
    await db.houseRules.update(id, updates);
    setHouseRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteRule = useCallback(async (id: string) => {
    await db.houseRules.delete(id);
    setHouseRules(prev => prev.filter(r => r.id !== id));
  }, []);

  const addPlace = useCallback(async (place: Omit<LocalPlace, 'id' | 'propertyId'>) => {
    if (!property) return;
    const newPlace: LocalPlace = { ...place, id: crypto.randomUUID(), propertyId: property.id };
    await db.localPlaces.add(newPlace);
    setLocalPlaces(prev => [...prev, newPlace]);
  }, [property]);

  const updatePlace = useCallback(async (id: string, updates: Partial<LocalPlace>) => {
    await db.localPlaces.update(id, updates);
    setLocalPlaces(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePlace = useCallback(async (id: string) => {
    await db.localPlaces.delete(id);
    setLocalPlaces(prev => prev.filter(p => p.id !== id));
  }, []);

  return { property, houseRules, localPlaces, loading, saveProperty, addRule, updateRule, deleteRule, addPlace, updatePlace, deletePlace, reload: load };
}

export function useTransactions(propertyId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!propertyId) return;
    const txs = await db.transactions.where('propertyId').equals(propertyId).reverse().sortBy('date');
    setTransactions(txs);
    setLoading(false);
  }, [propertyId]);

  useEffect(() => { load(); }, [load]);

  const addTransaction = useCallback(async (tx: Omit<Transaction, 'id' | 'propertyId'>) => {
    if (!propertyId) return;
    const newTx: Transaction = { ...tx, id: crypto.randomUUID(), propertyId };
    await db.transactions.add(newTx);
    setTransactions(prev => [newTx, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  }, [propertyId]);

  const deleteTransaction = useCallback(async (id: string) => {
    await db.transactions.delete(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  return { transactions, loading, addTransaction, deleteTransaction, reload: load };
}
