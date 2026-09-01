"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Package, Archive, Eye } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { DataTable, RowActions, RowAction, type Column } from "@/components/admin/data-table";
import { getProducts, deleteProduct, bulkUpdateProductStatus } from "@/features/products/actions";
import { formatPrice, cn } from "@/lib/utils";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  product_type: string;
  status: string;
  regular_price: number;
  sale_price: number | null;
  is_featured: boolean;
  created_at: string;
  brands: { name: string } | null;
  inventory: Array<{ on_hand: number; available: number }>;
}

export default function ProductListClient() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data as ProductRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Archive "${name}"? This will soft-delete the product.`)) return;
    const result = await deleteProduct(id);
    if (result.error) { alert(result.error); return; }
    fetchData();
  };

  const getStock = (inv: Array<{ on_hand: number; available: number }>) => {
    if (!inv || inv.length === 0) return { on_hand: 0, available: 0 };
    return inv.reduce((acc, i) => ({
      on_hand: acc.on_hand + (i.on_hand || 0),
      available: acc.available + (i.available || 0),
    }), { on_hand: 0, available: 0 });
  };

  const columns: Column<ProductRow>[] = [
    {
      key: "name",
      header: "Product",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-secondary text-text-muted">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-text truncate max-w-[200px]">{row.name}</p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              {row.sku && <span>SKU: {row.sku}</span>}
              <span className="capitalize">{row.product_type}</span>
              {row.is_featured && (
                <span className="rounded bg-yellow-50 px-1.5 py-0.5 text-yellow-700 font-medium">Featured</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "brand",
      header: "Brand",
      cell: (row) => (
        <span className="text-text-secondary">{row.brands?.name ?? "—"}</span>
      ),
    },
    {
      key: "regular_price",
      header: "Price",
      sortable: true,
      cell: (row) => (
        <div>
          {row.sale_price ? (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-text">{formatPrice(row.sale_price)}</span>
              <span className="text-xs text-text-muted line-through">{formatPrice(row.regular_price)}</span>
            </div>
          ) : (
            <span className="font-medium text-text">{formatPrice(row.regular_price)}</span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (row) => {
        const stock = getStock(row.inventory);
        return (
          <span className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            stock.available > 10 ? "bg-green-50 text-green-700" :
            stock.available > 0 ? "bg-yellow-50 text-yellow-700" :
            "bg-red-50 text-red-700"
          )}>
            {stock.available} available
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (
        <span className={cn(
          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
          row.status === "active" ? "bg-green-50 text-green-700" :
          row.status === "draft" ? "bg-yellow-50 text-yellow-700" :
          "bg-gray-100 text-gray-600"
        )}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Products</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your product catalog ({products.length} products)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchPlaceholder="Search products by name or SKU..."
        searchKey="name"
        getRowId={(row) => row.id}
        emptyMessage="No products found. Create your first product."
        emptyIcon={<Package className="h-6 w-6" />}
        headerActions={
          <Link href="/admin/products/create">
            <Button><Plus className="h-4 w-4" /> Add Product</Button>
          </Link>
        }
        bulkActions={
          <>
            <Button size="sm" variant="outline" onClick={() => {}}>
              <Eye className="h-3.5 w-3.5" /> Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => {}}>
              <Archive className="h-3.5 w-3.5" /> Archive
            </Button>
          </>
        }
        actions={(row) => (
          <RowActions>
            <RowAction onClick={() => router.push(`/admin/products/${row.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </RowAction>
            <RowAction onClick={() => window.open(`/products/${row.slug}`, "_blank")}>
              <Eye className="h-3.5 w-3.5" /> View
            </RowAction>
            <RowAction variant="danger" onClick={() => handleDelete(row.id, row.name)}>
              <Trash2 className="h-3.5 w-3.5" /> Archive
            </RowAction>
          </RowActions>
        )}
      />
    </div>
  );
}
