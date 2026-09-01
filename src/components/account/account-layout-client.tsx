"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, MapPin, Heart, Star,
  RotateCcw, Award, Ticket, Bell, User, Lock, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { customerNavItems } from "@/config/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, ShoppingBag, MapPin, Heart, Star,
  RotateCcw, Award, Ticket, Bell, User, Lock,
};

export default function AccountLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  };

  return (
    <div className="container-main py-6 lg:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="rounded-xl border border-border bg-white shadow-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-semibold text-text">My Account</h2>
            </div>
            <ul className="p-2">
              {customerNavItems.map((item) => {
                const Icon = iconMap[item.icon] || User;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-secondary",
                        isActive(item.href)
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-text-secondary"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600">
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
