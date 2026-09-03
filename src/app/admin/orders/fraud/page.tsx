import { getFraudProfiles } from "@/features/fraud/actions";
import FraudBlacklistClient from "./fraud-blacklist-client";

export const metadata = {
  title: "Fraud Prevention & Blacklist — Admin Dashboard",
};

export default async function AdminFraudPage() {
  const profiles = await getFraudProfiles();

  return <FraudBlacklistClient initialProfiles={profiles} />;
}
