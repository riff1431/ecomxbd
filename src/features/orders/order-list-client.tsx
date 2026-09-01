"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Package, Phone, Calendar, Clock } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "./actions";

interface OrderListClientProps {
  initialOrders: any[];
}

export function OrderListClient({ initialOrders }: OrderListClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const columns: Column<any>[] = [
    {
      key: "order_number",
      header: "Order #",
      sortable: true,
      cell: (row: any) => (
        <div>
          <span className="font-extrabold text-primary-600 block">{row.order_number}</span>
          <span className="text-[11px] text-text-muted">
            {new Date(row.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (row: any) => {
        const addr = row.shipping_address_snapshot || {};
        return (
          <div className="text-xs">
            <span className="font-bold text-text block">{addr.name || row.guest_name}</span>
            <span className="text-text-muted flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3" />
              {addr.phone || row.guest_phone}
            </span>
          </div>
        );
      },
    },
    {
      key: "destination",
      header: "District",
      cell: (row: any) => {
        const addr = row.shipping_address_snapshot || {};
        return (
          <div className="text-xs">
            <span className="font-semibold text-text">{addr.district || "Dhaka"}</span>
            <span className="text-[11px] text-text-muted block">{addr.thana}</span>
          </div>
        );
      },
    },
    {
      key: "items",
      header: "Items",
      cell: (row: any) => (
        <span className="text-xs font-semibold text-text">
          {row.order_items?.length || 1} item(s)
        </span>
      ),
    },
    {
      key: "total",
      header: "Amount",
      sortable: true,
      cell: (row: any) => (
        <div>
          <span className="font-extrabold text-text text-sm block">
            {formatPrice(row.total)}
          </span>
          <span className="text-[10px] text-text-muted uppercase font-bold">
            {row.payment_method} ({row.payment_status})
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`rounded-lg border px-2.5 py-1 text-xs font-bold capitalize focus:outline-none ${
            statusColors[row.status] || "bg-surface-secondary text-text"
          }`}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      key: "actions",
      header: "Action",
      cell: (row: any) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-secondary transition-colors"
        >
          <Eye className="h-3.5 w-3.5 text-primary-600" />
          Manage
        </Link>
      ),
    },
  ];

  const tabs = [
    { label: "All Orders", value: "all", count: orders.length },
    { label: "Pending", value: "pending", count: orders.filter((o) => o.status === "pending").length },
    { label: "Confirmed", value: "confirmed", count: orders.filter((o) => o.status === "confirmed").length },
    { label: "Shipped", value: "shipped", count: orders.filter((o) => o.status === "shipped").length },
    { label: "Delivered", value: "delivered", count: orders.filter((o) => o.status === "delivered").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Orders & Fulfillment</h1>
          <p className="text-sm text-text-secondary">
            Manage customer orders, Cash on Delivery consignments, and statuses.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
              activeTab === t.value
                ? "bg-primary-600 text-white"
                : "bg-white border border-border text-text hover:bg-surface-secondary"
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === t.value
                  ? "bg-white/20 text-white"
                  : "bg-surface-secondary text-text-muted"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchKey="order_number"
        searchPlaceholder="Search order number or phone..."
        emptyMessage="No customer orders found."
      />
    </div>
  );
}
