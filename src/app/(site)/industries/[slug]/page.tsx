import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DentalPage from "@/components/industries/dental";
import HvacPage from "@/components/industries/hvac";
import LawPage from "@/components/industries/law";
import PlumbingPage from "@/components/industries/plumbing";
import VeterinaryPage from "@/components/industries/veterinary";
import WalkInPage from "@/components/industries/walk-in";
import { INDUSTRIES, industryBySlug } from "@/lib/industries";

type Props = { params: Promise<{ slug: string }> };

/** Only the listed trades exist; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) return {};
  return {
    title: industry.title,
    description: industry.metaDescription,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

/**
 * One component per trade, not one template. Blake, 2026-11-04: "Very repetive
 * pages." Each page has its own opening and its own shape, and they share only
 * the small parts in src/components/industries/shared.tsx.
 */
const PAGES: Record<string, ComponentType> = {
  hvac: HvacPage,
  "dental-clinics": DentalPage,
  "law-firms": LawPage,
  "walk-in-clinics": WalkInPage,
  "veterinary-clinics": VeterinaryPage,
  "plumbing-companies": PlumbingPage,
};

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const Page = PAGES[slug];
  if (!Page) notFound();
  return <Page />;
}
