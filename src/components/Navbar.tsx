import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/ventas/nueva", label: "Nueva venta" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#1a1208]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg font-black text-[#1a1208] shadow-lg shadow-amber-500/20">
            LA
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/70">
              Restaurante
            </p>
            <p className="text-lg font-bold text-amber-50 group-hover:text-amber-300">
              La Aldea Burguer
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-amber-500/20 px-4 py-2 text-sm font-medium text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
