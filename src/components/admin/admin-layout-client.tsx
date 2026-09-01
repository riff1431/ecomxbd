"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, Warehouse, Users,
  Megaphone, Truck, DollarSign, Image, FileText, Palette,
  Shield, BarChart3, Settings, ScrollText, ChevronDown,
  ChevronRight, Menu, X, Search, Bell, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/config/site";
import { createClient } from "@/lib/supabase/client";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, ShoppingBag, Package, Warehouse, Users,
  Megaphone, Truck, DollarSign, Image, FileText, Palette,
  Shield, BarChart3, Settings, ScrollText,
};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isGroupActive = (children: readonly { href: string }[]) => {
    return children.some((child) => pathname.startsWith(child.href));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-admin-sidebar text-admin-sidebar-text transition-transform duration-200 lg:relative lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
              eX
            </div>
            <span className="text-lg font-bold text-white">ecomX</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-admin-sidebar-text hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;

              if ("children" in item && item.children) {
                const expanded = expandedItems.includes(item.title) || isGroupActive(item.children);
                return (
                  <li key={item.title}>
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-admin-sidebar-hover",
                        isGroupActive(item.children) && "bg-admin-sidebar-hover text-white"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                    {expanded && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-admin-sidebar-hover hover:text-white",
                                isActive(child.href)
                                  ? "bg-primary-600 text-white font-medium"
                                  : "text-admin-sidebar-text"
                              )}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.title}>
                  <Link
                    href={"href" in item ? item.href : "#"}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-admin-sidebar-hover hover:text-white",
                      "href" in item && isActive(item.href)
                        ? "bg-primary-600 text-white font-medium"
                        : "text-admin-sidebar-text"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-admin-sidebar-text transition-colors hover:bg-admin-sidebar-hover hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-surface-secondary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-1.5 text-sm text-text-muted md:flex">
          <Search className="h-4 w-4" />
          <span>Search... </span>
          <kbd className="ml-4 rounded bg-white px-1.5 py-0.5 text-xs font-medium text-text-secondary shadow-sm border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-surface-secondary">
          <Bell className="h-5 w-5 text-text-secondary" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-secondary">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            A
          </div>
          <span className="hidden text-sm font-medium md:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
