import type { PermissionKey, UserRole } from "@/types";

// Default permissions per role — this is the fallback when custom role permissions aren't defined
const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  guest: [],
  customer: [],
  moderator: [
    "products.view", "products.create", "products.update",
    "orders.view", "orders.update",
    "customers.view",
    "media.manage",
    "reviews.moderate",
    "reports.sales",
  ],
  admin: [
    "products.view", "products.create", "products.update", "products.delete",
    "orders.view", "orders.update", "orders.refund",
    "customers.view", "customers.update", "customers.block",
    "reports.sales", "reports.profit", "reports.customers",
    "media.manage", "coupons.manage", "reviews.moderate",
    "settings.manage", "integrations.manage", "roles.manage", "finance.manage",
  ],
};

/**
 * Check if a role has a specific permission (using defaults).
 * For production, check the `role_permissions` table instead.
 */
export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  const permissions = DEFAULT_ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(role: UserRole, permissions: PermissionKey[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(role: UserRole, permissions: PermissionKey[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Check if the user is an admin-level role (admin or moderator).
 */
export function isAdminRole(role: UserRole): boolean {
  return role === "admin" || role === "moderator";
}

/**
 * Get all permissions for a role.
 */
export function getPermissionsForRole(role: UserRole): PermissionKey[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
}

/**
 * Permission groups for the admin roles UI.
 */
export const permissionGroups = [
  {
    group: "Products",
    permissions: [
      { key: "products.view" as PermissionKey, label: "View products" },
      { key: "products.create" as PermissionKey, label: "Create products" },
      { key: "products.update" as PermissionKey, label: "Update products" },
      { key: "products.delete" as PermissionKey, label: "Delete products" },
    ],
  },
  {
    group: "Orders",
    permissions: [
      { key: "orders.view" as PermissionKey, label: "View orders" },
      { key: "orders.update" as PermissionKey, label: "Update order status" },
      { key: "orders.refund" as PermissionKey, label: "Process refunds" },
    ],
  },
  {
    group: "Customers",
    permissions: [
      { key: "customers.view" as PermissionKey, label: "View customers" },
      { key: "customers.update" as PermissionKey, label: "Update customers" },
      { key: "customers.block" as PermissionKey, label: "Block customers" },
    ],
  },
  {
    group: "Reports",
    permissions: [
      { key: "reports.sales" as PermissionKey, label: "View sales reports" },
      { key: "reports.profit" as PermissionKey, label: "View profit reports" },
      { key: "reports.customers" as PermissionKey, label: "View customer reports" },
    ],
  },
  {
    group: "Content & Media",
    permissions: [
      { key: "media.manage" as PermissionKey, label: "Manage media" },
      { key: "reviews.moderate" as PermissionKey, label: "Moderate reviews" },
      { key: "coupons.manage" as PermissionKey, label: "Manage coupons" },
    ],
  },
  {
    group: "Settings & Security",
    permissions: [
      { key: "settings.manage" as PermissionKey, label: "Manage settings" },
      { key: "integrations.manage" as PermissionKey, label: "Manage integrations" },
      { key: "roles.manage" as PermissionKey, label: "Manage roles" },
      { key: "finance.manage" as PermissionKey, label: "Manage finances" },
    ],
  },
];
