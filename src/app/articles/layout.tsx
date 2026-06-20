export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[var(--color-surface)]">{children}</div>;
}
