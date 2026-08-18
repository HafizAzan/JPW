"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AccountSettingsForms } from "@/components/forms/AccountSettingsForms";

export default function EmployerSettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Update your email or account security for your hiring workspace."
      />
      <AccountSettingsForms />
    </div>
  );
}
