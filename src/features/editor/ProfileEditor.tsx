import { useTranslation } from "react-i18next";
import { Input, Textarea } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";

export function ProfileEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const updateProfile = useCVStore((s) => s.updateProfile);

  if (!cv) return null;
  const p = cv.profile;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-ink">{t("editor.section.profile.title")}</h3>
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="firstName"
          label={t("editor.section.profile.firstName")}
          value={p.firstName}
          onChange={(e) => updateProfile({ firstName: e.target.value })}
        />
        <Input
          id="lastName"
          label={t("editor.section.profile.lastName")}
          value={p.lastName}
          onChange={(e) => updateProfile({ lastName: e.target.value })}
        />
      </div>
      <Input
        id="jobTitle"
        label={t("editor.section.profile.jobTitle")}
        value={p.jobTitle}
        onChange={(e) => updateProfile({ jobTitle: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="email"
          label={t("editor.section.profile.email")}
          type="email"
          value={p.email}
          onChange={(e) => updateProfile({ email: e.target.value })}
        />
        <Input
          id="phone"
          label={t("editor.section.profile.phone")}
          type="tel"
          value={p.phone}
          onChange={(e) => updateProfile({ phone: e.target.value })}
        />
      </div>
      <Input
        id="location"
        label={t("editor.section.profile.location")}
        value={p.location}
        onChange={(e) => updateProfile({ location: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="linkedin"
          label={t("editor.section.profile.linkedin")}
          value={p.linkedin}
          onChange={(e) => updateProfile({ linkedin: e.target.value })}
        />
        <Input
          id="website"
          label={t("editor.section.profile.website")}
          value={p.website}
          onChange={(e) => updateProfile({ website: e.target.value })}
        />
      </div>
      <Textarea
        id="summary"
        label={t("editor.section.profile.summary")}
        value={p.summary}
        rows={4}
        onChange={(e) => updateProfile({ summary: e.target.value })}
      />
    </div>
  );
}
