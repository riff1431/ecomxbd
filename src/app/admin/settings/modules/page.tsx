import { getSystemModules } from "@/features/modules/actions";
import { ModulesClient } from "./modules-client";

export const metadata = {
  title: "Feature Modules & Integrations — Admin Dashboard",
};

export default async function AdminModulesPage() {
  const modules = await getSystemModules();
  return <ModulesClient initialModules={modules} />;
}
