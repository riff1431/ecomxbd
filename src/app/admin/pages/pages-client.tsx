"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Globe,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Save,
  Eye,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { ModuleHeader } from "@/components/admin/module-settings/module-header";
import { saveCMSPage, togglePageStatus, type CMSPageItem } from "@/features/pages/actions";
import Link from "next/link";

interface PagesClientProps {
  initialPages: CMSPageItem[];
}

export function PagesClient({ initialPages }: PagesClientProps) {
  const [pages, setPages] = useState<CMSPageItem[]>(initialPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPage, setEditingPage] = useState<Partial<CMSPageItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleToggle = async (id: string, currentStatus: "draft" | "published") => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
    await togglePageStatus(id, currentStatus);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setSaving(true);
    try {
      await saveCMSPage(editingPage);
      if (editingPage.id) {
        setPages((prev) =>
          prev.map((p) => (p.id === editingPage.id ? ({ ...p, ...editingPage } as CMSPageItem) : p))
        );
      } else {
        const newP: CMSPageItem = {
          id: `page-${Date.now()}`,
          title: editingPage.title || "Untitled",
          slug: editingPage.slug || "new-page",
          content: editingPage.content || "",
          seo_title: editingPage.seo_title,
          seo_description: editingPage.seo_description,
          status: editingPage.status || "published",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setPages((prev) => [newP, ...prev]);
      }
      setEditingPage(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const filteredPages = pages.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModuleHeader
          title="CMS Static Content & Legal Pages"
          description="Create, edit, and publish rich content pages like About Us, Privacy Policy, Terms, FAQ, and custom landing pages."
          icon={FileText}
          badgeLabel={`${pages.filter((p) => p.status === "published").length} Published / ${pages.length} Total`}
        />

        <Button
          onClick={() =>
            setEditingPage({
              title: "",
              slug: "",
              content: "",
              seo_title: "",
              seo_description: "",
              status: "published",
            })
          }
          size="sm"
          className="text-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create New Page
        </Button>
      </div>

      {successToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Page saved successfully!</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-card flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-secondary/50 pl-9 pr-4 py-2 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text">
            <thead className="bg-surface-secondary/60 text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
              <tr>
                <th className="px-5 py-3.5">Page Title & Slug</th>
                <th className="px-5 py-3.5">SEO Meta Title</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Last Updated</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPages.map((item) => (
                <tr key={item.id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-text text-sm">{item.title}</div>
                    <div className="flex items-center gap-1 text-[11px] text-text-muted font-mono mt-0.5">
                      <Globe className="h-3 w-3" />
                      <span>/{item.slug}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary max-w-xs truncate">
                    {item.seo_title || item.title}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(item.id, item.status)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {item.status === "published" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Published
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-text-muted">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/${item.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                          <Eye className="h-3.5 w-3.5 text-text-muted" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPage(item)}
                        className="text-xs h-7 px-2.5"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1 text-primary-600" />
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <FileText className="h-8 w-8 text-text-muted mx-auto" />
            <h3 className="text-sm font-bold text-text">No pages found</h3>
            <p className="text-xs text-text-secondary">Click "Create New Page" to add content.</p>
          </div>
        )}
      </div>

      {/* Edit / Create Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                  {editingPage.id ? "Edit Page Content" : "Create New Static Page"}
                </span>
                <h2 className="text-lg font-bold text-text">
                  {editingPage.title || "Untitled Page"}
                </h2>
              </div>
              <button
                onClick={() => setEditingPage(null)}
                className="text-text-muted hover:text-text p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text mb-1">Page Title</label>
                  <input
                    type="text"
                    required
                    value={editingPage.title || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    placeholder="e.g. About Our Company"
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingPage.slug || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    placeholder="e.g. about-us"
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Page Body Content</label>
                <textarea
                  rows={8}
                  value={editingPage.content || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  placeholder="Enter markdown or plain text page content here..."
                  className="w-full rounded-xl border border-border bg-white p-3.5 text-xs font-mono leading-relaxed focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="bg-surface-secondary/40 rounded-2xl p-4 border border-border space-y-3">
                <h4 className="font-bold text-text text-xs uppercase tracking-wider">SEO Metadata</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-text mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      value={editingPage.seo_title || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, seo_title: e.target.value })}
                      placeholder="e.g. About Us — ecomXbangladesh"
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs focus:border-primary-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-text mb-1">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={editingPage.seo_description || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, seo_description: e.target.value })}
                      placeholder="Brief search engine summary..."
                      className="w-full rounded-xl border border-border bg-white p-3 text-xs focus:border-primary-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-text">Status:</label>
                  <select
                    value={editingPage.status || "published"}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value as any })}
                    className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs focus:border-primary-600 focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingPage(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={saving}>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    {saving ? "Saving..." : "Save Page"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
