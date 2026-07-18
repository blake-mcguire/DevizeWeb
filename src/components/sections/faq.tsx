export const faqs = [
  {
    q: "What's the difference between Revenue Recovery and Revenue Retention?",
    a: "Recovery catches money leaking out the front of the business: the 7pm calls, the weekend calls, the calls that ring out while every tech is on a job. Retention protects the money you already earned: post-job follow-up, reviews, reminders, and win-backs when a maintenance plan goes quiet. Most shops leak from both ends. We plug both.",
  },
  {
    q: "Is this just a fancy answering service?",
    a: "No. An answering service takes a message and hopes you call back before the customer dials the next shop. Devize answers in about two rings, qualifies the caller, and books the job straight into your schedule. The caller hangs up with a booked appointment.",
  },
  {
    q: "Is this a tool or a managed service?",
    a: "Both. We build both systems on top of the stack you already run (phones, CRM, field software) and operate them with you. You get the platform plus the setup, the scripts, and the ongoing tuning.",
  },
  {
    q: "Will it work with the software I already run?",
    a: "Yes. Devize runs alongside ServiceTitan, Housecall Pro, Jobber, and most CRMs and field platforms. Nothing gets ripped out. Bookings, reminders, and follow-ups land in the tools your team already lives in.",
  },
  {
    q: "How fast can we be live?",
    a: "Most shops are taking real calls through Revenue Recovery within two weeks. Retention (follow-up, reviews, reminders, plan win-backs) typically lands inside 30 to 45 days.",
  },
  {
    q: "What if the AI gets something wrong?",
    a: "Every call is transcribed and reviewed. We tune the agent weekly. Anything outside its scope transfers live to your team, so a caller is never stuck in a dead end.",
  },
  {
    q: "Will the follow-up texts annoy my customers?",
    a: "No. Retention messages are service notifications to your existing customers: appointment reminders, post-job check-ins, a nudge when their maintenance plan lapses. Every message is about work you've done or work they're due for, and opting out takes one reply. It's the follow-up you'd send yourself if you ever got out of the truck.",
  },
  {
    q: "What does it cost?",
    a: "Straight answer: it depends on your call volume and how much of the system you run: Recovery, Retention, or both. The whole thing is built to pay for itself out of the calls you're currently missing. Book a demo and we'll run the numbers on your shop before you spend a dollar.",
  },
];

export default function Faq() {
  return (
    <section className="bg-white/60 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-28">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
          Questions
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight text-[var(--color-ink)] font-medium">
          Straight answers.
        </h2>

        <div className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {faqs.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="flex items-center justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-[1.05rem] md:text-lg text-[var(--color-ink)] font-medium pr-4">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-[var(--color-border)] text-[var(--color-ink-soft)] transition-transform group-open:rotate-45"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed pr-11">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
