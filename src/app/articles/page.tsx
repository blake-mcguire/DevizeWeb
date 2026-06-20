import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Weekly updates, field notes, and deep dives on running an AI operating system for home services.",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "Articles · Devize",
    description:
      "Weekly updates, field notes, and deep dives on running an AI operating system for home services.",
    url: "https://devize.ai/articles",
    type: "website",
  },
};

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
};

// TODO: generate this list from the filesystem (fs.readdir on src/app/articles/*)
// once we have more than one post. For v1 we register them manually.
const posts: Post[] = [
  {
    slug: "welcome",
    title: "Why we built Devize",
    date: "2026-04-22",
    excerpt:
      "Home services operators are drowning in phones, tabs, and follow-ups. Here's the system we built to take that off their plate.",
    readingTime: "4 min read",
  },
];

export default function ArticlesIndex() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Devize Journal",
    description:
      "Weekly writeups from inside home services shops running on Devize.",
    url: "https://devize.ai/articles",
    publisher: {
      "@type": "Organization",
      name: "Devize",
      url: "https://devize.ai",
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: `https://devize.ai/articles/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Organization", name: "Devize" },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <JsonLd data={blogSchema} />
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
        The Devize journal
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
        Articles &amp; field notes
      </h1>
      <p className="mt-5 text-lg text-[var(--color-ink-soft)] max-w-xl leading-relaxed">
        Weekly writeups from inside home services shops running on Devize.
      </p>

      <ul className="mt-16 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/articles/${post.slug}`}
              className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 py-8 transition-colors"
            >
              <div className="max-w-2xl">
                <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] font-medium leading-snug group-hover:brand-text-gradient transition">
                  {post.title}
                </h2>
                <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] shrink-0">
                <span>{post.readingTime}</span>
                <span className="brand-dot" aria-hidden="true" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
