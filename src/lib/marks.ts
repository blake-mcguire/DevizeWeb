/**
 * The three marks every audit search gets, with the same labels and colours
 * the audit page (/a/<token>) and the audit PDF's map use.
 */
export const MARKS = [
  { key: "top3", label: "In the top three", color: "#2E9E5B" },
  { key: "mid", label: "Fourth to twentieth", color: "#E0A500" },
  { key: "absent", label: "Nowhere in the first twenty", color: "#8E8A80" },
] as const;

export type MarkKey = (typeof MARKS)[number]["key"];
