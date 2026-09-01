"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, XCircle, AlertTriangle, MessageSquare, Reply, X, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/shared/ui/button";
import { moderateReview } from "./actions";

interface ReviewListClientProps {
  initialReviews: any[];
}

export function ReviewListClient({ initialReviews }: ReviewListClientProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [replyModalReview, setReplyModalReview] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected" | "spam") => {
    const res = await moderateReview(id, newStatus);
    if (res.success && res.review) {
      setReviews(reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalReview) return;

    setLoading(true);
    const res = await moderateReview(replyModalReview.id, "approved", replyText);
    if (res.success && res.review) {
      setReviews(
        reviews.map((r) =>
          r.id === replyModalReview.id ? { ...r, status: "approved", admin_reply: replyText } : r
        )
      );
      setReplyModalReview(null);
      setReplyText("");
    }
    setLoading(false);
  };

  const statusColors: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    spam: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  const columns: Column<any>[] = [
    {
      key: "product",
      header: "Product",
      sortable: true,
      cell: (row: any) => (
        <div className="max-w-[200px]">
          <span className="font-bold text-text text-xs line-clamp-1">
            {row.products?.name || "Product"}
          </span>
          <span className="text-[10px] text-text-muted">
            by {row.profiles?.full_name || row.profiles?.email || "Customer"}
          </span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < row.rating ? "fill-current" : "stroke-current fill-none text-zinc-300"
              }`}
            />
          ))}
          <span className="text-xs font-bold text-text ml-1">{row.rating}.0</span>
        </div>
      ),
    },
    {
      key: "review",
      header: "Comment",
      cell: (row: any) => (
        <div className="max-w-[300px] text-xs">
          {row.title && <p className="font-bold text-text line-clamp-1">{row.title}</p>}
          <p className="text-text-secondary line-clamp-2">{row.comment}</p>
          {row.admin_reply && (
            <span className="text-[10px] text-primary-600 font-semibold block mt-0.5">
              Replied: &quot;{row.admin_reply}&quot;
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
            statusColors[row.status] || "bg-zinc-100 text-zinc-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Moderation",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          {row.status !== "approved" && (
            <button
              onClick={() => handleStatusChange(row.id, "approved")}
              className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Approve"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}

          {row.status !== "rejected" && (
            <button
              onClick={() => handleStatusChange(row.id, "rejected")}
              className="rounded-lg p-1 text-red-600 hover:bg-red-50 transition-colors"
              title="Reject"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => {
              setReplyModalReview(row);
              setReplyText(row.admin_reply || "");
            }}
            className="rounded-lg p-1 text-primary-600 hover:bg-primary-50 transition-colors"
            title="Reply"
          >
            <Reply className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">Customer Reviews Moderation</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Approve, reject, or post official store replies to customer feedback.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        searchKey="title"
        searchPlaceholder="Search reviews..."
        emptyMessage="No customer reviews found."
      />

      {/* Admin Reply Modal */}
      {replyModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Reply className="h-4 w-4 text-primary-600" />
                Reply to Customer Review
              </h3>
              <button
                onClick={() => setReplyModalReview(null)}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl bg-surface-secondary p-3 text-xs space-y-1">
              <span className="font-bold text-text">{replyModalReview.products?.name}</span>
              <p className="text-text-secondary italic">&quot;{replyModalReview.comment}&quot;</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Official Store Response
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank you for your feedback! We are delighted that..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full rounded-xl border border-border p-3 text-xs text-text focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setReplyModalReview(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                  Publish Reply
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
