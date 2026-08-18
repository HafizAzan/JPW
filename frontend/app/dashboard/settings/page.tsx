"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AccountSettingsForms } from "@/components/forms/AccountSettingsForms";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Update your email or keep your account secure."
      />
      <AccountSettingsForms />
    </div>
  );
}
