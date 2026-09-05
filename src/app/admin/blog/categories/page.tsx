import { getBlogCategories } from "@/features/blog/actions";
import { CategoryManagerClient } from "./category-manager-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogCategoriesPage() {
  const categories = await getBlogCategories();
  return <CategoryManagerClient initialCategories={categories} />;
}
