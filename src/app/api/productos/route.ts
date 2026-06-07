import { NextRequest, NextResponse } from "next/server";
import { ClientError } from "@/lib/errors";
import { crearProducto, listarProductos } from "@/lib/services/productos";
import type { CrearProductoInput } from "@/types";

export async function GET() {
  try {
    const productos = await listarProductos();
    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los productos." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CrearProductoInput;
    const producto = await crearProducto(body);
    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo crear el producto.";

    const status = error instanceof ClientError ? 400 : 500;
    if (status === 500) {
      console.error("Error al crear producto:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
