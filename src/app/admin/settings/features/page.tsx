import { getSystemModules } from "@/features/modules/actions";
import { FeaturesClient } from "./features-client";

export const metadata = {
  title: "Feature Flags — Admin Dashboard",
};

export default async function AdminFeatureFlagsPage() {
  const modules = await getSystemModules();
  return <FeaturesClient initialModules={modules} />;
}
