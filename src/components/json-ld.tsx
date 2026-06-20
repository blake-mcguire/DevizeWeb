type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      // Safe: JSON.stringify produces valid JSON; schema.org values come from our own code.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
