import { getPrisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializers";
import type { CrearVentaInput, Venta } from "@/types";

export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}

export async function listarVentas(): Promise<Venta[]> {
  const prisma = getPrisma();
  const ventas = await prisma.venta.findMany({
    orderBy: { fechaVenta: "desc" },
    include: {
      detalles: {
        include: { producto: true },
      },
    },
  });

  return serializeBigInt(ventas) as unknown as Venta[];
}

export async function obtenerVentaPorId(idVenta: bigint): Promise<Venta | null> {
  const prisma = getPrisma();
  const venta = await prisma.venta.findUnique({
    where: { idVenta },
    include: {
      detalles: {
        include: { producto: true },
      },
    },
  });

  if (!venta) return null;
  return serializeBigInt(venta) as unknown as Venta;
}

export async function crearVenta(input: CrearVentaInput): Promise<Venta> {
  const prisma = getPrisma();

  if (!input.lineas.length) {
    throw new ClientError("Debes agregar al menos un producto a la venta.");
  }

  const uniqueProductoIds = [
    ...new Set(input.lineas.map((linea) => linea.idProducto)),
  ];
  const productoIds = uniqueProductoIds.map((id) => BigInt(id));
  const productos = await prisma.producto.findMany({
    where: { idProducto: { in: productoIds } },
  });

  if (productos.length !== uniqueProductoIds.length) {
    throw new ClientError("Uno o más productos no existen.");
  }

  const productoMap = new Map(
    productos.map((producto) => [producto.idProducto.toString(), producto]),
  );

  const detalles = input.lineas.map((linea) => {
    const producto = productoMap.get(linea.idProducto);
    if (!producto) {
      throw new ClientError(`Producto ${linea.idProducto} no encontrado.`);
    }

    const cantidad = BigInt(linea.cantidadProducto);
    const subtotal = producto.precioProducto * cantidad;

    return {
      idProducto: producto.idProducto,
      cantidadProducto: cantidad,
      precioUnitario: producto.precioProducto,
      subtotalVenta: subtotal,
    };
  });

  const totalVenta = detalles.reduce(
    (acc, detalle) => acc + detalle.subtotalVenta,
    BigInt(0),
  );

  const venta = await prisma.venta.create({
    data: {
      fechaVenta: new Date(input.fechaVenta),
      totalVenta,
      detalles: {
        create: detalles,
      },
    },
    include: {
      detalles: {
        include: { producto: true },
      },
    },
  });

  return serializeBigInt(venta) as unknown as Venta;
}