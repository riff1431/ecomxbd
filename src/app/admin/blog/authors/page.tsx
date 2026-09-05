import { getBlogAuthors } from "@/features/blog/actions";
import { AuthorManagerClient } from "./author-manager-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogAuthorsPage() {
  const authors = await getBlogAuthors();
  return <AuthorManagerClient initialAuthors={authors} />;
}
