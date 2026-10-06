import { useState, useMemo } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Download, X } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { Transaction } from '@/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS } from '@/types';
import { ml } from '@/lib/i18n';

interface Props {
  transactions: Transaction[];
  onAdd: (tx: Omit<Transaction, 'id' | 'propertyId'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyTx = (): Omit<Transaction, 'id' | 'propertyId'> => ({
  date: new Date().toISOString().slice(0, 10),
  type: 'income',
  category: 'booking',
  description: '',
  amount: 0,
  notes: '',
});

const MONTHS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function KPICard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className={`rounded-2xl p-5 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-80">{label}</p>
        <Icon className="w-5 h-5 opacity-70" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export function FinanceDashboard({ transactions, onAdd, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTx());
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);
  const netProfit = totalIncome - totalExpense;

  const chartData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const entry = map.get(key) ?? { income: 0, expense: 0 };
      if (t.type === 'income') entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(key, entry);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, val]) => {
        const [, m] = key.split('-');
        return { name: MONTHS_IT[parseInt(m) - 1], ...val };
      });
  }, [transactions]);

  const handleAdd = async () => {
    if (!form.description || form.amount <= 0) return;
    await onAdd(form);
    setForm(emptyTx());
    setShowForm(false);
  };

  const exportCSV = () => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrizione', 'Importo (€)', 'Note'];
    const rows = transactions.map(t => [
      t.date,
      t.type === 'income' ? 'Entrata' : 'Uscita',
      t.type === 'income'
        ? (ml(INCOME_CATEGORY_LABELS[t.category], 'it') || t.category)
        : (ml(EXPENSE_CATEGORY_LABELS[t.category], 'it') || t.category),
      t.description,
      t.amount.toFixed(2),
      t.notes,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transazioni_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryLabels = form.type === 'income' ? INCOME_CATEGORY_LABELS : EXPENSE_CATEGORY_LABELS;
  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  const fmt = (v: number) => `€ ${v.toFixed(2).replace('.', ',')}`;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Entrate Totali" value={fmt(totalIncome)} icon={TrendingUp} color="bg-green-500 text-white" />
        <KPICard label="Spese Totali" value={fmt(totalExpense)} icon={TrendingDown} color="bg-red-400 text-white" />
        <KPICard label="Guadagno Netto" value={fmt(netProfit)} icon={DollarSign} color={netProfit >= 0 ? 'bg-amber-500 text-white' : 'bg-gray-600 text-white'} />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Andamento Mensile</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}€`} />
              <Tooltip formatter={(v: number) => [`€ ${v.toFixed(2)}`, '']} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Entrate" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Uscite" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === f ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f === 'all' ? 'Tutte' : f === 'income' ? 'Entrate' : 'Uscite'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg px-2.5 py-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Aggiungi
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-800">Nuova Transazione</p>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-amber-600" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tipo</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white"
                value={form.type}
                onChange={e => {
                  const type = e.target.value as 'income' | 'expense';
                  setForm(f => ({ ...f, type, category: type === 'income' ? 'booking' : 'utilities' }));
                }}
              >
                <option value="income">Entrata</option>
                <option value="expense">Uscita</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Data</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Categoria</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{ml(categoryLabels[c], 'it') || c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Importo (€)</label>
              <input
                type="number" min="0" step="0.01"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                value={form.amount || ''}
                onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Descrizione *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Es: Prenotazione Airbnb 15-18 Ott..."
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Note (facoltative)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!form.description || form.amount <= 0}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-xl transition-colors text-sm disabled:opacity-50"
          >
            Salva Transazione
          </button>
        </div>
      )}

      {/* Transactions list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">Nessuna transazione registrata.</p>
        )}
        {filtered.map(tx => (
          <div key={tx.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-gray-200 transition-colors">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
              <p className="text-xs text-gray-400">{tx.date} · {tx.type === 'income' ? (ml(INCOME_CATEGORY_LABELS[tx.category], 'it') || tx.category) : (ml(EXPENSE_CATEGORY_LABELS[tx.category], 'it') || tx.category)}</p>
            </div>
            <span className={`font-bold text-sm flex-shrink-0 ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
              {tx.type === 'income' ? '+' : '-'}€{tx.amount.toFixed(2)}
            </span>
            <button onClick={() => onDelete(tx.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
