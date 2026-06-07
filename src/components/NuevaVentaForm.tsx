"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import type { Producto } from "@/types";

type LineaLocal = {
  idProducto: string;
  cantidadProducto: number;
};

type NuevaVentaFormProps = {
  productos: Producto[];
};

export function NuevaVentaForm({ productos }: NuevaVentaFormProps) {
  const router = useRouter();
  const [fechaVenta, setFechaVenta] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [idProducto, setIdProducto] = useState(productos[0]?.idProducto ?? "");
  const [cantidad, setCantidad] = useState(1);
  const [lineas, setLineas] = useState<LineaLocal[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const productoMap = useMemo(
    () => new Map(productos.map((producto) => [producto.idProducto, producto])),
    [productos],
  );

  const total = lineas.reduce((acc, linea) => {
    const producto = productoMap.get(linea.idProducto);
    if (!producto) return acc;
    return acc + Number(producto.precioProducto) * linea.cantidadProducto;
  }, 0);

  function agregarLinea() {
    setError("");

    if (!idProducto) {
      setError("Selecciona un producto.");
      return;
    }

    if (cantidad < 1) {
      setError("La cantidad debe ser al menos 1.");
      return;
    }

    setLineas((prev) => [
      ...prev,
      { idProducto, cantidadProducto: cantidad },
    ]);
    setCantidad(1);
  }

  function quitarLinea(index: number) {
    setLineas((prev) => prev.filter((_, i) => i !== index));
  }

  async function registrarVenta() {
    setError("");

    if (!lineas.length) {
      setError("Agrega al menos un producto antes de guardar.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaVenta, lineas }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo registrar la venta.");
      }

      router.push(`/ventas/${data.idVenta}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ocurrió un error inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-amber-500/15 bg-[#24180d]/80 p-6 shadow-xl shadow-black/20">
        <h2 className="text-xl font-bold text-amber-50">Datos de la venta</h2>
        <p className="mt-1 text-sm text-amber-100/60">
          Selecciona el día y agrega los productos vendidos
        </p>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-amber-100">Día de la venta</span>
            <input
              type="date"
              value={fechaVenta}
              onChange={(event) => setFechaVenta(event.target.value)}
              className="rounded-2xl border border-amber-500/20 bg-[#1a1208] px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_120px_auto] sm:items-end">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-amber-100">Producto</span>
              <select
                value={idProducto}
                onChange={(event) => setIdProducto(event.target.value)}
                className="rounded-2xl border border-amber-500/20 bg-[#1a1208] px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400"
              >
                {productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombreProducto} — {formatCurrency(producto.precioProducto)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-amber-100">Cantidad</span>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(event) => {
                  const parsed = Number(event.target.value);
                  setCantidad(Number.isNaN(parsed) ? 0 : parsed);
                }}
                className="rounded-2xl border border-amber-500/20 bg-[#1a1208] px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400"
              />
            </label>

            <button
              type="button"
              onClick={agregarLinea}
              className="rounded-2xl border border-amber-400/30 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/10"
            >
              Agregar
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-500/15 bg-[#24180d]/80 p-6 shadow-xl shadow-black/20">
        <h2 className="text-xl font-bold text-amber-50">Resumen del ticket</h2>

        <div className="mt-6 space-y-3">
          {lineas.length ? (
            lineas.map((linea, index) => {
              const producto = productoMap.get(linea.idProducto);
              if (!producto) return null;

              const subtotal =
                Number(producto.precioProducto) * linea.cantidadProducto;

              return (
                <div
                  key={`${linea.idProducto}-${index}`}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-amber-500/10 bg-[#1a1208]/70 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-amber-50">
                      {producto.nombreProducto}
                    </p>
                    <p className="text-sm text-amber-100/60">
                      {linea.cantidadProducto} x {formatCurrency(producto.precioProducto)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-300">
                      {formatCurrency(subtotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => quitarLinea(index)}
                      className="mt-1 text-xs text-red-300 hover:text-red-200"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl border border-dashed border-amber-500/20 px-4 py-8 text-center text-sm text-amber-100/60">
              Agrega productos para construir el ticket
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-amber-500/10 pt-4">
          <div className="flex items-center justify-between text-lg font-bold text-amber-50">
            <span>Total</span>
            <span className="text-amber-300">{formatCurrency(total)}</span>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={registrarVenta}
          disabled={loading || !lineas.length}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-sm font-bold text-[#1a1208] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Registrar venta"}
        </button>
      </section>
    </div>
  );
}
