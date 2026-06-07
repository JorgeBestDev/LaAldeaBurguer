import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function VentaNotFound() {
  return (
    <div className="min-h-screen bg-[#1a1208]">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-amber-50">Venta no encontrada</h1>
        <p className="mt-3 text-amber-100/70">
          El ticket que buscas no existe o fue eliminado.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-[#1a1208]"
        >
          Ir al dashboard
        </Link>
      </main>
    </div>
  );
}
