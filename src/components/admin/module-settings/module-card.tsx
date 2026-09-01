"use client";

import Link from "next/link";
import { LucideIcon, Settings, ArrowRight, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { ConnectionStatusBadge, ConnectionStatus } from "./connection-status-badge";

export interface ModuleCardItem {
  key: string;
  name: string;
  category?: string;
  description: string;
  icon?: LucideIcon;
  status: ConnectionStatus | string;
  isEnabled: boolean;
  isCore?: boolean;
  settingsHref?: string;
  lastTestedAt?: string | null;
  version?: string;
}

interface ModuleCardProps {
  module: ModuleCardItem;
  onToggle?: (key: string, enabled: boolean) => void;
  loading?: boolean;
}

export function ModuleCard({ module, onToggle, loading = false }: ModuleCardProps) {
  const Icon = module.icon;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:shadow-dropdown">
      <div className="space-y-3">
        {/* Header with Icon and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {Icon ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 border border-primary-100">
                <Icon className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary text-text-muted border border-border">
                <Settings className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-text">{module.name}</h3>
              {module.category && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  {module.category}
                </span>
              )}
            </div>
          </div>

          <ConnectionStatusBadge status={module.status} />
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
          {module.description}
        </p>
      </div>

      {/* Footer / Actions */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
        {/* Toggle (if not core) */}
        {!module.isCore && onToggle ? (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={module.isEnabled}
              disabled={loading}
              onChange={(e) => onToggle(module.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-2 text-[11px] font-medium text-text-muted">
              {module.isEnabled ? "Active" : "Disabled"}
            </span>
          </label>
        ) : (
          <span className="text-[10px] font-bold text-blue-600 uppercase">Core</span>
        )}

        {/* Settings button */}
        {module.settingsHref && (
          <Link href={module.settingsHref}>
            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
              <Settings className="h-3 w-3 mr-1 text-primary-600" />
              Configure
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
