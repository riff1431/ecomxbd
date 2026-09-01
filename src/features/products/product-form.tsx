"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Loader2, ArrowLeft, Package, FileText,
  DollarSign, Ruler, Image as ImageIcon, Search,
  Box, Layers, Upload, Trash2, Plus, Check,
} from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { generateSlug, cn } from "@/lib/utils";
import { createProduct, updateProduct } from "@/features/products/actions";
import { getCategories } from "@/features/categories/actions";
import { getBrands } from "@/features/brands/actions";
import { getAttributes } from "@/features/attributes/actions";

interface AttributeOption {
  id: string;
  name: string;
  type: string;
  attribute_values: Array<{
    id: string;
    value: string;
    color_hex: string | null;
  }>;
}

interface VariantItem {
  id?: string;
  sku: string;
  regular_price: number;
  sale_price: number;
  cost_price: number;
  weight: number;
  status: "active" | "inactive";
  attribute_value_ids: string[];
  attribute_labels: string[];
}

export default function ProductForm({ initialData }: { initialData?: Record<string, unknown> }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Array<{ id: string; name: string; parent_id: string | null }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [availableAttributes, setAvailableAttributes] = useState<AttributeOption[]>([]);

  // Media upload state
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData?.og_image_url ? [initialData.og_image_url as string] : []
  );

  // Variant generator state
  const [selectedAttrIds, setSelectedAttrIds] = useState<string[]>([]);
  const [selectedValuesByAttr, setSelectedValuesByAttr] = useState<Record<string, string[]>>({});
  const [generatedVariants, setGeneratedVariants] = useState<VariantItem[]>([]);

  const [form, setForm] = useState({
    name: (initialData?.name as string) ?? "",
    slug: (initialData?.slug as string) ?? "",
    sku: (initialData?.sku as string) ?? "",
    barcode: (initialData?.barcode as string) ?? "",
    product_type: (initialData?.product_type as string) ?? "simple",
    brand_id: (initialData?.brand_id as string) ?? "",
    status: (initialData?.status as string) ?? "draft",
    is_featured: (initialData?.is_featured as boolean) ?? false,
    selectedCategories: [] as string[],
    tags: "" as string,
    // Content
    short_description: (initialData?.short_description as string) ?? "",
    description: (initialData?.description as string) ?? "",
    benefits: (initialData?.benefits as string) ?? "",
    usage: (initialData?.usage as string) ?? "",
    ingredients_specifications: (initialData?.ingredients_specifications as string) ?? "",
    country: (initialData?.country as string) ?? "",
    warranty: (initialData?.warranty as string) ?? "",
    // Pricing
    cost_price: (initialData?.cost_price as number) ?? 0,
    regular_price: (initialData?.regular_price as number) ?? 0,
    sale_price: (initialData?.sale_price as number) ?? 0,
    sale_start: (initialData?.sale_start as string) ?? "",
    sale_end: (initialData?.sale_end as string) ?? "",
    // Physical
    weight: (initialData?.weight as number) ?? 0,
    length: (initialData?.length as number) ?? 0,
    width: (initialData?.width as number) ?? 0,
    height: (initialData?.height as number) ?? 0,
    shipping_class: (initialData?.shipping_class as string) ?? "",
    // SEO
    seo_title: (initialData?.seo_title as string) ?? "",
    seo_description: (initialData?.seo_description as string) ?? "",
    canonical_override: (initialData?.canonical_override as string) ?? "",
    og_image_url: (initialData?.og_image_url as string) ?? "",
    is_indexed: (initialData?.is_indexed as boolean) ?? true,
    // Inventory
    initial_stock: 0,
  });

  useEffect(() => {
    Promise.all([getCategories(), getBrands(), getAttributes()]).then(([cats, brs, attrs]) => {
      setCategories(cats as Array<{ id: string; name: string; parent_id: string | null }>);
      setBrands(brs as Array<{ id: string; name: string }>);
      setAvailableAttributes(attrs as unknown as AttributeOption[]);
    });
  }, []);

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "name" && !isEditing) {
      setForm((prev) => ({ ...prev, slug: generateSlug(value as string) }));
    }
  };

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter((c) => c !== id)
        : [...prev.selectedCategories, id],
    }));
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const signRes = await fetch("/api/media/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "products" }),
        });

        if (!signRes.ok) throw new Error("Failed to get upload signature");
        const signData = await signRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", signData.timestamp.toString());
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
          { method: "POST", body: formData }
        );

        if (!cloudRes.ok) throw new Error("Cloudinary upload failed");
        const asset = await cloudRes.json();

        setGalleryImages((prev) => {
          const next = [...prev, asset.secure_url];
          if (!form.og_image_url) {
            updateField("og_image_url", asset.secure_url);
          }
          return next;
        });
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    setGalleryImages((prev) => {
      const next = prev.filter((img) => img !== url);
      if (form.og_image_url === url) {
        updateField("og_image_url", next[0] || "");
      }
      return next;
    });
  };

  // Toggle attribute selection for variants
  const toggleAttribute = (attrId: string) => {
    setSelectedAttrIds((prev) =>
      prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId]
    );
  };

  // Toggle attribute value selection
  const toggleAttrValue = (attrId: string, valId: string) => {
    setSelectedValuesByAttr((prev) => {
      const current = prev[attrId] || [];
      const updated = current.includes(valId)
        ? current.filter((id) => id !== valId)
        : [...current, valId];
      return { ...prev, [attrId]: updated };
    });
  };

  // Generate Cartesian Product of selected attribute values
  const generateVariantCombinations = () => {
    const activeAttrs = availableAttributes.filter((a) =>
      selectedAttrIds.includes(a.id) && (selectedValuesByAttr[a.id] || []).length > 0
    );

    if (activeAttrs.length === 0) {
      alert("Please select at least one attribute and value.");
      return;
    }

    const valueArrays = activeAttrs.map((attr) => {
      const chosenValueIds = selectedValuesByAttr[attr.id] || [];
      return attr.attribute_values.filter((v) => chosenValueIds.includes(v.id));
    });

    const cartesian = (arrays: any[][]): any[][] => {
      return arrays.reduce<any[][]>(
        (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
        [[]]
      );
    };

    const combinations = cartesian(valueArrays);

    const newVariants: VariantItem[] = combinations.map((combo, idx) => {
      const items = Array.isArray(combo) ? combo : [combo];
      const valueIds = items.map((i: any) => i.id);
      const labels = items.map((i: any) => i.value);
      const skuSuffix = labels.map((l: string) => l.toUpperCase().replace(/\s+/g, "")).join("-");

      return {
        sku: form.sku ? `${form.sku}-${skuSuffix}` : `VAR-${idx + 1}-${skuSuffix}`,
        regular_price: form.regular_price || 0,
        sale_price: form.sale_price || 0,
        cost_price: form.cost_price || 0,
        weight: form.weight || 0,
        status: "active",
        attribute_value_ids: valueIds,
        attribute_labels: labels,
      };
    });

    setGeneratedVariants(newVariants);
  };

  const updateVariantRow = (index: number, key: keyof VariantItem, val: any) => {
    setGeneratedVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: val } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and slug are required");
      return;
    }
    setLoading(true);
    setError("");

    const productData = {
      name: form.name,
      slug: form.slug,
      sku: form.sku || null,
      barcode: form.barcode || null,
      product_type: form.product_type,
      brand_id: form.brand_id || null,
      status: form.status,
      is_featured: form.is_featured,
      short_description: form.short_description || null,
      description: form.description || null,
      benefits: form.benefits || null,
      usage: form.usage || null,
      ingredients_specifications: form.ingredients_specifications || null,
      country: form.country || null,
      warranty: form.warranty || null,
      cost_price: form.cost_price || null,
      regular_price: form.regular_price || 0,
      sale_price: form.sale_price || null,
      sale_start: form.sale_start || null,
      sale_end: form.sale_end || null,
      weight: form.weight || null,
      length: form.length || null,
      width: form.width || null,
      height: form.height || null,
      shipping_class: form.shipping_class || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      canonical_override: form.canonical_override || null,
      og_image_url: form.og_image_url || galleryImages[0] || null,
      is_indexed: form.is_indexed,
    };

    const tagNames = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const variantsPayload =
      form.product_type === "variable" && generatedVariants.length > 0
        ? generatedVariants.map((v) => ({
            sku: v.sku,
            regular_price: v.regular_price,
            sale_price: v.sale_price || undefined,
            cost_price: v.cost_price || undefined,
            weight: v.weight || undefined,
            status: v.status,
            attribute_value_ids: v.attribute_value_ids,
          }))
        : undefined;

    const result = isEditing
      ? await updateProduct(initialData!.id as string, {
          product: productData,
          category_ids: form.selectedCategories,
          tag_names: tagNames,
        })
      : await createProduct({
          product: productData,
          category_ids: form.selectedCategories,
          tag_names: tagNames,
          variants: variantsPayload,
          initial_stock: form.initial_stock,
        });

    if (result.error) {
      setError(typeof result.error === "string" ? result.error : "Failed to save product");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const dynamicTabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "content", label: "Content", icon: FileText },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    ...(form.product_type === "variable"
      ? [{ id: "variants", label: "Variants", icon: Layers }]
      : []),
    { id: "physical", label: "Physical", icon: Ruler },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "seo", label: "SEO", icon: Search },
    { id: "inventory", label: "Inventory", icon: Box },
  ];

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
              {isEditing ? "Edit Product" : "Create Product"}
            </h1>
            <p className="text-xs text-text-secondary">
              {form.product_type === "variable" ? "Configuring Variable Product" : "Configuring Simple Product"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-secondary p-1">
        {dynamicTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-white text-text shadow-card"
                  : "text-text-muted hover:text-text"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Info */}
          {activeTab === "basic" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-text">Basic Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input value={form.sku} onChange={(e) => updateField("sku", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Barcode</Label>
                  <Input value={form.barcode} onChange={(e) => updateField("barcode", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <select
                    value={form.product_type}
                    onChange={(e) => updateField("product_type", e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                  >
                    <option value="simple">Simple Product</option>
                    <option value="variable">Variable Product (with Variants)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <select
                    value={form.brand_id}
                    onChange={(e) => updateField("brand_id", e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                  >
                    <option value="">— No brand —</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={form.tags} onChange={(e) => updateField("tags", e.target.value)} placeholder="skincare, essence, k-beauty" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => updateField("is_featured", e.target.checked)} className="rounded border-border" />
                <span className="text-sm text-text font-medium">Feature on Homepage</span>
              </label>
            </div>
          )}

          {/* 2. Content */}
          {activeTab === "content" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-text">Product Content</h2>
              {[
                { key: "short_description", label: "Short Description", rows: 2 },
                { key: "description", label: "Full Description", rows: 6 },
                { key: "benefits", label: "Benefits", rows: 4 },
                { key: "usage", label: "How to Use", rows: 3 },
                { key: "ingredients_specifications", label: "Ingredients / Specifications", rows: 4 },
              ].map(({ key, label, rows }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <textarea
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => updateField(key as keyof typeof form, e.target.value as never)}
                    rows={rows}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm resize-none focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              ))}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Country of Origin</Label>
                  <Input value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="e.g. South Korea" />
                </div>
                <div className="space-y-2">
                  <Label>Warranty</Label>
                  <Input value={form.warranty} onChange={(e) => updateField("warranty", e.target.value)} placeholder="e.g. 100% Authentic" />
                </div>
              </div>
            </div>
          )}

          {/* 3. Pricing */}
          {activeTab === "pricing" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-text">Base Pricing</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Cost Price (৳)</Label>
                  <Input type="number" step="0.01" min="0" value={form.cost_price || ""} onChange={(e) => updateField("cost_price", parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Regular Price (৳) *</Label>
                  <Input type="number" step="0.01" min="0" value={form.regular_price || ""} onChange={(e) => updateField("regular_price", parseFloat(e.target.value) || 0)} required />
                </div>
                <div className="space-y-2">
                  <Label>Sale Price (৳)</Label>
                  <Input type="number" step="0.01" min="0" value={form.sale_price || ""} onChange={(e) => updateField("sale_price", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              {form.regular_price > 0 && form.sale_price > 0 && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                  💰 Discount: {Math.round((1 - form.sale_price / form.regular_price) * 100)}% off
                  (saving ৳{(form.regular_price - form.sale_price).toFixed(2)})
                </div>
              )}
            </div>
          )}

          {/* 4. Variants Generator (Variable Products Only) */}
          {activeTab === "variants" && form.product_type === "variable" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-text">Product Variants Generator</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Choose attributes and values to generate variant combinations automatically.
                </p>
              </div>

              {/* Attributes & Value Pickers */}
              <div className="space-y-4 rounded-lg border border-border p-4 bg-surface-secondary/40">
                <Label className="font-semibold text-text">1. Select Attributes to Use</Label>
                <div className="flex flex-wrap gap-2">
                  {availableAttributes.map((attr) => (
                    <Button
                      key={attr.id}
                      type="button"
                      size="sm"
                      variant={selectedAttrIds.includes(attr.id) ? "default" : "outline"}
                      onClick={() => toggleAttribute(attr.id)}
                    >
                      {selectedAttrIds.includes(attr.id) && <Check className="h-3.5 w-3.5 mr-1" />}
                      {attr.name}
                    </Button>
                  ))}
                </div>

                {selectedAttrIds.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-border">
                    <Label className="font-semibold text-text">2. Choose Values for Each Attribute</Label>
                    {availableAttributes
                      .filter((a) => selectedAttrIds.includes(a.id))
                      .map((attr) => (
                        <div key={attr.id} className="space-y-1.5">
                          <span className="text-xs font-bold text-text uppercase">{attr.name}:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {attr.attribute_values.map((v) => {
                              const isChecked = (selectedValuesByAttr[attr.id] || []).includes(v.id);
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => toggleAttrValue(attr.id, v.id)}
                                  className={cn(
                                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors border",
                                    isChecked
                                      ? "bg-primary-600 text-white border-primary-600 font-semibold"
                                      : "bg-white text-text-secondary border-border hover:border-text-muted"
                                  )}
                                >
                                  {v.color_hex && (
                                    <span
                                      className="h-2.5 w-2.5 rounded-full border border-black/20"
                                      style={{ backgroundColor: v.color_hex }}
                                    />
                                  )}
                                  {v.value}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={generateVariantCombinations}
                  className="mt-2"
                >
                  <Layers className="h-4 w-4 mr-1.5" />
                  Generate Combinations Matrix
                </Button>
              </div>

              {/* Generated Variants Table */}
              {generatedVariants.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-text">
                      Generated Variants ({generatedVariants.length})
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-surface-secondary text-text-muted border-b border-border">
                        <tr>
                          <th className="p-2.5">Variant</th>
                          <th className="p-2.5">SKU</th>
                          <th className="p-2.5">Regular Price (৳)</th>
                          <th className="p-2.5">Sale Price (৳)</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-white">
                        {generatedVariants.map((variant, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-medium text-text whitespace-nowrap">
                              {variant.attribute_labels.join(" / ")}
                            </td>
                            <td className="p-2.5">
                              <Input
                                value={variant.sku}
                                onChange={(e) => updateVariantRow(idx, "sku", e.target.value)}
                                className="h-7 text-xs w-32"
                              />
                            </td>
                            <td className="p-2.5">
                              <Input
                                type="number"
                                value={variant.regular_price}
                                onChange={(e) => updateVariantRow(idx, "regular_price", parseFloat(e.target.value) || 0)}
                                className="h-7 text-xs w-24"
                              />
                            </td>
                            <td className="p-2.5">
                              <Input
                                type="number"
                                value={variant.sale_price}
                                onChange={(e) => updateVariantRow(idx, "sale_price", parseFloat(e.target.value) || 0)}
                                className="h-7 text-xs w-24"
                              />
                            </td>
                            <td className="p-2.5">
                              <select
                                value={variant.status}
                                onChange={(e) => updateVariantRow(idx, "status", e.target.value)}
                                className="rounded border border-border h-7 text-xs px-1"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Physical Specs */}
          {activeTab === "physical" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-text">Physical Dimensions</h2>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.001" min="0" value={form.weight || ""} onChange={(e) => updateField("weight", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Length (cm)</Label>
                  <Input type="number" step="0.01" min="0" value={form.length || ""} onChange={(e) => updateField("length", parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Width (cm)</Label>
                  <Input type="number" step="0.01" min="0" value={form.width || ""} onChange={(e) => updateField("width", parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" step="0.01" min="0" value={form.height || ""} onChange={(e) => updateField("height", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shipping Class</Label>
                <Input value={form.shipping_class} onChange={(e) => updateField("shipping_class", e.target.value)} placeholder="e.g. standard, fragile" />
              </div>
            </div>
          )}

          {/* 6. Media Tab with Direct Cloudinary Upload */}
          {activeTab === "media" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-text">Product Images & Gallery</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Upload images directly to Cloudinary. The first image will be used as the featured product image.
                </p>
              </div>

              {/* Upload Box */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/40 p-8 text-center cursor-pointer transition-colors hover:bg-primary-50"
              >
                {uploadingMedia ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <p className="text-xs font-semibold text-primary-700">Uploading to Cloudinary...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-primary-600" />
                    <p className="text-sm font-semibold text-text">Click to upload product images</p>
                    <p className="text-xs text-text-muted">JPG, PNG, WebP up to 10MB each</p>
                  </div>
                )}
              </div>

              {/* Gallery Grid */}
              {galleryImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Photos ({galleryImages.length})</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-lg border border-border overflow-hidden bg-surface-secondary"
                      >
                        <img src={url} alt="Product" className="h-full w-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                            Featured
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. SEO Tab */}
          {activeTab === "seo" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-text">Search Engine Optimization</h2>
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} maxLength={70} />
                <p className="text-xs text-text-muted">{form.seo_title.length}/70</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <textarea
                  value={form.seo_description}
                  onChange={(e) => updateField("seo_description", e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm resize-none focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <p className="text-xs text-text-muted">{form.seo_description.length}/160</p>
              </div>
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input value={form.og_image_url} onChange={(e) => updateField("og_image_url", e.target.value)} placeholder="https://res.cloudinary.com/..." />
              </div>
            </div>
          )}

          {/* 8. Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-text">Initial Inventory</h2>
              <div className="space-y-2">
                <Label>Initial Stock (on-hand units)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.initial_stock || ""}
                  onChange={(e) => updateField("initial_stock", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-text-muted">
                  Sets initial available stock. Ongoing changes should be made in the Inventory Manager.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-3">
            <h2 className="text-lg font-semibold text-text">Categories</h2>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-text">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-3">
            <h2 className="text-lg font-semibold text-text">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <span className="font-medium text-text capitalize">{form.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Type</span>
                <span className="font-medium text-text capitalize">{form.product_type}</span>
              </div>
              {form.regular_price > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Price</span>
                  <span className="font-medium text-text">৳{form.regular_price}</span>
                </div>
              )}
              {form.product_type === "variable" && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Variants</span>
                  <span className="font-medium text-primary-600">{generatedVariants.length} generated</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
