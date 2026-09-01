"use client";

import { useState } from "react";
import { Building, Phone, Mail, MapPin } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";

interface SupplierListClientProps {
  initialSuppliers: any[];
}

export function SupplierListClient({ initialSuppliers }: SupplierListClientProps) {
  const [suppliers] = useState(initialSuppliers);

  const columns: Column<any>[] = [
    {
      key: "company",
      header: "Supplier & Company",
      sortable: true,
      cell: (row: any) => (
        <div>
          <span className="font-bold text-text text-xs flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-primary-600" />
            {row.company}
          </span>
          <span className="text-[11px] text-text-muted">Contact: {row.name}</span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (row: any) => (
        <div className="text-xs space-y-0.5">
          <span className="flex items-center gap-1 text-text">
            <Phone className="h-3 w-3 text-text-muted" /> {row.phone}
          </span>
          {row.email && (
            <span className="flex items-center gap-1 text-text-muted text-[11px]">
              <Mail className="h-3 w-3" /> {row.email}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "address",
      header: "Origin & Hub",
      cell: (row: any) => (
        <span className="text-xs text-text-secondary flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
          {row.address}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Procurement Scope",
      cell: (row: any) => (
        <p className="max-w-[280px] text-xs text-text-secondary leading-relaxed">
          {row.notes}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold uppercase border border-emerald-200">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Procurement & Suppliers</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Directory of international skincare distributors, authentic brand importers, and origin hubs.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        searchKey="company"
        searchPlaceholder="Search supplier or company..."
        emptyMessage="No suppliers registered yet."
      />
    </div>
  );
}
