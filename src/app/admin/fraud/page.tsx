import { getFraudProfiles } from "@/features/fraud/actions";
import { FraudCheckerClient } from "@/features/fraud/fraud-checker-client";

export const metadata = {
  title: "Fraud Controls — Admin Dashboard",
};

export default async function AdminFraudPage() {
  const profiles = await getFraudProfiles();

  return <FraudCheckerClient initialProfiles={profiles} />;
}
