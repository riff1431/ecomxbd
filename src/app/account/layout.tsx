import type { Metadata } from "next";
import AccountLayoutClient from "@/components/account/account-layout-client";

export const metadata: Metadata = {
  title: {
    default: "My Account",
    template: "%s | My Account — ecomXbangladesh",
  },
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayoutClient>{children}</AccountLayoutClient>;
}
