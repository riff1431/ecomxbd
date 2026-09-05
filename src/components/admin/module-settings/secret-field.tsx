"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

interface SecretFieldProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  required?: boolean;
  isConfigured?: boolean;
}

export function SecretField({
  id,
  label,
  description,
  value,
  onChange,
  placeholder = "Enter secret credential...",
  required = false,
  isConfigured = false,
}: SecretFieldProps) {
  const [isEditing, setIsEditing] = useState(!isConfigured);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-text flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5 text-text-muted" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {isConfigured && !isEditing && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Encrypted in Database
          </span>
        )}
      </div>

      {description && <p className="text-[11px] text-text-muted">{description}</p>}

      {!isEditing && isConfigured ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-xl border border-border bg-surface-secondary/70 px-3.5 py-2 text-xs font-mono text-text-muted select-none">
            ••••••••••••••••••••••••••••••••
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditing(true);
              onChange("");
            }}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Replace Credential
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id={id}
              type={showSecret ? "text" : "password"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2 pr-10 text-xs font-mono text-text placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {isConfigured && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                onChange("••••••••");
              }}
              className="text-xs text-text-muted"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
