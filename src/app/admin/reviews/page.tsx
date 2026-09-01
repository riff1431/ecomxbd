import { getAdminReviews } from "@/features/reviews/actions";
import { ReviewListClient } from "@/features/reviews/review-list-client";

export const metadata = {
  title: "Reviews Moderation — Admin Dashboard",
};

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return <ReviewListClient initialReviews={reviews} />;
}
