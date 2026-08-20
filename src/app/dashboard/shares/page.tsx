"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { Upload, Plus, Trash2, X, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatLargeNumber } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

type Share = {
  id: string;
  symbol: string;
  name: string;
  sector?: string | null;
  receitaLiquida?: number | null;
  lucroLiquido?: number | null;
  roe?: number | null;
  margemLiquida?: number | null;
  debitEbitda?: number | null;
  ebitda?: number | null;
  dividendo?: number | null;
  period?: string | null;
  notes?: string | null;
  passesFilter: boolean;
};

// Buffett thresholds
const THRESHOLDS = {
  roe: { min: 15, label: "ROE ≥ 15%" },
  margemLiquida: { min: 15, label: "Margin ≥ 15%" },
  debitEbitda: { max: 3, label: "D/EBITDA ≤ 3" },
  dividendo: { min: 10, label: "Yield ≥ 10%" },
};

function passes(
  field: keyof typeof THRESHOLDS,
  value?: number | null
): boolean | null {
  if (value == null) return null;
  const t = THRESHOLDS[field];
  if ("min" in t) return value >= t.min;
  return value <= (t as any).max;
}

function CellValue({
  field,
  value,
  fmt,
}: {
  field: keyof typeof THRESHOLDS | "other";
  value?: number | null;
  fmt?: (v: number) => string;
}) {
  if (value == null) return <span className="text-zinc-600">—</span>;
  const ok = field !== "other" ? passes(field, value) : null;
  const formatted = fmt ? fmt(value) : value.toFixed(1);
  return (
    <span
      className={
        ok === true
          ? "text-emerald-400 font-medium"
          : ok === false
          ? "text-red-400 font-medium"
          : "text-zinc-300"
      }
    >
      {formatted}
    </span>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function ShareModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Share>;
  onSave: (data: Omit<Share, "id" | "passesFilter">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    symbol: initial?.symbol ?? "",
    name: initial?.name ?? "",
    sector: initial?.sector ?? "",
    period: initial?.period ?? "",
    receitaLiquida:
      initial?.receitaLiquida != null ? String(initial.receitaLiquida) : "",
    lucroLiquido:
      initial?.lucroLiquido != null ? String(initial.lucroLiquido) : "",
    roe: initial?.roe != null ? String(initial.roe) : "",
    margemLiquida:
      initial?.margemLiquida != null ? String(initial.margemLiquida) : "",
    debitEbitda:
      initial?.debitEbitda != null ? String(initial.debitEbitda) : "",
    ebitda: initial?.ebitda != null ? String(initial.ebitda) : "",
    dividendo: initial?.dividendo != null ? String(initial.dividendo) : "",
    notes: initial?.notes ?? "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const num = (v: string) => (v !== "" ? parseFloat(v) : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      symbol: form.symbol.toUpperCase().trim(),
      name: form.name.trim(),
      sector: form.sector.trim() || null,
      period: form.period.trim() || null,
      receitaLiquida: num(form.receitaLiquida),
      lucroLiquido: num(form.lucroLiquido),
      roe: num(form.roe),
      margemLiquida: num(form.margemLiquida),
      debitEbitda: num(form.debitEbitda),
      ebitda: num(form.ebitda),
      dividendo: num(form.dividendo),
      notes: form.notes.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-3 sticky top-0 bg-zinc-900 z-10">
          <CardTitle className="text-sm font-medium text-zinc-200">
            {initial?.id ? "Edit Share" : "Add Share"}
          </CardTitle>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Ticker *</Label>
                <Input
                  value={form.symbol}
                  onChange={set("symbol")}
                  placeholder="AAPL"
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Name *</Label>
                <Input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Apple Inc."
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400">Sector</Label>
                <Input
                  value={form.sector}
                  onChange={set("sector")}
                  placeholder="Technology"
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Period</Label>
                <Input
                  value={form.period}
                  onChange={set("period")}
                  placeholder="2024"
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                />
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-3">
              <p className="text-xs text-zinc-400 mb-2 font-medium">
                Financials
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "receitaLiquida", label: "Net Revenue" },
                  { key: "lucroLiquido", label: "Net Income" },
                  { key: "ebitda", label: "EBITDA" },
                  { key: "roe", label: "ROE (%)" },
                  { key: "margemLiquida", label: "Net Margin (%)" },
                  { key: "debitEbitda", label: "Debt/EBITDA" },
                  { key: "dividendo", label: "Dividend Yield (%)" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <Label className="text-xs text-zinc-400">{label}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={(form as any)[key]}
                      onChange={set(key)}
                      placeholder="—"
                      className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Notes</Label>
              <Input
                value={form.notes}
                onChange={set("notes")}
                placeholder="Optional"
                className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
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

// ─── CSV Import ────────────────────────────────────────────────────────────────

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
    const res = await fetch("/api/finance/shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows),
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
        <p className="text-xs text-zinc-500">
          {rows.length} rows ready to import
        </p>
      )}
      <p className="text-xs text-zinc-500">
        Columns:{" "}
        <code className="text-zinc-400">
          symbol, name, sector, roe, margemLiquida, debitEbitda, dividendo,
          receitaLiquida, lucroLiquido, ebitda, period
        </code>
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SharesPage() {
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPassing, setFilterPassing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editShare, setEditShare] = useState<Share | null>(null);

  const fetchShares = useCallback(async () => {
    setLoading(true);
    const url = filterPassing
      ? "/api/finance/shares?passesFilter=true"
      : "/api/finance/shares";
    const res = await fetch(url);
    const data = await res.json();
    setShares(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filterPassing]);

  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  const handleAdd = async (data: Omit<Share, "id" | "passesFilter">) => {
    await fetch("/api/finance/shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowAdd(false);
    fetchShares();
  };

  const handleEdit = async (data: Omit<Share, "id" | "passesFilter">) => {
    if (!editShare) return;
    await fetch(`/api/finance/shares/${editShare.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditShare(null);
    fetchShares();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this share?")) return;
    await fetch(`/api/finance/shares/${id}`, { method: "DELETE" });
    fetchShares();
  };

  const passing = shares.filter((s) => s.passesFilter).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Shares Watchlist</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {shares.length} tracked · {passing} pass Buffett filter
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
                fetchShares();
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Buffett criteria legend + filter toggle */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-zinc-400 font-medium">
              Buffett Criteria:
            </span>
            {Object.entries(THRESHOLDS).map(([k, t]) => (
              <span key={k} className="text-xs text-zinc-300">
                <span className="text-emerald-400">✓</span> {t.label}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
                <div
                  onClick={() => setFilterPassing((v) => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    filterPassing ? "bg-emerald-600" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      filterPassing ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </div>
                Show only passing
              </label>
            </div>
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
                    Ticker
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">
                    Sector
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-400 font-medium">
                    Revenue
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-400 font-medium">
                    Net Inc.
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-400 font-medium">
                    ROE %
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-400 font-medium">
                    Margin %
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-400 font-medium">
                    D/EBITDA
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-400 font-medium">
                    Yield %
                  </th>
                  <th className="text-center px-4 py-3 text-xs text-zinc-400 font-medium">
                    Pass
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {/* Benchmark row */}
                <tr className="border-b border-zinc-700 bg-zinc-800/50">
                  <td
                    className="px-4 py-2 text-xs text-zinc-500 italic"
                    colSpan={5}
                  >
                    Buffett thresholds
                  </td>
                  <td className="px-4 py-2 text-xs text-emerald-600 text-right">
                    ≥ 15
                  </td>
                  <td className="px-4 py-2 text-xs text-emerald-600 text-right">
                    ≥ 15
                  </td>
                  <td className="px-4 py-2 text-xs text-emerald-600 text-right">
                    ≤ 3
                  </td>
                  <td className="px-4 py-2 text-xs text-emerald-600 text-right">
                    ≥ 10
                  </td>
                  <td className="px-4 py-2" />
                  <td className="px-4 py-2" />
                </tr>

                {loading ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : shares.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      No shares yet. Add one or import a CSV.
                    </td>
                  </tr>
                ) : (
                  shares.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-medium text-white text-xs">
                        {s.symbol}
                      </td>
                      <td className="px-4 py-3 text-zinc-300 max-w-32 truncate">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">
                        {s.sector || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-300 text-xs tabular-nums">
                        {s.receitaLiquida != null
                          ? formatLargeNumber(s.receitaLiquida)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-300 text-xs tabular-nums">
                        {s.lucroLiquido != null
                          ? formatLargeNumber(s.lucroLiquido)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-xs tabular-nums">
                        <CellValue field="roe" value={s.roe} />
                      </td>
                      <td className="px-4 py-3 text-right text-xs tabular-nums">
                        <CellValue
                          field="margemLiquida"
                          value={s.margemLiquida}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-xs tabular-nums">
                        <CellValue field="debitEbitda" value={s.debitEbitda} />
                      </td>
                      <td className="px-4 py-3 text-right text-xs tabular-nums">
                        <CellValue field="dividendo" value={s.dividendo} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {s.passesFilter ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500/60 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setEditShare(s)}
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
                            onClick={() => handleDelete(s.id)}
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
        <ShareModal onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editShare && (
        <ShareModal
          initial={editShare}
          onSave={handleEdit}
          onClose={() => setEditShare(null)}
        />
      )}
    </div>
  );
}
