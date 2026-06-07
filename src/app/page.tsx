export const dynamic = "force-dynamic";

import Link from "next/link";
import { DayOfWeekChart } from "@/components/DayOfWeekChart";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { VentasTable } from "@/components/VentasTable";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { obtenerEstadisticas } from "@/lib/services/estadisticas";
import { listarVentas } from "@/lib/services/ventas";
import type { Venta } from "@/types";

export default async function DashboardPage() {
  let estadisticas = null;
  let ventas: Venta[] = [];
  let error = "";

  try {
    [estadisticas, ventas] = await Promise.all([
      obtenerEstadisticas(),
      listarVentas(),
    ]);
  } catch (fetchError) {
    console.error(fetchError);
    error =
      "No se pudo conectar con la base de datos. Configura DATABASE_URL y ejecuta las migraciones.";
  }

  return (
    <div className="min-h-screen bg-[#1a1208]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-amber-200/60">
              Panel de control
            </p>
            <h1 className="mt-2 text-3xl font-bold text-amber-50 sm:text-4xl">
              Ventas diarias
            </h1>
            <p className="mt-3 max-w-2xl text-amber-100/70">
              Registra ventas, consulta tickets y analiza el desempeño del
              restaurante desde cualquier dispositivo.
            </p>
          </div>

          <Link
            href="/ventas/nueva"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-bold text-[#1a1208] shadow-lg shadow-amber-500/20 transition hover:brightness-110"
          >
            + Agregar venta
          </Link>
        </section>

        {error ? (
          <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-100">
            {error}
          </div>
        ) : null}

        {estadisticas ? (
          <>
            <section className="mb-8 grid gap-4 md:grid-cols-3">
              <StatCard
                title="Producto más vendido"
                value={estadisticas.productoMasVendido?.nombreProducto ?? "Sin datos"}
                subtitle={
                  estadisticas.productoMasVendido
                    ? `${estadisticas.productoMasVendido.cantidadTotal} unidades vendidas`
                    : "Registra ventas para ver estadísticas"
                }
                accent="amber"
              />
              <StatCard
                title="Venta más alta"
                value={
                  estadisticas.ventaMasAlta
                    ? formatCurrency(estadisticas.ventaMasAlta.totalVenta)
                    : "Sin datos"
                }
                subtitle={
                  estadisticas.ventaMasAlta
                    ? `Ticket #${estadisticas.ventaMasAlta.idVenta} · ${formatShortDate(estadisticas.ventaMasAlta.fechaVenta)}`
                    : "Aún no hay ventas registradas"
                }
                accent="orange"
              />
              <StatCard
                title="Ingreso total"
                value={formatCurrency(estadisticas.resumen.ingresoTotal)}
                subtitle={`${estadisticas.resumen.totalVentasRegistradas} ventas registradas`}
                accent="emerald"
              />
            </section>

            <section className="mb-8">
              <DayOfWeekChart data={estadisticas.ventasPorDiaSemana} />
            </section>
          </>
        ) : null}

        <VentasTable ventas={ventas.slice(0, 10)} />
      </main>
    </div>
  );
}
