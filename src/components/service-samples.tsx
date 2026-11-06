import type { ReactNode } from "react";
import { SampleTag } from "@/components/sections/sample-audit";
import { cn } from "@/lib/cn";
import type { ServiceSampleKind } from "@/lib/services";

/**
 * One invented example on each service page that has no device mockup, so the page shows
 * what the work looks like instead of only saying it. Built in plain HTML, in the same card
 * style as /sample-audit, with a SAMPLE tag and "Invented example." on every card, so none
 * of it can be read or screenshotted as a client result. Nothing here comes from a real
 * lead, search, account or call: no real business names and no results.
 *
 * TODO(Blake): each card shows work nobody has delivered yet (claim bank, section 5). They
 * show the format, and they stand on the same launch-day condition as the words around them.
 */

function Frame({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <figure className={cn("min-w-0 rounded-lg border border-[var(--color-border)] bg-white p-5 text-[var(--color-ink)] md:p-7", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[1.0625rem] font-extrabold leading-snug tracking-[-0.02em] text-[var(--color-ink)]">{title}</p>
        <SampleTag />
      </div>
      <div className="mt-5">{children}</div>
      <figcaption className="mt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">Invented example.</figcaption>
    </figure>
  );
}

const MARK_TONES = {
  good: "border-[#2E9E5B]/30 bg-[#2E9E5B]/10 text-[#1F7A45]",
  bad: "border-[#B3261E]/25 bg-[#B3261E]/[0.07] text-[#B3261E]",
  wait: "border-[#E0A500]/40 bg-[#E0A500]/15 text-[#8A5A00]",
} as const;

function Mark({ tone, children }: { tone: keyof typeof MARK_TONES; children: ReactNode }) {
  return <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.8125rem] font-bold", MARK_TONES[tone])}>{children}</span>;
}

// Plain rows, not a table, so the mark stays in view on a phone instead of scrolling off.
const HEAD_ROW = "hidden gap-x-5 pb-2 text-[0.8125rem] font-bold text-[var(--color-ink-soft)] md:grid";
const ROW = "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-t border-[var(--color-border)] py-2.5 text-[0.9375rem] leading-snug md:gap-x-5";

// ---------------------------------------------------------------------------
// Local Services Ads: the twice-a-month read of every lead
// ---------------------------------------------------------------------------

const LEADS: { when: string; what: string; tone: keyof typeof MARK_TONES; mark: string }[] = [
  { when: "Mon, 7:12am", what: "Call. AC not cooling, asked for a visit today.", tone: "good", mark: "Real" },
  { when: "Mon, 9:40am", what: "Call. Wanted a roofer, wrong trade.", tone: "wait", mark: "To dispute" },
  { when: "Tue, 1:05pm", what: "Message. Quote on a new unit.", tone: "good", mark: "Real" },
  { when: "Tue, 4:31pm", what: "Call. Selling marketing services.", tone: "wait", mark: "To dispute" },
  { when: "Wed, 6:18pm", what: "Call. Nobody answered.", tone: "good", mark: "Real" },
  { when: "Thu, 8:02am", what: "Call. Hung up during the greeting.", tone: "bad", mark: "Not real" },
];

function LeadLog() {
  return (
    <Frame title="One week of leads, each one marked">
      <div aria-hidden="true" className={cn(HEAD_ROW, "md:grid-cols-[9rem_minmax(0,1fr)_auto]")}>
        <span>When</span>
        <span>The lead</span>
        <span>Our mark</span>
      </div>
      <ul>
        {LEADS.map((row) => (
          <li key={row.when} className={cn(ROW, "md:grid-cols-[9rem_minmax(0,1fr)_auto]")}>
            <span className="col-span-2 text-[0.875rem] text-[var(--color-ink-soft)] md:col-span-1 md:text-[0.9375rem]">{row.when}</span>
            <span className="min-w-0">{row.what}</span>
            <Mark tone={row.tone}>{row.mark}</Mark>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// Google Search ads: every search that drew a click
// ---------------------------------------------------------------------------

const SEARCHES: { term: string; tone: keyof typeof MARK_TONES; mark: string; why: string }[] = [
  { term: "emergency ac repair", tone: "good", mark: "Keep", why: "Closest thing to a booked job." },
  { term: "ac repair near me", tone: "good", mark: "Keep", why: "Someone with a hot house." },
  { term: "how to fix ac yourself", tone: "bad", mark: "Block", why: "They're not hiring anyone." },
  { term: "ac repair school", tone: "bad", mark: "Block", why: "They want a career." },
  { term: "hvac jobs near me", tone: "bad", mark: "Block", why: "They want a paycheck." },
  { term: "heat pump cost", tone: "wait", mark: "Watch", why: "Could be a replacement. We'll look at it again next time." },
];

function SearchSheet() {
  return (
    <Frame title="One review of the search terms">
      <div aria-hidden="true" className={cn(HEAD_ROW, "md:grid-cols-[17rem_7rem_minmax(0,1fr)]")}>
        <span>What they typed</span>
        <span>Our mark</span>
        <span>Why</span>
      </div>
      <ul>
        {SEARCHES.map((row) => (
          <li key={row.term} className={cn(ROW, "md:grid-cols-[17rem_7rem_minmax(0,1fr)]")}>
            <span className="min-w-0 font-bold">{row.term}</span>
            <span className="justify-self-end md:justify-self-start"><Mark tone={row.tone}>{row.mark}</Mark></span>
            <span className="col-span-2 text-[var(--color-ink-soft)] md:col-span-1">{row.why}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// Facebook and Instagram: two variations in a phone frame, with an empty photo slot
// ---------------------------------------------------------------------------

const ADS_SHOWN = [
  { copy: "It's going to be 98 by Friday. Get your AC looked at while it's still running.", head: "AC tune-ups this month", slot: "Your photo: a tech at a real job", button: "Call now" },
  { copy: "That's our truck on your street. Same crew, same phone number, every time.", head: "Local HVAC crew", slot: "Your photo: your truck, your people", button: "Learn more" },
];

function AdPhones() {
  return (
    <Frame title="Two of a month's variations">
      <ul className="flex flex-wrap justify-center gap-5 md:gap-10">
        {ADS_SHOWN.map((ad) => (
          <li key={ad.head} className="w-full max-w-[19rem] rounded-[1.75rem] bg-[#1A1236] p-2.5">
            <div className="overflow-hidden rounded-[1.25rem] bg-white">
              <div className="flex items-center gap-2.5 px-3.5 pt-3.5">
                <span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-full bg-[var(--color-surface-raised)]" />
                <p className="min-w-0 text-[0.8125rem] font-bold leading-tight text-[#150b3a]">
                  Your business name
                  <span className="block font-normal text-[#5c5480]">Sponsored</span>
                </p>
              </div>
              <p className="px-3.5 py-2.5 text-[0.875rem] leading-snug text-[#150b3a]">{ad.copy}</p>
              <div className="mx-3.5 grid aspect-[4/3] place-items-center rounded-md border-2 border-dashed border-[#5a1fbf]/35 bg-[#f5f2fd] px-4 text-center text-[0.8125rem] font-bold leading-snug text-[#5a1fbf]">
                {ad.slot}
              </div>
              <div className="flex items-center justify-between gap-3 px-3.5 py-3">
                <p className="min-w-0 text-[0.875rem] font-bold leading-tight text-[#150b3a]">{ad.head}</p>
                <span className="shrink-0 rounded-md bg-[#f5f2fd] px-2.5 py-1.5 text-[0.8125rem] font-bold text-[#150b3a]">{ad.button}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// Website rebuild: old links and where each one lands
// ---------------------------------------------------------------------------

const ADDRESSES = [
  { from: "/services.html", to: "/services" },
  { from: "/ac-repair-page2.php", to: "/services/ac-repair" },
  { from: "/about-us/old-team", to: "/about" },
];

function OldAddresses() {
  return (
    <Frame title="Every old link gets a new home">
      <ul className="space-y-3">
        {ADDRESSES.map((row) => (
          <li key={row.from} className="grid grid-cols-1 items-center gap-2 rounded-md bg-[var(--color-surface-raised)] px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
            <code className="min-w-0 break-all font-mono text-[0.9375rem] text-[var(--color-ink-soft)]">{row.from}</code>
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 18 18" fill="none" className="rotate-90 text-[var(--color-brand)] md:rotate-0">
              <path d="M2.5 9h12.5M10 3.75 15.25 9 10 14.25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">goes to</span>
            <code className="min-w-0 break-all font-mono text-[0.9375rem] font-bold text-[var(--color-ink)]">{row.to}</code>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// AI Voice Receptionist: one after-hours call, and the message that follows it
// ---------------------------------------------------------------------------

const SCRIPT: { who: "ai" | "caller"; line: string }[] = [
  { who: "ai", line: "Thanks for calling Your Business. I'm an AI system, and this call may be recorded. How can I help?" },
  { who: "caller", line: "My AC quit and the house is hot." },
  { who: "ai", line: "I can take a message or try the person on call. Which would you like?" },
  { who: "caller", line: "Try the person on call, please." },
  { who: "ai", line: "Trying them now. If nobody picks up, I'll pass on your message and your number." },
];

function CallScript() {
  return (
    <Frame title="One call at 7:12pm">
      <ol className="space-y-2.5">
        {SCRIPT.map((turn) => (
          <li key={turn.line} className={cn("flex", turn.who === "caller" && "justify-end")}>
            <p className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-snug", turn.who === "ai" ? "rounded-bl-sm bg-[var(--color-surface-raised)] text-[var(--color-ink)]" : "rounded-br-sm bg-[#5a1fbf] text-white")}>
              <span className="sr-only">{turn.who === "ai" ? "Receptionist: " : "Caller: "}</span>
              {turn.line}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-5 border-l-4 border-[#5a1fbf] bg-[var(--color-surface-raised)] px-4 py-3">
        <p className="text-[0.8125rem] font-bold text-[var(--color-brand)]">Message sent to you</p>
        <dl className="mt-1.5 space-y-0.5 text-[0.9375rem] leading-snug">
          <div className="flex gap-2"><dt className="font-bold">Who:</dt><dd>Alex, a homeowner</dd></div>
          <div className="flex gap-2"><dt className="font-bold">Number:</dt><dd>(555) 010-0142</dd></div>
          <div className="flex gap-2"><dt className="font-bold">Needs:</dt><dd>AC not cooling. Transferred to your on-call person.</dd></div>
        </dl>
      </div>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// Lead Nurture SMS: the list, the check and what's left to text
// ---------------------------------------------------------------------------

const CHECK_STEPS = [
  { head: "Your list", count: "1,200", note: "numbers handed to us" },
  { head: "The consent check", count: "860", note: "with no record, or an old opt-out, or a changed number" },
  { head: "Can be texted", count: "340", note: "numbers that passed. That's the list." },
];

function ListCheck() {
  return (
    <Frame title="The numbers you get back">
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {CHECK_STEPS.map((step, i) => (
          <li
            key={step.head}
            className={cn(
              "min-w-0 rounded-md px-5 py-4",
              i === CHECK_STEPS.length - 1 ? "bg-[#5a1fbf] text-white" : "bg-[var(--color-surface-raised)] text-[var(--color-ink)]"
            )}
          >
            <p className="text-[0.875rem] font-bold">
              {i + 1}. {step.head}
            </p>
            <p className="mt-1 text-[2.25rem] font-extrabold leading-none tracking-[-0.035em] md:text-[2.75rem]">{step.count}</p>
            <p className={cn("mt-1.5 text-[0.9375rem] leading-snug", i === CHECK_STEPS.length - 1 ? "text-white/90" : "text-[var(--color-ink-soft)]")}>{step.note}</p>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export function ServiceSample({ kind }: { kind: ServiceSampleKind }) {
  switch (kind) {
    case "lead-log":
      return <LeadLog />;
    case "search-sheet":
      return <SearchSheet />;
    case "ad-phones":
      return <AdPhones />;
    case "old-addresses":
      return <OldAddresses />;
    case "call-script":
      return <CallScript />;
    case "list-check":
      return <ListCheck />;
  }
}
