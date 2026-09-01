import { getCustomerAddresses } from "@/features/account/actions";
import { AddressBookClient } from "./address-book-client";

export const metadata = {
  title: "Addresses — Customer Account",
};

export default async function CustomerAddressesPage() {
  const addresses = await getCustomerAddresses();

  return <AddressBookClient initialAddresses={addresses} />;
}
