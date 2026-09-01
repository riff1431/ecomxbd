import { getBrandById } from "@/features/brands/actions";
import BrandForm from "@/features/brands/brand-form";
export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await getBrandById(id);
  return <BrandForm initialData={brand} />;
}
