import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, Textarea } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";

function PhotoUpload({ photo, onUpload, onRemove }: { photo: string; onUpload: () => void; onRemove: () => void }) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        useCVStore.getState().updateProfile({ photo: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }, []);

  if (photo) {
    return (
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 4px 16px -4px color-mix(in srgb, var(--color-accent), transparent 60%)",
              border: "3px solid transparent",
              backgroundImage: `linear-gradient(var(--color-raised), var(--color-raised)), linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #8b5cf6))`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <img src={photo} alt="Photo" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={onUpload}
          >
            <span className="text-white text-xs font-medium">Changer</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={onUpload}
            className="text-xs font-medium text-accent hover:text-accent/80 transition-colors text-left"
          >
            {t("editor.section.profile.changePhoto")}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-ink-muted hover:text-danger transition-colors text-left"
          >
            {t("actions.delete")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300"
      style={{
        borderColor: dragOver ? "var(--color-accent)" : "var(--color-border)",
        background: dragOver ? "var(--color-accent-dim)" : "transparent",
        transform: dragOver ? "scale(1.01)" : "scale(1)",
      }}
      onClick={onUpload}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300"
        style={{
          background: "var(--color-accent-dim)",
          transform: dragOver ? "scale(1.1) rotate(-5deg)" : "scale(1)",
        }}
      >
        <span className="text-xl font-medium text-ink-muted">+</span>
      </div>
      <p className="text-xs font-medium text-ink-muted">
        {t("editor.section.profile.addPhoto")}
      </p>
      <p className="text-[10px] text-ink-muted/60">
        Glisser-déposer ou cliquer
      </p>
    </div>
  );
}

export function ProfileEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const updateProfile = useCVStore((s) => s.updateProfile);

  if (!cv) return null;
  const p = cv.profile;

  const handlePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          updateProfile({ photo: reader.result });
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-accent">ID</span>
        <h3 className="text-sm font-bold text-ink">{t("editor.section.profile.title")}</h3>
      </div>

      <PhotoUpload
        photo={p.photo}
        onUpload={handlePhotoUpload}
        onRemove={() => updateProfile({ photo: "" })}
      />

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
