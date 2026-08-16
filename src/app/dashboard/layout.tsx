"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/shares", label: "Shares", icon: BarChart3 },
  { href: "/dashboard/investments", label: "Investments", icon: TrendingUp },
];

function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    // Server clears the HttpOnly __session cookie; no localStorage to remove
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  return (
    <aside
      className={`flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-200 ${
        collapsed ? "w-14" : "w-52"
      } min-h-screen shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-zinc-800">
        {!collapsed && (
          <span className="font-bold text-white text-sm truncate">
            EasyInvest
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-zinc-950 text-white">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
