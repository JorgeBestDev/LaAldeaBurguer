export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { VentaDetalle } from "@/components/VentaDetalle";
import { obtenerVentaPorId } from "@/lib/services/ventas";
import type { Venta } from "@/types";

type VentaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VentaPage({ params }: VentaPageProps) {
  const { id } = await params;

  let venta: Venta | null = null;

  try {
    venta = await obtenerVentaPorId(BigInt(id));
  } catch (error) {
    console.error(error);
    throw error;
  }

  if (!venta) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#1a1208]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-amber-200/70 transition hover:text-amber-100"
        >
          ← Volver al dashboard
        </Link>

        <VentaDetalle venta={venta} />
      </main>
    </div>
  );
}
