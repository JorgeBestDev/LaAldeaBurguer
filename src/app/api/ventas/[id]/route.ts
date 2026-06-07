import { NextRequest, NextResponse } from "next/server";
import { obtenerVentaPorId } from "@/lib/services/ventas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const venta = await obtenerVentaPorId(BigInt(id));

    if (!venta) {
      return NextResponse.json(
        { error: "Venta no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(venta);
  } catch (error) {
    console.error("Error al obtener venta:", error);
    return NextResponse.json(
      { error: "No se pudo cargar el detalle de la venta." },
      { status: 500 },
    );
  }
}
