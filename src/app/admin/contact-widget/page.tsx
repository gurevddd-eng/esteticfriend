import { getContactWidgetConfig } from "@/lib/catalog";
import { ContactWidgetAdminClient } from "./ContactWidgetAdminClient";

export default async function AdminContactWidgetPage() {
  const config = await getContactWidgetConfig();

  return <ContactWidgetAdminClient initialConfig={config} />;
}
