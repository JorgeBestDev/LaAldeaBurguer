import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const productos = [
  {
    nombreProducto: "Hamburguesa Clásica",
    precioProducto: 89,
    tipoProducto: "Hamburguesa",
  },
  {
    nombreProducto: "Hamburguesa Doble",
    precioProducto: 129,
    tipoProducto: "Hamburguesa",
  },
  {
    nombreProducto: "Papas a la Francesa",
    precioProducto: 45,
    tipoProducto: "Acompañamiento",
  },
  {
    nombreProducto: "Refresco 600ml",
    precioProducto: 25,
    tipoProducto: "Bebida",
  },
  {
    nombreProducto: "Agua embotellada",
    precioProducto: 18,
    tipoProducto: "Bebida",
  },
  {
    nombreProducto: "Hot Dog Especial",
    precioProducto: 65,
    tipoProducto: "Hot Dog",
  },
];

async function main() {
  await prisma.detalleVenta.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.producto.deleteMany();

  for (const producto of productos) {
    await prisma.producto.create({
      data: {
        nombreProducto: producto.nombreProducto,
        precioProducto: BigInt(producto.precioProducto),
        tipoProducto: producto.tipoProducto,
      },
    });
  }

  const catalogo = await prisma.producto.findMany();
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);

  const ventasDemo = [
    {
      fechaVenta: hoy,
      lineas: [
        { producto: catalogo[0], cantidad: BigInt(3) },
        { producto: catalogo[2], cantidad: BigInt(2) },
        { producto: catalogo[3], cantidad: BigInt(3) },
      ],
    },
    {
      fechaVenta: ayer,
      lineas: [
        { producto: catalogo[1], cantidad: BigInt(2) },
        { producto: catalogo[4], cantidad: BigInt(2) },
      ],
    },
  ];

  for (const ventaDemo of ventasDemo) {
    const detalles = ventaDemo.lineas.map((linea) => ({
      idProducto: linea.producto.idProducto,
      cantidadProducto: linea.cantidad,
      precioUnitario: linea.producto.precioProducto,
      subtotalVenta: linea.producto.precioProducto * linea.cantidad,
    }));

    const totalVenta = detalles.reduce(
      (acc, detalle) => acc + detalle.subtotalVenta,
      BigInt(0),
    );

    await prisma.venta.create({
      data: {
        fechaVenta: ventaDemo.fechaVenta,
        totalVenta,
        detalles: { create: detalles },
      },
    });
  }

  console.log("Seed completado: productos y ventas de demostración creados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
