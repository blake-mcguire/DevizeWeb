import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl tracking-tight text-[var(--color-ink)] font-medium mt-0 mb-6 leading-[1.1]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] font-medium mt-12 mb-4 leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-tight text-[var(--color-ink)] font-medium mt-10 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[1.05rem] leading-[1.75] text-[var(--color-ink-soft)] my-5">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)] transition"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-5 space-y-2 text-[1.05rem] text-[var(--color-ink-soft)] pl-6 list-disc marker:text-[var(--color-brand)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 space-y-2 text-[1.05rem] text-[var(--color-ink-soft)] pl-6 list-decimal">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-[var(--color-brand)] pl-6 text-xl italic text-[var(--color-ink)]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-md bg-[var(--color-ink)]/5 px-1.5 py-0.5 text-[0.9em] font-mono text-[var(--color-ink)]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-6 rounded-xl bg-[var(--color-ink)] text-white/90 p-5 overflow-x-auto text-sm leading-relaxed">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-10 border-[var(--color-border)]" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
