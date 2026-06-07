"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { Producto } from "@/types";

type ProductosAdminProps = {
  productosIniciales: Producto[];
};

type FormState = {
  nombreProducto: string;
  precioProducto: string;
  tipoProducto: string;
};

const emptyForm: FormState = {
  nombreProducto: "",
  precioProducto: "",
  tipoProducto: "",
};

export function ProductosAdmin({ productosIniciales }: ProductosAdminProps) {
  const router = useRouter();
  const [productos, setProductos] = useState(productosIniciales);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function startEdit(producto: Producto) {
    setEditingId(producto.idProducto);
    setForm({
      nombreProducto: producto.nombreProducto,
      precioProducto: producto.precioProducto,
      tipoProducto: producto.tipoProducto,
    });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const precio = Number(form.precioProducto);
    const payload = {
      nombreProducto: form.nombreProducto,
      precioProducto: precio,
      tipoProducto: form.tipoProducto,
    };

    try {
      const response = await fetch(
        editingId ? `/api/productos/${editingId}` : "/api/productos",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo guardar el producto.");
      }

      if (editingId) {
        setProductos((prev) =>
          prev.map((producto) =>
            producto.idProducto === editingId ? data : producto,
          ),
        );
      } else {
        setProductos((prev) =>
          [...prev, data].sort((a, b) =>
            a.nombreProducto.localeCompare(b.nombreProducto, "es"),
          ),
        );
      }

      cancelEdit();
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

  async function handleDelete(idProducto: string, nombreProducto: string) {
    const confirmed = window.confirm(
      `¿Eliminar "${nombreProducto}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/productos/${idProducto}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo eliminar el producto.");
      }

      setProductos((prev) =>
        prev.filter((producto) => producto.idProducto !== idProducto),
      );

      if (editingId === idProducto) {
        cancelEdit();
      }

      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Ocurrió un error inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-amber-500/15 bg-[#24180d]/80 p-6 shadow-xl shadow-black/20">
        <h2 className="text-xl font-bold text-amber-50">
          {editingId ? "Editar producto" : "Agregar producto"}
        </h2>
        <p className="mt-1 text-sm text-amber-100/60">
          {editingId
            ? "Modifica los datos y guarda los cambios."
            : "Completa el formulario para añadir un producto al catálogo."}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-amber-100">Nombre</span>
            <input
              type="text"
              value={form.nombreProducto}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  nombreProducto: event.target.value,
                }))
              }
              className="rounded-2xl border border-amber-500/20 bg-[#1a1208] px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400"
              placeholder="Hamburguesa Clásica"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-amber-100">Precio (MXN)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={form.precioProducto}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  precioProducto: event.target.value,
                }))
              }
              className="rounded-2xl border border-amber-500/20 bg-[#1a1208] px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400"
              placeholder="89"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-amber-100">Tipo</span>
            <input
              type="text"
              value={form.tipoProducto}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  tipoProducto: event.target.value,
                }))
              }
              className="rounded-2xl border border-amber-500/20 bg-[#1a1208] px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400"
              placeholder="Hamburguesa"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-bold text-[#1a1208] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : editingId
                ? "Guardar cambios"
                : "Agregar producto"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="rounded-2xl border border-amber-400/30 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-amber-500/15 bg-[#24180d]/80 shadow-xl shadow-black/20">
        <div className="border-b border-amber-500/10 px-6 py-5">
          <h2 className="text-xl font-bold text-amber-50">Catálogo</h2>
          <p className="mt-1 text-sm text-amber-100/60">
            {productos.length} producto{productos.length === 1 ? "" : "s"} registrado
            {productos.length === 1 ? "" : "s"}
          </p>
        </div>

        {productos.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-amber-950/40 text-amber-100/70">
                <tr>
                  <th className="px-6 py-4 font-medium">Nombre</th>
                  <th className="px-6 py-4 font-medium">Tipo</th>
                  <th className="px-6 py-4 font-medium">Precio</th>
                  <th className="px-6 py-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr
                    key={producto.idProducto}
                    className="border-t border-amber-500/10 text-amber-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {producto.nombreProducto}
                    </td>
                    <td className="px-6 py-4">{producto.tipoProducto}</td>
                    <td className="px-6 py-4 font-semibold text-amber-300">
                      {formatCurrency(producto.precioProducto)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(producto)}
                          disabled={loading}
                          className="rounded-full border border-amber-400/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              producto.idProducto,
                              producto.nombreProducto,
                            )
                          }
                          disabled={loading}
                          className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-amber-100/60">
            No hay productos en el catálogo. Agrega el primero con el formulario de arriba.
          </p>
        )}
      </section>
    </div>
  );
}
