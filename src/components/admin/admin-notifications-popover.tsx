"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ShoppingBag,
  CreditCard,
  Package,
  Shield,
  CheckCircle2,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAdminNotifications,
  type AdminNotification,
} from "@/features/admin/notifications-actions";

export function AdminNotificationsPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "stock" | "system">("all");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Load read status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecomx_admin_read_notifs");
      if (saved) {
        setReadIds(new Set(JSON.parse(saved)));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Fetch notifications on mount and set up periodic refresh
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await getAdminNotifications();
      setNotifications(result.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    try {
      localStorage.setItem("ecomx_admin_read_notifs", JSON.stringify(Array.from(next)));
    } catch {}
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
    try {
      localStorage.setItem("ecomx_admin_read_notifs", JSON.stringify(Array.from(allIds)));
    } catch {}
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  // Format relative timestamp
  const formatTime = (isoString: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return "Recent";
    }
  };

  // Filter list by tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "orders") return n.type === "order" || n.type === "payment";
    if (activeTab === "stock") return n.type === "stock";
    if (activeTab === "system") return n.type === "security" || n.type === "system";
    return true;
  });

  const getIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4 text-primary-600" />;
      case "payment":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case "stock":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "security":
        return <Shield className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBgColor = (type: AdminNotification["type"]) => {
    switch (type) {
      case "order":
        return "bg-primary-50 border-primary-100";
      case "payment":
        return "bg-emerald-50 border-emerald-100";
      case "stock":
        return "bg-amber-50 border-amber-100";
      case "security":
        return "bg-purple-50 border-purple-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Bell Button */}
      <button
        id="admin-notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        className={cn(
          "relative rounded-lg p-2 transition-all duration-150",
          isOpen
            ? "bg-surface-secondary text-primary-600"
            : "text-text-secondary hover:bg-surface-secondary hover:text-text"
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-gray-50/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text text-sm">Notifications</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-danger-100 text-danger-700 font-semibold px-2 py-0.5 text-xs">
                  {unreadCount} new
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 text-xs flex items-center gap-1">
                  <Check className="h-3 w-3" /> All read
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={fetchNotifications}
                title="Refresh notifications"
                className="rounded-md p-1.5 text-text-muted hover:bg-white hover:text-text transition-colors"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin text-primary-600")} />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="rounded-md px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-border bg-white px-3 pt-1.5 gap-1 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-2.5 py-1.5 font-medium rounded-t-md transition-colors border-b-2",
                activeTab === "all"
                  ? "border-primary-600 text-primary-600 bg-primary-50/50"
                  : "border-transparent text-text-muted hover:text-text"
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={cn(
                "px-2.5 py-1.5 font-medium rounded-t-md transition-colors border-b-2",
                activeTab === "orders"
                  ? "border-primary-600 text-primary-600 bg-primary-50/50"
                  : "border-transparent text-text-muted hover:text-text"
              )}
            >
              Orders & Pay
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={cn(
                "px-2.5 py-1.5 font-medium rounded-t-md transition-colors border-b-2",
                activeTab === "stock"
                  ? "border-primary-600 text-primary-600 bg-primary-50/50"
                  : "border-transparent text-text-muted hover:text-text"
              )}
            >
              Stock
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={cn(
                "px-2.5 py-1.5 font-medium rounded-t-md transition-colors border-b-2",
                activeTab === "system"
                  ? "border-primary-600 text-primary-600 bg-primary-50/50"
                  : "border-transparent text-text-muted hover:text-text"
              )}
            >
              System
            </button>
          </div>

          {/* Notifications Scroll List */}
          <div className="max-h-95 overflow-y-auto divide-y divide-border/60">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary text-text-muted mb-2">
                  <Inbox className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-text">No notifications here</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {activeTab === "all"
                    ? "You're completely up to date!"
                    : "No notifications found in this category."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isRead = readIds.has(notif.id);

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "group relative flex items-start gap-3 p-3 text-left transition-colors cursor-pointer",
                      isRead
                        ? "bg-white hover:bg-gray-50 opacity-80"
                        : "bg-primary-50/20 hover:bg-primary-50/40"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                        getBgColor(notif.type)
                      )}
                    >
                      {getIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={cn(
                            "text-xs font-semibold truncate",
                            isRead ? "text-text" : "text-text font-bold"
                          )}
                        >
                          {notif.title}
                        </p>
                        {notif.priority === "high" && !isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-danger-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-text-muted/80 block mt-1">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    {/* Right Action: Mark as read check button */}
                    <div className="absolute right-2.5 top-3 flex items-center">
                      {!isRead ? (
                        <button
                          onClick={(e) => markAsRead(notif.id, e)}
                          title="Mark as read"
                          className="opacity-0 group-hover:opacity-100 rounded p-1 hover:bg-white text-text-muted hover:text-primary-600 transition-all"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-text-muted">
                          Read
                        </span>
                      )}

                      {!isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary-600 shrink-0 group-hover:hidden" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Quick Links */}
          <div className="flex items-center justify-between border-t border-border bg-gray-50 px-4 py-2 text-xs">
            <Link
              href="/admin/orders"
              onClick={() => setIsOpen(false)}
              className="font-medium text-text-muted hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              Orders <ChevronRight className="h-3 w-3" />
            </Link>

            <Link
              href="/admin/activity"
              onClick={() => setIsOpen(false)}
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              Activity Audit <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
