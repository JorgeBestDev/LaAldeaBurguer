import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializers";

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { nombreProducto: "asc" },
    });

    return NextResponse.json(serializeBigInt(productos));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los productos." },
      { status: 500 },
    );
  }
}
