"use client";

import { cn } from "@/lib/utils";

export interface ModuleTab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface ModuleTabsProps {
  tabs: ModuleTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function ModuleTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: ModuleTabsProps) {
  return (
    <div className={cn("border-b border-border", className)}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 border-b-2 py-3 px-1 text-xs font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-text-secondary hover:border-border hover:text-text"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "bg-surface-secondary text-text-muted"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
