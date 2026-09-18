export interface PrimaryColorPreset {
  id: string;
  label: string;
  primary: string;
}

export const primaryColorPresets: PrimaryColorPreset[] = [
  { id: "rose", label: "Rosa", primary: "330 22% 38%" },
  { id: "blue", label: "Azul", primary: "217 76% 42%" },
  { id: "green", label: "Verde", primary: "142 56% 32%" },
  { id: "violet", label: "Violeta", primary: "262 52% 47%" },
  { id: "orange", label: "Naranja", primary: "22 78% 42%" },
  { id: "red", label: "Rojo", primary: "0 65% 42%" },
];

export const defaultPrimaryColorId = "rose";

export const PRIMARY_COLOR_STORAGE_KEY = "front-tasks-primary-color";

export function getPresetById(id: string | null | undefined): PrimaryColorPreset {
  return primaryColorPresets.find((preset) => preset.id === id) ?? primaryColorPresets[0];
}

export function applyPrimaryColor(primary: string) {
  document.documentElement.style.setProperty("--primary", primary);
  document.documentElement.style.setProperty("--ring", primary);
}
