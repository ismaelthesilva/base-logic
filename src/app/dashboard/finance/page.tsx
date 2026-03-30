"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Papa from "papaparse";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PlusCircle,
  Upload,
  Trash2,
  Pencil,
  X,
  CheckCircle,
  AlertCircle,
  MinusCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

type Share = {
  id: string;
  symbol: string;
  name: string;
  receitaLiquida?: number | null;
  lucroLiquido?: number | null;
  roe?: number | null;
  margemLiquida?: number | null;
  debitEbitda?: number | null;
  dividendo?: number | null;
  notes?: string | null;
};

type Transaction = {
  id: string;
  date: string;
  tag: string;
  title: string;
  currency: string;
  amount: number;
};

type ShareForm = Omit<Share, "id">;

const emptyShare: ShareForm = {
  symbol: "",
  name: "",
  receitaLiquida: null,
  lucroLiquido: null,
  roe: null,
  margemLiquida: null,
  debitEbitda: null,
  dividendo: null,
  notes: null,
};

type TxForm = {
  date: string;
  tag: string;
  title: string;
  currency: string;
  amount: string;
};

const emptyTx: TxForm = {
  date: new Date().toISOString().slice(0, 10),
  tag: "",
  title: "",
  currency: "USD",
  amount: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v?: number | null) {
  return formatNumber(v, { maximumFractionDigits: 2 });
}

function fmtPct(v?: number | null) {
  return formatPercent(v);
}

function fmtAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  } catch {
    return `${currency} ${Math.abs(amount).toFixed(2)}`;
  }
}

function roeColor(roe?: number | null) {
  if (roe == null) return "text-muted-foreground";
  if (roe >= 15) return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (roe >= 8) return "text-yellow-600 dark:text-yellow-400 font-semibold";
  return "text-red-600 dark:text-red-400 font-semibold";
}

function debtColor(d?: number | null) {
  if (d == null) return "text-muted-foreground";
  if (d <= 2) return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (d <= 4) return "text-yellow-600 dark:text-yellow-400 font-semibold";
  return "text-red-600 dark:text-red-400 font-semibold";
}

function divColor(div?: number | null) {
  if (div == null) return "text-muted-foreground";
  if (div >= 5) return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (div >= 2) return "text-blue-600 dark:text-blue-400 font-semibold";
  return "text-muted-foreground";
}

function parseNumericField(val: string): number | null {
  if (!val || val.trim() === "") return null;
  const n = parseFloat(val.replace(",", "."));
  return isFinite(n) ? n : null;
}

// ─── Share Score Badge ─────────────────────────────────────────────────────────

function ShareScore({ share }: { share: Share }) {
  let score = 0;
  if ((share.roe ?? 0) >= 15) score++;
  if ((share.margemLiquida ?? 0) >= 10) score++;
  if (share.debitEbitda != null && share.debitEbitda <= 3) score++;
  if ((share.dividendo ?? 0) >= 2) score++;

  const label = score >= 3 ? "Strong" : score >= 2 ? "Neutral" : "Weak";
  const cls =
    score >= 3
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
      : score >= 2
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {score >= 3 ? (
        <CheckCircle className="h-3 w-3" />
      ) : score >= 2 ? (
        <MinusCircle className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      {label} ({score}/4)
    </span>
  );
}

// ─── Share Modal ───────────────────────────────────────────────────────────────

function ShareModal({
  initial,
  onSave,
  onClose,
}: {
  initial: ShareForm & { id?: string };
  onSave: (data: ShareForm, id?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ShareForm & { id?: string }>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof ShareForm, val: string) {
    if (
      [
        "receitaLiquida",
        "lucroLiquido",
        "roe",
        "margemLiquida",
        "debitEbitda",
        "dividendo",
      ].includes(key)
    ) {
      setForm((f) => ({ ...f, [key]: val === "" ? null : val }));
    } else {
      setForm((f) => ({ ...f, [key]: val }));
    }
  }

  function getStr(key: keyof ShareForm): string {
    const v = form[key];
    return v == null ? "" : String(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.symbol.trim() || !form.name.trim()) {
      setError("Symbol and Name are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(
        {
          symbol: form.symbol,
          name: form.name,
          receitaLiquida: parseNumericField(getStr("receitaLiquida")),
          lucroLiquido: parseNumericField(getStr("lucroLiquido")),
          roe: parseNumericField(getStr("roe")),
          margemLiquida: parseNumericField(getStr("margemLiquida")),
          debitEbitda: parseNumericField(getStr("debitEbitda")),
          dividendo: parseNumericField(getStr("dividendo")),
          notes: form.notes || null,
        },
        form.id
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setSaving(false);
    }
  }

  const numField = (label: string, key: keyof ShareForm, suffix = "") => (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">
        {label}
        {suffix && (
          <span className="ml-1 text-muted-foreground/60">{suffix}</span>
        )}
      </Label>
      <Input
        type="number"
        step="any"
        placeholder="—"
        value={getStr(key)}
        onChange={(e) => set(key, e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40">
          <h2 className="font-bold text-lg">
            {form.id ? "Edit Share" : "Add Share"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Symbol *</Label>
              <Input
                placeholder="AAPL"
                value={form.symbol}
                onChange={(e) => set("symbol", e.target.value.toUpperCase())}
                className="h-9 font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Name *</Label>
              <Input
                placeholder="Apple Inc."
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {numField("Receita L.", "receitaLiquida", "M")}
            {numField("Lucro L.", "lucroLiquido", "M")}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {numField("ROE", "roe", "%")}
            {numField("Margem L.", "margemLiquida", "%")}
            {numField("Debt/EBITDA", "debitEbitda", "×")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {numField("Dividendo", "dividendo", "%")}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Input
                placeholder="Optional notes..."
                value={form.notes || ""}
                onChange={(e) => set("notes", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              {saving ? "Saving…" : form.id ? "Update" : "Add Share"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Transaction Modal ─────────────────────────────────────────────────────────

function TxModal({
  onSave,
  onClose,
}: {
  onSave: (data: TxForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<TxForm>(emptyTx);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof TxForm, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.title.trim() || form.amount === "") {
      setError("Date, Description and Amount are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40">
          <h2 className="font-bold text-lg">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">TAG</Label>
              <Input
                placeholder="Salary, Food, Bills…"
                value={form.tag}
                onChange={(e) => set("tag", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Description *
            </Label>
            <Input
              placeholder="Monthly salary, groceries…"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Currency</Label>
              <Input
                placeholder="USD"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value.toUpperCase())}
                className="h-9 font-mono"
                maxLength={5}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Amount *{" "}
                <span className="text-muted-foreground/60">
                  (negative = expense)
                </span>
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="-150 or 5000"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
            >
              {saving ? "Saving…" : "Add Transaction"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FinanceDashboardPage() {
  const [tab, setTab] = useState<"shares" | "transactions">("shares");

  // Shares state
  const [shares, setShares] = useState<Share[]>([]);
  const [sharesLoading, setSharesLoading] = useState(true);
  const [shareModal, setShareModal] = useState<
    (ShareForm & { id?: string }) | null
  >(null);
  const [deletingShareId, setDeletingShareId] = useState<string | null>(null);
  const [shareSort, setShareSort] = useState<{
    key: keyof Share;
    dir: "asc" | "desc";
  }>({ key: "symbol", dir: "asc" });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txModal, setTxModal] = useState(false);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);
  const [txTagFilter, setTxTagFilter] = useState("");
  const [txCurrencyFilter, setTxCurrencyFilter] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data
  const loadShares = useCallback(async () => {
    setSharesLoading(true);
    const res = await fetch("/api/finance/shares");
    setShares(await res.json());
    setSharesLoading(false);
  }, []);

  const loadTransactions = useCallback(async () => {
    setTxLoading(true);
    const res = await fetch("/api/finance/transactions");
    setTransactions(await res.json());
    setTxLoading(false);
  }, []);

  useEffect(() => {
    loadShares();
  }, [loadShares]);
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // ── Shares CRUD ──

  async function saveShare(data: ShareForm, id?: string) {
    if (id) {
      const res = await fetch(`/api/finance/shares/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update share");
    } else {
      const res = await fetch("/api/finance/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to create share");
      }
    }
    setShareModal(null);
    loadShares();
  }

  async function deleteShare(id: string) {
    setDeletingShareId(id);
    await fetch(`/api/finance/shares/${id}`, { method: "DELETE" });
    setDeletingShareId(null);
    loadShares();
  }

  // ── Transactions CRUD ──

  async function saveTx(form: TxForm) {
    const res = await fetch("/api/finance/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        tag: form.tag,
        title: form.title,
        currency: form.currency || "USD",
        amount: parseFloat(form.amount),
      }),
    });
    if (!res.ok) throw new Error("Failed to save transaction");
    setTxModal(false);
    loadTransactions();
  }

  async function deleteTx(id: string) {
    setDeletingTxId(id);
    await fetch(`/api/finance/transactions/${id}`, { method: "DELETE" });
    setDeletingTxId(null);
    loadTransactions();
  }

  // ── CSV Upload ──

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus("Parsing…");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const rows = (result.data as Record<string, string>[]).map((row) => ({
          date: row["Date"] || row["date"] || "",
          tag: row["TAG"] || row["tag"] || "Other",
          title:
            row["Title"] ||
            row["title"] ||
            row["Description"] ||
            row["description"] ||
            "",
          currency:
            row["CY"] ||
            row["cy"] ||
            row["Currency"] ||
            row["currency"] ||
            "USD",
          amount: parseFloat(
            (row["$"] || row["amount"] || "0").replace(",", ".")
          ),
        }));

        const valid = rows.filter(
          (r) => r.date && r.title && isFinite(r.amount)
        );

        if (!valid.length) {
          setUploadStatus("No valid rows found. Check CSV format.");
          return;
        }

        try {
          const res = await fetch("/api/finance/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(valid),
          });
          const json = await res.json();
          setUploadStatus(`✓ ${json.count} transactions imported`);
          loadTransactions();
        } catch {
          setUploadStatus("Upload failed.");
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: () => setUploadStatus("CSV parse error."),
    });
  }

  // ── Memos ──

  const sortedShares = useMemo(() => {
    return [...shares].sort((a, b) => {
      const av = a[shareSort.key];
      const bv = b[shareSort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const res = av < bv ? -1 : av > bv ? 1 : 0;
      return shareSort.dir === "asc" ? res : -res;
    });
  }, [shares, shareSort]);

  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      if (
        txTagFilter &&
        !t.tag.toLowerCase().includes(txTagFilter.toLowerCase())
      )
        return false;
      if (
        txCurrencyFilter &&
        t.currency.toUpperCase() !== txCurrencyFilter.toUpperCase()
      )
        return false;
      return true;
    });
  }, [transactions, txTagFilter, txCurrencyFilter]);

  const txStats = useMemo(() => {
    const income = filteredTx
      .filter((t) => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);
    const expense = filteredTx
      .filter((t) => t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expense, balance: income - expense };
  }, [filteredTx]);

  const uniqueTags = useMemo(
    () => [...new Set(transactions.map((t) => t.tag))].sort(),
    [transactions]
  );
  const uniqueCurrencies = useMemo(
    () => [...new Set(transactions.map((t) => t.currency))].sort(),
    [transactions]
  );

  function toggleSort(key: keyof Share) {
    setShareSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  function SortIcon({ k }: { k: keyof Share }) {
    if (shareSort.key !== k)
      return <ChevronUp className="h-3 w-3 text-muted-foreground/40 ml-1" />;
    return shareSort.dir === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1 text-blue-500" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1 text-blue-500" />
    );
  }

  // ── Render ──

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-5 w-px bg-border" />
              <div>
                <h1 className="font-bold text-xl tracking-tight">
                  Finance Hub
                </h1>
                <p className="text-xs text-muted-foreground">
                  Shares & personal transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Shares Tracked
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {shares.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">portfolios</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Total Income
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {txStats.income > 0
                    ? `+${txStats.income.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}`
                    : "—"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredTx.filter((t) => t.amount > 0).length} entries
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/40">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Total Expenses
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {txStats.expense > 0
                    ? `-${txStats.expense.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}`
                    : "—"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredTx.filter((t) => t.amount < 0).length} entries
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Net Balance
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-violet-500" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div
                  className={`text-2xl font-bold ${
                    txStats.balance >= 0
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {txStats.balance !== 0
                    ? `${
                        txStats.balance >= 0 ? "+" : ""
                      }${txStats.balance.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}`
                    : "—"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredTx.length} transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit">
            {(["shares", "transactions"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "shares" ? "📈 My Shares" : "💳 Transactions"}
              </button>
            ))}
          </div>

          {/* ──────────────────────── SHARES TAB ──────────────────────── */}
          {tab === "shares" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">My Shares</h2>
                  <p className="text-sm text-muted-foreground">
                    Track fundamentals for each position
                  </p>
                </div>
                <Button
                  onClick={() => setShareModal({ ...emptyShare })}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Share
                </Button>
              </div>

              {sharesLoading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Loading…
                </div>
              ) : shares.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 border-2 border-dashed rounded-xl text-muted-foreground gap-3">
                  <BarChart3 className="h-10 w-10 opacity-30" />
                  <p className="font-medium">No shares yet</p>
                  <Button
                    variant="outline"
                    onClick={() => setShareModal({ ...emptyShare })}
                    className="gap-2"
                  >
                    <PlusCircle className="h-4 w-4" /> Add your first share
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {(
                          [
                            ["symbol", "Symbol"],
                            ["name", "Name"],
                            ["receitaLiquida", "Receita L."],
                            ["lucroLiquido", "Lucro L."],
                            ["roe", "ROE"],
                            ["margemLiquida", "Margem L."],
                            ["debitEbitda", "Debt/EBITDA"],
                            ["dividendo", "Dividendo"],
                          ] as [keyof Share, string][]
                        ).map(([key, label]) => (
                          <th
                            key={key}
                            onClick={() => toggleSort(key)}
                            className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                          >
                            <span className="inline-flex items-center">
                              {label}
                              <SortIcon k={key} />
                            </span>
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                          Score
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedShares.map((share, i) => (
                        <tr
                          key={share.id}
                          className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${
                            i % 2 === 0 ? "" : "bg-muted/10"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                              {share.symbol}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium max-w-[140px] truncate">
                            {share.name}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {fmt(share.receitaLiquida)}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {fmt(share.lucroLiquido)}
                          </td>
                          <td
                            className={`px-4 py-3 text-right tabular-nums ${roeColor(
                              share.roe
                            )}`}
                          >
                            {fmtPct(share.roe)}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {fmtPct(share.margemLiquida)}
                          </td>
                          <td
                            className={`px-4 py-3 text-right tabular-nums ${debtColor(
                              share.debitEbitda
                            )}`}
                          >
                            {fmt(share.debitEbitda)}
                            {share.debitEbitda != null ? "×" : ""}
                          </td>
                          <td
                            className={`px-4 py-3 text-right tabular-nums ${divColor(
                              share.dividendo
                            )}`}
                          >
                            {fmtPct(share.dividendo)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <ShareScore share={share} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() =>
                                  setShareModal({
                                    id: share.id,
                                    symbol: share.symbol,
                                    name: share.name,
                                    receitaLiquida: share.receitaLiquida,
                                    lucroLiquido: share.lucroLiquido,
                                    roe: share.roe,
                                    margemLiquida: share.margemLiquida,
                                    debitEbitda: share.debitEbitda,
                                    dividendo: share.dividendo,
                                    notes: share.notes,
                                  })
                                }
                                className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteShare(share.id)}
                                disabled={deletingShareId === share.id}
                                className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500 transition-colors disabled:opacity-40"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Score legend */}
              {shares.length > 0 && (
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                  <span className="font-semibold">Score rubric:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ROE ≥ 15%
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Margem ≥ 10%
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Debt/EBITDA ≤ 3×
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Dividendo ≥ 2%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ──────────────────────── TRANSACTIONS TAB ──────────────────────── */}
          {tab === "transactions" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-lg">Transactions</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload CSV or add entries manually
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload CSV
                  </Button>
                  <Button
                    onClick={() => setTxModal(true)}
                    className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Transaction
                  </Button>
                </div>
              </div>

              {/* CSV upload hint + status */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                  CSV columns:{" "}
                  <code className="font-mono">Date, TAG, Title, CY, $</code>
                </div>
                {uploadStatus && (
                  <span
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                      uploadStatus.startsWith("✓")
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    }`}
                  >
                    {uploadStatus}
                  </span>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center bg-muted/30 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                    Filter by TAG
                  </Label>
                  <select
                    value={txTagFilter}
                    onChange={(e) => setTxTagFilter(e.target.value)}
                    className="h-8 text-sm border rounded-lg px-2 bg-background text-foreground"
                  >
                    <option value="">All tags</option>
                    {uniqueTags.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                    Currency
                  </Label>
                  <select
                    value={txCurrencyFilter}
                    onChange={(e) => setTxCurrencyFilter(e.target.value)}
                    className="h-8 text-sm border rounded-lg px-2 bg-background text-foreground"
                  >
                    <option value="">All</option>
                    {uniqueCurrencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {(txTagFilter || txCurrencyFilter) && (
                  <button
                    onClick={() => {
                      setTxTagFilter("");
                      setTxCurrencyFilter("");
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>

              {/* Transaction table */}
              {txLoading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Loading…
                </div>
              ) : filteredTx.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 border-2 border-dashed rounded-xl text-muted-foreground gap-3">
                  <DollarSign className="h-10 w-10 opacity-30" />
                  <p className="font-medium">No transactions yet</p>
                  <p className="text-xs">
                    Upload a CSV or add entries manually
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                          TAG
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                          CY
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                          Amount
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTx.map((tx, i) => {
                        const isIncome = tx.amount > 0;
                        return (
                          <tr
                            key={tx.id}
                            className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${
                              i % 2 === 0 ? "" : "bg-muted/10"
                            }`}
                          >
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap font-mono text-xs">
                              {new Date(tx.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="secondary"
                                className="text-xs font-medium"
                              >
                                {tx.tag}
                              </Badge>
                            </td>
                            <td
                              className="px-4 py-3 max-w-[200px] truncate font-medium"
                              title={tx.title}
                            >
                              {tx.title}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                              {tx.currency}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums font-semibold">
                              <span
                                className={
                                  isIncome
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }
                              >
                                {isIncome ? "+" : "−"}
                                {fmtAmount(tx.amount, tx.currency)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => deleteTx(tx.id)}
                                disabled={deletingTxId === tx.id}
                                className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-400 transition-colors disabled:opacity-40"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Footer totals */}
                    <tfoot>
                      <tr className="border-t bg-muted/40 font-semibold">
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-right text-sm text-muted-foreground"
                        >
                          {filteredTx.length} rows
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <span
                            className={
                              txStats.balance >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }
                          >
                            {txStats.balance >= 0 ? "+" : "−"}
                            {Math.abs(txStats.balance).toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {shareModal && (
        <ShareModal
          initial={shareModal}
          onSave={saveShare}
          onClose={() => setShareModal(null)}
        />
      )}
      {txModal && <TxModal onSave={saveTx} onClose={() => setTxModal(false)} />}
    </ProtectedRoute>
  );
}
