"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { Upload, Plus, Trash2, X, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

type Transaction = {
  id: string;
  date: string;
  category: string;
  tag: string;
  title: string;
  currency: string;
  amount: number;
};

const CURRENCIES = ["USD", "NZD", "BRL", "EUR", "GBP", "AUD"];
const CATEGORIES = ["All", "Income", "Expense"];

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function TxModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Transaction>;
  onSave: (data: Omit<Transaction, "id">) => void;
  onClose: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    date: initial?.date?.slice(0, 10) ?? today,
    category: initial?.category ?? "Expense",
    tag: initial?.tag ?? "",
    title: initial?.title ?? "",
    currency: initial?.currency ?? "USD",
    amount: initial?.amount != null ? String(Math.abs(initial.amount)) : "",
  });

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (isNaN(amt)) return;
    onSave({
      date: form.date,
      category: form.category,
      tag: form.tag.trim(),
      title: form.title.trim(),
      currency: form.currency,
      amount: form.category === "Income" ? Math.abs(amt) : -Math.abs(amt),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-zinc-200">
            {initial?.id ? "Edit Transaction" : "Add Transaction"}
          </CardTitle>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Category</Label>
                <select
                  value={form.category}
                  onChange={set("category")}
                  className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-md px-3 py-2"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Description</Label>
              <Input
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Salary, Rent…"
                className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Tag</Label>
                <Input
                  value={form.tag}
                  onChange={set("tag")}
                  placeholder="e.g. salary, food"
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Currency</Label>
                <select
                  value={form.currency}
                  onChange={set("currency")}
                  className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-md px-3 py-2"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={set("amount")}
                placeholder="0.00"
                className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── CSV Import Preview ────────────────────────────────────────────────────────

function CsvImport({ onImported }: { onImported: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (!result.data.length) {
          setError("Empty CSV");
          return;
        }
        setRows(result.data as any[]);
      },
    });
  };

  const handleImport = async () => {
    if (!rows.length) return;
    setLoading(true);
    const payload = rows.map((r: any) => ({
      date: r.date,
      category: r.category || undefined,
      tag: r.tag || "",
      title: r.title || r.description || "",
      currency: r.currency || "USD",
      amount: parseFloat(r.amount) || 0,
    }));
    const res = await fetch("/api/finance/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      setRows([]);
      if (fileRef.current) fileRef.current.value = "";
      onImported();
    } else {
      setError("Import failed");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md cursor-pointer text-sm text-zinc-300 transition-colors">
          <Upload className="h-4 w-4" />
          Choose CSV
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {rows.length > 0 && (
          <Button
            onClick={handleImport}
            disabled={loading}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading ? "Importing…" : `Import ${rows.length} rows`}
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-zinc-700 max-h-40">
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-zinc-800">
                {Object.keys(rows[0]).map((k) => (
                  <th
                    key={k}
                    className="px-2 py-1 text-left text-zinc-400 font-medium"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  {Object.values(row).map((v: any, j) => (
                    <td key={j} className="px-2 py-1 text-zinc-300">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length > 5 && (
                <tr>
                  <td
                    colSpan={Object.keys(rows[0]).length}
                    className="px-2 py-1 text-zinc-500 italic"
                  >
                    … {rows.length - 5} more rows
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-zinc-500">
        Expected columns:{" "}
        <code className="text-zinc-400">
          date, category, tag, title, currency, amount
        </code>
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTag, setFilterTag] = useState("");
  const [filterCurrency, setFilterCurrency] = useState("All");
  const [filterMonth, setFilterMonth] = useState("");

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCategory !== "All") params.set("category", filterCategory);
    if (filterTag) params.set("tag", filterTag);
    if (filterCurrency !== "All") params.set("currency", filterCurrency);
    if (filterMonth) params.set("month", filterMonth);
    const res = await fetch(`/api/finance/transactions?${params}`);
    const data = await res.json();
    setTransactions(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filterCategory, filterTag, filterCurrency, filterMonth]);

  useEffect(() => {
    fetchTxs();
  }, [fetchTxs]);

  const handleAdd = async (data: Omit<Transaction, "id">) => {
    await fetch("/api/finance/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowAdd(false);
    fetchTxs();
  };

  const handleEdit = async (data: Omit<Transaction, "id">) => {
    if (!editTx) return;
    await fetch(`/api/finance/transactions/${editTx.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditTx(null);
    fetchTxs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/finance/transactions/${id}`, { method: "DELETE" });
    fetchTxs();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {transactions.length} records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowImport((v) => !v)}
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button
            onClick={() => setShowAdd(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* CSV Import panel */}
      {showImport && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Import CSV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CsvImport
              onImported={() => {
                setShowImport(false);
                fetchTxs();
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-md px-3 py-1.5 min-w-28"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Tag</label>
              <Input
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                placeholder="Filter by tag"
                className="bg-zinc-800 border-zinc-700 text-white text-sm py-1.5 h-auto min-w-36"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Currency</label>
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-md px-3 py-1.5 min-w-24"
              >
                <option value="All">All</option>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Month</label>
              <Input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-sm py-1.5 h-auto"
              />
            </div>
            {(filterCategory !== "All" ||
              filterTag ||
              filterCurrency !== "All" ||
              filterMonth) && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-transparent">Reset</label>
                <Button
                  onClick={() => {
                    setFilterCategory("All");
                    setFilterTag("");
                    setFilterCurrency("All");
                    setFilterMonth("");
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white py-1.5 h-auto"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">
                    Tag
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">
                    Description
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">
                    Currency
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-400 font-medium">
                    Amount
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-zinc-400 text-xs tabular-nums">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs px-2 py-0 ${
                            tx.category === "Income"
                              ? "bg-emerald-900/50 text-emerald-400 border-emerald-700"
                              : "bg-red-900/50 text-red-400 border-red-700"
                          }`}
                        >
                          {tx.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">
                        {tx.tag || "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-200">{tx.title}</td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">
                        {tx.currency}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-medium tabular-nums ${
                          tx.category === "Income"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.category === "Income" ? "+" : "-"}
                        {formatCurrency(Math.abs(tx.amount))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setEditTx(tx)}
                            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showAdd && (
        <TxModal onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editTx && (
        <TxModal
          initial={editTx}
          onSave={handleEdit}
          onClose={() => setEditTx(null)}
        />
      )}
    </div>
  );
}
