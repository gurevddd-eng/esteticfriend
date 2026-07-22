import { getHomepageContent } from "@/lib/site";
import { HomepageAdminClient } from "./HomepageAdminClient";

export default async function AdminHomepagePage() {
  const home = await getHomepageContent();
  return <HomepageAdminClient initial={home} />;
}
