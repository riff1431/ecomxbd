"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { generateSlug } from "@/lib/utils";
import { createCategory, updateCategory, getCategories } from "@/features/categories/actions";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    description: string | null;
    image_url: string | null;
    seo_title: string | null;
    seo_description: string | null;
    sort_order: number;
    status: string;
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [allCategories, setAllCategories] = useState<Array<{ id: string; name: string; parent_id: string | null }>>([]);

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    parent_id: initialData?.parent_id ?? null,
    description: initialData?.description ?? "",
    image_url: initialData?.image_url ?? "",
    seo_title: initialData?.seo_title ?? "",
    seo_description: initialData?.seo_description ?? "",
    sort_order: initialData?.sort_order ?? 0,
    status: (initialData?.status ?? "active") as "active" | "inactive",
  });

  useEffect(() => {
    getCategories().then((cats) => {
      // Exclude self to prevent circular parent reference
      const filtered = initialData
        ? cats.filter((c: { id: string }) => c.id !== initialData.id)
        : cats;
      setAllCategories(filtered);
    });
  }, [initialData]);

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "name" && !isEditing) {
      setForm((prev) => ({ ...prev, slug: generateSlug(value as string) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = isEditing
      ? await updateCategory(initialData!.id, form)
      : await createCategory(form);

    if ("error" in result && result.error) {
      const err = result.error as Record<string, string[]> | string;
      setErrors(typeof err === "string" ? { _form: [err] } : (err as Record<string, string[]>));
      setLoading(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  };

  // Build hierarchy labels for parent selector
  const buildLabel = (cat: { id: string; name: string; parent_id: string | null }): string => {
    if (!cat.parent_id) return cat.name;
    const parent = allCategories.find((c) => c.id === cat.parent_id);
    return parent ? `${buildLabel(parent)} → ${cat.name}` : cat.name;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text">
              {isEditing ? "Edit Category" : "Create Category"}
            </h1>
            <p className="text-sm text-text-secondary">
              {isEditing ? `Editing "${initialData.name}"` : "Add a new product category"}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEditing ? "Update" : "Create"}
        </Button>
      </div>

      {errors._form && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
          {errors._form.join(", ")}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-lg font-semibold text-text">Basic Information</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
                {errors.name && <p className="text-xs text-red-600">{errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
                {errors.slug && <p className="text-xs text-red-600">{errors.slug[0]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent Category</Label>
              <select
                id="parent_id"
                value={form.parent_id ?? ""}
                onChange={(e) => updateField("parent_id", e.target.value || null)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">— No parent (top-level) —</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {buildLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Category Image</Label>
              <div className="flex gap-2">
                <Input
                  id="image_url"
                  value={form.image_url}
                  onChange={(e) => updateField("image_url", e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="flex-1"
                />
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-secondary px-3 py-2 text-xs font-semibold hover:bg-surface-tertiary">
                    Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const signRes = await fetch("/api/media/sign", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ folder: "categories" }),
                        });
                        const signData = await signRes.json();
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("api_key", signData.apiKey);
                        formData.append("timestamp", signData.timestamp.toString());
                        formData.append("signature", signData.signature);
                        formData.append("folder", signData.folder);
                        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`, {
                          method: "POST",
                          body: formData,
                        });
                        const asset = await cloudRes.json();
                        updateField("image_url", asset.secure_url);
                      } catch (err) {
                        alert("Upload failed");
                      }
                    }}
                  />
                </label>
              </div>
              {form.image_url && (
                <div className="mt-2">
                  <img src={form.image_url} alt="Category Preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-lg font-semibold text-text">SEO</h2>
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={form.seo_title}
                onChange={(e) => updateField("seo_title", e.target.value)}
                maxLength={70}
              />
              <p className="text-xs text-text-muted">{form.seo_title.length}/70</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">Meta Description</Label>
              <textarea
                id="seo_description"
                value={form.seo_description}
                onChange={(e) => updateField("seo_description", e.target.value)}
                rows={3}
                maxLength={160}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
              <p className="text-xs text-text-muted">{form.seo_description.length}/160</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-lg font-semibold text-text">Settings</h2>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value as "active" | "inactive")}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={form.sort_order}
                onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
