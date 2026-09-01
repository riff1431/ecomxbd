import { formatPrice } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock, Truck, Building } from "lucide-react";

export const metadata = {
  title: "Dues & Settlements — Finance",
};

const DUES_LIST = [
  {
    id: "due-1",
    entity: "SteadFast Courier",
    type: "Receivable (COD)",
    amount: 45200,
    paid: 0,
    status: "due",
    dueDate: "2026-09-04",
    notes: "COD collection for 34 delivered orders in Dhaka & Chattogram",
  },
  {
    id: "due-2",
    entity: "Seoul Cosmetics Wholesale Ltd",
    type: "Payable (Supplier)",
    amount: 120000,
    paid: 40000,
    status: "partial",
    dueDate: "2026-09-15",
    notes: "Balance for August 500x COSRX Snail Essence shipment",
  },
];

export default function AdminFinanceDuesPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Dues & Settlements Manager</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Track pending Cash on Delivery remittances from courier partners and upcoming supplier payments.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h2 className="text-base font-bold text-text">Active Dues & Remittances</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Party / Entity</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Settled</th>
                <th className="px-4 py-3">Due Balance</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DUES_LIST.map((due) => (
                <tr key={due.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-text flex items-center gap-1.5">
                    {due.type.includes("COD") ? (
                      <Truck className="h-3.5 w-3.5 text-primary-600" />
                    ) : (
                      <Building className="h-3.5 w-3.5 text-primary-600" />
                    )}
                    {due.entity}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{due.type}</td>
                  <td className="px-4 py-3 font-bold text-text">{formatPrice(due.amount)}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">{formatPrice(due.paid)}</td>
                  <td className="px-4 py-3 font-extrabold text-sm text-red-600">
                    {formatPrice(due.amount - due.paid)}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{due.dueDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                        due.status === "due"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {due.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
