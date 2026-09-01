import { getProductById } from "@/features/products/actions";
import ProductForm from "@/features/products/product-form";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  return <ProductForm initialData={product as unknown as Record<string, unknown>} />;
}
