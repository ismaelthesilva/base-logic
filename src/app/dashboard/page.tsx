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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Upload,
  Trash2,
  Pencil,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  MinusCircle,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  CreditCard,
  Search,
  BookOpen,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/format";
import { scoreAsset, getScoreLabel } from "@/lib/investments";

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

type Transaction = {
  id: string;
  date: string;
  tag: string;
  title: string;
  currency: string;
  amount: number;
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

type Fundamentals = {
  year: number;
  receitaLiquida?: number | null;
  lucroLiquido?: number | null;
  roe?: number | null;
  margemLiquida?: number | null;
  dividaLiquida?: number | null;
  ebitda?: number | null;
  dividendPercentage?: number | null;
};

type Asset = {
  id: string;
  symbol: string;
  name: string;
  country: "USA" | "BRAZIL";
  type: "STOCK" | "ETF" | "REIT";
  dividendYield?: number | null;
  currentPrice?: number | null;
  latestFundamentals?: Fundamentals | null;
};

type StatsResponse = {
  total: number;
  byCountry: { USA: number; BRAZIL: number };
  byType: { STOCK: number; ETF: number; REIT: number };
};

type TabId = "overview" | "shares" | "transactions" | "investments";

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

function roeColor(v?: number | null) {
  if (v == null) return "text-muted-foreground";
  if (v >= 15) return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (v >= 8) return "text-yellow-600 dark:text-yellow-400 font-semibold";
  return "text-red-600 dark:text-red-400 font-semibold";
}

function debtColor(v?: number | null) {
  if (v == null) return "text-muted-foreground";
  if (v <= 2) return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (v <= 4) return "text-yellow-600 dark:text-yellow-400 font-semibold";
  return "text-red-600 dark:text-red-400 font-semibold";
}

function divColor(v?: number | null) {
  if (v == null) return "text-muted-foreground";
  if (v >= 5) return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (v >= 2) return "text-blue-600 dark:text-blue-400 font-semibold";
  return "text-muted-foreground";
}

function parseNumericField(val: string): number | null {
  if (!val || val.trim() === "") return null;
  const n = parseFloat(val.replace(",", "."));
  return isFinite(n) ? n : null;
}

// ─── ShareScore badge ──────────────────────────────────────────────────────────

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
    const numericKeys = [
      "receitaLiquida",
      "lucroLiquido",
      "roe",
      "margemLiquida",
      "debitEbitda",
      "dividendo",
    ];
    setForm((f) => ({
      ...f,
      [key]: numericKeys.includes(key) ? (val === "" ? null : val) : val,
    }));
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 sticky top-0">
          <h2 className="font-bold text-lg">
            {form.id ? "Edit Share" : "Add Share"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40">
          <h2 className="font-bold text-lg">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
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
                placeholder="Salary, Food…"
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
                  (neg = expense)
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

// ─── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    id: "shares",
    label: "My Shares",
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "investments",
    label: "Investments",
    icon: <Search className="h-4 w-4" />,
  },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<TabId>("overview");

  // ── Investments data ────────────────────────────────
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [invLoading, setInvLoading] = useState(true);

  // ── Shares data ─────────────────────────────────────
  const [shares, setShares] = useState<Share[]>([]);
  const [sharesLoading, setSharesLoading] = useState(false);
  const [shareModal, setShareModal] = useState<
    (ShareForm & { id?: string }) | null
  >(null);

  // ── Transactions data ───────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txModal, setTxModal] = useState(false);
  const [txSearch, setTxSearch] = useState("");
  const [txType, setTxType] = useState<"all" | "income" | "expense">("all");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Load investments on mount ────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/investments/stats"),
          fetch("/api/investments/assets?limit=200"),
        ]);
        const sData = await sRes.json();
        const aData = await aRes.json();
        setStats(sData);
        setAssets(aData.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setInvLoading(false);
      }
    })();
  }, []);

  // ── Load shares when tab = shares ────────────────────
  useEffect(() => {
    if (tab !== "shares" || shares.length > 0) return;
    fetchShares();
  }, [tab]);

  // ── Load transactions when tab = transactions ────────
  useEffect(() => {
    if (tab !== "transactions" || transactions.length > 0) return;
    fetchTransactions();
  }, [tab]);

  const fetchShares = useCallback(async () => {
    setSharesLoading(true);
    try {
      const res = await fetch("/api/finance/shares");
      const data = await res.json();
      setShares(data.shares || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSharesLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const res = await fetch("/api/finance/transactions");
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setTxLoading(false);
    }
  }, []);

  // ── Share CRUD ───────────────────────────────────────
  async function saveShare(data: ShareForm, id?: string) {
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/finance/shares/${id}` : "/api/finance/shares";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    setShareModal(null);
    setShares([]);
    await fetchShares();
  }

  async function deleteShare(id: string) {
    if (!confirm("Delete this share?")) return;
    await fetch(`/api/finance/shares/${id}`, { method: "DELETE" });
    setShares((prev) => prev.filter((s) => s.id !== id));
  }

  // ── Transaction CRUD ─────────────────────────────────
  async function saveTx(data: TxForm) {
    const amount = parseFloat(data.amount);
    const res = await fetch("/api/finance/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: data.date,
        tag: data.tag || null,
        title: data.title,
        currency: data.currency || "USD",
        amount,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    setTxModal(false);
    setTransactions([]);
    await fetchTransactions();
  }

  async function deleteTx(id: string) {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/finance/transactions/${id}`, { method: "DELETE" });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  // ── CSV import ───────────────────────────────────────
  async function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
    const rows = result.data.slice(1);
    let imported = 0;
    for (const row of rows) {
      const [date, tag, title, currency, amount] = row;
      if (!date || !title || !amount) continue;
      const amt = parseFloat(amount);
      if (!isFinite(amt)) continue;
      await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          tag: tag || null,
          title,
          currency: currency || "USD",
          amount: amt,
        }),
      });
      imported++;
    }
    setTransactions([]);
    await fetchTransactions();
    alert(`Imported ${imported} transactions.`);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ── Derived data ─────────────────────────────────────
  const topPicks = useMemo(() => {
    return assets
      .map((a) => ({
        asset: a,
        score: scoreAsset(a, a.latestFundamentals).total,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [assets]);

  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !txSearch ||
        t.title.toLowerCase().includes(txSearch.toLowerCase()) ||
        (t.tag ?? "").toLowerCase().includes(txSearch.toLowerCase());
      const matchType =
        txType === "all" ||
        (txType === "income" && t.amount >= 0) ||
        (txType === "expense" && t.amount < 0);
      return matchSearch && matchType;
    });
  }, [transactions, txSearch, txType]);

  const txStats = useMemo(() => {
    const income = transactions
      .filter((t) => t.amount >= 0)
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Sticky header with tab bar */}
        <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 h-14">
              <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
              <h1 className="font-bold text-lg leading-tight hidden sm:block">
                Dashboard
              </h1>
              {/* Scrollable tab bar */}
              <div className="flex overflow-x-auto gap-1 ml-auto scrollbar-none">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      tab === t.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* ═══════ OVERVIEW TAB ═══════ */}
          {tab === "overview" && (
            <div className="space-y-6 animate-in fade-in-0 duration-200">
              <div>
                <h2 className="text-2xl font-bold">Overview</h2>
                <p className="text-muted-foreground text-sm">
                  Your financial snapshot
                </p>
              </div>

              {/* 4 Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Assets Tracked
                    </p>
                    <p className="text-2xl font-bold">
                      {invLoading ? "—" : stats?.total ?? "—"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      My Shares
                    </p>
                    <p className="text-2xl font-bold">{shares.length || "—"}</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">Income</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {transactions.length
                        ? `$${txStats.income.toFixed(0)}`
                        : "—"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Expenses
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {transactions.length
                        ? `$${txStats.expense.toFixed(0)}`
                        : "—"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* DB breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Asset Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {invLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : (
                    <>
                      {[
                        { label: "USA", value: stats?.byCountry.USA ?? 0 },
                        {
                          label: "Brazil",
                          value: stats?.byCountry.BRAZIL ?? 0,
                        },
                      ].map((row) => (
                        <div key={row.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{row.label}</span>
                            <span className="font-medium">{row.value}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{
                                width: `${(
                                  (row.value / (stats?.total || 1)) *
                                  100
                                ).toFixed(1)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="grid grid-cols-3 gap-3 pt-2 text-center text-sm">
                        {[
                          {
                            label: "Stocks",
                            value: stats?.byType.STOCK ?? 0,
                          },
                          { label: "ETFs", value: stats?.byType.ETF ?? 0 },
                          {
                            label: "REITs",
                            value: stats?.byType.REIT ?? 0,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="border rounded-lg py-2"
                          >
                            <p className="text-lg font-bold">{row.value}</p>
                            <p className="text-xs text-muted-foreground">
                              {row.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Top picks */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Top Picks</CardTitle>
                </CardHeader>
                <CardContent>
                  {invLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : topPicks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No assets yet.
                    </p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {topPicks.map(({ asset, score }) => (
                        <Link
                          key={asset.id}
                          href={`/dashboard/investments/${asset.symbol}?country=${asset.country}`}
                          className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-bold font-mono">
                              {asset.symbol}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-32">
                              {asset.name}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-primary">
                            {score}/4
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick access */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TABS.slice(1).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="flex flex-col items-center gap-2 border rounded-xl py-5 px-3 hover:bg-muted/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════ MY SHARES TAB ═══════ */}
          {tab === "shares" && (
            <div className="space-y-5 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">My Shares</h2>
                  <p className="text-muted-foreground text-sm">
                    Personal watchlist with fundamentals tracking
                  </p>
                </div>
                <Button
                  onClick={() => setShareModal(emptyShare)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-1.5"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Share</span>
                </Button>
              </div>

              {sharesLoading ? (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  Loading…
                </div>
              ) : shares.length === 0 ? (
                <div className="text-center py-16 border rounded-xl space-y-3">
                  <LineChart className="h-10 w-10 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground">
                    No shares yet. Add your first one.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShareModal(emptyShare)}
                  >
                    Add Share
                  </Button>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 text-xs text-muted-foreground">
                          <th className="text-left px-4 py-3">Symbol</th>
                          <th className="text-left px-4 py-3">Name</th>
                          <th className="text-right px-4 py-3">ROE %</th>
                          <th className="text-right px-4 py-3">Margem %</th>
                          <th className="text-right px-4 py-3">D/EBITDA</th>
                          <th className="text-right px-4 py-3">Div %</th>
                          <th className="text-center px-4 py-3">Score</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {shares.map((s) => (
                          <tr
                            key={s.id}
                            className="border-t hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3 font-bold font-mono">
                              {s.symbol}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">
                              {s.name}
                            </td>
                            <td
                              className={`px-4 py-3 text-right ${roeColor(
                                s.roe
                              )}`}
                            >
                              {s.roe != null ? `${fmtPct(s.roe)}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {s.margemLiquida != null
                                ? fmtPct(s.margemLiquida)
                                : "—"}
                            </td>
                            <td
                              className={`px-4 py-3 text-right ${debtColor(
                                s.debitEbitda
                              )}`}
                            >
                              {s.debitEbitda != null
                                ? `${fmt(s.debitEbitda)}×`
                                : "—"}
                            </td>
                            <td
                              className={`px-4 py-3 text-right ${divColor(
                                s.dividendo
                              )}`}
                            >
                              {s.dividendo != null ? fmtPct(s.dividendo) : "—"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <ShareScore share={s} />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() =>
                                    setShareModal({
                                      id: s.id,
                                      symbol: s.symbol,
                                      name: s.name,
                                      receitaLiquida: s.receitaLiquida,
                                      lucroLiquido: s.lucroLiquido,
                                      roe: s.roe,
                                      margemLiquida: s.margemLiquida,
                                      debitEbitda: s.debitEbitda,
                                      dividendo: s.dividendo,
                                      notes: s.notes,
                                    })
                                  }
                                  className="p-1 text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteShare(s.id)}
                                  className="p-1 text-muted-foreground hover:text-red-500"
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

                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-3">
                    {shares.map((s) => (
                      <div
                        key={s.id}
                        className="border rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold font-mono text-lg">
                              {s.symbol}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {s.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setShareModal({
                                  id: s.id,
                                  symbol: s.symbol,
                                  name: s.name,
                                  receitaLiquida: s.receitaLiquida,
                                  lucroLiquido: s.lucroLiquido,
                                  roe: s.roe,
                                  margemLiquida: s.margemLiquida,
                                  debitEbitda: s.debitEbitda,
                                  dividendo: s.dividendo,
                                  notes: s.notes,
                                })
                              }
                              className="p-2 text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteShare(s.id)}
                              className="p-2 text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center border rounded-lg py-2">
                            <p className={`font-bold ${roeColor(s.roe)}`}>
                              {s.roe != null ? fmtPct(s.roe) : "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">ROE</p>
                          </div>
                          <div className="text-center border rounded-lg py-2">
                            <p
                              className={`font-bold ${debtColor(
                                s.debitEbitda
                              )}`}
                            >
                              {s.debitEbitda != null
                                ? `${fmt(s.debitEbitda)}×`
                                : "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              D/EBITDA
                            </p>
                          </div>
                          <div className="text-center border rounded-lg py-2">
                            <p className={`font-bold ${divColor(s.dividendo)}`}>
                              {s.dividendo != null ? fmtPct(s.dividendo) : "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Div.
                            </p>
                          </div>
                        </div>
                        <ShareScore share={s} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════ TRANSACTIONS TAB ═══════ */}
          {tab === "transactions" && (
            <div className="space-y-5 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Transactions</h2>
                  <p className="text-muted-foreground text-sm">
                    Income & expenses tracker
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileRef}
                    onChange={handleCSV}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileRef.current?.click()}
                    size="sm"
                    className="gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">CSV</span>
                  </Button>
                  <Button
                    onClick={() => setTxModal(true)}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </div>
              </div>

              {/* Stats bar */}
              {transactions.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  <Card className="text-center">
                    <CardContent className="pt-3 pb-3">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ${txStats.income.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Income</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-3 pb-3">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        ${txStats.expense.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Expenses</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-3 pb-3">
                      <p
                        className={`text-lg font-bold ${
                          txStats.net >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        ${txStats.net.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Net</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[160px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search…"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <div className="flex border rounded-lg overflow-hidden text-sm">
                  {(["all", "income", "expense"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setTxType(v)}
                      className={`px-3 py-1.5 capitalize transition-colors ${
                        txType === v
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {txLoading ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Loading…
                </p>
              ) : transactions.length === 0 ? (
                <div className="text-center py-16 border rounded-xl space-y-3">
                  <CreditCard className="h-10 w-10 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground">
                    No transactions yet. Import a CSV or add one manually.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV format: <code>Date, TAG, Title, Currency, Amount</code>
                  </p>
                </div>
              ) : filteredTx.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No results for the current filter.
                </p>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 text-xs text-muted-foreground">
                          <th className="text-left px-4 py-3">Date</th>
                          <th className="text-left px-4 py-3">TAG</th>
                          <th className="text-left px-4 py-3">Description</th>
                          <th className="text-right px-4 py-3">Amount</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTx.map((t) => (
                          <tr
                            key={t.id}
                            className="border-t hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                              {t.date}
                            </td>
                            <td className="px-4 py-3">
                              {t.tag && (
                                <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                                  {t.tag}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">{t.title}</td>
                            <td
                              className={`px-4 py-3 text-right font-semibold tabular-nums ${
                                t.amount >= 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {t.amount >= 0 ? "+" : "−"}
                              {fmtAmount(t.amount, t.currency)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => deleteTx(t.id)}
                                className="p-1 text-muted-foreground hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-2">
                    {filteredTx.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-3 border rounded-xl px-4 py-3"
                      >
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                            t.amount >= 0
                              ? "bg-emerald-100 dark:bg-emerald-900/40"
                              : "bg-red-100 dark:bg-red-900/40"
                          }`}
                        >
                          {t.amount >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {t.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.date}
                            {t.tag && (
                              <span className="ml-2 px-1.5 py-0.5 bg-muted rounded-full">
                                {t.tag}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p
                            className={`font-semibold text-sm tabular-nums ${
                              t.amount >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {t.amount >= 0 ? "+" : "−"}
                            {fmtAmount(t.amount, t.currency)}
                          </p>
                          <button
                            onClick={() => deleteTx(t.id)}
                            className="p-1 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════ INVESTMENTS TAB ═══════ */}
          {tab === "investments" && (
            <div className="space-y-5 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Investments</h2>
                  <p className="text-muted-foreground text-sm">
                    Browse & analyze assets
                  </p>
                </div>
                <Link href="/dashboard/investments">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Search className="h-4 w-4" />
                    Browse All
                  </Button>
                </Link>
              </div>

              {/* Type stats */}
              <div className="grid grid-cols-3 gap-3">
                {invLoading ? (
                  <div className="col-span-3 text-sm text-muted-foreground text-center py-4">
                    Loading…
                  </div>
                ) : (
                  [
                    {
                      label: "Stocks",
                      value: stats?.byType.STOCK ?? 0,
                      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
                    },
                    {
                      label: "ETFs",
                      value: stats?.byType.ETF ?? 0,
                      icon: (
                        <LayoutDashboard className="h-5 w-5 text-purple-500" />
                      ),
                    },
                    {
                      label: "REITs",
                      value: stats?.byType.REIT ?? 0,
                      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
                    },
                  ].map((row) => (
                    <Card key={row.label} className="text-center">
                      <CardContent className="pt-4 pb-4 space-y-1">
                        <div className="flex justify-center">{row.icon}</div>
                        <p className="text-xl font-bold">{row.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.label}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Top picks list */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Top Scored Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {invLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : topPicks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No assets yet.
                    </p>
                  ) : (
                    topPicks.map(({ asset, score }) => (
                      <Link
                        key={asset.id}
                        href={`/dashboard/investments/${asset.symbol}?country=${asset.country}`}
                        className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold font-mono">
                            {asset.symbol}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-48">
                            {asset.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {asset.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={getScoreLabel(score).tone}>
                            {getScoreLabel(score).label}
                          </span>
                          <span className="font-bold text-primary">
                            {score}/4
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Learning center card */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Learning Center
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Evaluate assets by ROE ≥15%, low Debt/EBITDA ≤3×, healthy
                    margins, and sustainable dividends.
                  </p>
                  <Link
                    href="/dashboard/investments/learn"
                    className="text-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    Open learning guide <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
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
