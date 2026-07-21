import { describe, expect, it } from "vitest";
import { createEmptyCV } from "./cv";

describe("createEmptyCV", () => {
  it("creates a CV with the given id and profile", () => {
    const cv = createEmptyCV("test-id", "default");

    expect(cv.meta.id).toBe("test-id");
    expect(cv.meta.profile).toBe("default");
    expect(cv.meta.version).toBe("1.0");
    expect(cv.meta.language).toBe("fr");
  });

  it("creates default sections", () => {
    const cv = createEmptyCV("test-id", "default");

    const types = cv.sections.map((s) => s.type);
    expect(types).toContain("experience");
    expect(types).toContain("education");
    expect(types).toContain("skills");
    expect(types).toContain("languages");
  });

  it("creates an empty profile", () => {
    const cv = createEmptyCV("test-id", "default");

    expect(cv.profile.firstName).toBe("");
    expect(cv.profile.lastName).toBe("");
    expect(cv.profile.email).toBe("");
  });

  it("sets default customization values", () => {
    const cv = createEmptyCV("test-id", "default");

    expect(cv.customization.font).toBe("Inter");
    expect(cv.customization.fontSize).toBe(10);
    expect(cv.customization.colors.accent).toBe("#2d7d9a");
  });
});
