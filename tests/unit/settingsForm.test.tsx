import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { DEFAULT_SETTINGS } from "@/lib/constants";

describe("SettingsForm", () => {
  it("sends updates when display name changes", () => {
    const onChange = vi.fn();

    render(<SettingsForm settings={DEFAULT_SETTINGS} onChange={onChange} />);

    fireEvent.change(screen.getByDisplayValue("Sarah"), { target: { value: "Marcus" } });
    expect(onChange).toHaveBeenCalledWith({ displayName: "Marcus" });
  });
});
