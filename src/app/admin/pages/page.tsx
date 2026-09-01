import { getCMSPages } from "@/features/pages/actions";
import { PagesClient } from "./pages-client";

export const metadata = {
  title: "CMS Static Pages & Content — Admin Dashboard",
  description: "Manage CMS pages, policy documents, FAQ content, and rich static pages.",
};

export default async function AdminCMSPagesPage() {
  const pages = await getCMSPages();

  return <PagesClient initialPages={pages} />;
}
