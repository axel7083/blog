// Lucide icons (ISC licence, https://lucide.dev), inner markup of a 24×24 stroke icon.
export const icons = {
  'cpu': "<path d=\"M12 20v2\"/><path d=\"M12 2v2\"/><path d=\"M17 20v2\"/><path d=\"M17 2v2\"/><path d=\"M2 12h2\"/><path d=\"M2 17h2\"/><path d=\"M2 7h2\"/><path d=\"M20 12h2\"/><path d=\"M20 17h2\"/><path d=\"M20 7h2\"/><path d=\"M7 20v2\"/><path d=\"M7 2v2\"/><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><rect x=\"8\" y=\"8\" width=\"8\" height=\"8\" rx=\"1\"/>",
  'ethernet-port': "<path d=\"M10 8v1\"/><path d=\"M14 8v1\"/><path d=\"M18 8v1\"/><path d=\"M19 17a2 2 0 00-1.765 1.059l-.47.882A2 2 0 0115 20H9a2 2 0 01-1.765-1.059l-.47-.882A2 2 0 005 17H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v9a2 2 0 01-2 2z\"/><path d=\"M6 8v1\"/>",
  'hard-drive': "<path d=\"M10 16h.01\"/><path d=\"M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/><path d=\"M21.946 12.013H2.054\"/><path d=\"M6 16h.01\"/>",
  'memory-stick': "<path d=\"M12 12v-2\"/><path d=\"M12 18v-2\"/><path d=\"M16 12v-2\"/><path d=\"M16 18v-2\"/><path d=\"M2 11h1.5\"/><path d=\"M20 18v-2\"/><path d=\"M20.5 11H22\"/><path d=\"M4 18v-2\"/><path d=\"M8 12v-2\"/><path d=\"M8 18v-2\"/><rect x=\"2\" y=\"6\" width=\"20\" height=\"10\" rx=\"2\"/>",
  'microchip': "<path d=\"M10 12h4\"/><path d=\"M10 17h4\"/><path d=\"M10 7h4\"/><path d=\"M18 12h2\"/><path d=\"M18 18h2\"/><path d=\"M18 6h2\"/><path d=\"M4 12h2\"/><path d=\"M4 18h2\"/><path d=\"M4 6h2\"/><rect x=\"6\" y=\"2\" width=\"12\" height=\"20\" rx=\"2\"/>",
  'shield-check': "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/>",
} as const;

export type IconName = keyof typeof icons;
