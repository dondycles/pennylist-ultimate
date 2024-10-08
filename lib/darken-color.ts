import { colors } from "./colors";

export const darken_color = (c: string) => {
  const filtered_colors: string[] = [];
  Object.values(colors).map((color) => {
    filtered_colors.push(color[100], color[200], color[300], color[400]);
  });

  if (filtered_colors.includes(c)) return "brightness-50 saturate-200";
  return "";
};
