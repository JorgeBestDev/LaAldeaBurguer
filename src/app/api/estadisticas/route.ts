import { NextResponse } from "next/server";
import { obtenerEstadisticas } from "@/lib/services/estadisticas";

export async function GET() {
  try {
    const estadisticas = await obtenerEstadisticas();
    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar las estadísticas." },
      { status: 500 },
    );
  }
}
