/**
 * The audit's 21 checks (completeness.CHECKS in the audit pipeline): 1 + 15 + 5.
 * Add none and drop none without changing the audit itself. Two labels follow
 * the printed audit rather than completeness.py, because that is what a reader
 * compares this list with: a review "in the last 30 days" earns the full points
 * (inside 90 earns part), and the owner photo counts "in the last year".
 *
 * TODO(Blake): the last website check is labelled by what it reads, pages that
 * name services and towns. The pipeline's town-page rule is one of the four
 * audit faults in the 2026-11-04 journal. Fix it there, then check this label.
 */
export const AUDIT_CHECKS: { group: string; items: string[] }[] = [
  {
    group: "The map",
    items: ["In the top three where people search"],
  },
  {
    group: "Your Google listing",
    items: [
      "The right main category",
      "Extra categories, next to the businesses that lead your map",
      "Verified",
      "Rated 4.5 or better",
      "20 or more reviews",
      "A review in the last 30 days",
      "A new review every month",
      "You answer your reviews",
      "You answer them within a week",
      "Photos, next to similar businesses near you",
      "A photo of your own in the last year",
      "Hours for all seven days",
      "A description",
      "Posts",
      "No customer question left unanswered",
    ],
  },
  {
    group: "Your website",
    items: [
      "Your listing opens a working site",
      "The site works on a phone",
      "The site shows the same number as your listing",
      "The home page says what you do and where",
      "Pages that name your services and towns",
    ],
  },
];
