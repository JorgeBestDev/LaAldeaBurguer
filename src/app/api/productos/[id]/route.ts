import { NextRequest, NextResponse } from "next/server";
import { ClientError } from "@/lib/errors";
import {
  actualizarProducto,
  eliminarProducto,
  obtenerProductoPorId,
} from "@/lib/services/productos";
import type { ActualizarProductoInput } from "@/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "Identificador de producto inválido." },
        { status: 400 },
      );
    }

    const producto = await obtenerProductoPorId(BigInt(id));

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { error: "No se pudo cargar el producto." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "Identificador de producto inválido." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as ActualizarProductoInput;
    const producto = await actualizarProducto(BigInt(id), body);
    return NextResponse.json(producto);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo actualizar el producto.";

    const status = error instanceof ClientError ? 400 : 500;
    if (status === 500) {
      console.error("Error al actualizar producto:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "Identificador de producto inválido." },
        { status: 400 },
      );
    }

    await eliminarProducto(BigInt(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo eliminar el producto.";

    const status = error instanceof ClientError ? 400 : 500;
    if (status === 500) {
      console.error("Error al eliminar producto:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
