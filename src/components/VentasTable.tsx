import Link from "next/link";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { Venta } from "@/types";

type VentasTableProps = {
  ventas: Venta[];
};

export function VentasTable({ ventas }: VentasTableProps) {
  if (!ventas.length) {
    return (
      <div className="rounded-3xl border border-dashed border-amber-500/20 bg-[#24180d]/50 p-10 text-center">
        <p className="text-lg font-medium text-amber-50">Aún no hay ventas registradas</p>
        <p className="mt-2 text-sm text-amber-100/60">
          Comienza registrando la primera venta del día.
        </p>
        <Link
          href="/ventas/nueva"
          className="mt-6 inline-flex rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-[#1a1208] transition hover:brightness-110"
        >
          Registrar venta
        </Link>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-500/15 bg-[#24180d]/80 shadow-xl shadow-black/20">
      <div className="border-b border-amber-500/10 px-6 py-5">
        <h2 className="text-xl font-bold text-amber-50">Ventas recientes</h2>
        <p className="mt-1 text-sm text-amber-100/60">
          Consulta el detalle de cada ticket registrado
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-amber-950/40 text-amber-100/70">
            <tr>
              <th className="px-6 py-4 font-medium">Folio</th>
              <th className="px-6 py-4 font-medium">Fecha</th>
              <th className="px-6 py-4 font-medium">Productos</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr
                key={venta.idVenta}
                className="border-t border-amber-500/10 text-amber-50"
              >
                <td className="px-6 py-4 font-semibold">#{venta.idVenta}</td>
                <td className="px-6 py-4">{formatShortDate(venta.fechaVenta)}</td>
                <td className="px-6 py-4">
                  {venta.detalles?.length ?? 0} producto
                  {(venta.detalles?.length ?? 0) === 1 ? "" : "s"}
                </td>
                <td className="px-6 py-4 font-semibold text-amber-300">
                  {formatCurrency(venta.totalVenta)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/ventas/${venta.idVenta}`}
                    className="rounded-full border border-amber-400/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200 transition hover:bg-amber-500/10"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
