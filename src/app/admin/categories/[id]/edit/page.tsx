import { getCategoryById } from "@/features/categories/actions";
import CategoryForm from "@/features/categories/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);
  return <CategoryForm initialData={category} />;
}
