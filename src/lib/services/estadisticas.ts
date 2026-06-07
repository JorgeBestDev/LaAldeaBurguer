import { getPrisma } from "@/lib/prisma";
import { DIAS_SEMANA } from "@/lib/format";
import { serializeBigInt } from "@/lib/serializers";
import type { Estadisticas } from "@/types";

export async function obtenerEstadisticas(): Promise<Estadisticas> {
  const prisma = getPrisma();
  const [agrupadoProductos, ventaMasAlta, ventasPorDia, resumenVentas] =
    await Promise.all([
      prisma.detalleVenta.groupBy({
        by: ["idProducto"],
        _sum: { cantidadProducto: true },
        orderBy: { _sum: { cantidadProducto: "desc" } },
        take: 1,
      }),
      prisma.venta.findFirst({
        orderBy: { totalVenta: "desc" },
      }),
      prisma.$queryRaw<
        { dia: number; total: bigint; cantidad: bigint }[]
      >`
        SELECT
          EXTRACT(DOW FROM "fechaVenta")::int AS dia,
          SUM("totalVenta") AS total,
          COUNT(*)::bigint AS cantidad
        FROM venta
        GROUP BY EXTRACT(DOW FROM "fechaVenta")
        ORDER BY dia
      `,
      prisma.venta.aggregate({
        _count: { idVenta: true },
        _sum: { totalVenta: true },
      }),
    ]);

  let productoMasVendido: Estadisticas["productoMasVendido"] = null;

  if (agrupadoProductos.length > 0) {
    const top = agrupadoProductos[0];
    const producto = await prisma.producto.findUnique({
      where: { idProducto: top.idProducto },
    });

    if (producto) {
      productoMasVendido = {
        nombreProducto: producto.nombreProducto,
        cantidadTotal: top._sum.cantidadProducto?.toString() ?? "0",
      };
    }
  }

  const ventasPorDiaMap = new Map(
    ventasPorDia.map((row) => [row.dia, row]),
  );

  const ventasPorDiaSemana = DIAS_SEMANA.map((dia, index) => {
    const registro = ventasPorDiaMap.get(index);
    return {
      dia,
      total: registro?.total?.toString() ?? "0",
      cantidadVentas: Number(registro?.cantidad ?? 0),
    };
  });

  return serializeBigInt({
    productoMasVendido,
    ventaMasAlta: ventaMasAlta
      ? {
          idVenta: ventaMasAlta.idVenta.toString(),
          fechaVenta: ventaMasAlta.fechaVenta.toISOString(),
          totalVenta: ventaMasAlta.totalVenta.toString(),
        }
      : null,
    ventasPorDiaSemana,
    resumen: {
      totalVentasRegistradas: resumenVentas._count.idVenta,
      ingresoTotal: resumenVentas._sum.totalVenta?.toString() ?? "0",
    },
  });
}
