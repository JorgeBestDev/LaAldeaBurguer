import { Prisma } from "@/generated/prisma/client";
import { ClientError } from "@/lib/errors";
import { getPrisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializers";
import type { ActualizarProductoInput, CrearProductoInput, Producto } from "@/types";

function validarProductoInput(input: {
  nombreProducto?: string;
  precioProducto?: number;
  tipoProducto?: string;
}) {
  if (input.nombreProducto !== undefined) {
    const nombre = input.nombreProducto.trim();
    if (!nombre) {
      throw new ClientError("El nombre del producto es obligatorio.");
    }
    if (nombre.length > 255) {
      throw new ClientError("El nombre no puede superar 255 caracteres.");
    }
  }

  if (input.precioProducto !== undefined) {
    if (!Number.isFinite(input.precioProducto) || input.precioProducto < 1) {
      throw new ClientError("El precio debe ser un número mayor a 0.");
    }
    if (!Number.isInteger(input.precioProducto)) {
      throw new ClientError("El precio debe ser un número entero.");
    }
  }

  if (input.tipoProducto !== undefined) {
    const tipo = input.tipoProducto.trim();
    if (!tipo) {
      throw new ClientError("El tipo de producto es obligatorio.");
    }
    if (tipo.length > 100) {
      throw new ClientError("El tipo no puede superar 100 caracteres.");
    }
  }
}

export async function listarProductos(): Promise<Producto[]> {
  const prisma = getPrisma();
  const productos = await prisma.producto.findMany({
    orderBy: { nombreProducto: "asc" },
  });

  return serializeBigInt(productos) as unknown as Producto[];
}

export async function obtenerProductoPorId(
  idProducto: bigint,
): Promise<Producto | null> {
  const prisma = getPrisma();
  const producto = await prisma.producto.findUnique({
    where: { idProducto },
  });

  if (!producto) return null;
  return serializeBigInt(producto) as unknown as Producto;
}

export async function crearProducto(input: CrearProductoInput): Promise<Producto> {
  if (
    input.nombreProducto === undefined ||
    input.precioProducto === undefined ||
    input.tipoProducto === undefined
  ) {
    throw new ClientError("Nombre, precio y tipo son obligatorios.");
  }

  validarProductoInput(input);

  const prisma = getPrisma();
  const producto = await prisma.producto.create({
    data: {
      nombreProducto: input.nombreProducto.trim(),
      precioProducto: BigInt(input.precioProducto),
      tipoProducto: input.tipoProducto.trim(),
    },
  });

  return serializeBigInt(producto) as unknown as Producto;
}

export async function actualizarProducto(
  idProducto: bigint,
  input: ActualizarProductoInput,
): Promise<Producto> {
  if (
    input.nombreProducto === undefined &&
    input.precioProducto === undefined &&
    input.tipoProducto === undefined
  ) {
    throw new ClientError("Debes enviar al menos un campo para actualizar.");
  }

  validarProductoInput(input);

  const prisma = getPrisma();
  const existente = await prisma.producto.findUnique({
    where: { idProducto },
  });

  if (!existente) {
    throw new ClientError("Producto no encontrado.");
  }

  const producto = await prisma.producto.update({
    where: { idProducto },
    data: {
      ...(input.nombreProducto !== undefined && {
        nombreProducto: input.nombreProducto.trim(),
      }),
      ...(input.precioProducto !== undefined && {
        precioProducto: BigInt(input.precioProducto),
      }),
      ...(input.tipoProducto !== undefined && {
        tipoProducto: input.tipoProducto.trim(),
      }),
    },
  });

  return serializeBigInt(producto) as unknown as Producto;
}

export async function eliminarProducto(idProducto: bigint): Promise<void> {
  const prisma = getPrisma();
  const existente = await prisma.producto.findUnique({
    where: { idProducto },
  });

  if (!existente) {
    throw new ClientError("Producto no encontrado.");
  }

  try {
    await prisma.producto.delete({ where: { idProducto } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new ClientError(
        "No se puede eliminar un producto que ya tiene ventas registradas.",
      );
    }
    throw error;
  }
}
