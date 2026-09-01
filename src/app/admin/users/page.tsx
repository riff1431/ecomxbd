import { Shield, UserCheck, Key, Mail, Lock, Plus } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

export const metadata = {
  title: "Team & Permissions — Admin",
};

const USERS = [
  {
    id: "u1",
    name: "Master Admin",
    email: "admin@ecomxbangladesh.com",
    role: "Super Admin",
    permissions: "Full Access (All Modules, Settings, Finance & Blacklist)",
    status: "Active",
    lastLogin: "Just now",
  },
  {
    id: "u2",
    name: "Tanzir Ahmed",
    email: "catalog@ecomxbangladesh.com",
    role: "Catalog Manager",
    permissions: "Products, Categories, Brands, Inventory & Media Library",
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: "u3",
    name: "Nusrat Jahan",
    email: "fulfillment@ecomxbangladesh.com",
    role: "Logistics Coordinator",
    permissions: "Orders, Shipping Booking (SteadFast / Pathao), SMS Dispatch",
    status: "Active",
    lastLogin: "Yesterday",
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Team Roles & Access Permissions</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Manage administrative staff, granular role permissions, and system access levels.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h2 className="text-base font-bold text-text">Administrative Staff Directory</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Team Member</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Access Scope</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {USERS.map((user) => (
                <tr key={user.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-text text-xs block">{user.name}</span>
                    <span className="text-text-muted text-[11px] flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {user.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary-700">
                    <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold border border-primary-200 uppercase">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary max-w-[280px]">
                    {user.permissions}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase border border-emerald-200">
                      {user.status}
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
