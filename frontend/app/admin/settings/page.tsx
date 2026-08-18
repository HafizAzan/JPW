"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AccountSettingsForms } from "@/components/forms/AccountSettingsForms";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Update your administrator email or password."
      />
      <AccountSettingsForms />
    </div>
  );
}
