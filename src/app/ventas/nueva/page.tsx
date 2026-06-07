export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { NuevaVentaForm } from "@/components/NuevaVentaForm";
import { getPrisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializers";
import type { Producto } from "@/types";

export default async function NuevaVentaPage() {
  let productos: Producto[] = [];
  let error = "";

  try {
    const prisma = getPrisma();
    const data = await prisma.producto.findMany({
      orderBy: { nombreProducto: "asc" },
    });
    productos = serializeBigInt(data) as unknown as Producto[];
  } catch (fetchError) {
    console.error(fetchError);
    error =
      "No se pudieron cargar los productos. Verifica la conexión a PostgreSQL.";
  }

  return (
    <div className="min-h-screen bg-[#1a1208]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-amber-200/70 transition hover:text-amber-100"
          >
            ← Volver al dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-amber-50 sm:text-4xl">
            Registrar nueva venta
          </h1>
          <p className="mt-3 max-w-2xl text-amber-100/70">
            Selecciona el día de la venta, agrega los productos vendidos con su
            cantidad y guarda el ticket.
          </p>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-100">
            {error}
          </div>
        ) : productos.length ? (
          <NuevaVentaForm productos={productos} />
        ) : (
          <div className="rounded-3xl border border-dashed border-amber-500/20 bg-[#24180d]/50 p-10 text-center text-amber-100/70">
            No hay productos en el catálogo. Ejecuta el seed de la base de datos.
          </div>
        )}
      </main>
    </div>
  );
}