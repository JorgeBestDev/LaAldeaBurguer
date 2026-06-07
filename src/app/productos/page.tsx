export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProductosAdmin } from "@/components/ProductosAdmin";
import { listarProductos } from "@/lib/services/productos";
import type { Producto } from "@/types";

export default async function ProductosPage() {
  let productos: Producto[] = [];
  let error = "";

  try {
    productos = await listarProductos();
  } catch (fetchError) {
    console.error(fetchError);
    error =
      "No se pudieron cargar los productos. Verifica la conexión a Neon y las migraciones.";
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
            Catálogo de productos
          </h1>
          <p className="mt-3 max-w-2xl text-amber-100/70">
            Administra el menú del restaurante: agrega, edita o elimina productos
            disponibles para registrar ventas.
          </p>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-100">
            {error}
          </div>
        ) : (
          <ProductosAdmin productosIniciales={productos} />
        )}
      </main>
    </div>
  );
}
