"use client";

import { useState } from "react";
import { User, Phone, Mail, ShoppingBag, ShieldCheck } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/utils";

interface CustomerListClientProps {
  initialCustomers: any[];
}

export function CustomerListClient({ initialCustomers }: CustomerListClientProps) {
  const [customers] = useState(initialCustomers);

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Customer",
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 font-bold text-xs uppercase">
            {row.full_name ? row.full_name.charAt(0) : row.email.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-text text-xs block">
              {row.full_name || "Unnamed Customer"}
            </span>
            <span className="text-[11px] text-text-muted flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (row: any) => (
        <span className="text-xs text-text-secondary flex items-center gap-1">
          <Phone className="h-3 w-3 text-text-muted" />
          {row.phone || "—"}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row: any) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
            row.role === "admin"
              ? "bg-primary-50 text-primary-700 border-primary-200"
              : "bg-zinc-100 text-zinc-600 border-zinc-200"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: "orders",
      header: "Orders Placed",
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs font-semibold text-text">
          {row.order_count} order(s)
        </span>
      ),
    },
    {
      key: "spent",
      header: "Total Spent",
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs font-extrabold text-primary-700">
          {formatPrice(row.total_spent)}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Registered",
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs text-text-muted">
          {new Date(row.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Customer Directory</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          View registered customer accounts, order history totals, and contact records.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchKey="full_name"
        searchPlaceholder="Search customer name..."
        emptyMessage="No customer accounts found."
      />
    </div>
  );
}
