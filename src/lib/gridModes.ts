export type FitMode = "cover" | "contain";

export type GridModeId =
  | "x-single"
  | "x-custom"
  | "instagram-grid"
  | "instagram-carousel";

export type GridPlatform = "x" | "instagram";

export type PreviewType = "x-post" | "instagram-profile" | "instagram-carousel";

export type GridMode = {
  id: GridModeId;
  platform: GridPlatform;
  label: string;
  shortLabel: string;
  description: string;
  selectLabel: string;
  actionLabel: string;
  outputCount: number;
  outputWidth: number;
  outputHeight: number;
  columns: number;
  rows: number;
  previewType: PreviewType;
  filenamePrefix: string;
  inputHint: string;
  advanced?: boolean;
};

export const GRID_MODES: GridMode[] = [
  {
    id: "x-single",
    platform: "x",
    label: "X 2x2 Image Splitter",
    shortLabel: "X 2x2",
    description:
      "Split one image into four parts for an X post preview with the familiar 2x2 layout.",
    selectLabel: "Select one image",
    actionLabel: "Split for X",
    outputCount: 4,
    outputWidth: 600,
    outputHeight: 337,
    columns: 2,
    rows: 2,
    previewType: "x-post",
    filenamePrefix: "x-grid",
    inputHint: "Best for wide images, announcements, screenshots, and poster-style posts.",
  },
  {
    id: "x-custom",
    platform: "x",
    label: "X Custom Grid Illusion",
    shortLabel: "X Custom",
    description:
      "Use one main image plus header and footer images to build the original X grid illusion.",
    selectLabel: "Select 9 images",
    actionLabel: "Create X illusion",
    outputCount: 4,
    outputWidth: 600,
    outputHeight: 1011,
    columns: 2,
    rows: 2,
    previewType: "x-post",
    filenamePrefix: "x-custom-grid",
    inputHint: "Advanced mode for the original 9-image grid illusion workflow.",
    advanced: true,
  },
  {
    id: "instagram-grid",
    platform: "instagram",
    label: "Instagram 3x3 Grid Maker",
    shortLabel: "IG 3x3",
    description:
      "Split one image into nine square posts for an Instagram profile grid.",
    selectLabel: "Select one image",
    actionLabel: "Split 3x3 grid",
    outputCount: 9,
    outputWidth: 1080,
    outputHeight: 1080,
    columns: 3,
    rows: 3,
    previewType: "instagram-profile",
    filenamePrefix: "instagram-grid",
    inputHint: "Post the downloads in reverse order so the profile grid lines up.",
  },
  {
    id: "instagram-carousel",
    platform: "instagram",
    label: "Instagram Carousel Splitter",
    shortLabel: "IG Carousel",
    description:
      "Split one wide image into square slides for a swipeable Instagram carousel.",
    selectLabel: "Select one wide image",
    actionLabel: "Split carousel",
    outputCount: 4,
    outputWidth: 1080,
    outputHeight: 1080,
    columns: 4,
    rows: 1,
    previewType: "instagram-carousel",
    filenamePrefix: "instagram-carousel",
    inputHint: "Best for panoramas, launch graphics, tutorials, and before/after visuals.",
  },
];

export const getGridMode = (id: GridModeId) => {
  const mode = GRID_MODES.find((item) => item.id === id);

  if (!mode) {
    throw new Error(`Unknown grid mode: ${id}`);
  }

  return mode;
};

export const getFilename = (mode: GridMode, index: number) =>
  `${mode.filenamePrefix}-${String(index + 1).padStart(2, "0")}.jpg`;
