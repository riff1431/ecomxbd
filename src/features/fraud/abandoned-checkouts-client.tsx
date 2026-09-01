"use client";

import { useState } from "react";
import { ShoppingCart, Send, CheckCircle2, Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/shared/ui/button";
import { formatPrice } from "@/lib/utils";
import { sendAbandonedRecoverySms } from "./actions";

interface AbandonedCheckoutsClientProps {
  initialCheckouts: any[];
}

export function AbandonedCheckoutsClient({ initialCheckouts }: AbandonedCheckoutsClientProps) {
  const [checkouts, setCheckouts] = useState(initialCheckouts);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSendRecovery = async (id: string) => {
    setLoadingId(id);
    const res = await sendAbandonedRecoverySms(id);
    if (res.success) {
      setCheckouts(
        checkouts.map((c) => (c.id === id ? { ...c, recovery_status: "sms_sent" } : c))
      );
    }
    setLoadingId(null);
  };

  const columns: Column<any>[] = [
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-bold text-text text-xs block">{row.customer_name}</span>
          <span className="font-mono text-[11px] text-text-muted flex items-center gap-1">
            <Phone className="h-3 w-3" /> {row.customer_phone}
          </span>
          {row.customer_email && (
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Mail className="h-3 w-3" /> {row.customer_email}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <span className="font-semibold text-text flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary-600" /> {row.district}
          </span>
          <span className="text-text-muted text-[11px] block truncate max-w-[200px]">
            {row.address}
          </span>
        </div>
      ),
    },
    {
      key: "cart",
      header: "Abandoned Items & Value",
      cell: (row) => (
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-text text-sm">
            {formatPrice(row.cart_total)}
          </div>
          <div className="text-text-muted text-[11px]">
            {row.cart_items?.map((item: any) => (
              <span key={item.name} className="block truncate max-w-[240px]">
                {item.quantity}x {item.name}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Recovery Status",
      cell: (row) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
            row.recovery_status === "recovered"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : row.recovery_status === "sms_sent"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {row.recovery_status.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      cell: (row) => (
        <Button
          size="sm"
          variant={row.recovery_status === "sms_sent" ? "outline" : "default"}
          disabled={loadingId === row.id}
          onClick={() => handleSendRecovery(row.id)}
          className="text-xs"
        >
          {loadingId === row.id ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Send className="h-3 w-3 mr-1" />
          )}
          {row.recovery_status === "sms_sent" ? "Resend SMS" : "Send Recovery SMS"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Abandoned & Incomplete Checkouts</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Recover dropped customer carts with 1-click automated SMS discounts and checkout restore links.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={checkouts}
        searchKey="customer_phone"
        searchPlaceholder="Search customer phone or name..."
        emptyMessage="No abandoned checkouts currently."
      />
    </div>
  );
}
