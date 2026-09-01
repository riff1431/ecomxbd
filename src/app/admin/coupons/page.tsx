import { getCoupons } from "@/features/coupons/actions";
import { CouponListClient } from "@/features/coupons/coupon-list-client";

export const metadata = {
  title: "Coupons — Admin Dashboard",
};

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return <CouponListClient initialCoupons={coupons} />;
}
