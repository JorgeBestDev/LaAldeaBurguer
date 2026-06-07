import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Venta } from "@/types";

type VentaDetalleProps = {
  venta: Venta;
};

export function VentaDetalle({ venta }: VentaDetalleProps) {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-amber-500/15 bg-[#24180d]/80 p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200/60">
              Detalle de venta
            </p>
            <h1 className="mt-2 text-3xl font-bold text-amber-50">
              Ticket #{venta.idVenta}
            </h1>
            <p className="mt-2 text-amber-100/70">{formatDate(venta.fechaVenta)}</p>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-[#1a1208]/70 px-6 py-4 text-right">
            <p className="text-sm text-amber-100/60">Total de la venta</p>
            <p className="mt-1 text-3xl font-bold text-amber-300">
              {formatCurrency(venta.totalVenta)}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-amber-500/15 bg-[#24180d]/80 shadow-xl shadow-black/20">
        <div className="border-b border-amber-500/10 px-6 py-5">
          <h2 className="text-xl font-bold text-amber-50">Productos vendidos</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-amber-950/40 text-amber-100/70">
              <tr>
                <th className="px-6 py-4 font-medium">Producto</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Cantidad</th>
                <th className="px-6 py-4 font-medium">Precio unitario</th>
                <th className="px-6 py-4 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles?.map((detalle) => (
                <tr
                  key={detalle.idDetalle}
                  className="border-t border-amber-500/10 text-amber-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {detalle.producto?.nombreProducto}
                  </td>
                  <td className="px-6 py-4 text-amber-100/70">
                    {detalle.producto?.tipoProducto}
                  </td>
                  <td className="px-6 py-4">{detalle.cantidadProducto}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(detalle.precioUnitario)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-amber-300">
                    {formatCurrency(detalle.subtotalVenta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/ventas/nueva"
          className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-[#1a1208] transition hover:brightness-110"
        >
          Registrar otra venta
        </Link>
        <Link
          href="/"
          className="rounded-full border border-amber-400/30 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/10"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
