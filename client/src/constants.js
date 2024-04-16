export const API_URL = import.meta.env.VITE_API_URL;
export const ICON_SIZE = 18;
export const HOTKEYS = {
  b: "bold",
  i: "italic",
  u: "underline",
  "`": "code",
};
export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
export const INITIAL_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
export const DEFAULT_COVER_PHOTO = "../preview.png";