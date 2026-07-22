import { prisma } from "@/lib/prisma";
import { ReviewsAdminClient } from "./ReviewsAdminClient";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
  return <ReviewsAdminClient reviews={reviews} />;
}
