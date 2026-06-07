import { NextRequest, NextResponse } from "next/server";
import { crearVenta, listarVentas, ClientError } from "@/lib/services/ventas";
import type { CrearVentaInput } from "@/types";

export async function GET() {
  try {
    const ventas = await listarVentas();
    return NextResponse.json(ventas);
  } catch (error) {
    console.error("Error al listar ventas:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar las ventas." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CrearVentaInput;

    if (!body.fechaVenta) {
      return NextResponse.json(
        { error: "La fecha de venta es obligatoria." },
        { status: 400 },
      );
    }

    const venta = await crearVenta(body);
    return NextResponse.json(venta, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo registrar la venta.";

    const status = error instanceof ClientError ? 400 : 500;
    if (status === 500) {
      console.error("Error al registrar venta:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
