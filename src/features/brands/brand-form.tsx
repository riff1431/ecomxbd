"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { generateSlug } from "@/lib/utils";
import { createBrand, updateBrand } from "@/features/brands/actions";
import { ImageUploadDropzone } from "@/components/shared/image-upload-dropzone";

interface BrandFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    banner_url: string | null;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    status: string;
  };
}

export default function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    logo_url: initialData?.logo_url ?? "",
    banner_url: initialData?.banner_url ?? "",
    description: initialData?.description ?? "",
    seo_title: initialData?.seo_title ?? "",
    seo_description: initialData?.seo_description ?? "",
    status: (initialData?.status ?? "active") as "active" | "inactive",
  });

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
      ? await updateBrand(initialData!.id, form)
      : await createBrand(form);

    if ("error" in result && result.error) {
      const err = result.error as Record<string, string[]> | string;
      setErrors(typeof err === "string" ? { _form: [err] } : (err as Record<string, string[]>));
      setLoading(false);
      return;
    }

    router.push("/admin/brands");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text">
              {isEditing ? "Edit Brand" : "Create Brand"}
            </h1>
            <p className="text-sm text-text-secondary">
              {isEditing ? `Editing "${initialData.name}"` : "Add a new product brand"}
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
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-lg font-semibold text-text">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
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
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <ImageUploadDropzone
                label="Brand Logo"
                description="Square brand emblem or logo icon"
                value={form.logo_url || ""}
                onChange={(url) => updateField("logo_url", url)}
                folder="brands"
                previewShape="circle"
              />
              <ImageUploadDropzone
                label="Brand Banner"
                description="Wide brand hero cover image"
                value={form.banner_url || ""}
                onChange={(url) => updateField("banner_url", url)}
                folder="brands"
                previewShape="banner"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-lg font-semibold text-text">SEO</h2>
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input id="seo_title" value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} maxLength={70} />
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
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
              <p className="text-xs text-text-muted">{form.seo_description.length}/160</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-lg font-semibold text-text">Settings</h2>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value as "active" | "inactive")}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          {form.logo_url && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-2">
              <h2 className="text-lg font-semibold text-text">Logo Preview</h2>
              <img src={form.logo_url} alt="Logo" className="max-h-24 rounded-lg object-contain" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
