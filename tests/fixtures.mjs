/**
 * Page documents for the tests. Every business here is invented.
 */

/** A 22-character token (the pipeline's length) from a short label. */
export function tok(label) {
  return `${label}_${"0".repeat(22)}`.slice(0, 22);
}

/** A token exactly as the pipeline makes one (22 letters and digits, no underscore), from a short label of letters and digits. */
export function alnumTok(label) {
  return `${label}${"0".repeat(22)}`.slice(0, 22);
}

/** links/<slug>.json as the pipeline writes it (voice build contract 8.4). */
export function linkFile(slug, token) {
  return { v: 1, slug, token };
}

const pick = (label) => ({ next_open_day: `next-${label}`, appt_windows: `windows-${label}` });

/** Monday to Friday 8 AM to 5 PM, Saturday 9 AM to 1 PM, Sunday closed. Index 0 is Monday. */
export function weekTable() {
  const days = {};
  for (let d = 0; d < 7; d++) {
    const spans = d < 5 ? [[480, 1020]] : d === 5 ? [[540, 780]] : [];
    days[String(d)] = { spans, before_close: pick(`d${d}-before`), after_close: pick(`d${d}-after`) };
  }
  return days;
}

/** The three arrival windows the pipeline cuts from an eight to five day, as words. */
export const FULL_DAY_WINDOWS = "morning eight to eleven, midday eleven to one, afternoon one to four";

/**
 * A week as the pipeline's page writer stores it (voice_slots.clock_days): Monday to Friday 8 AM to 5 PM,
 * Saturday and Sunday closed. Each open day carries its own arrival windows as [start, end, words]; both
 * stored pairs of a day are the same pair, the next open day after it. Index 0 is Monday.
 */
export function pipelineWeekTable() {
  const next = ["tomorrow, Tuesday", "tomorrow, Wednesday", "tomorrow, Thursday", "tomorrow, Friday", "Monday", "Monday", "tomorrow, Monday"];
  const days = {};
  for (let d = 0; d < 7; d++) {
    const open = d < 5;
    const later = { next_open_day: next[d], appt_windows: FULL_DAY_WINDOWS };
    days[String(d)] = {
      spans: open ? [[480, 1020]] : [],
      windows: open
        ? [
            [480, 660, "morning eight to eleven"],
            [660, 780, "midday eleven to one"],
            [780, 960, "afternoon one to four"],
          ]
        : [],
      before_close: { ...later },
      after_close: { ...later },
    };
  }
  return days;
}

/** A voice page as the build contract (section 5) writes it. */
export function voicePage(token, over = {}) {
  const business = over.business ?? "Maple Creek Family Dental";
  return {
    v: 1,
    kind: "voice",
    token,
    business,
    city: "Katy",
    state: "TX",
    trade: "dental",
    persona: "Blake",
    sample: false,
    expires_at: "2999-12-30",
    demo: {
      vars: {
        business_name: business,
        city: "Katy",
        state: "TX",
        service_area: "Katy and the surrounding area",
        hours_text: "Monday to Friday eight to five, Saturday nine to one",
        services_text: "cleanings, fillings, crowns and emergency visits",
        emergency_text: "same-day emergency visits when the schedule allows",
        business_phone: "(281) 555-0142",
        website: "https://maplecreekdental.example",
        owner_first: "the owner",
        demo_mode: "yes",
        lead_token: token,
        faq_text: "",
        booking_mode: "simulate",
        trade_words: "dental office",
        business_word: "practice",
        customer_word: "patient",
        team_word: "front desk",
        opening_question: "What is going on with your tooth?",
        issue_examples: "a toothache, a chipped tooth, a lost filling",
      },
      tz: "America/Chicago",
      days: weekTable(),
    },
    ...over.top,
  };
}

/** An audit page as landing.page_json writes it (v2, no kind). */
export function auditPage(token) {
  return {
    v: 2,
    token,
    place_id: "ChIJ-invented-place-id",
    business: "Bayou Bend Heating and Air",
    city: "Houston",
    trade: "hvac",
    place_noun: "shop",
    keyword: "ac repair",
    pins: 49,
    top3: 6,
    mid: 18,
    absent: 25,
    scanned_on: "November 3",
    rows: [
      { name: "Northside Comfort Pros", rating: 4.9, reviews_display: "1,204", top3: 31, me: false },
      { name: "Gulf Breeze Air", rating: 4.8, reviews_display: "856", top3: 22, me: false },
      { name: "Bayou Bend Heating and Air", rating: 4.6, reviews_display: "97", top3: 6, me: true },
    ],
    typical_line: "The shops that came up most have about 900 reviews.",
    persona_first: "Conner",
    persona_name: "Conner Hale",
    sender_email: "conner@sender.example",
    map_url: `/blob-mock/audits/${token}/map.png`,
    plan: true,
    pdf_url: null,
    pdf_built_at: null,
    pdf_filename: "Bayou Bend Heating and Air - Google Map Audit and Plan.pdf",
    created_at: "2026-11-03T15:00:00Z",
    expires_at: "2999-01-01T00:00:00Z",
  };
}
