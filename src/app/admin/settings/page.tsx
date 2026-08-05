import { SITE } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { SettingsAdminClient } from "./SettingsAdminClient";

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <SettingsAdminClient
      settings={settings}
      defaults={{
        phone: SITE.phone,
        email: SITE.email,
        cities: SITE.cities,
        tagline: SITE.tagline,
        about: SITE.about,
        aboutExtra: SITE.aboutExtra,
      }}
    />
  );
}
