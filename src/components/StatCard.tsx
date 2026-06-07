type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  accent?: "amber" | "orange" | "emerald";
};

const accents = {
  amber: "from-amber-500/20 to-amber-600/5 border-amber-400/20",
  orange: "from-orange-500/20 to-orange-600/5 border-orange-400/20",
  emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-400/20",
};

export function StatCard({
  title,
  value,
  subtitle,
  accent = "amber",
}: StatCardProps) {
  return (
    <article
      className={`rounded-3xl border bg-gradient-to-br p-5 shadow-xl shadow-black/20 ${accents[accent]}`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-amber-100/60">
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold text-amber-50 sm:text-4xl">{value}</p>
      {subtitle ? (
        <p className="mt-2 text-sm text-amber-100/70">{subtitle}</p>
      ) : null}
    </article>
  );
}
